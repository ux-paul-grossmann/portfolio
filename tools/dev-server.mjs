#!/usr/bin/env node
// Portfolio dev server: static files plus thumbnail uploads for the dev editor.
// Standard library only. Start with: node tools/dev-server.mjs

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THUMB_DIR = path.join(ROOT, 'lib', 'images', 'thumbs');
const MEDIA_DIR = path.join(ROOT, 'lib', 'images', 'uploads');
const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 8000);
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip'
};

function send(res, status, body, type = 'text/plain; charset=utf-8', extra = {}) {
  res.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    ...extra
  });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), 'application/json; charset=utf-8');
}

function imageType(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: 'png' };
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: 'jpg' };
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { ext: 'webp' };
  }
  return null;
}

function safeName(raw) {
  let decoded = String(raw || '');
  try {
    decoded = decodeURIComponent(decoded);
  } catch (error) {
    decoded = String(raw || '');
  }
  const base = path.basename(decoded);
  const cleaned = base
    .toLowerCase()
    .replace(/\.[a-z0-9]{1,5}$/i, '')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '')
    .slice(0, 80);
  return cleaned || 'thumbnail';
}

async function freeName(dir, base, ext) {
  let candidate = path.join(dir, base + '.' + ext);
  let counter = 2;
  for (;;) {
    try {
      await fs.access(candidate);
      candidate = path.join(dir, base + '-' + counter + '.' + ext);
      counter += 1;
    } catch (error) {
      return path.basename(candidate);
    }
  }
}

async function handleUpload(req, res, targetDir, prefix) {
  if (req.headers['x-dev-upload'] !== '1') {
    sendJson(res, 403, { error: 'Uploads are only accepted from the local dev editor.' });
    return;
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_UPLOAD_BYTES) {
      req.destroy();
      sendJson(res, 413, { error: 'Image is larger than 12 MB.' });
      return;
    }
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const type = imageType(buffer);
  if (!type) {
    sendJson(res, 415, { error: 'Only PNG, JPEG or WebP images are supported.' });
    return;
  }
  await fs.mkdir(targetDir, { recursive: true });
  const fileName = await freeName(targetDir, safeName(req.headers['x-file-name']), type.ext);
  await fs.writeFile(path.join(targetDir, fileName), buffer);
  const relative = prefix + fileName;
  console.log('upload: ' + relative);
  sendJson(res, 200, { path: relative });
}

async function handleStatic(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method not allowed', 'text/plain; charset=utf-8', { Allow: 'GET, HEAD' });
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (error) {
    send(res, 400, 'Bad request');
    return;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const target = path.resolve(ROOT, '.' + pathname);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    send(res, 403, 'Forbidden');
    return;
  }
  let info;
  try {
    info = await fs.stat(target);
  } catch (error) {
    send(res, 404, 'Not found');
    return;
  }
  let file = target;
  if (info.isDirectory()) {
    file = path.join(target, 'index.html');
    try {
      info = await fs.stat(file);
    } catch (error) {
      send(res, 404, 'Not found');
      return;
    }
  }
  if (!info.isFile()) {
    send(res, 404, 'Not found');
    return;
  }
  const body = req.method === 'HEAD' ? null : await fs.readFile(file);
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Content-Length': info.size,
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = new URL(req.url, 'http://localhost').pathname;
  } catch (error) {
    send(res, 400, 'Bad request');
    return;
  }
  const uploadTarget = pathname === '/__dev/thumbnail'
    ? { dir: THUMB_DIR, prefix: './lib/images/thumbs/' }
    : pathname === '/__dev/media'
      ? { dir: MEDIA_DIR, prefix: './lib/images/uploads/' }
      : null;
  if (uploadTarget) {
    if (req.method !== 'POST') {
      send(res, 405, 'Method not allowed', 'text/plain; charset=utf-8', { Allow: 'POST' });
      return;
    }
    handleUpload(req, res, uploadTarget.dir, uploadTarget.prefix).catch(error => {
      console.error('upload failed:', error);
      sendJson(res, 500, { error: 'Upload failed.' });
    });
    return;
  }
  handleStatic(req, res).catch(error => {
    console.error('request failed:', error);
    send(res, 500, 'Internal server error');
  });
});

server.listen(PORT, HOST, () => {
  console.log('Portfolio: http://' + HOST + ':' + PORT + '/');
  console.log('Thumbnails: POST /__dev/thumbnail -> lib/images/thumbs/');
  console.log('Media:      POST /__dev/media -> lib/images/uploads/');
});

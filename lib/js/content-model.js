// content-model.js — one flexible content model for a card.
//
// A card's body is ONE ordered list of nodes. There is no text slot, no list
// slot, no media array and no section wrapper: a section heading is just a
// heading node, and any node type can follow any other. The editor inserts,
// moves and deletes nodes; the renderer walks the list once.
//
// Node types (the vocabulary the editor offers):
//   { type: 'heading',  level: 2|3|4|5|6, html }
//   { type: 'text',     html }
//   { type: 'list',     items: [html], ordered: bool }
//   { type: 'media',    value }   value = string | { src } | { icon } | { link } | { embed } | { video }
//   { type: 'cta' }
//
// Every card keeps working without the new model: `contentFromLegacy` converts
// today's keys (section-order, <key>-text/-list/-list-type/-media/-order) into
// nodes in the same visual order, once, so old data and old presets render
// identically and then live in the new shape.
(function () {
  'use strict';

  const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const TYPES = ['heading', 'text', 'list', 'media', 'cta'];

  function isNode(node) {
    return !!node && typeof node === 'object' && TYPES.indexOf(node.type) !== -1;
  }

  // ---------- legacy → nodes ----------
  // `plan` supplies the project's section order, titles and per-section block
  // order; it is the only thing this module needs to know about old data.
  function contentFromLegacy(project, plan) {
    const nodes = [];
    plan.sectionOrder(project).forEach(key => {
      nodes.push({
        type: 'heading',
        level: 3,
        html: plan.sectionTitle(project, key)
      });
      plan.blockOrder(project, key).forEach(kind => {
        if (kind === 'text') {
          const html = project[key + '-text'];
          if (html) nodes.push({ type: 'text', html });
          return;
        }
        if (kind === 'list') {
          const items = project[key + '-list'];
          if (Array.isArray(items) && items.length) {
            nodes.push({ type: 'list', items: items.slice(), ordered: project[key + '-list-type'] === 'ol' });
          }
          return;
        }
        if (kind === 'media') {
          (project[key + '-media'] || []).forEach(value => nodes.push({ type: 'media', value }));
        }
      });
    });
    nodes.push({ type: 'cta' });
    return nodes;
  }

  // Converts in place and marks the card as converted, so the write path knows
  // the file now carries `content` and the plan is no longer consulted.
  function convertToContent(project, plan) {
    if (Array.isArray(project.content) && project.content.length) return project.content;
    project.content = contentFromLegacy(project, plan);
    return project.content;
  }

  // ---------- insert / move / delete ----------
  function insertNode(project, plan, index, node) {
    if (!isNode(node)) return false;
    const content = convertToContent(project, plan);
    const at = Math.max(0, Math.min(index, content.length));
    content.splice(at, 0, node);
    return true;
  }

  function removeNode(project, plan, index) {
    const content = convertToContent(project, plan);
    if (index < 0 || index >= content.length) return null;
    return content.splice(index, 1)[0] || null;
  }

  function moveNode(project, plan, from, to) {
    const content = convertToContent(project, plan);
    if (from < 0 || from >= content.length) return false;
    const target = Math.max(0, Math.min(to, content.length - 1));
    if (from === target) return false;
    const moved = content.splice(from, 1)[0];
    content.splice(target, 0, moved);
    return true;
  }

  // ---------- nodes → html ----------
  // `render` supplies the markup primitives the site already uses, so the new
  // renderer cannot drift away from the old one.
  function nodesToHtml(nodes, render) {
    let html = '';
    let trayOpen = false;
    const closeTray = () => {
      if (trayOpen) {
        html += '</div>';
        trayOpen = false;
      }
    };
    nodes.forEach((node, index) => {
      if (!isNode(node)) return;
      if (node.type === 'media') {
        const media = render.media(node, index);
        if (!media) return;
        if (render.trayClass) {
          if (!trayOpen) {
            html += `<div class="dev-tray ${render.trayClass}">`;
            trayOpen = true;
          }
          html += media;
        } else {
          html += media;
        }
        return;
      }
      closeTray();
      if (node.type === 'heading') {
        const level = Math.max(1, Math.min(6, Number(node.level) || 3));
        html += `<${HEADINGS[level - 1]} data-node="${index}">${node.html || ''}</${HEADINGS[level - 1]}>`;
        return;
      }
      if (node.type === 'text') {
        html += `<div class="project-detail-text" data-node="${index}">${render.inlineLinks(node.html || '')}</div>`;
        return;
      }
      if (node.type === 'list') {
        const tag = node.ordered ? 'ol' : 'ul';
        const items = Array.isArray(node.items) ? node.items : [];
        html += `<${tag} data-node="${index}">${items.map(item => `<li>${render.inlineLinks(item)}</li>`).join('')}</${tag}>`;
        return;
      }
      if (node.type === 'cta') {
        html += render.cta();
      }
    });
    closeTray();
    return html;
  }

  window.PortfolioContent = {
    TYPES,
    isNode,
    contentFromLegacy,
    convertToContent,
    insertNode,
    removeNode,
    moveNode,
    nodesToHtml
  };
})();

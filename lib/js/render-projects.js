// render-projects.js – Generates portfolio cards from projectsData
(function() {
  'use strict';
const BLANK_GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  const DEV_EDIT = localStorage.getItem('portfolio-dev') === '1';

  // Alt text is typed in the dev editor, so it is the one attribute that
  // needs escaping; every other value is a hand-checked path or URL.
  function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  // Icon mapping for "Verwendete Tools" — normalized to Simple Icons (monochrome, 32×32)
  const iconMap = {
    xd:          { src: './lib/images/icons/simple/adobexd.svg', title: 'Adobe XD - Experience Design - Prototypdesign' },
    msteams:     { src: './lib/images/icons/simple/msteams.svg', title: 'MS Teams' },
    jira:        { src: './lib/images/icons/simple/jira.svg', title: 'JIRA - Projektverwaltung' },
    invision:    { src: './lib/images/icons/simple/invision.svg', title: 'InVision Freehand - Collab Whiteboard' },
    vscode:      { src: './lib/images/icons/simple/vscode.svg', title: 'Microsoft Visual Studio Code' },
    'bootstrap-4': { src: './lib/images/icons/simple/bootstrap.svg', title: 'Bootstrap 4 - CSS-Framework' },
    'html-5':    { src: './lib/images/icons/simple/html5.svg', title: 'HTML5' },
    'css-3':     { src: './lib/images/icons/simple/css3.svg', title: 'CSS3' },
    javascript:  { src: './lib/images/icons/simple/javascript.svg', title: 'Javascript' },
    jquery:      { src: './lib/images/icons/simple/jquery.svg', title: 'Jquery - Javascript-Framework' },
    axure:       { src: './lib/images/icons/axure.png', title: 'Axure RP Prototypdesign' },
    'photoshop-cc': { src: './lib/images/icons/simple/adobephotoshop.svg', title: 'Adobe Photoshop CC' },
    angular:     { src: './lib/images/icons/simple/angular.svg', title: 'Angular - JavaScript-Framework' },
    typescript:  { src: './lib/images/icons/simple/typescript.svg', title: 'Typescript' },
    'github-octocat': { src: './lib/images/icons/simple/github.svg', title: 'GitHub - Version Control' },
    illustrator: { src: './lib/images/icons/simple/adobeillustrator.svg', title: 'Adobe Illustrator CC' },
    miro:        { src: './lib/images/icons/simple/miro.svg', title: 'Miro - Digital Whiteboard' },
    figma:       { src: './lib/images/icons/simple/figma.svg', title: 'Figma - UI Design Tool' },
    office:      { src: './lib/images/icons/simple/microsoftoffice.svg', title: 'Microsoft Office 365' }
  };

  // The dev editor builds its icon picker from the same map.
  window.portfolioIconMap = iconMap;

  function renderIcon(iconKey) {
    const icon = iconMap[iconKey];
    if (!icon) return '';
    return `<img src="${icon.src}" class="iconsizing ${icon.extraClass || ''}" alt="" title="${icon.title}" data-toggle="tooltip" data-placement="top">`;
}

  // One block of the expanded card: heading plus body. Replaces the old dt/dd pairs,
  // which had no dl ancestor and were therefore invalid HTML.
  function buildDetail(label, body, bodyClass = '', key = '') {
    const attr = key ? ` data-section="${key}"` : '';
    return `<section class="project-detail"${attr}>
      <h3>${label}</h3>
      <div class="project-detail-body ${bodyClass}">${body}</div>
    </section>`;
  }

  // Generic media list. A string is an image; the rare video, embed, link or
  // icon is an object. No section knows about the other sections.
  function wrapResponsive(html, item) {
    if (item.mobileOnly) return `<div class="d-md-none">${html}</div>`;
    if (item.desktopOnly) return `<div class="d-none d-md-block">${html}</div>`;
    return html;
  }

  // Dev editor hook: tag each media item with its project, section key and
  // index so the editor can map a double-click back to the data.
  function withMediaData(html, project, key, index) {
    if (!DEV_EDIT) return html;
    const attrs = ` data-media-project="${project.id}" data-media-key="${key}" data-media-index="${index}"`;
    return html.replace(/^(\s*<[a-zA-Z][^>]*?)(\s*\/?)>/, `$1${attrs}$2>`);
  }

  function buildMediaItems(items, project, key, blockIndex) {
    const gallery = project.id.toLowerCase();
    return items.map((item, index) => {
      let html = '';
      if (typeof item === 'string') {
        html = `<a href="${item}" class="glightbox" data-gallery="${gallery}"><img data-src="${item}" class="my-3 lazyload d-block w-100 rounded-lg" alt=""></a>`;
      } else if (item.icon) {
        html = renderIcon(item.icon);
      } else if (item.text) {
        // A text item can sit between two media items, so prose is possible
        // anywhere in a media run without splitting the array.
        html = `<div class="project-detail-text media-text">${inlineLinks(item.text)}</div>`;
      } else if (item.video) {
        const poster = item.poster ? ` poster="${item.poster}"` : '';
        html = wrapResponsive(`<video class="my-3 d-block w-100 rounded-lg shadow" controls playsinline preload="metadata"${poster}><source src="${item.video}" type="video/mp4"></video>`, item);
      } else if (item.embed) {
        const width = item.width || 375;
        const height = item.height || 667;
        // Every prototype sits in an iPhone SE screen (375 × 667); a smaller
        // prototype viewport is scaled up to fill it.
        const scale = Math.min(375 / width, 667 / height);
        const frame = `<div class="proto-frame-wrap">
          <div class="proto-frame">
            <div class="proto-frame-screen" style="--proto-native-w:${width}px;--proto-native-h:${height}px">
              <iframe width="${width}" height="${height}" style="--proto-scale:${scale}" class="lazy" src="about:blank" data-src="${item.embed}" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>
        </div>`;
        html = item.desktopOnly ? `<div class="d-none d-md-block">${frame}</div>` : wrapResponsive(frame, item);
      } else if (item.link) {
        const title = item.title ? ` title="${item.title}"` : '';
        html = wrapResponsive(`<a class="link-inline" href="${item.link}" target="_blank"${title}>${item.label || item.link} <i class="fas fa-external-link-alt"></i></a>`, item);
      } else if (item.src) {
        const extra = item.className ? ` ${item.className}` : '';
        const alt = escapeAttr(item.alt || '');
        const img = `<img data-src="${item.src}" class="my-3 lazyload d-block w-100 rounded-lg${extra}" alt="${alt}">`;
        if (item.href) {
          html = wrapResponsive(`<a href="${item.href}">${img}</a>`, item);
        } else if (item.lightbox === false) {
          html = wrapResponsive(img, item);
        } else {
          const caption = item.caption ? ` data-glightbox="title: ${item.caption}"` : '';
          html = wrapResponsive(`<a href="${item.src}" class="glightbox" data-gallery="${gallery}"${caption}>${img}</a>`, item);
        }
      }
      if (!html) return '';
      if (typeof blockIndex === 'number') {
        // Blocks address their media through the block index, not the legacy
        // media array, so the two editors never collide.
        if (!DEV_EDIT) return html;
        return html.replace(/^(\s*<[a-zA-Z][^>]*?)(\s*\/?)>/, `$1 data-block-index="${blockIndex}"$2>`);
      }
      return withMediaData(html, project, key, index);
    }).join('');
  }

  // Block order per section. The optional <key>-order lists "text", "list" and
  // "media"; a block with content that is missing from the list is appended in
  // the default order, so stale or partial order data can never hide content.
  const DEFAULT_BLOCK_ORDER = ['text', 'list', 'media'];
  function blockOrder(project, key) {
    const stored = project[key + '-order'];
    const order = [];
    if (Array.isArray(stored)) {
      stored.forEach(type => {
        if (DEFAULT_BLOCK_ORDER.indexOf(type) !== -1 && order.indexOf(type) === -1) order.push(type);
      });
    }
    DEFAULT_BLOCK_ORDER.forEach(type => {
      if (order.indexOf(type) === -1) order.push(type);
    });
    return order;
  }

  // Content links use the styleguide's inline level everywhere. The class is
  // added at render time so stored HTML and older presets get it too.
  function inlineLinks(html) {
    return String(html).replace(/<a\b([^>]*)>/gi, (match, attrs) => {
      if (/class="[^"]*(?:glightbox|link-inline)/i.test(attrs)) return match;
      if (/class="/i.test(attrs)) return '<a' + attrs.replace(/class="/i, 'class="link-inline ');
      return '<a class="link-inline"' + attrs + '>';
    });
  }

  // One section: title, text, list and media are independent. Any section may
  // use any of them; nothing here branches on the section name.
  // The icon tray (a flex-row body class) wraps only the media items: text
  // and lists render as full-width siblings, so inserted text never inherits
  // the tray's inset and tint.
  // A section may carry an ordered block list (`<key>-blocks`). When present it
  // is the whole content, in order, and every block is independent: text,
  // list, or a single media item. That removes the old three-slot limit, so
  // text can sit between two images. Sections without the key render exactly
  // as before.
  function buildBlocksSection(project, key, blocks, title, bodyClass, trayClass) {
    let body = '';
    let trayOpen = false;
    const closeTray = () => {
      if (trayOpen) {
        body += '</div>';
        trayOpen = false;
      }
    };
    blocks.forEach((block, index) => {
      if (!block || !block.t) return;
      if (block.t === 'text') {
        closeTray();
        body += `<div class="project-detail-text" data-block-index="${index}">${inlineLinks(block.html || '')}</div>`;
        return;
      }
      if (block.t === 'list') {
        closeTray();
        const listTag = block.ol ? 'ol' : 'ul';
        const items = Array.isArray(block.items) ? block.items : [];
        body += `<${listTag} data-block-index="${index}">${items.map(item => `<li>${inlineLinks(item)}</li>`).join('')}</${listTag}>`;
        return;
      }
      if (block.t === 'media') {
        const html = buildMediaItems([block.v], project, key, index);
        if (!html) return;
        if (trayClass) {
          if (!trayOpen) {
            body += `<div class="dev-tray ${trayClass}">`;
            trayOpen = true;
          }
          body += html;
        } else {
          body += html;
        }
      }
    });
    closeTray();
    return buildDetail(title, body, trayClass ? '' : bodyClass, key);
  }

  function buildSection(project, key) {
    const title = project[key + '-title'] || sectionTitles[key] || key;
    const text = project[key + '-text'];
    const list = project[key + '-list'];
    const media = project[key + '-media'];
    const blocks = project[key + '-blocks'];
    const bodyClass = project[key + '-class'] || '';
    const trayClass = bodyClass.indexOf('flex-row') !== -1 ? bodyClass : null;
    if (Array.isArray(blocks) && blocks.length) {
      return buildBlocksSection(project, key, blocks, title, trayClass ? '' : bodyClass, trayClass);
    }
    if (!text && (!list || !list.length) && (!media || !media.length)) {
      // A section added in the editor has a title but no content yet. Dev only:
      // render an empty, clickable body so it can be filled; visitors see nothing.
      if (!DEV_EDIT) return '';
      return buildDetail(title, '<div class="project-detail-text dev-empty-section" data-placeholder="Click to add text"></div>', trayClass ? '' : bodyClass, key);
    }
    let body = '';
    blockOrder(project, key).forEach(type => {
      if (type === 'text' && text) body += `<div class="project-detail-text">${inlineLinks(text)}</div>`;
      else if (type === 'list' && list && list.length) {
        const listTag = project[key + '-list-type'] === 'ol' ? 'ol' : 'ul';
        body += `<${listTag}>${list.map(item => `<li>${inlineLinks(item)}</li>`).join('')}</${listTag}>`;
      } else if (type === 'media' && media && media.length) {
        const items = buildMediaItems(media, project, key);
        body += trayClass ? `<div class="dev-tray ${trayClass}">${items}</div>` : items;
      }
    });
    return buildDetail(title, body, trayClass ? '' : bodyClass, key);
  }

  function buildCta(project) {
    return `<div class="d-flex justify-content-center">
    <button class="scroll-to-top-card cta cta--primary" onclick="document.querySelector('#thumbCluster-${project.id}').scrollIntoView({ behavior: 'smooth', block: 'start' });">
        <i class="fas fa-chevron-up"></i> Zurück zur Übersicht
    </button>
</div>`;
  }

  // ---------- content-model renderer ----------
  // Flat nodes stay flat in the data; sections are derived here, at render
  // time, by grouping nodes under the heading that owns a section key. That
  // keeps the visitor markup identical to the legacy renderer.
  function contentSections(project) {
    const nodes = project.content || [];
    const sections = [];
    let current = null;
    nodes.forEach(node => {
      if (node && node.type === 'heading' && node.sectionKey) {
        current = { key: node.sectionKey, title: node.html || node.sectionKey, bodyClass: node.bodyClass || '', nodes: [] };
        sections.push(current);
        return;
      }
      if (!current) {
        current = { key: '', title: '', bodyClass: '', nodes: [] };
        sections.push(current);
      }
      current.nodes.push(node);
    });
    return sections;
  }

  function buildContentSection(project, section) {
    const bodyClass = section.bodyClass || '';
    const trayClass = bodyClass.indexOf('flex-row') !== -1 ? bodyClass : null;
    let body = '';
    let trayOpen = false;
    const closeTray = () => {
      if (trayOpen) {
        body += '</div>';
        trayOpen = false;
      }
    };
    section.nodes.forEach((node, index) => {
      if (!node || !node.type) return;
      if (node.type === 'media') {
        const media = buildMediaItems([node.value], project, section.key, index);
        if (!media) return;
        if (trayClass) {
          if (!trayOpen) {
            body += `<div class="dev-tray ${trayClass}">`;
            trayOpen = true;
          }
          body += media;
        } else {
          body += media;
        }
        return;
      }
      closeTray();
      if (node.type === 'text') {
        body += `<div class="project-detail-text">${inlineLinks(node.html || '')}</div>`;
        return;
      }
      if (node.type === 'list') {
        const listTag = node.ordered ? 'ol' : 'ul';
        const items = Array.isArray(node.items) ? node.items : [];
        body += `<${listTag}>${items.map(item => `<li>${inlineLinks(item)}</li>`).join('')}</${listTag}>`;
        return;
      }
      if (node.type === 'heading') {
        const level = Math.max(1, Math.min(6, Number(node.level) || 3));
        body += `<h${level}>${node.html || ''}</h${level}>`;
      }
    });
    closeTray();
    if (!body && DEV_EDIT) {
      return buildDetail(section.title, '<div class="project-detail-text dev-empty-section" data-placeholder="Click to add text"></div>', trayClass ? '' : bodyClass, section.key);
    }
    return buildDetail(section.title, body, trayClass ? '' : bodyClass, section.key);
  }

  function buildContentBody(project) {
    return contentSections(project).map(section => buildContentSection(project, section)).join('') + buildCta(project);
  }

  function buildCollapseContent(project) {
    if (Array.isArray(project.content) && project.content.length) return buildContentBody(project);
    const order = project['section-order'] || sectionOrder;
    return order.map(key => buildSection(project, key)).join('') + buildCta(project);
  }

  function buildCardFront(project, asLink) {
    const tagsHtml = project.tags.map(tag => `<span class="badge badge-tag">${tag}</span>`).join('');
    // Flat projects carry the card fields as kebab-case keys; the old projects
    // still use the camelCase shape until the migration is complete.
    const thumbClass = project['thumbnail-class'] || project.thumbnailClass;
    const thumbPath = project.thumbnail ? String(project.thumbnail).replace(/'/g, '%27').replace(/"/g, '&quot;') : '';
    const thumbStyle = thumbPath ? ` style="background-image:url('${thumbPath}')"` : '';
    const shortDesc = {
      mobile: project['short-desc-mobile'] || (project.shortDesc || {}).mobile,
      tablet: project['short-desc-tablet'] || (project.shortDesc || {}).tablet,
      desktop: project['short-desc-desktop'] || (project.shortDesc || {}).desktop
    };
    const open = asLink
      ? `<a class="thumb-element collapsed" data-toggle="collapse" href="#thumbCollapse-${project.id}" role="button" aria-expanded="false" aria-controls="thumbCollapse-${project.id}">`
      : '<div class="dev-card-preview-card">';
    const close = asLink ? '</a>' : '</div>';

    // Build the thumbnail card
    return `${open}
          <div class="card">
            <div class="row no-gutters">
              <div class="col-4 col-md-4">
                <div class="${thumbClass}"${thumbStyle} alt="Thumbnail ${project.title}"></div>
              </div>
              <div class="col-8 col-md-8">
                <div class="card-body-thumbnail d-flex flex-column justify-content-start align-items-start">
                  <h6 class="card-title d-sm-none mb-1">${project.title}</h6>
                  <h5 class="card-title d-none d-sm-block d-md-none mb-1">${project.title}</h5>
                  <h4 class="card-title d-none d-md-block mb-2">${project.title}</h4>
                  
                  <p class="card-description d-sm-none mb-2 small">${shortDesc.mobile}</p>
                  <p class="card-description d-none d-sm-block d-md-none mb-3 small">${shortDesc.tablet}</p>
                  <p class="card-description d-none d-md-block mb-3">${shortDesc.desktop}</p>
                  
                  <div class="card-text d-flex flex-wrap justify-content-start align-items-center">
                    ${tagsHtml}
                  </div>
                </div>
                <div class="card-footer-thumbnail d-flex justify-content-end">
                  <i class="fas fa-chevron-down"></i>
                </div>
              </div>
            </div>
          </div>
        ${close}`;
  }

  function renderProjectCard(project) {
    return `
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 px-md-1 cluster" id="thumbCluster-${project.id}">
        ${buildCardFront(project, true)}
        <div class="">
          <div class="row">
            <div class="col">
              <div class="collapse multi-collapse" id="thumbCollapse-${project.id}">
                <div class="card card-body">
                  <article>
                    <h2 class="mb-3 d-none d-sm-block pt-md-3 px-md-4">${project.title}</h2>
                    <h3 class="mb-3 d-sm-none pt-md-3 px-md-4">${project.title}</h3>
                    <section class="px-md-4">
                      ${buildCollapseContent(project)}
                    </section>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // The dev editor renders the real card front in its new-card preview.
  window.buildCardFrontHtml = function(project) {
    return buildCardFront(project, false);
  };

  // Test hook: render a card body both ways so parity can be measured.
  window.__contentParity = function(project) {
    const legacyOrder = project['section-order'] || sectionOrder;
    const legacy = legacyOrder.map(key => buildSection(project, key)).join('') + buildCta(project);
    const copy = JSON.parse(JSON.stringify(project));
    const plan = {
      sectionOrder: p => p['section-order'] || sectionOrder,
      sectionTitle: (p, key) => p[key + '-title'] || sectionTitles[key] || key,
      blockOrder: (p, key) => blockOrder(p, key).filter(type =>
        (type === 'text' && p[key + '-text']) ||
        (type === 'list' && (p[key + '-list'] || []).length) ||
        (type === 'media' && (p[key + '-media'] || []).length))
    };
    window.PortfolioContent.convertToContent(copy, plan);
    const fresh = buildContentBody(copy);
    const normalise = html => String(html)
      .replace(/\s+data-(media|block)-[a-z-]+="[^"]*"/g, '')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
    return { same: normalise(legacy) === normalise(fresh), legacyLength: legacy.length, contentLength: fresh.length };
  };

function renderAllProjects() {
  const projekteSection = document.querySelector('#projekte');
  if (!projekteSection) {
    console.warn('Section #projekte not found');
    return;
  }

  // Remove any existing .row.propalign elements (static cards)
  const existingRows = projekteSection.querySelectorAll('.row.propalign');
  existingRows.forEach(row => row.remove());

  // Group projects into rows of two and append fresh rows
  for (let i = 0; i < projectsData.length; i += 2) {
    const row = document.createElement('div');
    row.className = 'row propalign';

    const project1 = projectsData[i];
    row.innerHTML = renderProjectCard(project1);

    if (i + 1 < projectsData.length) {
      const project2 = projectsData[i + 1];
      row.innerHTML += renderProjectCard(project2);
    }

    projekteSection.appendChild(row);
  }

  // The cards are inserted after the lazy-loading instance was created, so the
  // new iframes have to be registered here; the collapse-open update alone can
  // run while they are still hidden.
  if (window.lazyLoadInstance) {
    window.lazyLoadInstance.update();
  }

if (window.lazySizes) {
    lazySizes.loader.checkElems();
}

  // Reinitialize tooltips
  if (typeof $ !== 'undefined' && $.fn.tooltip) {
    $('[data-toggle="tooltip"]').tooltip();
  }

  // The dev editor re-renders the cards after a preset load; the lightbox and
  // the editor have to know about the new DOM.
  if (window.glightbox && window.glightbox.reload) window.glightbox.reload();
  document.dispatchEvent(new CustomEvent('portfolio-rendered'));
}

  document.addEventListener('DOMContentLoaded', renderAllProjects);
  document.addEventListener('portfolio-rerender', renderAllProjects);
})();

document.addEventListener('DOMContentLoaded', function() {
    if (window.lazySizes) {
        lazySizes.loader.checkElems();
    }
});
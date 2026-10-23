// render-projects.js – Generates portfolio cards from projectsData
(function() {
  'use strict';
const BLANK_GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  const DEV_EDIT = localStorage.getItem('portfolio-dev') === '1';

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

  function buildMediaItems(items, project, key) {
    const gallery = project.id.toLowerCase();
    return items.map((item, index) => {
      let html = '';
      if (typeof item === 'string') {
        html = `<a href="${item}" class="glightbox" data-gallery="${gallery}"><img data-src="${item}" class="my-3 lazyload d-block w-100 rounded-lg" alt=""></a>`;
      } else if (item.icon) {
        html = renderIcon(item.icon);
      } else if (item.video) {
        const poster = item.poster ? ` poster="${item.poster}"` : '';
        html = wrapResponsive(`<video class="my-3 d-block w-100 rounded-lg shadow" controls playsinline preload="metadata"${poster}><source src="${item.video}" type="video/mp4"></video>`, item);
      } else if (item.embed) {
        const device = item.device || 'iphone8';
        const width = item.width || 375;
        const height = item.height || 667;
        const frame = `<div class="outer-iframe-prototype-wrap${item.desktopOnly ? ' d-none d-md-block' : ''}">
          <div class="iframe-prototype-wrapper my-5 d-flex justify-content-center">
            <div class="shadow-lg marvel-device ${device} black"><div class="top-bar"></div><div class="sleep"></div><div class="volume"></div><div class="camera"></div><div class="sensor"></div><div class="speaker"></div><div class="screen"><iframe width="${width}" height="${height}" class="lazy" src="about:blank" data-src="${item.embed}" frameborder="0" allowfullscreen></iframe></div><div class="home"></div><div class="bottom-bar"></div></div>
          </div>
          <div class="color-choose-wrap d-flex justify-content-center mb-2"><div class="btn-group btn-group-sm" role="group"><button type="button" class="btn download-section-color select-black">Schwarz</button><button type="button" class="btn download-section-color select-silver">Silber</button><button type="button" class="btn download-section-color select-gold">Gold</button></div></div>
          <div class="d-flex justify-content-center hint-wrap mb-5"><span class="text-muted" style="font-size: 60%;">Wählen Sie eine Geräte-Farbe</span></div>
        </div>`;
        html = item.desktopOnly ? frame : wrapResponsive(frame, item);
      } else if (item.link) {
        const title = item.title ? ` title="${item.title}"` : '';
        html = wrapResponsive(`<a href="${item.link}" target="_blank"${title}>${item.label || item.link} <i class="fas fa-external-link-alt"></i></a>`, item);
      } else if (item.src) {
        const extra = item.className ? ` ${item.className}` : '';
        const img = `<img data-src="${item.src}" class="my-3 lazyload d-block w-100 rounded-lg${extra}" alt="">`;
        if (item.href) {
          html = wrapResponsive(`<a href="${item.href}">${img}</a>`, item);
        } else if (item.lightbox === false) {
          html = wrapResponsive(img, item);
        } else {
          const caption = item.caption ? ` data-glightbox="title: ${item.caption}"` : '';
          html = wrapResponsive(`<a href="${item.src}" class="glightbox" data-gallery="${gallery}"${caption}>${img}</a>`, item);
        }
      }
      return html ? withMediaData(html, project, key, index) : '';
    }).join('');
  }

  // One section: title, text, list and media are independent. Any section may
  // use any of them; nothing here branches on the section name.
  function buildSection(project, key) {
    const title = project[key + '-title'] || sectionTitles[key] || key;
    const text = project[key + '-text'];
    const list = project[key + '-list'];
    const media = project[key + '-media'];
    const bodyClass = project[key + '-class'] || '';
    if (!text && (!list || !list.length) && (!media || !media.length)) return '';
    let body = '';
    if (text) body += `<div class="project-detail-text">${text}</div>`;
    if (list && list.length) body += `<ul>${list.map(item => `<li>${item}</li>`).join('')}</ul>`;
    if (media && media.length) body += buildMediaItems(media, project, key);
    return buildDetail(title, body, bodyClass, key);
  }

  function buildCta(project) {
    return `<div class="d-flex justify-content-center">
    <button class="scroll-to-top-card" onclick="document.querySelector('#thumbCluster-${project.id}').scrollIntoView({ behavior: 'smooth', block: 'start' });">
        <i class="fas fa-chevron-up"></i> Zurück zur Übersicht
    </button>
</div>`;
  }

  function buildCollapseContent(project) {
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
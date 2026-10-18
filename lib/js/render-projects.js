// render-projects.js – Generates portfolio cards from projectsData
(function() {
  'use strict';
const BLANK_GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

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
    return `<img data-src="${icon.src}" src="${BLANK_GIF}" class="lazyload iconsizing ${icon.extraClass || ''}" alt="" title="${icon.title}" data-toggle="tooltip" data-placement="top">`;
}

  // One block of the expanded card: heading plus body. Replaces the old dt/dd pairs,
  // which had no dl ancestor and were therefore invalid HTML.
  function buildDetail(label, body, bodyClass = '') {
    return `<section class="project-detail">
      <h3>${label}</h3>
      <div class="project-detail-body ${bodyClass}">${body}</div>
    </section>`;
  }

  function buildDesignedWith(iconKeys) {
    if (!iconKeys || iconKeys.length === 0) return '';
    const iconsHtml = iconKeys.map(key => renderIcon(key)).join('');
    return buildDetail('Verwendete Tools:', iconsHtml, 'd-flex flex-row align-items-center flex-wrap mb-5');
  }

  function buildPrototypeLink(link, text) {
    if (!link) return '';
    return buildDetail('Interaktiver High-Fidelity Prototyp', `<a href="${link}" target="_blank" title="${text}" alt="Link zum interaktiven Prototypen">${text} <i class="fas fa-external-link-alt"></i></a>`);
  }

  // Final Design: the project's own result, at the top of the card.
  // Each entry carries a caption and a lightbox flag by default; a caption
  // becomes the GLightbox title, lightbox: false keeps the image inline.
  function buildFinalDesign(project) {
    const items = project.finalDesign;
    if (!items || !items.length) return '';
    const gallery = project.id.toLowerCase();
    const html = items.map(item => {
      const img = `<img data-src="${item.src}" class="my-3 lazyload d-block w-100 rounded-lg" alt="">`;
      if (item.lightbox === false) return img;
      const caption = item.caption ? ` data-glightbox="title: ${item.caption}"` : '';
      return `<a href="${item.src}" class="glightbox" data-gallery="${gallery}"${caption}>${img}</a>`;
    }).join('');
    return buildDetail('Final Design', html);
  }

  // Generic media list. A string is an image; the rare video, embed, link or
  // icon is an object. No section knows about the other sections.
  function wrapResponsive(html, item) {
    if (item.mobileOnly) return `<div class="d-md-none">${html}</div>`;
    if (item.desktopOnly) return `<div class="d-none d-md-block">${html}</div>`;
    return html;
  }

  function buildMediaItems(items, project) {
    const gallery = project.id.toLowerCase();
    return items.map(item => {
      if (typeof item === 'string') {
        return `<a href="${item}" class="glightbox" data-gallery="${gallery}"><img data-src="${item}" class="my-3 lazyload d-block w-100 rounded-lg" alt=""></a>`;
      }
      if (item.icon) return renderIcon(item.icon);
      if (item.video) {
        const poster = item.poster ? ` poster="${item.poster}"` : '';
        return wrapResponsive(`<video class="my-3 d-block w-100 rounded-lg shadow" controls playsinline preload="metadata"${poster}><source src="${item.video}" type="video/mp4"></video>`, item);
      }
      if (item.embed) {
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
        return item.desktopOnly ? frame : wrapResponsive(frame, item);
      }
      if (item.link) {
        const title = item.title ? ` title="${item.title}"` : '';
        return wrapResponsive(`<a href="${item.link}" target="_blank"${title}>${item.label || item.link} <i class="fas fa-external-link-alt"></i></a>`, item);
      }
      if (item.src) {
        const extra = item.className ? ` ${item.className}` : '';
        const img = `<img data-src="${item.src}" class="my-3 lazyload d-block w-100 rounded-lg${extra}" alt="">`;
        if (item.href) {
          return wrapResponsive(`<a href="${item.href}">${img}</a>`, item);
        }
        if (item.lightbox === false) return wrapResponsive(img, item);
        const caption = item.caption ? ` data-glightbox="title: ${item.caption}"` : '';
        return wrapResponsive(`<a href="${item.src}" class="glightbox" data-gallery="${gallery}"${caption}>${img}</a>`, item);
      }
      return '';
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
    if (text) body += text;
    if (list && list.length) body += `<ul>${list.map(item => `<li>${item}</li>`).join('')}</ul>`;
    if (media && media.length) body += buildMediaItems(media, project);
    return buildDetail(title, body, bodyClass);
  }

  function buildCta(project) {
    return `<div class="d-flex justify-content-center">
    <button class="scroll-to-top-card" onclick="document.querySelector('#thumbCluster${project.id}').scrollIntoView({ behavior: 'smooth', block: 'start' });">
        <i class="fas fa-chevron-up"></i> Zurück zur Übersicht
    </button>
</div>`;
  }

  function buildCollapseContent(project) {
    // Flat projects carry their own section order. Everything else still uses
    // the old field-by-field path until the migration is complete.
    if (project['section-order']) {
      const order = project['section-order'] || sectionOrder;
      return order.map(key => buildSection(project, key)).join('') + buildCta(project);
    }

    let html = '';
    
    // Final Design section
    html += buildFinalDesign(project);
    html += buildDesignedWith(project.verwendeTools);
    
    // Prototype link
    html += buildPrototypeLink(project.prototypeLink, project.prototypeText);
    
    // Background
    if (project.background) {
      html += buildDetail('Projekthintergrund', project.background);
    }
    
    // Project media carried by the data
    if (project.backgroundMediaHtml) {
      html += project.backgroundMediaHtml;
    }
    
    // Organisation
    if (project.organisation) {
      html += buildDetail('Organisation', project.organisation);
    }
    
    // Duration
    if (project.duration) {
      html += buildDetail('Dauer', project.duration);
    }
    
    // Target group
    if (project.targetGroup) {
      html += buildDetail('Zielgruppe', project.targetGroup);
    }
    
    // Team
    if (project.team) {
      html += buildDetail('Interdisziplinäres Team', project.team);
    }
    
    // For Sprachzwirbel: goalText is separate
    if (project.goalText) {
      html += buildDetail('Ziel', project.goalText);
    }
    
    // Topic
    if (project.topic) {
      html += buildDetail('Thema', project.topic);
    }
    
    // Goal details (Methodik / Vorgehen)
    if (project.goalDetails) {
      html += buildDetail('Vorgehen / Methodik', project.goalDetails);
    }
    
    // Implementation
    if (project.implementation) {
      html += buildDetail('Umsetzung', project.implementation);
    }
    
    // Design process (custom HTML from the data, or the project's media block)
    if (project.designProcessHtml) {
      html += buildDetail('Designprozess', project.designProcessHtml);
    }
    if (project.designProcessMediaHtml) {
      html += project.designProcessMediaHtml;
    }
    
    // Achievements
    if (project.achievements && project.achievements.length) {
      html += buildDetail('Meine Leistung im Team', `<ul>${project.achievements.map(item => `<li>${item}</li>`).join('')}</ul>`);
      if (project.goals && project.goals.length) {
        html += buildDetail('Erreichte Ziele', `<ul>${project.goals.map(item => `<li>${item}</li>`).join('')}</ul>`);
      }
    }
    // CTA button at end of card content
    html += buildCta(project);
    return html;
  }

  function renderProjectCard(project) {
    const tagsHtml = project.tags.map(tag => `<span class="badge badge-tag">${tag}</span>`).join('');
    // Flat projects carry the card fields as kebab-case keys; the old projects
    // still use the camelCase shape until the migration is complete.
    const thumbClass = project['thumbnail-class'] || project.thumbnailClass;
    const shortDesc = {
      mobile: project['short-desc-mobile'] || project.shortDesc.mobile,
      tablet: project['short-desc-tablet'] || project.shortDesc.tablet,
      desktop: project['short-desc-desktop'] || project.shortDesc.desktop
    };
    
    // Build the thumbnail card
    return `
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 px-md-1 cluster" id="thumbCluster${project.id}">
        <a class="thumb-element collapsed" data-toggle="collapse" href="#thumbCollapse${project.id}" role="button" aria-expanded="false" aria-controls="thumbCollapse${project.id}">
          <div class="card">
            <div class="row no-gutters">
              <div class="col-4 col-md-4">
                <div class="${thumbClass}" alt="Thumbnail ${project.title}"></div>
              </div>
              <div class="col-8 col-md-8">
                <div class="card-body-thumbnail d-flex flex-column justify-content-start align-items-start">
                  <h6 class="card-title d-sm-none mt-n1 mb-1">${project.title}</h6>
                  <h5 class="card-title d-none d-sm-block d-md-none mb-1">${project.title}</h5>
                  <h4 class="card-title d-none d-md-block mt-n1 mb-2">${project.title}</h4>
                  
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
        </a>
        <div class="">
          <div class="row">
            <div class="col">
              <div class="collapse multi-collapse" id="thumbCollapse${project.id}">
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
}

  document.addEventListener('DOMContentLoaded', renderAllProjects);
})();

document.addEventListener('DOMContentLoaded', function() {
    if (window.lazySizes) {
        lazySizes.loader.checkElems();
    }
});
// render-projects.js – Generates portfolio cards from projectsData
(function() {
  'use strict';
const BLANK_GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

  // Icon mapping for "Designed mit" section
  const iconMap = {
    sketching:   { src: './lib/images/icons/sketching.svg', title: 'Zeichnen von Wireframes' },
    xd:          { src: './lib/images/icons/xd.svg', title: 'Adobe XD - Experience Design - Prototypdesign' },
    msteams:     { src: './lib/images/icons/msteams.svg', title: 'MS Teams' },
    jira:        { src: './lib/images/icons/jira.svg', title: 'JIRA - Projektverwaltung', extraClass: 'jiraico' },
    invision:    { src: './lib/images/icons/invision.svg', title: 'InVision Freehand - Collab Whiteboard', extraClass: 'invision' },
    vscode:      { src: './lib/images/icons/vscode.png', title: 'Microsoft Visual Studio Code' },
    'bootstrap-4': { src: './lib/images/icons/bootstrap-4.svg', title: 'Bootstrap 4 - CSS-Framework' },
    'html-5':    { src: './lib/images/icons/html-5.svg', title: 'HTML5' },
    'css-3':     { src: './lib/images/icons/css-3.svg', title: 'CSS3' },
    javascript:  { src: './lib/images/icons/javascript.svg', title: 'Javascript' },
    jquery:      { src: './lib/images/icons/jquery.svg', title: 'Jquery - Javascript-Framework', extraClass: 'jqueryico' },
    axure:       { src: './lib/images/icons/axure.png', title: 'Axure RP Prototypdesign' },
    'photoshop-cc': { src: './lib/images/icons/photoshop-cc.svg', title: 'Adobe Photoshop CC' },
    angular:     { src: './lib/images/icons/angular.svg', title: 'Angular - JavaScript-Framework' },
    typescript:  { src: './lib/images/icons/typescript.svg', title: 'Typescript' },
    'github-octocat': { src: './lib/images/icons/github-octocat.svg', title: 'GitHub - Version Control' },
    illustrator: { src: './lib/images/icons/illustrator.svg', title: 'Adobe Illustrator CC' }
  };

  function renderIcon(iconKey) {
    const icon = iconMap[iconKey];
    if (!icon) return '';
    return `<img data-src="${icon.src}" src="${BLANK_GIF}" class="lazyload iconsizing ${icon.extraClass || ''}" alt="" title="${icon.title}" data-toggle="tooltip" data-placement="top">`;
}

  function buildDesignedWith(iconKeys) {
    if (!iconKeys || iconKeys.length === 0) return '';
    const iconsHtml = iconKeys.map(key => renderIcon(key)).join('');
    return `<dt>Designed mit:</dt><dd class="d-flex flex-row align-items-center flex-wrap mb-5">${iconsHtml}</dd>`;
  }

  function buildPrototypeLink(link, text) {
    if (!link) return '';
    return `<dt>Interaktiver High-Fidelity Prototyp</dt><dd><a href="${link}" target="_blank" title="${text}" alt="Link zum interaktiven Prototypen">${text} <i class="fas fa-external-link-alt"></i></a></dd>`;
  }

  function buildCollapseContent(project) {
    let html = '';
    
    // Designed mit
    html += buildDesignedWith(project.designedWithIcons);
    
    // Prototype link
    html += buildPrototypeLink(project.prototypeLink, project.prototypeText);
    
    // Background
    if (project.background) {
      html += `<dt>Projekthintergrund</dt><dd>${project.background}</dd>`;
    }
    
    // Optional images (Horizon screenshots for first two projects)
    if (project.id === 'Proj01' || project.id === 'Proj02') {
      html += `
        <a href="./lib/images/ssb-collapseBody/horizon-start.png" class="glightbox">
          <img data-src="./lib/images/ssb-collapseBody/horizon-start.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg">
        </a>
        <a href="./lib/images/ssb-collapseBody/horizon-mobilansicht.png" class="glightbox">
          <img data-src="./lib/images/ssb-collapseBody/horizon-mobilansicht.png" class="my-3 lazyload mb-2 d-block w-100 img-zoomable rounded-lg">
        </a>
      `;
    }
    
    // Organisation
    if (project.organisation) {
      html += `<dt>Organisation</dt><dd>${project.organisation}</dd>`;
    }
    
    // Duration
    if (project.duration) {
      html += `<dt>Dauer</dt><dd>${project.duration}</dd>`;
    }
    
    // Target group
    if (project.targetGroup) {
      html += `<dt>Zielgruppe</dt><dd>${project.targetGroup}</dd>`;
    }
    
    // Team
    if (project.team) {
      html += `<dt>Interdisziplinäres Team</dt><dd>${project.team}</dd>`;
    }
    
    // For Sprachzwirbel: goalText is separate
    if (project.goalText) {
      html += `<dt>Ziel</dt><dd>${project.goalText}</dd>`;
    }
    
    // Design process (custom HTML or carousel)
    if (project.designProcessHtml) {
      html += `<dt>Designprozess</dt><dd>${project.designProcessHtml}</dd>`;
    } else if (project.id === 'Proj03') {
      // Sprachzwirbel carousel
      html += `
        <div id="slider-sprachzwirbel" class="carousel slide carousel-fade shadow" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active"><img data-src="./lib/images/slider/slider-sprachzwirbel-s7.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s1.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s2.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s3.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s4.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-iphone-hoch-lightdark-animated.gif" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s5.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s6.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
          </div>
          <a class="carousel-control-prev" href="#slider-sprachzwirbel" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Vorheriges</span></a>
          <a class="carousel-control-next" href="#slider-sprachzwirbel" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Nächstes</span></a>
        </div>
        <div class="ext-web-prototype-wrapper d-md-none">
          <dt>Website</dt><dd><a href="https://ux-paul-grossmann.github.io/sprachzwirbel" target="_blank" title="Sprachzwirbel-App">Sprachzwirbel <i class="fas fa-external-link-alt"></i></a></dd>
        </div>
        <div class="outer-iframe-prototype-wrap d-none d-md-block">
          <dt></dt><dd><div class="iframe-prototype-wrapper my-5 d-flex justify-content-center">
            <div class="shadow-lg marvel-device iphone8 black"><div class="top-bar"></div><div class="sleep"></div><div class="volume"></div><div class="camera"></div><div class="sensor"></div><div class="speaker"></div><div class="screen"><iframe width="375" height="667" class="lazy" data-src="https://ux-paul-grossmann.github.io/sprachzwirbel/" frameborder="0" allowfullscreen></iframe></div><div class="home"></div><div class="bottom-bar"></div></div>
          </div>
          <div class="color-choose-wrap d-flex justify-content-center mb-2"><div class="btn-group btn-group-sm" role="group" id="color-choose-device"><button type="button" class="btn download-section-color select-black">Schwarz</button><button type="button" class="btn download-section-color select-silver">Silber</button><button type="button" class="btn download-section-color select-gold">Gold</button></div></div>
          <div class="d-flex justify-content-center hint-wrap mb-5"><span class="text-muted" style="font-size: 60%;">Wählen Sie eine Geräte-Farbe</span></div></dd>
        </div>
        <div class="d-none d-md-block"><dt>Website</dt><dd><a href="https://ux-paul-grossmann.github.io/sprachzwirbel/" target="_blank">Sprachzwirbel - [WebApp] <i class="fas fa-external-link-alt"></i></a></dd></div>
      `;
    } else if (project.id === 'Proj04') {
      // Industrie 4.0 carousel
      html += `
        <div id="slider-ip40-Carousel" class="carousel slide carousel-fade shadow" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active"><img data-src="./lib/images/slider/slider-ip-s1a.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s1.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s2.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s3.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s4.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s5.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s5A.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s5B.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s6.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s6A.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s6B.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
          </div>
          <a class="carousel-control-prev" href="#slider-ip40-Carousel" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Vorheriges</span></a>
          <a class="carousel-control-next" href="#slider-ip40-Carousel" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Nächstes</span></a>
        </div>
      `;
    } else if (project.id === 'Proj05') {
      html += `
        <div id="slider-senseeringCarousel" class="carousel slide carousel-fade shadow" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active"><img data-src="./lib/images/slider/slider-senseering-sA.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-senseering-sB.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-senseering-sC.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-senseering-sD.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-senseering-sE.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-senseering-sF.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
          </div>
          <a class="carousel-control-prev" href="#slider-senseeringCarousel" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Vorheriges</span></a>
          <a class="carousel-control-next" href="#slider-senseeringCarousel" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Nächstes</span></a>
        </div>
      `;
    } else if (project.id === 'Proj06') {
      html += `
        <div id="slider-fhacDesignCarousel" class="carousel slide carousel-fade shadow" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active"><img data-src="./lib/images/slider/slider-fh-aachen-mobile-design-1.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-fh-aachen-mobile-design-2.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
            <div class="carousel-item"><img data-src="./lib/images/slider/slider-fh-aachen-mobile-design-3.jpg" src="${BLANK_GIF}" class="lazyload d-block w-100 px-0 mx-0 rounded-lg" alt=""></div>
          </div>
          <a class="carousel-control-prev" href="#slider-fhacDesignCarousel" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Vorheriges</span></a>
          <a class="carousel-control-next" href="#slider-fhacDesignCarousel" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Nächstes</span></a>
        </div>
        <div class="ext-web-prototype-wrapper d-md-none">
          <a href="./lib/images/fhac-collapseBody/fhacxdscrn.png"><img data-src="./lib/images/fhac-collapseBody/fhacxdscrn.png" class="lazyload d-block w-100 px-0 mx-0" alt="FH Aachen Mobile Redesign - Adobe XD"></a>
          <dt>Website</dt><dd><a href="https://xd.adobe.com/embed/71bccdfd-e05a-4268-5009-0697868d0bbc-078d/" target="_blank">Klickbarer Prototyp_FH-AC-Mobile-320x640 <i class="fas fa-external-link-alt"></i></a></dd>
        </div>
        <div class="outer-iframe-prototype-wrap d-none d-md-block">
          <dt></dt><dd><div class="iframe-prototype-wrapper my-5 d-flex justify-content-center">
            <div class="shadow-lg marvel-device iphone5s black"><div class="top-bar"></div><div class="sleep"></div><div class="volume"></div><div class="camera"></div><div class="sensor"></div><div class="speaker"></div><div class="screen"><iframe width="320" height="568" class="lazy" data-src="https://xd.adobe.com/embed/71bccdfd-e05a-4268-5009-0697868d0bbc-078d/" frameborder="0" allowfullscreen></iframe></div><div class="home"></div><div class="bottom-bar"></div></div>
          </div>
          <div class="color-choose-wrap d-flex justify-content-center mb-2"><div class="btn-group btn-group-sm" role="group"><button type="button" class="btn download-section-color select-black">Schwarz</button><button type="button" class="btn download-section-color select-silver">Silber</button><button type="button" class="btn download-section-color select-gold">Gold</button></div></div>
          <div class="d-flex justify-content-center hint-wrap mb-5"><span class="text-muted" style="font-size: 60%;">Wählen Sie eine Geräte-Farbe</span></div></dd>
        </div>
      `;
    }
    
    // Achievements
    if (project.achievements && project.achievements.length) {
      html += `<dt>Meine Leistung im Team</dt><dd><ul>${project.achievements.map(item => `<li>${item}</li>`).join('')}</ul>`;
      if (project.goals && project.goals.length) {
        html += `<dt>Erreichte Ziele</dt><dd><ul>${project.goals.map(item => `<li>${item}</li>`).join('')}</ul></dd>`;
      }
      html += `</dd>`;
    } else if (project.id === 'Proj06') {
      // FH Aachen has no achievements list but we can leave it empty
    }
    
    return html;
  }

  function renderProjectCard(project) {
    const tagsHtml = project.tags.map(tag => `<span class="badge badge-tag">${tag}</span>`).join('');
    
    // Build the thumbnail card
    return `
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 px-md-1 cluster" id="thumbCluster${project.id}">
        <a class="thumb-element collapsed" data-toggle="collapse" href="#thumbCollapse${project.id}" role="button" aria-expanded="false" aria-controls="thumbCollapse${project.id}">
          <div class="card">
            <div class="row no-gutters">
              <div class="col-4 col-md-4">
                <div class="${project.thumbnailClass}" alt="Thumbnail ${project.title}"></div>
              </div>
              <div class="col-8 col-md-8">
                <div class="card-body-thumbnail d-flex flex-column justify-content-start align-items-start">
                  <h6 class="card-title d-sm-none mt-n1 mb-1">${project.title}</h6>
                  <h5 class="card-title d-none d-sm-block d-md-none mb-1">${project.title}</h5>
                  <h4 class="card-title d-none d-md-block mt-n1 mb-2">${project.title}</h4>
                  
                  <p class="card-description d-sm-none mb-2 small">${project.shortDesc.mobile}</p>
                  <p class="card-description d-none d-sm-block d-md-none mb-3 small">${project.shortDesc.tablet}</p>
                  <p class="card-description d-none d-md-block mb-3">${project.shortDesc.desktop}</p>
                  
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
if (window.lazySizes) {
    lazySizes.loader.checkElems();
}

// After appending all rows, refresh lightbox
if (typeof GLightbox !== 'undefined') {
    window.lightbox = GLightbox({
        selector: '.glightbox',
        skin: 'clean',
        openEffect: 'zoom',
        closeEffect: 'fade'
    });
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
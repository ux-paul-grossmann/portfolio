(function () {
    'use strict';

    var projects = typeof projectsData !== 'undefined' ? projectsData : [];
    var iconMap = {
        sketching: { src: './lib/images/icons/sketching.svg', title: 'Zeichnen von Wireframes' },
        xd: { src: './lib/images/icons/xd.svg', title: 'Adobe XD - Experience Design - Prototypdesign' },
        msteams: { src: './lib/images/icons/msteams.svg', title: 'MS Teams' },
        jira: { src: './lib/images/icons/jira.svg', title: 'JIRA - Projektverwaltung', extraClass: 'jiraico' },
        invision: { src: './lib/images/icons/invision.svg', title: 'InVision Freehand - Collab Whiteboard', extraClass: 'invision' },
        vscode: { src: './lib/images/icons/vscode.png', title: 'Microsoft Visual Studio Code' },
        'bootstrap-4': { src: './lib/images/icons/bootstrap-4.svg', title: 'Bootstrap 4 - CSS-Framework' },
        'html-5': { src: './lib/images/icons/html-5.svg', title: 'HTML5' },
        'css-3': { src: './lib/images/icons/css-3.svg', title: 'CSS3' },
        javascript: { src: './lib/images/icons/javascript.svg', title: 'Javascript' },
        jquery: { src: './lib/images/icons/jquery.svg', title: 'Jquery - Javascript-Framework', extraClass: 'jqueryico' },
        axure: { src: './lib/images/icons/axure.png', title: 'Axure RP Prototypdesign' },
        'photoshop-cc': { src: './lib/images/icons/photoshop-cc.svg', title: 'Adobe Photoshop CC' },
        angular: { src: './lib/images/icons/angular.svg', title: 'Angular - JavaScript-Framework' },
        typescript: { src: './lib/images/icons/typescript.svg', title: 'Typescript' },
        'github-octocat': { src: './lib/images/icons/github-octocat.svg', title: 'GitHub - Version Control' },
        illustrator: { src: './lib/images/icons/illustrator.svg', title: 'Adobe Illustrator CC' }
    };

    var currentIndex = 0;
    var isTransitioning = false;
    var BLANK_GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    function renderIcon(key) {
        var icon = iconMap[key];
        if (!icon) return '';
        return '<img data-src="' + icon.src + '" src="' + BLANK_GIF + '" class="lazyload iconsizing ' + (icon.extraClass || '') + '" alt="" title="' + icon.title + '" data-toggle="tooltip" data-placement="top">';
    }

    function buildDesignedWith(iconKeys) {
        if (!iconKeys || !iconKeys.length) return '';
        var html = iconKeys.map(function (k) { return renderIcon(k); }).join('');
        return '<dt>Designed mit:</dt><dd class="d-flex flex-row align-items-center flex-wrap mb-5">' + html + '</dd>';
    }

    function buildPrototypeLink(link, text) {
        if (!link) return '';
        return '<dt>Interaktiver High-Fidelity Prototyp</dt><dd><a href="' + link + '" target="_blank" title="' + text + '">' + text + ' <i class="fas fa-external-link-alt"></i></a></dd>';
    }

    function buildDetail(p) {
        var html = '';
        html += '<div class="pv-detail-inner">';
        html += buildDesignedWith(p.designedWithIcons);
        html += buildPrototypeLink(p.prototypeLink, p.prototypeText);
        if (p.background) html += '<dt>Projekthintergrund</dt><dd>' + p.background + '</dd>';
        if (p.id === 'Proj01' || p.id === 'Proj02') {
            html += '<a href="./lib/images/ssb-collapseBody/horizon-start.png" class="glightbox"><img data-src="./lib/images/ssb-collapseBody/horizon-start.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg"></a><a href="./lib/images/ssb-collapseBody/horizon-mobilansicht.png" class="glightbox"><img data-src="./lib/images/ssb-collapseBody/horizon-mobilansicht.png" class="my-3 lazyload mb-2 d-block w-100 img-zoomable rounded-lg"></a>';
        }
        if (p.organisation) html += '<dt>Organisation</dt><dd>' + p.organisation + '</dd>';
        if (p.duration) html += '<dt>Dauer</dt><dd>' + p.duration + '</dd>';
        if (p.targetGroup) html += '<dt>Zielgruppe</dt><dd>' + p.targetGroup + '</dd>';
        if (p.team) html += '<dt>Interdisziplinäres Team</dt><dd>' + p.team + '</dd>';
        if (p.goalText) html += '<dt>Ziel</dt><dd>' + p.goalText + '</dd>';
        if (p.topic) html += '<dt>Thema</dt><dd>' + p.topic + '</dd>';
        if (p.goalDetails) html += '<dt>Zielsetzung</dt><dd>' + p.goalDetails + '</dd>';
        if (p.implementation) html += '<dt>Umsetzung</dt><dd>' + p.implementation + '</dd>';

        if (p.designProcessHtml) {
            html += '<dt>Designprozess</dt><dd>' + p.designProcessHtml + '</dd>';
        } else if (p.id === 'Proj03') {
            html += buildSprachzwirbelContent();
        } else if (p.id === 'Proj04') {
            html += buildIP40Content();
        } else if (p.id === 'Proj05') {
            html += buildSenseeringContent();
        } else if (p.id === 'Proj06') {
            html += buildFHACContent();
        }

        if (p.achievements && p.achievements.length) {
            html += '<dt>Meine Leistung im Team</dt><dd><ul>' + p.achievements.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul>';
            if (p.goals && p.goals.length) {
                html += '<dt>Erreichte Ziele</dt><dd><ul>' + p.goals.map(function (g) { return '<li>' + g + '</li>'; }).join('') + '</ul></dd>';
            }
            html += '</dd>';
        }
        html += '</div>';
        return html;
    }

    function buildSprachzwirbelContent() {
        return '<div id="slider-sprachzwirbel" class="carousel slide carousel-fade shadow" data-ride="carousel"><div class="carousel-inner"><div class="carousel-item active"><img data-src="./lib/images/slider/slider-sprachzwirbel-s7.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s1.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s2.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s3.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s4.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-iphone-hoch-lightdark-animated.gif" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s5.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-sprachzwirbel-s6.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div></div><a class="carousel-control-prev" href="#slider-sprachzwirbel" role="button" data-slide="prev"><span class="carousel-control-prev-icon"></span><span class="sr-only">Vorheriges</span></a><a class="carousel-control-next" href="#slider-sprachzwirbel" role="button" data-slide="next"><span class="carousel-control-next-icon"></span><span class="sr-only">Nächstes</span></a></div><div class="ext-web-prototype-wrapper d-md-none"><dt>Website</dt><dd><a href="https://ux-paul-grossmann.github.io/sprachzwirbel" target="_blank">Sprachzwirbel <i class="fas fa-external-link-alt"></i></a></dd></div><div class="outer-iframe-prototype-wrap d-none d-md-block"><dt></dt><dd><div class="iframe-prototype-wrapper my-5 d-flex justify-content-center"><div class="shadow-lg marvel-device iphone8 black"><div class="top-bar"></div><div class="sleep"></div><div class="volume"></div><div class="camera"></div><div class="sensor"></div><div class="speaker"></div><div class="screen"><iframe width="375" height="667" class="lazy" data-src="https://ux-paul-grossmann.github.io/sprachzwirbel/" frameborder="0" allowfullscreen></iframe></div><div class="home"></div><div class="bottom-bar"></div></div></div><div class="color-choose-wrap d-flex justify-content-center mb-2"><div class="btn-group btn-group-sm" role="group" id="color-choose-device"><button type="button" class="btn download-section-color select-black">Schwarz</button><button type="button" class="btn download-section-color select-silver">Silber</button><button type="button" class="btn download-section-color select-gold">Gold</button></div></div><div class="d-flex justify-content-center hint-wrap mb-5"><span class="text-muted" style="font-size:60%">Wählen Sie eine Geräte-Farbe</span></div></dd></div><div class="d-none d-md-block"><dt>Website</dt><dd><a href="https://ux-paul-grossmann.github.io/sprachzwirbel/" target="_blank">Sprachzwirbel - [WebApp] <i class="fas fa-external-link-alt"></i></a></dd></div>';
    }

    function buildIP40Content() {
        return '<div id="slider-ip40-Carousel" class="carousel slide carousel-fade shadow" data-ride="carousel"><div class="carousel-inner"><div class="carousel-item active"><img data-src="./lib/images/slider/slider-ip-s1a.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s1.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s2.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s3.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s4.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s5.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s5A.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s5B.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s6.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s6A.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-ip-s6B.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div></div><a class="carousel-control-prev" href="#slider-ip40-Carousel" role="button" data-slide="prev"><span class="carousel-control-prev-icon"></span><span class="sr-only">Vorheriges</span></a><a class="carousel-control-next" href="#slider-ip40-Carousel" role="button" data-slide="next"><span class="carousel-control-next-icon"></span><span class="sr-only">Nächstes</span></a></div>';
    }

    function buildSenseeringContent() {
        return '<div id="slider-senseeringCarousel" class="carousel slide carousel-fade shadow" data-ride="carousel"><div class="carousel-inner"><div class="carousel-item active"><img data-src="./lib/images/slider/slider-senseering-sA.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-senseering-sB.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-senseering-sC.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-senseering-sD.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-senseering-sE.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-senseering-sF.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div></div><a class="carousel-control-prev" href="#slider-senseeringCarousel" role="button" data-slide="prev"><span class="carousel-control-prev-icon"></span><span class="sr-only">Vorheriges</span></a><a class="carousel-control-next" href="#slider-senseeringCarousel" role="button" data-slide="next"><span class="carousel-control-next-icon"></span><span class="sr-only">Nächstes</span></a></div>';
    }

    function buildFHACContent() {
        return '<div id="slider-fhacDesignCarousel" class="carousel slide carousel-fade shadow" data-ride="carousel"><div class="carousel-inner"><div class="carousel-item active"><img data-src="./lib/images/slider/slider-fh-aachen-mobile-design-1.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-fh-aachen-mobile-design-2.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div><div class="carousel-item"><img data-src="./lib/images/slider/slider-fh-aachen-mobile-design-3.jpg" src="' + BLANK_GIF + '" class="lazyload d-block w-100 px-0 mx-0 rounded-lg"></div></div><a class="carousel-control-prev" href="#slider-fhacDesignCarousel" role="button" data-slide="prev"><span class="carousel-control-prev-icon"></span><span class="sr-only">Vorheriges</span></a><a class="carousel-control-next" href="#slider-fhacDesignCarousel" role="button" data-slide="next"><span class="carousel-control-next-icon"></span><span class="sr-only">Nächstes</span></a></div><div class="ext-web-prototype-wrapper d-md-none"><a href="./lib/images/fhac-collapseBody/fhacxdscrn.png"><img data-src="./lib/images/fhac-collapseBody/fhacxdscrn.png" class="lazyload d-block w-100 px-0 mx-0" alt="FH Aachen Mobile Redesign"></a><dt>Website</dt><dd><a href="https://xd.adobe.com/embed/71bccdfd-e05a-4268-5009-0697868d0bbc-078d/" target="_blank">Klickbarer Prototyp_FH-AC-Mobile-320x640 <i class="fas fa-external-link-alt"></i></a></dd></div><div class="outer-iframe-prototype-wrap d-none d-md-block"><dt></dt><dd><div class="iframe-prototype-wrapper my-5 d-flex justify-content-center"><div class="shadow-lg marvel-device iphone5s black"><div class="top-bar"></div><div class="sleep"></div><div class="volume"></div><div class="camera"></div><div class="sensor"></div><div class="speaker"></div><div class="screen"><iframe width="320" height="568" class="lazy" data-src="https://xd.adobe.com/embed/71bccdfd-e05a-4268-5009-0697868d0bbc-078d/" frameborder="0" allowfullscreen></iframe></div><div class="home"></div><div class="bottom-bar"></div></div></div><div class="color-choose-wrap d-flex justify-content-center mb-2"><div class="btn-group btn-group-sm" role="group"><button type="button" class="btn download-section-color select-black">Schwarz</button><button type="button" class="btn download-section-color select-silver">Silber</button><button type="button" class="btn download-section-color select-gold">Gold</button></div></div><div class="d-flex justify-content-center hint-wrap mb-5"><span class="text-muted" style="font-size:60%">Wählen Sie eine Geräte-Farbe</span></div></dd></div>';
    }

    function buildSideCard(project, idx) {
        var tagsHtml = (project.tags || []).map(function (t) { return '<span class="badge badge-tag">' + t + '</span>'; }).join('');
        var shortDesc = project.shortDesc ? project.shortDesc.desktop || project.shortDesc.mobile : '';
        var thumbClass = project.thumbnailClass || '';
        var companyName = '';
        if (typeof projectHierarchy !== 'undefined') {
            for (var h = 0; h < projectHierarchy.length; h++) {
                for (var p = 0; p < projectHierarchy[h].projects.length; p++) {
                    if (projectHierarchy[h].projects[p].id === project.id) {
                        companyName = projectHierarchy[h].company;
                        break;
                    }
                }
                if (companyName) break;
            }
        }
        var num = (idx + 1) + ' / ' + projects.length;
        return '<div class="pv-side-inner">' +
            '<div class="pv-side-counter">' + num + '</div>' +
            '<div class="pv-side-thumb ' + thumbClass + '"></div>' +
            '<div class="pv-side-meta">' +
            '<h4 class="pv-side-title">' + project.title + '</h4>' +
            (companyName ? '<div class="pv-side-company">' + companyName + '</div>' : '') +
            '<p class="pv-side-desc">' + shortDesc + '</p>' +
            '<div class="pv-side-tags">' + tagsHtml + '</div>' +
            '</div>' +
            '<div class="pv-side-arrow"><i class="fas fa-chevron-right"></i></div>' +
            '</div>';
    }

    function animateTransition(slot, newHtml, dir) {
        if (!slot) return;
        var children = slot.children;
        if (children.length > 0) {
            var old = children[0];
            var slideDir = dir === -1 ? '100%' : '-100%';
            old.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease';
            old.style.transform = 'translateX(' + slideDir + ')';
            old.style.opacity = '0';
        }
        var wrapper = document.createElement('div');
        wrapper.innerHTML = newHtml;
        wrapper.style.transform = 'translateX(' + (dir === -1 ? '-100%' : '100%') + ')';
        wrapper.style.opacity = '0';
        wrapper.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease';
        wrapper.style.willChange = 'transform, opacity';
        slot.appendChild(wrapper);
        requestAnimationFrame(function () {
            wrapper.style.transform = 'translateX(0)';
            wrapper.style.opacity = '1';
        });
        setTimeout(function () {
            while (slot.children.length > 1) {
                slot.removeChild(slot.firstChild);
            }
            wrapper.style.willChange = 'auto';
        }, 400);
    }

    function render(activeIdx, direction) {
        direction = direction || 0;
        var prevIdx = (activeIdx - 1 + projects.length) % projects.length;
        var nextIdx = (activeIdx + 1) % projects.length;

        var prevSlot = document.querySelector('.pv-prev');
        var activeSlot = document.querySelector('.pv-active');
        var nextSlot = document.querySelector('.pv-next');

        if (prevSlot) {
            var prevHtml = '<div class="pv-side-inner-wrap">' + buildSideCard(projects[prevIdx], prevIdx) + '</div>';
            if (direction < 0) {
                animateTransition(prevSlot, prevHtml, direction);
            } else {
                prevSlot.innerHTML = prevHtml;
            }
        }
        if (nextSlot) {
            var nextHtml = '<div class="pv-side-inner-wrap">' + buildSideCard(projects[nextIdx], nextIdx) + '</div>';
            if (direction > 0) {
                animateTransition(nextSlot, nextHtml, direction);
            } else {
                nextSlot.innerHTML = nextHtml;
            }
        }
        if (activeSlot) {
            var centerHtml = '<div class="pv-detail-wrap">' + buildDetail(projects[activeIdx]) + '</div>';
            if (direction !== 0) {
                animateTransition(activeSlot, centerHtml, direction);
            } else {
                activeSlot.innerHTML = centerHtml;
            }
        }

        var counter = document.querySelector('.pv-counter');
        if (counter) counter.textContent = (activeIdx + 1) + ' / ' + projects.length;
        currentIndex = activeIdx;

        setTimeout(function () {
            if (typeof lazySizes !== 'undefined') lazySizes.loader.checkElems();
            if (typeof GLightbox !== 'undefined') {
                window.lightbox = GLightbox({
                    selector: '.glightbox',
                    skin: 'clean',
                    openEffect: 'zoom',
                    closeEffect: 'fade'
                });
            }
            if (typeof $ !== 'undefined' && $.fn.tooltip) {
                $('[data-toggle="tooltip"]').tooltip();
            }
            if (typeof $ !== 'undefined' && $.fn.carousel) {
                $('.carousel').carousel({ interval: 3000 });
            }
        }, 100);
    }

    function navigate(dir) {
        if (isTransitioning || projects.length < 2) return;
        isTransitioning = true;
        var newIdx = (currentIndex + dir + projects.length) % projects.length;
        render(newIdx, dir);
        setTimeout(function () { isTransitioning = false; }, 450);
    }

    function initViewer() {
        var section = document.querySelector('#projekte');
        if (!section || !projects.length) return;

        section.innerHTML = '';
        var heading = document.createElement('div');
        heading.className = 'pv-heading';
        heading.innerHTML = '<h1 class="text-center text-lg-left d-none d-sm-block">Projekte</h1><h2 class="text-center d-sm-none">Projekte</h2>';
        section.appendChild(heading);

        var prevSlot = document.createElement('div');
        prevSlot.className = 'pv-slot pv-prev';
        prevSlot.setAttribute('data-nav', '-1');
        prevSlot.innerHTML = '<div class="pv-side-inner-wrap">' + buildSideCard(projects[(projects.length - 1) % projects.length], (projects.length - 1) % projects.length) + '</div>';

        var activeSlot = document.createElement('div');
        activeSlot.className = 'pv-slot pv-active';
        activeSlot.innerHTML = '<div class="pv-detail-wrap">' + buildDetail(projects[0]) + '</div>';

        var nextSlot = document.createElement('div');
        nextSlot.className = 'pv-slot pv-next';
        nextSlot.setAttribute('data-nav', '1');
        nextSlot.innerHTML = '<div class="pv-side-inner-wrap">' + buildSideCard(projects[1 % projects.length], 1 % projects.length) + '</div>';

        var row = document.createElement('div');
        row.className = 'pv-row';
        row.appendChild(prevSlot);
        row.appendChild(activeSlot);
        row.appendChild(nextSlot);

        var counter = document.createElement('div');
        counter.className = 'pv-counter';
        counter.textContent = '1 / ' + projects.length;

        var container = document.createElement('div');
        container.className = 'pv-container';
        container.appendChild(row);
        container.appendChild(counter);
        section.appendChild(container);
        currentIndex = 0;

        container.addEventListener('click', function (e) {
            var slot = e.target.closest('.pv-slot');
            if (!slot) return;
            var nav = slot.getAttribute('data-nav');
            if (nav) navigate(parseInt(nav, 10));
        });

        document.addEventListener('keydown', function (e) {
            var isInput = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable);
            if (isInput) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
        });

        setTimeout(function () {
            if (typeof lazySizes !== 'undefined') lazySizes.loader.checkElems();
            if (typeof GLightbox !== 'undefined') {
                window.lightbox = GLightbox({
                    selector: '.glightbox',
                    skin: 'clean',
                    openEffect: 'zoom',
                    closeEffect: 'fade'
                });
            }
            if (typeof $ !== 'undefined' && $.fn.tooltip) {
                $('[data-toggle="tooltip"]').tooltip();
            }
            if (typeof $ !== 'undefined' && $.fn.carousel) {
                $('.carousel').carousel({ interval: 3000 });
            }
        }, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initViewer);
    } else {
        initViewer();
    }
})();

/* ============================================================
   PROJECT NAVIGATION – Morphing Cards
   Card transforms into detail on click, spatial Z-axis transitions
   ============================================================ */
(function() {
    'use strict';

    const NavState = {
        level: 0,
        companyIndex: null,
        history: [],
        selectedIndex: 0,
        activeCard: null
    };

    function renderLevel(level) {
        const section = document.querySelector('#projekte');
        if (!section) return;
        section.querySelectorAll('.nav-grid, .nav-breadcrumb, .morph-detail').forEach(el => el.remove());

        if (level === 0) renderCompanyLevel(section);
        else if (level === 1) renderProjectLevel(section);
    }

    /* ============================================================
       LEVEL 0 – COMPANY CARDS (Morph on click)
       ============================================================ */
    function renderCompanyLevel(container) {
        const grid = document.createElement('div');
        grid.className = 'nav-grid';

        projectHierarchy.forEach((company, i) => {
            const card = document.createElement('div');
            card.className = 'morph-card nav-card';
            card.tabIndex = 0;
            card.setAttribute('data-index', i);
            card.innerHTML = `
                <div class="morph-front">
                    <img src="${company.logo}" alt="${company.company}">
                    <h3>${company.company}</h3>
                    <span>${company.projects.length} Projekte</span>
                </div>
                <div class="morph-back">
                    <h3>${company.company}</h3>
                    <p>${company.projects.length} Projekte verfügbar</p>
                    <button class="enter-btn">Öffnen →</button>
                </div>`;

            card.addEventListener('click', () => enterCompany(i, card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); enterCompany(i, card); }
            });
            card.addEventListener('mouseenter', () => selectCard(i));
            card.addEventListener('focus', () => selectCard(i));
            grid.appendChild(card);
        });

        container.appendChild(grid);
        selectCard(NavState.selectedIndex);
        animateEntrance(grid.querySelectorAll('.morph-card'));
    }

    function enterCompany(index, card) {
        // Morph the clicked card
        card.classList.add('morphing');
        
        if (typeof Motion !== 'undefined') {
            Motion.animate(card, {
                scale: [1, 0.95],
                opacity: [1, 0],
                filter: ['blur(0px)', 'blur(8px)']
            }, { duration: 0.3, easing: [0.3, 0, 0.8, 0.15] }).finished.then(() => {
                NavState.history.push({ level: 0, companyIndex: null, selectedIndex: NavState.selectedIndex });
                NavState.level = 1;
                NavState.companyIndex = index;
                NavState.selectedIndex = 0;
                renderLevel(1);
            });
        } else {
            NavState.history.push({ level: 0, companyIndex: null, selectedIndex: NavState.selectedIndex });
            NavState.level = 1;
            NavState.companyIndex = index;
            NavState.selectedIndex = 0;
            renderLevel(1);
        }
    }

    /* ============================================================
       LEVEL 1 – PROJECT CARDS (Morph into detail)
       ============================================================ */
    function renderProjectLevel(container) {
        const company = projectHierarchy[NavState.companyIndex];
        if (!company) return;

        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'nav-breadcrumb';
        breadcrumb.innerHTML = `<button class="back-btn">← ${company.company}</button>`;
        breadcrumb.querySelector('.back-btn').addEventListener('click', goBack);
        container.appendChild(breadcrumb);

        const grid = document.createElement('div');
        grid.className = 'nav-grid';

        company.projects.forEach((project, i) => {
            const card = document.createElement('div');
            card.className = 'morph-card nav-card project-card';
            card.tabIndex = 0;
            card.setAttribute('data-index', i);

            const desc = project.shortDesc ? project.shortDesc.desktop : '';
            const tags = project.tags || [];
            const tagsHtml = tags.map(t => `<span class="tag">${t}</span>`).join('');

            card.innerHTML = `
                <div class="morph-front">
                    <h3>${project.title}</h3>
                    <p>${desc}</p>
                    <div class="tags">${tagsHtml}</div>
                </div>
                <div class="morph-detail">
                    <button class="close-detail">✕</button>
                    <h3>${project.title}</h3>
                    <div class="detail-content">
                        <p>${project.background || ''}</p>
                        ${project.organisation ? `<p><strong>Organisation:</strong> ${project.organisation}</p>` : ''}
                        ${project.duration ? `<p><strong>Dauer:</strong> ${project.duration}</p>` : ''}
                        ${project.team ? `<p><strong>Team:</strong> ${project.team}</p>` : ''}
                    </div>
                </div>`;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.close-detail')) {
                    e.stopPropagation();
                    collapseCard(card);
                    return;
                }
                if (!card.classList.contains('expanded')) {
                    expandCard(card, grid);
                }
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!card.classList.contains('expanded')) expandCard(card, grid);
                    else collapseCard(card);
                }
            });

            card.addEventListener('mouseenter', () => selectCard(i));
            card.addEventListener('focus', () => selectCard(i));
            grid.appendChild(card);
        });

        container.appendChild(grid);
        selectCard(NavState.selectedIndex);
        animateEntrance(grid.querySelectorAll('.morph-card'));
    }

    function expandCard(card, grid) {
        // Collapse any other expanded card
        grid.querySelectorAll('.morph-card.expanded').forEach(c => collapseCard(c));

        card.classList.add('expanded');
        card.style.gridColumn = '1 / -1';
        card.style.width = '100%';

        // Dim other cards
        grid.querySelectorAll('.morph-card').forEach(c => {
            if (c !== card) c.style.opacity = '0.3';
        });

        if (typeof Motion !== 'undefined') {
            Motion.animate(card.querySelector('.morph-detail'), {
                opacity: [0, 1],
                y: [10, 0]
            }, { duration: 0.3, easing: [0.05, 0.7, 0.1, 1] });
        }
    }

    function collapseCard(card) {
        card.classList.remove('expanded');
        card.style.gridColumn = '';
        card.style.width = '';

        const grid = card.closest('.nav-grid');
        if (grid) {
            grid.querySelectorAll('.morph-card').forEach(c => c.style.opacity = '1');
        }
    }

    /* ============================================================
       ANIMATIONS
       ============================================================ */
    function animateEntrance(cards) {
        if (typeof Motion === 'undefined') return;
        Motion.animate(cards, {
            scale: [0.92, 1],
            opacity: [0, 1],
            y: [30, 0],
            filter: ['blur(4px)', 'blur(0px)']
        }, {
            duration: 0.4,
            easing: [0.05, 0.7, 0.1, 1],
            delay: Motion.stagger(0.06)
        });
    }

    /* ============================================================
       NAVIGATION
       ============================================================ */
    function goBack() {
        const cards = document.querySelectorAll('#projekte .morph-card');
        if (typeof Motion !== 'undefined') {
            Motion.animate(cards, {
                scale: [1, 0.92],
                opacity: [1, 0],
                y: [0, -30],
                filter: ['blur(0px)', 'blur(4px)']
            }, { duration: 0.25, easing: 'ease-in' }).finished.then(() => {
                const prev = NavState.history.pop();
                NavState.level = prev.level;
                NavState.companyIndex = prev.companyIndex;
                NavState.selectedIndex = prev.selectedIndex;
                renderLevel(0);
            });
        } else {
            const prev = NavState.history.pop();
            NavState.level = prev.level;
            NavState.companyIndex = prev.companyIndex;
            NavState.selectedIndex = prev.selectedIndex;
            renderLevel(0);
        }
    }

    function selectCard(index) {
        document.querySelectorAll('#projekte .nav-card').forEach(c => c.classList.remove('selected'));
        const cards = document.querySelectorAll('#projekte .nav-card');
        if (cards[index]) {
            cards[index].classList.add('selected');
            NavState.selectedIndex = index;
        }
    }

    function moveSelection(dir) {
        const cards = Array.from(document.querySelectorAll('#projekte .nav-card')).filter(c => c.style.display !== 'none');
        if (!cards.length) return;
        let idx = NavState.selectedIndex;
        idx = (idx + dir + cards.length) % cards.length;
        selectCard(idx);
        if (cards[idx]) cards[idx].focus();
    }

    /* ============================================================
       KEYBOARD
       ============================================================ */
    document.addEventListener('keydown', function(e) {
        const active = document.activeElement;
        const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
        if (e.key === 'Escape' && !isInput) { e.preventDefault(); if (NavState.level > 0) goBack(); return; }
        if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowUp') { e.preventDefault(); if (NavState.level > 0) goBack(); return; }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { if (isInput) return; e.preventDefault(); moveSelection(1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { if (isInput) return; e.preventDefault(); moveSelection(-1); }
        if (e.key === 'Enter' && !isInput) {
            const focused = document.querySelector('#projekte .nav-card.selected');
            if (focused) { e.preventDefault(); focused.click(); }
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        if (typeof projectHierarchy === 'undefined') return;
        renderLevel(0);
    });
})();
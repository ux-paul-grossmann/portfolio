// dev-reorder.js – dev-only section reorder for the showcase cards.
// Active when localStorage['portfolio-dev'] is '1'; ?dev=1 sets it for every
// later load, ?dev=0 clears it. Adds a handle to every section of the open card,
// drags with pointer events (so it works with a mouse and on touch), shows the
// insertion line, auto-scrolls near the viewport edges and copies the resulting
// section-order array. The preview is kept in localStorage per project; the
// data file is never written from the browser.
(function () {
  'use strict';

  const DEV = localStorage.getItem('portfolio-dev') === '1';
  if (!DEV) return;

  const STORE = 'portfolio-section-order';
  const state = { drag: null, scrollDir: 0, raf: 0 };

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch (e) { return {}; }
  }
  function writeStore(map) {
    try { localStorage.setItem(STORE, JSON.stringify(map)); } catch (e) {}
  }
  function openCollapse() {
    return document.querySelector('#projekte .multi-collapse.show');
  }
  function sectionsOf(collapse) {
    return Array.from(collapse.querySelectorAll('.project-detail[data-section]'));
  }
  function projectIdOf(collapse) {
    return collapse.id.replace('thumbCollapse-', '');
  }

  // ---------- handles ----------
  function addHandles() {
    const open = openCollapse();
    if (!open) return;
    sectionsOf(open).forEach(section => {
      if (section.querySelector(':scope > .dev-reorder-handle')) return;
      const handle = document.createElement('span');
      handle.className = 'dev-reorder-handle';
      handle.textContent = '⠿';
      handle.title = 'Abschnitt ziehen';
      handle.setAttribute('aria-hidden', 'true');
      handle.addEventListener('pointerdown', startDrag);
      section.appendChild(handle);
    });
    updateBar();
  }

  function removeHandles() {
    document.querySelectorAll('.dev-reorder-handle').forEach(h => h.remove());
    document.querySelectorAll('.project-detail.dev-dragging, .project-detail.dev-before, .project-detail.dev-after')
      .forEach(s => s.classList.remove('dev-dragging', 'dev-before', 'dev-after'));
  }

  // ---------- drag ----------
  function startDrag(event) {
    if (event.button !== 0) return;
    const section = event.currentTarget.closest('.project-detail');
    if (!section) return;
    event.preventDefault();
    state.drag = { section, target: null, before: false };
    section.classList.add('dev-dragging');
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', endDrag, { once: true });
    document.addEventListener('pointercancel', endDrag, { once: true });
  }

  function onMove(event) {
    if (!state.drag) return;
    const dragged = state.drag.section;
    const over = document.elementFromPoint(event.clientX, event.clientY);
    const target = over && over.closest ? over.closest('.project-detail[data-section]') : null;
    clearMarks(dragged);
    if (target && target !== dragged && target.parentElement === dragged.parentElement) {
      const rect = target.getBoundingClientRect();
      state.drag.before = event.clientY < rect.top + rect.height / 2;
      target.classList.add(state.drag.before ? 'dev-before' : 'dev-after');
      state.drag.target = target;
    } else {
      state.drag.target = null;
    }
    autoScroll(event.clientY);
  }

  function clearMarks(except) {
    document.querySelectorAll('.project-detail.dev-before, .project-detail.dev-after').forEach(s => {
      if (s !== except) s.classList.remove('dev-before', 'dev-after');
    });
  }

  function autoScroll(y) {
    const edge = 90;
    if (y < edge) state.scrollDir = -1;
    else if (y > window.innerHeight - edge) state.scrollDir = 1;
    else state.scrollDir = 0;
    if (state.scrollDir && !state.raf) state.raf = requestAnimationFrame(scrollStep);
  }

  function scrollStep() {
    state.raf = 0;
    if (!state.drag || !state.scrollDir) return;
    window.scrollBy(0, state.scrollDir * 14);
    state.raf = requestAnimationFrame(scrollStep);
  }

  function endDrag() {
    const drag = state.drag;
    state.drag = null;
    state.scrollDir = 0;
    if (state.raf) { cancelAnimationFrame(state.raf); state.raf = 0; }
    document.removeEventListener('pointermove', onMove);
    if (!drag) return;
    drag.section.classList.remove('dev-dragging');
    clearMarks();
    if (drag.target) {
      drag.section.parentElement.insertBefore(drag.section, drag.before ? drag.target : drag.target.nextSibling);
      saveOrder();
    }
    updateBar();
  }

  function saveOrder() {
    const open = openCollapse();
    if (!open) return;
    const map = readStore();
    map[projectIdOf(open)] = sectionsOf(open).map(s => s.dataset.section);
    writeStore(map);
  }

  // Reorder a rendered card from the saved preview order; the call to action
  // stays last.
  function applyStored(collapse) {
    const order = readStore()[projectIdOf(collapse)];
    if (!Array.isArray(order)) return;
    const wrap = collapse.querySelector('section.px-md-4');
    if (!wrap) return;
    const cta = Array.from(wrap.children).find(el => el.querySelector && el.querySelector('.scroll-to-top-card'));
    const byKey = new Map(sectionsOf(collapse).map(s => [s.dataset.section, s]));
    order.forEach(key => {
      const section = byKey.get(key);
      if (section) wrap.appendChild(section);
    });
    if (cta) wrap.appendChild(cta);
  }

  // ---------- bar ----------
  function bar() {
    let el = document.getElementById('devReorderBar');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'devReorderBar';
    el.innerHTML = '<span class="dev-reorder-label"></span>' +
      '<button type="button" class="dev-reorder-button" data-act="copy">Copy order</button>' +
      '<button type="button" class="dev-reorder-button" data-act="hide">Bearbeiten beenden</button>';
    el.addEventListener('click', event => {
      const act = event.target.getAttribute('data-act');
      if (act === 'hide') toggle(false);
      if (act === 'copy') copyOrder();
    });
    document.body.appendChild(el);
    return el;
  }

  function updateBar() {
    const el = bar();
    const open = openCollapse();
    if (!open) { el.hidden = true; return; }
    el.hidden = false;
    const order = sectionsOf(open).map(s => s.dataset.section);
    el.querySelector('.dev-reorder-label').textContent = projectIdOf(open) + ': ' + order.join(' → ');
  }

  function copyOrder() {
    const open = openCollapse();
    if (!open) return;
    const text = 'section-order: ' + JSON.stringify(sectionsOf(open).map(s => s.dataset.section));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => flash('copied')).catch(() => fallback(text));
    } else {
      fallback(text);
    }
  }

  function fallback(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(area);
    if (ok) flash('copied'); else window.prompt('Copy the order manually:', text);
  }

  function flash(text) {
    const label = bar().querySelector('.dev-reorder-label');
    const prev = label.textContent;
    label.textContent = text;
    setTimeout(() => { label.textContent = prev; }, 1200);
  }

  // ---------- toggle ----------
  function toggle(on) {
    const active = on === undefined ? !document.body.classList.contains('dev-reorder') : on;
    document.body.classList.toggle('dev-reorder', active);
    const btn = document.getElementById('devReorderToggle');
    if (btn) btn.setAttribute('aria-pressed', String(active));
    if (active) {
      const open = openCollapse();
      if (open) applyStored(open);
      addHandles();
    } else {
      removeHandles();
      bar().hidden = true;
    }
  }

  function makeToggle() {
    const nav = document.querySelector('nav.navbar.fixed-bottom');
    if (!nav || document.getElementById('devReorderToggle')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'devReorderToggle';
    btn.className = 'dev-reorder-toggle';
    btn.title = 'Sections reorder (dev)';
    btn.setAttribute('aria-label', 'Sections reorder (dev)');
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = '⠿';
    btn.addEventListener('click', () => toggle());
    nav.appendChild(btn);
  }

  // ---------- init ----------
  function init() {
    makeToggle();
    document.querySelectorAll('.multi-collapse').forEach(applyStored);
    const onShown = target => {
      if (!document.body.classList.contains('dev-reorder')) return;
      if (target.classList.contains('multi-collapse')) addHandles();
    };
    const onHidden = target => {
      if (!document.body.classList.contains('dev-reorder')) return;
      if (target.classList.contains('multi-collapse')) { removeHandles(); bar().hidden = true; }
    };
    if (window.jQuery) {
      jQuery(document).on('shown.bs.collapse', (e) => onShown(e.target));
      jQuery(document).on('hidden.bs.collapse', (e) => onHidden(e.target));
    } else {
      document.addEventListener('shown.bs.collapse', (e) => onShown(e.target));
      document.addEventListener('hidden.bs.collapse', (e) => onHidden(e.target));
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();

// dev-editor.js – dev-only preset toolbar and inline editing.
// Active only with ?dev=1. Presets are JSON snapshots of projectsData in
// localStorage; loading one re-renders the cards. Inline edits write back to
// the in-memory data: section titles, section text and section lists.
(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const DEV = params.has('dev') || localStorage.getItem('portfolio-dev') === '1';
  if (!DEV) return;

  const STORE = 'portfolio-presets';
  const CURRENT = 'portfolio-preset-current';
  const ORDER_STORE = 'portfolio-section-order';
  const state = { open: false, selected: null, filter: '' };
  let toolbar = null;
  let input = null;
  let list = null;

  // ---------- data ----------
  function readPresets() {
    try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch (e) { return []; }
  }
  function writePresets(presets) {
    try { localStorage.setItem(STORE, JSON.stringify(presets)); } catch (e) {}
  }
  function snapshot() {
    return JSON.parse(JSON.stringify(projectsData));
  }
  function syncOrders() {
    try {
      const map = JSON.parse(localStorage.getItem(ORDER_STORE) || '{}');
      projectsData.forEach(project => {
        if (Array.isArray(map[project.id])) project['section-order'] = map[project.id];
      });
    } catch (e) {}
  }
  function applyData(data) {
    if (!Array.isArray(data)) return;
    projectsData.length = 0;
    data.forEach(project => projectsData.push(project));
  }
  function render() {
    if (document.body.classList.contains('dev-reorder')) {
      const toggle = document.getElementById('devReorderToggle');
      if (toggle) toggle.click();
    }
    try { localStorage.removeItem(ORDER_STORE); } catch (e) {}
    document.dispatchEvent(new CustomEvent('portfolio-rerender'));
  }

  // ---------- inline editing ----------
  function onEdit(event) {
    const el = event.currentTarget;
    const section = el.closest('.project-detail');
    const collapse = el.closest('.multi-collapse');
    if (!section || !collapse) return;
    const project = projectsData.find(p => p.id === collapse.id.replace('thumbCollapse-', ''));
    if (!project) return;
    const key = section.dataset.section;
    if (!key) return;
    if (el.tagName === 'H3') {
      project[key + '-title'] = el.textContent.trim();
    } else if (el.tagName === 'UL') {
      project[key + '-list'] = Array.from(el.children)
        .filter(child => child.tagName === 'LI')
        .map(child => child.innerHTML);
    } else {
      project[key + '-text'] = el.innerHTML;
    }
  }

  function markEditable(el) {
    if (!el) return;
    if (!el.isContentEditable) el.setAttribute('contenteditable', 'true');
    if (el.dataset.editBound === '1') return;
    el.dataset.editBound = '1';
    el.addEventListener('input', onEdit);
  }

  function applyEditing() {
    if (!state.open) return;
    document.querySelectorAll('#projekte .project-detail').forEach(section => {
      markEditable(section.querySelector(':scope > h3'));
      markEditable(section.querySelector(':scope > .project-detail-body > .project-detail-text'));
      markEditable(section.querySelector(':scope > .project-detail-body > ul'));
    });
  }

  function clearEditing() {
    document.querySelectorAll('#projekte [contenteditable="true"]').forEach(el => el.removeAttribute('contenteditable'));
  }

  // ---------- presets ----------
  function openList(on) {
    if (!list) return;
    list.hidden = !on;
    if (on) renderList();
  }

  function renderList() {
    if (!list) return;
    const presets = readPresets();
    const items = presets.filter(p => !state.filter || p.name.toLowerCase().includes(state.filter));
    list.innerHTML = items.length ? '' : '<div class="dev-preset-empty">Keine Presets</div>';
    items.forEach(preset => {
      const row = document.createElement('div');
      row.className = 'dev-preset-row' + (preset.name === state.selected ? ' is-current' : '');
      const name = document.createElement('button');
      name.type = 'button';
      name.className = 'dev-preset-name';
      name.textContent = preset.name;
      name.addEventListener('click', () => loadPreset(preset.name));
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'dev-preset-delete';
      del.textContent = '×';
      del.title = 'Preset löschen';
      del.setAttribute('aria-label', 'Preset ' + preset.name + ' löschen');
      del.addEventListener('click', event => { event.stopPropagation(); deletePreset(preset.name); });
      row.appendChild(name);
      row.appendChild(del);
      list.appendChild(row);
    });
  }

  function setSelected(name) {
    state.selected = name;
    try {
      if (name) localStorage.setItem(CURRENT, name);
      else localStorage.removeItem(CURRENT);
    } catch (e) {}
    if (input) input.value = name || '';
    renderList();
  }

  function newPreset() {
    const answer = window.prompt('Name für das neue Preset:', '');
    if (!answer) return;
    const name = answer.trim();
    if (!name) return;
    const presets = readPresets();
    if (presets.some(p => p.name === name) && !window.confirm('Preset „' + name + '“ überschreiben?')) return;
    syncOrders();
    const entry = { name: name, savedAt: new Date().toISOString(), data: snapshot() };
    const index = presets.findIndex(p => p.name === name);
    if (index >= 0) presets[index] = entry; else presets.push(entry);
    writePresets(presets);
    setSelected(name);
    openList(false);
  }

  function savePreset() {
    if (!state.selected) { newPreset(); return; }
    syncOrders();
    const presets = readPresets();
    const entry = { name: state.selected, savedAt: new Date().toISOString(), data: snapshot() };
    const index = presets.findIndex(p => p.name === state.selected);
    if (index >= 0) presets[index] = entry; else presets.push(entry);
    writePresets(presets);
    renderList();
  }

  function loadPreset(name) {
    if (!name) return;
    const entry = readPresets().find(p => p.name === name);
    if (!entry) return;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    applyData(JSON.parse(JSON.stringify(entry.data)));
    setSelected(name);
    openList(false);
    render();
  }

  function deletePreset(name) {
    if (!window.confirm('Preset „' + name + '“ löschen?')) return;
    writePresets(readPresets().filter(p => p.name !== name));
    if (state.selected === name) setSelected(null);
    else renderList();
  }

  // ---------- toolbar ----------
  function buildToolbar() {
    toolbar = document.createElement('div');
    toolbar.id = 'devPresetBar';
    toolbar.setAttribute('aria-label', 'Presets');
    toolbar.innerHTML = '' +
      '<button type="button" class="dev-preset-button" data-act="new">New</button>' +
      '<button type="button" class="dev-preset-button" data-act="save">Save Preset</button>' +
      '<button type="button" class="dev-preset-button" data-act="load">Load Preset</button>' +
      '<div class="dev-preset-picker">' +
        '<input type="search" class="dev-preset-search" id="devPresetSearch" placeholder="Preset suchen" autocomplete="off" aria-label="Preset suchen">' +
        '<div class="dev-preset-list" id="devPresetList" hidden></div>' +
      '</div>';
    document.body.appendChild(toolbar);
    input = toolbar.querySelector('#devPresetSearch');
    list = toolbar.querySelector('#devPresetList');
    toolbar.addEventListener('click', event => {
      const act = event.target.getAttribute('data-act');
      if (act === 'new') newPreset();
      if (act === 'save') savePreset();
      if (act === 'load') loadPreset(state.selected);
    });
    input.addEventListener('focus', () => openList(true));
    input.addEventListener('input', () => {
      state.filter = input.value.trim().toLowerCase();
      openList(true);
    });
    input.addEventListener('blur', () => {
      setTimeout(() => {
        if (toolbar.contains(document.activeElement)) return;
        openList(false);
        input.value = state.selected || '';
        state.filter = '';
      }, 140);
    });
    document.addEventListener('click', event => {
      if (toolbar && !toolbar.contains(event.target)) openList(false);
    });
  }

  function makeToggle() {
    const nav = document.querySelector('nav.navbar.fixed-bottom');
    if (!nav || document.getElementById('devPresetToggle')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'devPresetToggle';
    btn.className = 'dev-preset-toggle';
    btn.title = 'Presets and inline editing (dev)';
    btn.setAttribute('aria-label', 'Presets and inline editing (dev)');
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = '✎';
    btn.addEventListener('click', () => toggle());
    nav.appendChild(btn);
  }

  function toggle(on) {
    const active = on === undefined ? !state.open : on;
    state.open = active;
    document.body.classList.toggle('dev-edit', active);
    toolbar.classList.toggle('is-open', active);
    const btn = document.getElementById('devPresetToggle');
    if (btn) btn.setAttribute('aria-pressed', String(active));
    if (active) {
      if (document.body.classList.contains('dev-reorder')) {
        const reorder = document.getElementById('devReorderToggle');
        if (reorder) reorder.click();
      }
      applyEditing();
      renderList();
    } else {
      clearEditing();
      openList(false);
    }
  }

  // ---------- init ----------
  function init() {
    buildToolbar();
    makeToggle();
    try { state.selected = localStorage.getItem(CURRENT); } catch (e) {}
    if (state.selected) {
      // Re-apply the last selected preset so a reload continues where the
      // previous dev session stopped. Missing presets are ignored.
      if (readPresets().some(p => p.name === state.selected)) {
        loadPreset(state.selected);
      } else {
        if (input) input.value = state.selected;
        renderList();
      }
    }
    document.addEventListener('portfolio-rendered', () => {
      if (state.open) applyEditing();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();

// dev-editor.js – dev-only preset toolbar and inline editing.
// Active when localStorage['portfolio-dev'] is '1'; ?dev=1 sets it for every
// later load, ?dev=0 clears it. Presets are JSON snapshots of projectsData in
// localStorage; loading one re-renders the cards. Inline edits write back to
// the in-memory data: section titles, section text and section lists.
(function () {
  'use strict';

  const DEV = localStorage.getItem('portfolio-dev') === '1';
  if (!DEV) return;

  const STORE = 'portfolio-presets';
  const CURRENT = 'portfolio-preset-current';
  const ORDER_STORE = 'portfolio-section-order';
  const state = { open: false, selected: null, filter: '', dirty: false, sub: null };
  let toolbar = null;
  let input = null;
  let list = null;
  let saveButton = null;
  let loadButton = null;
  let undoButton = null;
  let revertButton = null;
  let subBar = null;
  let mediaTarget = null;
  let history = [];
  let baseline = null;

  function setDirty(value) {
    state.dirty = !!value;
    const btn = document.getElementById('devPresetToggle');
    if (!btn) return;
    btn.classList.toggle('is-dirty', state.dirty);
    btn.title = state.dirty
      ? 'Unsaved changes — presets, inline editing and media paths (dev)'
      : 'Presets, inline editing and media paths (dev)';
    updateButtons();
  }

  window.addEventListener('beforeunload', event => {
    if (!state.open && !state.dirty) return;
    event.preventDefault();
    event.returnValue = '';
  });

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

  function pushHistory() {
    const snap = snapshot();
    if (history.length && JSON.stringify(history[history.length - 1]) === JSON.stringify(snap)) return;
    history.push(snap);
    if (history.length > 50) history.shift();
    updateButtons();
  }

  function setBaseline(data) {
    baseline = JSON.parse(JSON.stringify(data));
    history = [];
    updateButtons();
  }

  function undo() {
    if (!history.length) return;
    closeSub();
    applyData(history.pop());
    const changed = baseline ? JSON.stringify(projectsData) !== JSON.stringify(baseline) : true;
    setDirty(changed);
    rerenderPreservingOpen();
  }

  function revert() {
    if (!state.dirty || !baseline) return;
    if (!window.confirm('Discard all changes since the last save or load?')) return;
    closeSub();
    applyData(JSON.parse(JSON.stringify(baseline)));
    history = [];
    setDirty(false);
    rerenderPreservingOpen();
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
    if (el.dataset.historyPushed !== '1') {
      pushHistory();
      el.dataset.historyPushed = '1';
    }
    if (el.tagName === 'H3') {
      project[key + '-title'] = el.textContent.trim();
    } else if (el.tagName === 'UL') {
      project[key + '-list'] = Array.from(el.children)
        .filter(child => child.tagName === 'LI')
        .map(child => child.innerHTML);
    } else {
      project[key + '-text'] = el.innerHTML;
    }
    setDirty(true);
  }

  function markEditable(el) {
    if (!el) return;
    if (!el.isContentEditable) el.setAttribute('contenteditable', 'true');
    if (el.dataset.editBound === '1') return;
    el.dataset.editBound = '1';
    el.addEventListener('input', onEdit);
    el.addEventListener('blur', () => { delete el.dataset.historyPushed; });
  }

  function applyEditing() {
    if (!state.open) return;
    document.querySelectorAll('#projekte .project-detail').forEach(section => {
      markEditable(section.querySelector(':scope > h3'));
      markEditable(section.querySelector(':scope > .project-detail-body > .project-detail-text'));
      markEditable(section.querySelector(':scope > .project-detail-body > ul'));
    });
    document.querySelectorAll('#projekte .thumb-element').forEach(card => {
      card.querySelectorAll('.card-title').forEach(title => markCardEditable(title, 'title'));
      const descriptions = card.querySelectorAll('.card-description');
      ['short-desc-mobile', 'short-desc-tablet', 'short-desc-desktop'].forEach((field, index) => {
        markCardEditable(descriptions[index], field);
      });
      card.querySelectorAll('.badge-tag').forEach((tag, index) => markCardEditable(tag, 'tag', index));
      guardCardLink(card);
    });
    document.querySelectorAll('#projekte [data-media-key]').forEach(el => markMediaEditable(el));
  }

  function onCardEdit(event) {
    const el = event.currentTarget;
    const cluster = el.closest('.cluster');
    if (!cluster) return;
    const project = projectsData.find(p => p.id === cluster.id.replace('thumbCluster-', ''));
    if (!project) return;
    const field = el.dataset.field;
    const value = el.textContent.trim();
    if (!field) return;
    if (el.dataset.historyPushed !== '1') {
      pushHistory();
      el.dataset.historyPushed = '1';
    }
    if (field === 'title') {
      project.title = value;
      cluster.querySelectorAll('[data-field="title"]').forEach(node => {
        if (node !== el) node.textContent = value;
      });
      cluster.querySelectorAll('article > h2, article > h3').forEach(node => { node.textContent = value; });
    } else if (field === 'tag') {
      const index = Number(el.dataset.tagIndex);
      if (!Number.isNaN(index) && project.tags) project.tags[index] = value;
    } else if (field) {
      project[field] = value;
    }
    setDirty(true);
  }

  function markCardEditable(el, field, tagIndex) {
    if (!el) return;
    if (!el.isContentEditable) el.setAttribute('contenteditable', 'true');
    el.dataset.field = field;
    if (field === 'tag') el.dataset.tagIndex = String(tagIndex);
    if (el.dataset.editBound === '1') return;
    el.dataset.editBound = '1';
    el.addEventListener('input', onCardEdit);
    el.addEventListener('blur', () => { delete el.dataset.historyPushed; });
  }

  function guardCardLink(card) {
    if (card.dataset.editGuard === '1') return;
    card.dataset.editGuard = '1';
    card.addEventListener('click', event => {
      if (event.target.closest('[contenteditable="true"]')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  function rerenderPreservingOpen() {
    const open = [...document.querySelectorAll('#projekte .multi-collapse.show')].map(collapse => collapse.id);
    const y = window.scrollY;
    document.addEventListener('portfolio-rendered', () => {
      open.forEach(id => {
        const collapse = document.getElementById(id);
        if (collapse) $(collapse).collapse('show');
      });
      setTimeout(() => window.scrollTo({ top: y, behavior: 'instant' }), 50);
    }, { once: true });
    render();
  }

  function mediaField(item) {
    if (typeof item === 'string') return { field: null, kind: 'Image' };
    if (!item || item.icon) return null;
    if (item.video) return { field: 'video', kind: 'Video' };
    if (item.embed) return { field: 'embed', kind: 'Embed' };
    if (item.link) return { field: 'link', kind: 'Link' };
    if (item.src) return { field: 'src', kind: 'Image' };
    return null;
  }

  function markMediaEditable(el) {
    if (el.dataset.mediaBound === '1') return;
    const project = projectsData.find(p => p.id === el.dataset.mediaProject);
    const key = el.dataset.mediaKey;
    const index = Number(el.dataset.mediaIndex);
    const list = project && key ? project[key + '-media'] : null;
    if (!Array.isArray(list) || !list[index]) return;
    const item = list[index];
    const meta = mediaField(item);
    if (!meta) return;
    el.dataset.mediaBound = '1';
    if (el.dataset.mediaTitle === undefined) el.dataset.mediaTitle = el.getAttribute('title') || '';
    el.title = 'Click to edit media path (dev)';
    el.addEventListener('click', event => {
      if (!state.open) return;
      event.preventDefault();
      event.stopPropagation();
      openMediaSub(project, key, index, item, meta.field, meta.kind);
    }, true);
  }

  function clearEditing() {
    document.querySelectorAll('#projekte [contenteditable="true"]').forEach(el => el.removeAttribute('contenteditable'));
    document.querySelectorAll('#projekte [data-history-pushed]').forEach(el => { delete el.dataset.historyPushed; });
    document.querySelectorAll('#projekte [data-media-key]').forEach(el => {
      if (el.dataset.mediaTitle) el.setAttribute('title', el.dataset.mediaTitle);
      else el.removeAttribute('title');
    });
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
    list.innerHTML = items.length ? '' : '<div class="dev-preset-empty">No presets</div>';
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
      del.title = 'Delete preset';
      del.setAttribute('aria-label', 'Delete preset ' + preset.name);
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
    updateButtons();
  }

  function updateButtons() {
    const hasSelection = !!state.selected;
    if (saveButton) saveButton.disabled = !hasSelection;
    if (loadButton) loadButton.disabled = !hasSelection;
    if (undoButton) undoButton.disabled = history.length === 0;
    if (revertButton) revertButton.disabled = !state.dirty || !baseline;
  }

  function newPreset() {
    const answer = window.prompt('New preset name:', '');
    if (!answer) return;
    const name = answer.trim();
    if (!name) return;
    const presets = readPresets();
    if (presets.some(p => p.name === name) && !window.confirm('Overwrite preset "' + name + '"?')) return;
    syncOrders();
    const entry = { name: name, savedAt: new Date().toISOString(), data: snapshot() };
    const index = presets.findIndex(p => p.name === name);
    if (index >= 0) presets[index] = entry; else presets.push(entry);
    writePresets(presets);
    setSelected(name);
    openList(false);
    setBaseline(projectsData);
    setDirty(false);
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
    setBaseline(projectsData);
    setDirty(false);
  }

  function loadPreset(name) {
    if (!name) return;
    const entry = readPresets().find(p => p.name === name);
    if (!entry) return;
    if (state.dirty && !window.confirm('Discard unsaved changes?')) return;
    closeSub();
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    applyData(JSON.parse(JSON.stringify(entry.data)));
    setSelected(name);
    openList(false);
    render();
    setBaseline(projectsData);
    setDirty(false);
  }

  function deletePreset(name) {
    if (!window.confirm('Delete preset "' + name + '"?')) return;
    writePresets(readPresets().filter(p => p.name !== name));
    if (state.selected === name) {
      setSelected(null);
      setDirty(true);
    } else {
      renderList();
    }
  }

  // ---------- sub toolbar ----------
  function ensureSubBar() {
    if (subBar) return subBar;
    subBar = document.createElement('div');
    subBar.id = 'devSubBar';
    subBar.setAttribute('aria-label', 'Dev sub toolbar');
    document.body.appendChild(subBar);
    return subBar;
  }

  function updateBarHeight() {
    if (!toolbar) return;
    document.documentElement.style.setProperty('--dev-bar-height', toolbar.offsetHeight + 'px');
  }

  function openSub(mode) {
    ensureSubBar();
    state.sub = mode;
    if (mode === 'card') buildCardSub();
    else if (mode === 'media') buildMediaSub();
    else if (mode === 'help') buildHelpSub();
    subBar.classList.add('is-open');
    updateBarHeight();
  }

  function closeSub() {
    state.sub = null;
    mediaTarget = null;
    if (subBar) {
      subBar.classList.remove('is-open');
      subBar.innerHTML = '';
    }
  }

  function esc(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function prettify(id) {
    return id.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  }

  function buildCardSub() {
    const options = ['<option value="__blank__">Blank card</option>']
      .concat(projectsData.map(project =>
        `<option value="${esc(project.id)}">${esc(project.title)} — ${esc(project.id)}</option>`))
      .join('');
    subBar.innerHTML = `
      <div class="dev-sub-head">New card</div>
      <div class="dev-sub-row dev-sub-fields">
        <label class="dev-sub-label">ID<input class="dev-sub-input" id="devCardId" placeholder="new-project-id" autocomplete="off"></label>
        <label class="dev-sub-label">Title<input class="dev-sub-input" id="devCardTitle" placeholder="Card title" autocomplete="off"></label>
        <label class="dev-sub-label">Thumbnail<input class="dev-sub-input" id="devCardThumb" placeholder="Path or URL (optional)" autocomplete="off"></label>
      </div>
      <div class="dev-sub-row dev-sub-template">
        <button type="button" class="dev-preset-button" data-act="prev" aria-label="Previous template">‹</button>
        <select id="devCardTemplate" aria-label="Card template">${options}</select>
        <button type="button" class="dev-preset-button" data-act="next" aria-label="Next template">›</button>
      </div>
      <div class="dev-sub-error" id="devCardError" role="alert"></div>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button" data-act="create">Create card</button>
        <button type="button" class="dev-preset-button" data-act="sub-close">Cancel</button>
      </div>`;
    const select = subBar.querySelector('#devCardTemplate');
    const idInput = subBar.querySelector('#devCardId');
    const titleInput = subBar.querySelector('#devCardTitle');
    const thumbInput = subBar.querySelector('#devCardThumb');
    const error = subBar.querySelector('#devCardError');
    [idInput, titleInput, thumbInput].forEach(field => {
      field.addEventListener('input', () => { error.textContent = ''; });
    });
    const cycle = delta => {
      const count = select.options.length;
      select.selectedIndex = (select.selectedIndex + delta + count) % count;
      select.focus();
    };
    subBar.querySelector('[data-act="prev"]').addEventListener('click', () => cycle(-1));
    subBar.querySelector('[data-act="next"]').addEventListener('click', () => cycle(1));
    subBar.querySelector('[data-act="create"]').addEventListener('click', () => {
      createCardFromForm(select.value, idInput.value, titleInput.value, thumbInput.value);
    });
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
    [idInput, titleInput, thumbInput].forEach(field => {
      field.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        createCardFromForm(select.value, idInput.value, titleInput.value, thumbInput.value);
      });
    });
    idInput.focus();
  }

  function createCardFromForm(templateId, idValue, titleValue, thumbValue) {
    const error = subBar ? subBar.querySelector('#devCardError') : null;
    const id = String(idValue || '').trim();
    const title = String(titleValue || '').trim() || prettify(id);
    const thumb = String(thumbValue || '').trim();
    const fail = message => {
      if (error) error.textContent = message;
      return;
    };
    if (!id) return fail('Enter a project ID.');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return fail('The ID must be kebab-case, e.g. new-project.');
    if (projectsData.some(project => project.id === id)) return fail('This ID already exists: ' + id);
    let project;
    if (templateId === '__blank__') {
      project = {
        id: id,
        title: title,
        'thumbnail-class': 'thumbnail-custom',
        thumbnail: thumb,
        'short-desc-mobile': title,
        'short-desc-tablet': title,
        'short-desc-desktop': title,
        tags: ['Neu'],
        'section-order': ['final-design', 'tools', 'background', 'topic'],
        'final-design-text': 'Final Design. Diesen Text bearbeiten.',
        'background-text': 'Projekthintergrund. Diesen Text bearbeiten.',
        'topic-text': 'Thema. Diesen Text bearbeiten.'
      };
    } else {
      const template = projectsData.find(project => project.id === templateId);
      if (!template) return fail('Template not found.');
      project = JSON.parse(JSON.stringify(template));
      project.id = id;
      project.title = title;
      project['short-desc-mobile'] = title;
      project['short-desc-tablet'] = title;
      project['short-desc-desktop'] = title;
      if (thumb) {
        project['thumbnail-class'] = 'thumbnail-custom';
        project.thumbnail = thumb;
      }
    }
    pushHistory();
    projectsData.push(project);
    setDirty(true);
    closeSub();
    rerenderPreservingOpen();
    setTimeout(() => {
      const cluster = document.getElementById('thumbCluster-' + id);
      if (cluster) cluster.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  function buildMediaSub() {
    const target = mediaTarget;
    if (!target) {
      closeSub();
      return;
    }
    const { project, key, index, item, field, kind, current } = target;
    subBar.innerHTML = `
      <div class="dev-sub-head">Edit media path</div>
      <div class="dev-sub-row">
        <label class="dev-sub-label">${esc(kind)} path for <strong>${esc(project.title)}</strong> — ${esc(key)} #${index + 1}
          <input class="dev-sub-input" id="devMediaPath" value="${esc(current || '')}" autocomplete="off">
        </label>
      </div>
      <div class="dev-sub-error" id="devMediaError" role="alert"></div>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button" data-act="save-media">Save</button>
        <button type="button" class="dev-preset-button" data-act="sub-close">Cancel</button>
      </div>`;
    const pathInput = subBar.querySelector('#devMediaPath');
    const error = subBar.querySelector('#devMediaError');
    pathInput.addEventListener('input', () => { error.textContent = ''; });
    subBar.querySelector('[data-act="save-media"]').addEventListener('click', saveMediaSub);
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
    pathInput.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      saveMediaSub();
    });
    pathInput.focus();
    pathInput.select();
  }

  function saveMediaSub() {
    const target = mediaTarget;
    if (!target) {
      closeSub();
      return;
    }
    const { project, key, index, item, field, current } = target;
    const pathInput = subBar.querySelector('#devMediaPath');
    const error = subBar.querySelector('#devMediaError');
    const next = pathInput.value.trim();
    if (!next) {
      if (error) error.textContent = 'Enter a path or URL.';
      return;
    }
    pushHistory();
    if (typeof item === 'string') {
      project[key + '-media'][index] = next;
    } else {
      item[field] = next;
      if (field === 'src' && item.href === current) item.href = next;
    }
    setDirty(true);
    closeSub();
    rerenderPreservingOpen();
  }

  function buildHelpSub() {
    subBar.innerHTML = `
      <div class="dev-sub-head">Dev help</div>
      <ul class="dev-sub-help">
        <li><strong>Edit:</strong> click a section title, text, list, card title, teaser or tag.</li>
        <li><strong>Media:</strong> click an image, link, embed or video to edit its path.</li>
        <li><strong>Presets:</strong> New Preset / Save Preset / Load Preset store snapshots in this browser only.</li>
        <li><strong>New card:</strong> + Card, choose Blank card or a template, enter ID, title and optional thumbnail.</li>
        <li><strong>Undo / Revert:</strong> step back or discard changes since the last save or load.</li>
        <li><strong>Reload guard:</strong> warns while the toolbar is open or changes are unsaved.</li>
        <li><strong>Leave dev:</strong> open <code>?dev=0</code>.</li>
      </ul>
      <div class="dev-sub-actions"><button type="button" class="dev-preset-button" data-act="sub-close">Close</button></div>`;
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
  }

  function openMediaSub(project, key, index, item, field, kind) {
    mediaTarget = { project, key, index, item, field, kind, current: field ? item[field] : item };
    openSub('media');
  }

  // ---------- toolbar ----------
  function buildToolbar() {
    toolbar = document.createElement('div');
    toolbar.id = 'devPresetBar';
    toolbar.setAttribute('aria-label', 'Dev toolbar');
    toolbar.innerHTML = '' +
      '<button type="button" class="dev-preset-button" data-act="new">New Preset</button>' +
      '<button type="button" class="dev-preset-button" data-act="save">Save Preset</button>' +
      '<button type="button" class="dev-preset-button" data-act="load">Load Preset</button>' +
      '<button type="button" class="dev-preset-button" data-act="new-card" title="New card" aria-label="New card">+ Card</button>' +
      '<button type="button" class="dev-preset-button" data-act="undo">Undo</button>' +
      '<button type="button" class="dev-preset-button" data-act="revert">Revert</button>' +
      '<button type="button" class="dev-preset-button" data-act="help" title="Dev help" aria-label="Dev help">?</button>' +
      '<div class="dev-preset-picker">' +
        '<input type="search" class="dev-preset-search" id="devPresetSearch" placeholder="Search presets" autocomplete="off" aria-label="Search presets">' +
        '<div class="dev-preset-list" id="devPresetList" hidden></div>' +
      '</div>';
    document.body.appendChild(toolbar);
    input = toolbar.querySelector('#devPresetSearch');
    list = toolbar.querySelector('#devPresetList');
    saveButton = toolbar.querySelector('[data-act="save"]');
    loadButton = toolbar.querySelector('[data-act="load"]');
    undoButton = toolbar.querySelector('[data-act="undo"]');
    revertButton = toolbar.querySelector('[data-act="revert"]');
    ensureSubBar();
    updateButtons();
    requestAnimationFrame(updateBarHeight);
    toolbar.addEventListener('click', event => {
      const act = event.target.getAttribute('data-act');
      if (act === 'new') newPreset();
      if (act === 'save') savePreset();
      if (act === 'load') loadPreset(state.selected);
      if (act === 'new-card') openSub('card');
      if (act === 'undo') undo();
      if (act === 'revert') revert();
      if (act === 'help') openSub('help');
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
    btn.title = 'Presets, inline editing and media paths (dev)';
    btn.setAttribute('aria-label', 'Presets, inline editing and media paths (dev)');
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
      updateBarHeight();
    } else {
      clearEditing();
      openList(false);
      closeSub();
    }
  }

  // ---------- init ----------
  function init() {
    buildToolbar();
    makeToggle();
    try { state.selected = localStorage.getItem(CURRENT); } catch (e) {}
    if (state.selected) {
      // Re-apply the last selected preset so a reload continues where the
      // previous dev session stopped. A missing preset is cleared.
      if (readPresets().some(p => p.name === state.selected)) {
        loadPreset(state.selected);
      } else {
        state.selected = null;
        try { localStorage.removeItem(CURRENT); } catch (e) {}
        renderList();
      }
    }
    updateButtons();
    setBaseline(projectsData);
    setDirty(false);
    window.addEventListener('resize', updateBarHeight);
    document.addEventListener('portfolio-rendered', () => {
      if (state.open) applyEditing();
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      if (state.sub) {
        closeSub();
        return;
      }
      if (list && !list.hidden) {
        openList(false);
        if (input) input.blur();
        return;
      }
      if (state.open) toggle(false);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();

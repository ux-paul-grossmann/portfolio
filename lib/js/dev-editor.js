// dev-editor.js – dev-only preset toolbar and inline editing.
// Active only while the URL carries ?dev=1 (checked in index.html); ?dev=0
// clears it too, and a load without the parameter leaves dev mode. Presets
// are JSON snapshots of projectsData in localStorage; loading one re-renders
// the cards. Inline edits write back to the in-memory data: section titles,
// section text and section lists.
(function () {
  'use strict';

  const DEV = localStorage.getItem('portfolio-dev') === '1';
  if (!DEV) return;

  // The dev UI is desktop-only. A phone gets no edit button, toolbar or
  // testing panel until the mobile workflow has been tested.
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const STORE = 'portfolio-presets';
  const CURRENT = 'portfolio-preset-current';
  const CTA_POS_KEY = 'portfolio-cta-panel-pos';
  const CTA_OPEN_KEY = 'portfolio-cta-panel-open';
  const BAND_VISIBLE_KEY = 'portfolio-rider-band-visible';
  const GROUP_STATE_KEY = 'portfolio-dev-group-state';
  const PROTO_SHELL_KEY = 'portfolio-proto-shell';
  const PROTO_SCREEN_KEY = 'portfolio-proto-screen';
  let protoShell = 'slab';
  let protoScreen = 'se';
  try {
    protoShell = localStorage.getItem(PROTO_SHELL_KEY) || 'slab';
    protoScreen = localStorage.getItem(PROTO_SCREEN_KEY) || 'se';
  } catch (e) {}
  let riderBandVisible = true;
  try { riderBandVisible = localStorage.getItem(BAND_VISIBLE_KEY) !== '0'; } catch (e) {}
  const GLASS_DEPTHS = [0.5, 1, 1.5, 2, 3, 4, 5];
  const GLASS_SPECTRA = [0, 0.3, 0.6, 1.2, 2, 3];
  const GLASS_TINTS = [0, 7, 15, 25, 40, 60, 80];
  const GLASS_BLURS = [0, 0.5, 1, 2, 4, 8];
  const INTRO_DELAY_KEY = 'portfolio-intro-delay';
  const INTRO_DELAYS = [1200, 1600, 2000, 2400];
  const INTRO_STEP_KEY = 'portfolio-intro-stagger';
  const INTRO_STEPS = [40, 90, 140, 200];
  const SHADOW_KEY = 'portfolio-shadow-variant';
  const SHADOW_VARIANTS = [
    { id: 'none', label: 'None' },
    { id: 'soft', label: 'Soft' },
    { id: 'medium', label: 'Medium' },
    { id: 'lifted', label: 'Lifted' },
    { id: 'ring', label: 'Ring' }
  ];
  const TYPE_KEY = 'portfolio-type-scale';
  const TYPE_SCALES = [
    { id: 'current', label: 'Current' },
    { id: 'proposed', label: 'Proposed' }
  ];
  const CONTACT_KEY = 'portfolio-contact-variant';
  const CONTACT_VARIANTS = [
    { id: 'label-address', label: 'Label + Adresse', mailLabel: 'E-Mail schreiben', showAddress: true, showCopy: true },
    { id: 'schreib-mir', label: 'Schreib mir', mailLabel: 'Schreib mir', showAddress: false, showCopy: true },
    { id: 'mail-only', label: 'E-Mail schreiben', mailLabel: 'E-Mail schreiben', showAddress: false, showCopy: true },
    { id: 'address-only', label: 'Nur Adresse', mailLabel: 'pashka3k@gmail.com', showAddress: false, showCopy: true },
    { id: 'ohne-kopieren', label: 'Ohne Kopieren', mailLabel: 'E-Mail schreiben', showAddress: true, showCopy: false }
  ];
  const GAME_DELAY_KEY = 'portfolio-game-delay';
  const GAME_DELAYS = [0, 40, 80, 120, 160, 200];
  const GAME_DURATION_KEY = 'portfolio-game-duration';
  const GAME_DURATIONS = [0, 160, 240, 320, 400, 480, 600];
  const state = { open: false, selected: null, filter: '', dirty: false, sub: null };
  const CROSS_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2 2l8 8M10 2l-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
  const PLUS_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
  const DRAG_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="9" cy="6" r="1.6" fill="currentColor" stroke="none"></circle><circle cx="15" cy="6" r="1.6" fill="currentColor" stroke="none"></circle><circle cx="9" cy="12" r="1.6" fill="currentColor" stroke="none"></circle><circle cx="15" cy="12" r="1.6" fill="currentColor" stroke="none"></circle><circle cx="9" cy="18" r="1.6" fill="currentColor" stroke="none"></circle><circle cx="15" cy="18" r="1.6" fill="currentColor" stroke="none"></circle></svg>';
  const BLOCKS_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 17l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  const EDIT_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  const MOVE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M12 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  const LIST_UL_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="5" cy="6" r="1.6" fill="currentColor" stroke="none"></circle><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"></circle><circle cx="5" cy="18" r="1.6" fill="currentColor" stroke="none"></circle><path d="M10 6h12M10 12h12M10 18h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
  const LIST_OL_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 6h3M5 12h3M5 18h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M11 6h11M11 12h11M11 18h11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
  const ARROW_TO_LINE_DOWN = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M6 11l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
  const ARROW_TO_LINE_UP = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20V9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M6 13l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 4h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
  const ARROW_UP = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20V6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M6 12l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  const ARROW_DOWN = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4v14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M6 12l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  const PRESET_ADJECTIVES = ['Quiet', 'Amber', 'Gentle', 'Silver', 'Golden', 'Little', 'Distant', 'Velvet', 'Bright', 'Slow', 'Hidden', 'Warm', 'Open', 'Soft', 'Calm', 'Brave'];
  const PRESET_NOUNS = ['Meadow', 'Harbor', 'Field', 'Orbit', 'Ember', 'Pine', 'River', 'Cloud', 'Stone', 'Garden', 'Window', 'Lantern', 'Drift', 'Shore', 'Fern', 'Comet'];
  let toolbar = null;
  let input = null;
  let list = null;
  let subBar = null;
  let actionBar = null;
  let subBarHandle = null;
  let cardTemplate = '__blank__';
  let mediaTarget = null;
  let sectionTarget = null;
  let blockTarget = null;
  let confirmAction = null;
  let previewObserver = null;
  let mediaObservers = [];
  let mediaUndoItems = [];
  let presetPreview = null;
  let textToolbar = null;
  let activeText = null;
  let savedRange = null;
  let dragState = null;
  let dragScrollDir = 0;
  let dragRaf = 0;
  let history = [];
  let redoStack = [];
  let baseline = null;
  let autoSessionActive = false;
  let autoSessionName = null;
  let autoSessionOriginal = null;
  let presetAutosaveTimer = null;

  function setDirty(value) {
    state.dirty = !!value;
    if (state.dirty) schedulePresetAutosave();
    const btn = document.getElementById('devPresetToggle');
    if (!btn) return;
    btn.classList.toggle('is-dirty', state.dirty);
    btn.title = state.dirty
      ? 'Changes since the last save or version — presets, inline editing and media paths (dev)'
      : 'Presets, inline editing and media paths (dev)';
    updateButtons();
  }

  // Everything is autosaved; leaving is safe, so there is no native leave
  // prompt. Destructive in-app actions use the inline confirmations.
  window.addEventListener('beforeunload', () => {
    if (autoSessionActive) flushPresetAutosave();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flushPresetAutosave();
  });

  // ---------- data ----------
  function readPresets() {
    try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch (e) { return []; }
  }
  function writePresets(presets) {
    try { localStorage.setItem(STORE, JSON.stringify(presets)); } catch (e) {}
  }
  function writePresetEntry(name, data) {
    const presets = readPresets();
    const entry = { name: name, savedAt: new Date().toISOString(), data: JSON.parse(JSON.stringify(data)) };
    const index = presets.findIndex(p => p.name === name);
    if (index >= 0) presets[index] = entry; else presets.push(entry);
    writePresets(presets);
  }
  function nextPresetName() {
    const names = new Set(readPresets().map(p => p.name));
    for (let i = 0; i < 64; i += 1) {
      const name = PRESET_ADJECTIVES[Math.floor(Math.random() * PRESET_ADJECTIVES.length)] + ' ' + PRESET_NOUNS[Math.floor(Math.random() * PRESET_NOUNS.length)];
      if (!names.has(name)) return name;
    }
    let counter = 2;
    while (names.has('Untitled ' + counter)) counter += 1;
    return 'Untitled ' + counter;
  }
  function ensureAutoPreset() {
    if (autoSessionActive || !state.open) return;
    const name = nextPresetName();
    autoSessionOriginal = snapshot();
    writePresetEntry(name, autoSessionOriginal);
    autoSessionActive = true;
    autoSessionName = name;
    setSelected(name);
    updateButtons();
  }
  function schedulePresetAutosave() {
    if (!autoSessionActive || !autoSessionName) return;
    if (presetAutosaveTimer) clearTimeout(presetAutosaveTimer);
    presetAutosaveTimer = setTimeout(() => {
      presetAutosaveTimer = null;
      flushPresetAutosave();
    }, 400);
  }
  function flushPresetAutosave() {
    if (presetAutosaveTimer) {
      clearTimeout(presetAutosaveTimer);
      presetAutosaveTimer = null;
    }
    if (!autoSessionActive || !autoSessionName) return;
    writePresetEntry(autoSessionName, snapshot());
  }
  function resetAutoSession(flush) {
    if (flush) flushPresetAutosave();
    if (presetAutosaveTimer) {
      clearTimeout(presetAutosaveTimer);
      presetAutosaveTimer = null;
    }
    autoSessionActive = false;
    autoSessionName = null;
    autoSessionOriginal = null;
    updateButtons();
  }
  function snapshot() {
    return JSON.parse(JSON.stringify(projectsData));
  }
  function applyData(data) {
    if (!Array.isArray(data)) return;
    dismissAllMediaUndo();
    projectsData.length = 0;
    data.forEach(project => projectsData.push(project));
  }
  function render() {
    document.dispatchEvent(new CustomEvent('portfolio-rerender'));
  }

  function pushHistory() {
    if (state.open) ensureAutoPreset();
    const snap = snapshot();
    if (history.length && JSON.stringify(history[history.length - 1]) === JSON.stringify(snap)) return;
    history.push(snap);
    if (history.length > 50) history.shift();
    redoStack = [];
    updateButtons();
  }

  function setBaseline(data) {
    baseline = JSON.parse(JSON.stringify(data));
    history = [];
    redoStack = [];
    updateButtons();
  }

  function undo() {
    if (!history.length) return;
    closeSub();
    redoStack.push(snapshot());
    if (redoStack.length > 50) redoStack.shift();
    applyData(history.pop());
    const changed = baseline ? JSON.stringify(projectsData) !== JSON.stringify(baseline) : true;
    setDirty(changed);
    schedulePresetAutosave();
    rerenderPreservingOpen();
  }

  function redo() {
    if (!redoStack.length) return;
    closeSub();
    history.push(snapshot());
    if (history.length > 50) history.shift();
    applyData(redoStack.pop());
    const changed = baseline ? JSON.stringify(projectsData) !== JSON.stringify(baseline) : true;
    setDirty(changed);
    schedulePresetAutosave();
    rerenderPreservingOpen();
  }

  function revert(force) {
    if (!state.dirty || !baseline) return;
    if (!force) {
      confirmSub('Discard all changes since the last save or load?', 'Discard', () => revert(true));
      return;
    }
    closeSub();
    applyData(JSON.parse(JSON.stringify(baseline)));
    history = [];
    redoStack = [];
    setDirty(false);
    schedulePresetAutosave();
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
    if (Array.isArray(project.content) && el.hasAttribute('data-node')) {
      const index = Number(el.getAttribute('data-node'));
      const node = project.content[index];
      if (!node) return;
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        node.items = Array.from(el.children).filter(child => child.tagName === 'LI').map(child => child.innerHTML);
      } else {
        node.html = el.innerHTML;
      }
      setDirty(true);
      return;
    }
    if (el.tagName === 'H3') {
      const title = el.textContent.trim();
      // An emptied title removes the custom key, so the section falls back
      // to its default label instead of keeping an empty box.
      if (!title) delete project[key + '-title'];
      else project[key + '-title'] = title;
    } else if (el.closest('[data-block-index]') || el.hasAttribute('data-block-index')) {
      const blocks = sectionBlocks(project, key);
      if (!blocks) return;
      const holder = el.hasAttribute('data-block-index') ? el : el.closest('[data-block-index]');
      const index = Number(holder.getAttribute('data-block-index'));
      const block = blocks[index];
      if (!block) return;
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        block.items = Array.from(el.children).filter(child => child.tagName === 'LI').map(child => child.innerHTML);
      } else {
        block.html = el.innerHTML;
      }
      setDirty(true);
    } else if (el.tagName === 'UL' || el.tagName === 'OL') {
      project[key + '-list'] = Array.from(el.children)
        .filter(child => child.tagName === 'LI')
        .map(child => child.innerHTML);
    } else {
      normalizeListParents(el);
      project[key + '-text'] = el.innerHTML;
    }
    setDirty(true);
  }

  // ---------- ordered block sections ----------
  // A section can switch from the three fixed slots (text / list / media) to
  // one ordered list, `<key>-blocks`. The switch happens on the first structural
  // edit and keeps the rendered result identical; sections that never switch
  // keep rendering from the old keys, so old presets stay valid.
  function sectionBlocks(project, key) {
    const blocks = project[key + '-blocks'];
    if (!Array.isArray(blocks)) return null;
    // An empty list is not a block model; drop it so the section falls back to
    // the legacy keys instead of rendering nothing.
    if (!blocks.length) {
      delete project[key + '-blocks'];
      return null;
    }
    return blocks;
  }

  function migrateToBlocks(project, key) {
    const order = blockOrderFor(project, key);
    const blocks = [];
    order.forEach(type => {
      if (type === 'text') {
        if (project[key + '-text']) blocks.push({ t: 'text', html: project[key + '-text'] });
        return;
      }
      if (type === 'list') {
        const items = project[key + '-list'];
        if (Array.isArray(items) && items.length) blocks.push({ t: 'list', items: items.slice(), ol: project[key + '-list-type'] === 'ol' });
        return;
      }
      if (type === 'media') {
        (project[key + '-media'] || []).forEach(item => blocks.push({ t: 'media', v: item }));
      }
    });
    ['text', 'list', 'list-type', 'media', 'order'].forEach(suffix => {
      delete project[key + '-' + suffix];
    });
    project[key + '-blocks'] = blocks;
    return blocks;
  }

  function ensureBlocks(project, key) {
    return sectionBlocks(project, key) || migrateToBlocks(project, key);
  }

  function insertBlockAt(project, key, at, block) {
    pushHistory();
    const blocks = ensureBlocks(project, key);
    blocks.splice(Math.max(0, Math.min(at, blocks.length)), 0, block);
    setDirty(true);
    rerenderPreservingOpen();
  }

  function blockGapMenu(project, key, at, button) {
    const menu = document.createElement('div');
    menu.className = 'dev-insert-menu';
    menu.hidden = true;
    const add = (label, action) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'dev-insert-choice';
      item.textContent = label;
      item.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        menu.hidden = true;
        if (button) button.setAttribute('aria-expanded', 'false');
        action();
      });
      menu.appendChild(item);
    };
    add('Text', () => insertBlockAt(project, key, at, { t: 'text', html: '<p><br></p>' }));
    add('Image', () => pickBlockImage(project, key, at));
    add('Icon', () => {
      menu.hidden = false;
      if (grid.hidden) {
        grid.hidden = false;
        const first = grid.querySelector('button');
        if (first) first.focus();
      }
    });
    const grid = document.createElement('div');
    grid.className = 'dev-icon-grid';
    grid.hidden = true;
    const icons = window.portfolioIconMap || {};
    Object.keys(icons).forEach(iconKey => {
      const choice = document.createElement('button');
      choice.type = 'button';
      choice.className = 'dev-icon-choice';
      choice.dataset.icon = iconKey;
      choice.title = icons[iconKey].title || iconKey;
      const img = document.createElement('img');
      img.src = icons[iconKey].src;
      img.alt = '';
      choice.appendChild(img);
      choice.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        menu.hidden = true;
        insertBlockAt(project, key, at, { t: 'media', v: { icon: iconKey } });
      });
      grid.appendChild(choice);
    });
    menu.appendChild(grid);
    return menu;
  }

  function pickBlockImage(project, key, at) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.hidden = true;
    document.body.appendChild(input);
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      input.remove();
      if (!file) return;
      uploadMediaFile(file, (path, message) => {
        if (!path) {
          showMediaUndo({ top: 8, left: 8 }, () => false, message || 'Image upload failed.');
          return;
        }
        insertBlockAt(project, key, at, { t: 'media', v: { src: path, alt: '' } });
      });
    });
    input.click();
  }

  function addBlockSectionControls(section, project, key) {
    const body = section.querySelector(':scope > .project-detail-body');
    section.querySelectorAll(':scope > .dev-block-section').forEach(el => el.remove());
    if (!body) return;
    const blocks = sectionBlocks(project, key);
    if (!blocks) return;
    const gap = index => {
      const row = document.createElement('div');
      row.className = 'dev-insert-point';
      const inner = document.createElement('div');
      inner.className = 'dev-insert-inner';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'dev-insert-point-button';
      button.innerHTML = PLUS_SVG;
      button.title = 'Insert here';
      button.setAttribute('aria-label', 'Insert here');
      button.setAttribute('aria-expanded', 'false');
      const menu = blockGapMenu(project, key, index, button);
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const open = menu.hidden;
        closeInsertMenus(menu);
        menu.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        if (open) {
          const first = menu.querySelector('.dev-insert-choice');
          if (first) first.focus();
        }
      });
      inner.appendChild(button);
      row.appendChild(inner);
      row.appendChild(menu);
      return row;
    };
    const nodes = [...body.children].filter(el => el.hasAttribute && el.hasAttribute('data-block-index'));
    nodes.forEach((node, orderIndex) => {
      const index = Number(node.getAttribute('data-block-index'));
      body.insertBefore(gap(orderIndex), node);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'dev-frag-button dev-frag-remove';
      remove.innerHTML = CROSS_SVG;
      remove.title = 'Remove this block (Undo available)';
      remove.setAttribute('aria-label', 'Remove this block (Undo available)');
      remove.style.position = 'absolute';
      remove.style.right = '0';
      remove.style.top = Math.max(0, node.offsetTop + 4) + 'px';
      remove.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const list = sectionBlocks(project, key);
        if (!list) return;
        pushHistory();
        const removed = list.splice(index, 1)[0];
        setDirty(true);
        rerenderPreservingOpen();
        showMediaUndo({ top: 8, left: 8 }, () => {
          const now = sectionBlocks(project, key);
          if (!now) return false;
          now.splice(Math.min(index, now.length), 0, removed);
          setDirty(true);
          rerenderPreservingOpen();
          return true;
        }, 'Block removed');
      });
      section.appendChild(remove);
    });
    body.appendChild(gap(nodes.length));
  }

  // ---------- content-card editor ----------
  // Selection, not decoration: clicking a block outlines it and opens ONE
  // inspector in the control card. No control ever sits in the content column,
  // so nothing can overlap the text.
  let nodeTarget = null;

  function bindContentSelection(section, project) {
    const body = section.querySelector(':scope > .project-detail-body');
    if (!body) return;
    body.querySelectorAll('[data-node], [data-block-index]').forEach(el => {
      if (el.dataset.selectBound === '1') return;
      el.dataset.selectBound = '1';
      el.addEventListener('pointerdown', event => {
        if (!state.open) return;
        const raw = el.getAttribute('data-node') != null ? el.getAttribute('data-node') : el.getAttribute('data-block-index');
        const index = Number(raw);
        if (Number.isNaN(index)) return;
        if (event.target === el || el.contains(event.target)) selectContentNode(project, index, el);
      }, true);
      el.addEventListener('focusin', () => {
        const raw = el.getAttribute('data-node') != null ? el.getAttribute('data-node') : el.getAttribute('data-block-index');
        const index = Number(raw);
        if (!Number.isNaN(index)) selectContentNode(project, index, el, true);
      });
    });
  }

  function selectContentNode(project, index, el, keepFocus) {
    document.querySelectorAll('#projekte .is-node-selected').forEach(node => node.classList.remove('is-node-selected'));
    if (el) el.classList.add('is-node-selected');
    nodeTarget = { project, index, el };
    openSub('node');
    if (!keepFocus && el) el.classList.remove('is-node-selected') || el.classList.add('is-node-selected');
  }

  function buildNodeSub() {
    const target = nodeTarget;
    if (!target || !Array.isArray(target.project.content)) {
      closeSub();
      return;
    }
    const { project } = target;
    const index = target.index;
    const node = project.content[index];
    if (!node) {
      closeSub();
      return;
    }
    const label = node.type === 'media'
      ? 'Media' + (node.value && node.value.icon ? ' · icon' : node.value && node.value.src ? ' · image' : '')
      : node.type.charAt(0).toUpperCase() + node.type.slice(1);
    const insertOptions = [
      { id: 'text', label: 'Text' },
      { id: 'heading', label: 'Heading' },
      { id: 'list', label: 'List' },
      { id: 'image', label: 'Image' },
      { id: 'icon', label: 'Icon' }
    ];
    subBar.innerHTML = `
      <div class="dev-sub-head">Block ${index + 1} — <strong>${label}</strong></div>
      <div class="dev-sub-row">
        <label class="dev-sub-label">Insert above
          <select class="dev-sub-input" id="devNodeInsert">${insertOptions.map(option => `<option value="${option.id}">${option.label}</option>`).join('')}</select>
        </label>
        <button type="button" class="dev-preset-button" data-act="node-insert">Insert</button>
      </div>
      <div class="dev-sub-row">
        <button type="button" class="dev-preset-button" data-act="node-up">Move up</button>
        <button type="button" class="dev-preset-button" data-act="node-down">Move down</button>
        <button type="button" class="dev-preset-button" data-act="node-duplicate">Duplicate</button>
      </div>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button dev-danger" data-act="node-delete">Delete block</button>
        <button type="button" class="dev-preset-button" data-act="sub-close">Close</button>
      </div>`;
    const select = subBar.querySelector('#devNodeInsert');
    subBar.querySelector('[data-act="node-insert"]').addEventListener('click', () => {
      insertNodeByKind(project, index, select.value);
    });
    subBar.querySelector('[data-act="node-up"]').addEventListener('click', () => moveContentNode(project, index, -1));
    subBar.querySelector('[data-act="node-down"]').addEventListener('click', () => moveContentNode(project, index, 1));
    subBar.querySelector('[data-act="node-duplicate"]').addEventListener('click', () => {
      pushHistory();
      project.content.splice(index + 1, 0, JSON.parse(JSON.stringify(node)));
      setDirty(true);
      rerenderPreservingOpen();
    });
    subBar.querySelector('[data-act="node-delete"]').addEventListener('click', () => removeContentNode(project, index));
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
  }

  function insertNodeByKind(project, index, kind) {
    if (kind === 'image') {
      pickBlockImage(project, index);
      return;
    }
    if (kind === 'icon') {
      openIconPicker(project, index);
      return;
    }
    const node = kind === 'text' ? { type: 'text', html: '<p><br></p>' }
      : kind === 'heading' ? { type: 'heading', level: 3, html: 'Heading' }
        : { type: 'list', items: ['Item'], ordered: false };
    pushHistory();
    project.content.splice(Math.max(0, Math.min(index, project.content.length)), 0, node);
    setDirty(true);
    rerenderPreservingOpen();
  }

  function openIconPicker(project, index) {
    const grid = document.createElement('div');
    grid.className = 'dev-insert-menu';
    grid.style.position = 'fixed';
    grid.style.left = '50%';
    grid.style.top = '20%';
    grid.style.transform = 'translateX(-50%)';
    const icons = window.portfolioIconMap || {};
    Object.keys(icons).forEach(iconKey => {
      const choice = document.createElement('button');
      choice.type = 'button';
      choice.className = 'dev-icon-choice';
      choice.title = icons[iconKey].title || iconKey;
      const img = document.createElement('img');
      img.src = icons[iconKey].src;
      img.alt = '';
      choice.appendChild(img);
      choice.addEventListener('click', () => {
        grid.remove();
        pushHistory();
        project.content.splice(Math.max(0, Math.min(index, project.content.length)), 0, { type: 'media', value: { icon: iconKey } });
        setDirty(true);
        rerenderPreservingOpen();
      });
      grid.appendChild(choice);
    });
    document.body.appendChild(grid);
  }

  function pickBlockImage(project, index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.hidden = true;
    document.body.appendChild(input);
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      input.remove();
      if (!file) return;
      uploadMediaFile(file, (path, message) => {
        if (!path) {
          showMediaUndo({ top: 8, left: 8 }, () => false, message || 'Image upload failed.');
          return;
        }
        pushHistory();
        project.content.splice(Math.max(0, Math.min(index, project.content.length)), 0, { type: 'media', value: { src: path, alt: '' } });
        setDirty(true);
        rerenderPreservingOpen();
      });
    });
    input.click();
  }

  function moveContentNode(project, index, delta) {
    const nodes = project.content;
    if (!Array.isArray(nodes)) return;
    const to = index + delta;
    if (to < 0 || to >= nodes.length) return;
    pushHistory();
    const moved = nodes.splice(index, 1)[0];
    nodes.splice(to, 0, moved);
    setDirty(true);
    rerenderPreservingOpen();
  }

  function removeContentNode(project, index) {
    const nodes = project.content;
    if (!Array.isArray(nodes)) return;
    const removed = nodes[index];
    if (!removed) return;
    pushHistory();
    nodes.splice(index, 1);
    setDirty(true);
    rerenderPreservingOpen();
    showMediaUndo({ top: 8, left: 8 }, () => {
      nodes.splice(Math.min(index, nodes.length), 0, removed);
      setDirty(true);
      rerenderPreservingOpen();
      return true;
    }, 'Block removed');
  }

  function markEditable(el) {
    if (!el) return;
    if (!el.isContentEditable) el.setAttribute('contenteditable', 'true');
    if (el.dataset.editBound === '1') return;
    el.dataset.editBound = '1';
    el.addEventListener('input', onEdit);
    el.addEventListener('blur', () => {
      delete el.dataset.historyPushed;
      const isText = el.classList.contains('project-detail-text');
      const isList = el.tagName === 'UL' || el.tagName === 'OL';
      if (!isText && !isList) return;
      const section = el.closest('.project-detail');
      const key = section && section.dataset.section;
      const project = section ? projectOfSection(section) : null;
      if (!key || !project) return;
      // An emptied block removes itself, so an empty box can never be left
      // behind. The toast keeps the removal reversible.
      setTimeout(() => {
        if (!document.contains(el)) return;
        if (el.contains(document.activeElement)) return;
        if (el.textContent.trim() || el.querySelector('img, a')) return;
        removeBlock(project, key, isList ? 'list' : 'text');
      }, 80);
    });
  }

  function applyEditing() {
    if (!state.open) return;
    document.querySelectorAll('#projekte .project-detail').forEach(section => {
      markEditable(section.querySelector(':scope > h3'));
      markEditable(section.querySelector(':scope > .project-detail-body > .project-detail-text'));
      section.querySelectorAll(':scope > .project-detail-body > ul, :scope > .project-detail-body > ol').forEach(markEditable);
      const project = projectOfSection(section);
      const key = section.dataset.section;
      if (project && Array.isArray(project.content)) {
        section.querySelectorAll(':scope > .project-detail-body [data-node]').forEach(node => {
          if (/^H[1-6]$/.test(node.tagName) || node.classList.contains('project-detail-text')) markEditable(node);
        });
        section.querySelectorAll(':scope > .project-detail-body ul[data-node], :scope > .project-detail-body ol[data-node]').forEach(markEditable);
        bindContentSelection(section, project);
      } else if (project && key) {
        if (sectionBlocks(project, key)) {
          addBlockSectionControls(section, project, key);
        } else {
          addInsertPoints(section, project, key);
          addBlockRemovals(section, project, key);
          addTextFragmentControls(section, project, key);
        }
      }
    });
    document.querySelectorAll('#projekte .multi-collapse article > h2, #projekte .multi-collapse article > h3').forEach(heading => {
      const collapse = heading.closest('.multi-collapse');
      const project = collapse ? projectsData.find(entry => entry.id === collapse.id.replace('thumbCollapse-', '')) : null;
      if (project) markCardTitleHeading(heading, project);
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
    document.querySelectorAll('#projekte .project-detail-text a.glightbox').forEach(anchor => markRawImageEditable(anchor));
    addSectionHandles();
    addMediaControls();
    addSectionControls();
    applyContactEditing();
  }

  // ---------- contact block ----------
  // The footer copy is not part of projectsData, so it is edited in place and
  // kept in its own local key. Presets do not carry it.
  const CONTACT_COPY_KEY = 'portfolio-contact-copy';

  function readContactCopy() {
    try { return JSON.parse(localStorage.getItem(CONTACT_COPY_KEY) || '{}') || {}; } catch (error) { return {}; }
  }

  function saveContactCopy(patch) {
    const next = Object.assign(readContactCopy(), patch);
    try { localStorage.setItem(CONTACT_COPY_KEY, JSON.stringify(next)); } catch (error) {}
  }

  function applyContactCopy() {
    const copy = readContactCopy();
    const caption = document.getElementById('kontaktCaption');
    const label = document.querySelector('.contact-mail-label');
    const address = document.querySelector('.contact-mail-address');
    if (caption && copy.caption) caption.textContent = copy.caption;
    if (label && copy.label) label.textContent = copy.label;
    if (address && copy.address) address.textContent = copy.address;
  }

  function applyContactEditing() {
    const fields = [
      [document.getElementById('kontaktCaption'), 'caption'],
      [document.querySelector('.contact-mail-label'), 'label'],
      [document.querySelector('.contact-mail-address'), 'address']
    ];
    const mail = document.getElementById('contactMail');
    if (mail && mail.dataset.editGuard !== '1') {
      mail.dataset.editGuard = '1';
      mail.addEventListener('click', event => {
        if (event.target.closest('[contenteditable="true"]')) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      }, true);
    }
    fields.forEach(([el, key]) => {
      if (!el) return;
      if (!el.isContentEditable) el.setAttribute('contenteditable', 'true');
      if (el.dataset.contactBound === '1') return;
      el.dataset.contactBound = '1';
      el.addEventListener('input', () => {
        const patch = {};
        patch[key] = el.textContent.replace(/\s+/g, ' ').trim();
        saveContactCopy(patch);
      });
    });
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

  function sectionsOf(collapse) {
    return Array.from(collapse.querySelectorAll('.project-detail[data-section]'));
  }

  function projectOfSection(section) {
    const collapse = section.closest('.multi-collapse');
    if (!collapse) return null;
    return projectsData.find(project => project.id === collapse.id.replace('thumbCollapse-', '')) || null;
  }

  function addSectionHandles() {
    document.querySelectorAll('#projekte .project-detail[data-section]').forEach(section => {
      const project = projectOfSection(section);
      const key = section.dataset.section;
      if (!project || !key) return;
      const title = ((section.querySelector(':scope > h3') || {}).textContent || key || '').trim();
      const old = section.querySelector(':scope > .dev-section-tools');
      if (old) old.remove();
      const tools = document.createElement('div');
      tools.className = 'dev-section-tools';

      const handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'dev-reorder-handle';
      handle.innerHTML = DRAG_SVG;
      handle.title = 'Drag section';
      handle.setAttribute('aria-label', 'Drag section ' + title);
      handle.addEventListener('pointerdown', startSectionDrag);
      tools.appendChild(handle);

      if (presentBlocks(project, key).length >= 2) {
        const blocks = document.createElement('button');
        blocks.type = 'button';
        blocks.className = 'dev-section-blocks';
        blocks.innerHTML = BLOCKS_SVG;
        blocks.title = 'Block order';
        blocks.setAttribute('aria-label', 'Block order for ' + title);
        blocks.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          openBlockSub(project, key, title);
        });
        tools.appendChild(blocks);
      }

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'dev-section-remove';
      remove.innerHTML = CROSS_SVG;
      remove.title = 'Remove section (Undo available)';
      remove.setAttribute('aria-label', 'Remove section ' + title);
      remove.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        removeSection(section, project, key);
      });
      tools.appendChild(remove);

      section.appendChild(tools);
    });
  }

  function removeSection(section, project, key) {
    const order = project['section-order'];
    if (!Array.isArray(order)) return;
    const at = order.indexOf(key);
    if (at === -1) return;
    const rect = section.getBoundingClientRect();
    const fields = {};
    ['title', 'text', 'media', 'list', 'list-type', 'class'].forEach(suffix => {
      const field = key + '-' + suffix;
      if (Object.prototype.hasOwnProperty.call(project, field)) fields[field] = project[field];
    });
    pushHistory();
    order.splice(at, 1);
    Object.keys(fields).forEach(field => { delete project[field]; });
    setDirty(true);
    showMediaUndo({ top: rect.top, left: rect.left, right: rect.right, height: rect.height }, () => {
      const target = projectsData.find(p => p.id === project.id);
      if (!target || !Array.isArray(target['section-order'])) return false;
      if (target['section-order'].indexOf(key) !== -1) return false;
      target['section-order'].splice(Math.min(at, target['section-order'].length), 0, key);
      Object.keys(fields).forEach(field => { target[field] = fields[field]; });
      setDirty(true);
      rerenderPreservingOpen();
      return true;
    }, 'Section removed');
    rerenderPreservingOpen();
  }

  // ---------- block order ----------
  const DEFAULT_BLOCK_ORDER = ['text', 'list', 'media'];
  function presentBlocks(project, key) {
    const present = [];
    if (project[key + '-text']) present.push('text');
    if (Array.isArray(project[key + '-list']) && project[key + '-list'].length) present.push('list');
    if (Array.isArray(project[key + '-media']) && project[key + '-media'].length) present.push('media');
    return present;
  }
  function blockOrderFor(project, key) {
    const present = presentBlocks(project, key);
    const stored = project[key + '-order'];
    const order = [];
    if (Array.isArray(stored)) {
      stored.forEach(type => {
        if (present.indexOf(type) !== -1 && order.indexOf(type) === -1) order.push(type);
      });
    }
    present.forEach(type => {
      if (order.indexOf(type) === -1) order.push(type);
    });
    return order;
  }
  function storeBlockOrder(project, key, order) {
    const present = presentBlocks(project, key);
    const natural = DEFAULT_BLOCK_ORDER.filter(type => present.indexOf(type) !== -1);
    if (order.join(',') === natural.join(',')) delete project[key + '-order'];
    else project[key + '-order'] = order.slice();
  }

  // Block order used to go through a full re-render, which reloaded every
  // image in the card. The blocks are direct children of the section body, so
  // the change can be applied by re-appending the existing nodes in order.
  function reorderSectionBlocks(project, key) {
    const section = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
    if (!section) return false;
    const body = section.querySelector(':scope > .project-detail-body');
    if (!body) return false;
    const ordered = [];
    blockOrderFor(project, key).forEach(type => {
      if (type === 'text') {
        const el = body.querySelector(':scope > .project-detail-text');
        if (el) ordered.push(el);
      } else if (type === 'list') {
        const el = body.querySelector(':scope > ul, :scope > ol');
        if (el) ordered.push(el);
      } else if (type === 'media') {
        const tray = body.querySelector(':scope > .dev-tray');
        if (tray) ordered.push(tray);
        else body.querySelectorAll(':scope > [data-media-key]').forEach(el => ordered.push(el));
      }
    });
    if (!ordered.length) return false;
    ordered.forEach(node => body.appendChild(node));
    // Insertion points are rebuilt by applyEditing; moving them here would
    // need the gap indexes, so drop them and let the next edit pass recreate
    // them at the new positions.
    body.querySelectorAll(':scope > .dev-insert-point').forEach(el => el.remove());
    positionMediaOverlay(section);
    if (window.glightbox && window.glightbox.reload) window.glightbox.reload();
    return true;
  }
  function openBlockSub(project, key, title) {
    blockTarget = { project, key, title };
    openSub('blocks');
  }
  function blockLabel(project, key, type) {
    if (type === 'list') return 'List (' + project[key + '-list'].length + ')';
    if (type === 'media') return 'Media (' + project[key + '-media'].length + ')';
    return 'Text';
  }
  function buildBlocksSub() {
    const target = blockTarget;
    if (!target) {
      closeSub();
      return;
    }
    const project = target.project;
    const key = target.key;
    const order = blockOrderFor(project, key);
    const rows = order.map((type, index) => `
      <div class="dev-block-row">
        <span class="dev-block-name">${blockLabel(project, key, type)}</span>
        <button type="button" class="dev-preset-button" data-act="block-up" data-block="${type}"${index === 0 ? ' disabled' : ''}>Up</button>
        <button type="button" class="dev-preset-button" data-act="block-down" data-block="${type}"${index === order.length - 1 ? ' disabled' : ''}>Down</button>
      </div>`).join('');
    subBar.innerHTML = `
      <div class="dev-sub-head">Block order — <strong>${esc(target.title || key)}</strong></div>
      <div class="dev-block-list">${rows}</div>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button" data-act="sub-close">Close</button>
      </div>`;
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
    subBar.querySelectorAll('[data-act="block-up"]').forEach(button => button.addEventListener('click', () => moveBlock(button.dataset.block, -1)));
    subBar.querySelectorAll('[data-act="block-down"]').forEach(button => button.addEventListener('click', () => moveBlock(button.dataset.block, 1)));
  }
  function moveBlock(type, delta) {
    const target = blockTarget;
    if (!target) return;
    const project = target.project;
    const key = target.key;
    const order = blockOrderFor(project, key);
    const at = order.indexOf(type);
    const next = at + delta;
    if (at < 0 || next < 0 || next >= order.length) return;
    pushHistory();
    const moved = order.slice();
    moved[at] = order[next];
    moved[next] = order[at];
    storeBlockOrder(project, key, moved);
    setDirty(true);
    if (!reorderSectionBlocks(project, key)) rerenderPreservingOpen();
    openSub('blocks');
  }

  function removeRawImage(project, key, href, position) {
    const text = project[key + '-text'];
    if (typeof text !== 'string' || !href) return false;
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp('<a\\b[^>]*href="' + escaped + '"[^>]*>[\\s\\S]*?</a>(?:\\s*<div class="glightbox-desc[^"]*">[\\s\\S]*?</div>)?', 'i');
    const next = text.replace(pattern, '');
    if (next === text) return false;
    pushHistory();
    project[key + '-text'] = next;
    setDirty(true);
    showMediaUndo(position, () => {
      if (project[key + '-text'] !== next) return false;
      project[key + '-text'] = text;
      setDirty(true);
      rerenderPreservingOpen();
      return true;
    });
    rerenderPreservingOpen();
    return true;
  }

  function dismissMediaUndo(item) {
    if (!item) return;
    if (item.interval) clearInterval(item.interval);
    if (item.element) item.element.remove();
    mediaUndoItems = mediaUndoItems.filter(entry => entry !== item);
  }

  function dismissAllMediaUndo() {
    mediaUndoItems.slice().forEach(dismissMediaUndo);
  }

  function showMediaUndo(position, restore, label) {
    const toast = document.createElement('div');
    toast.className = 'dev-media-undo';
    toast.innerHTML = `<span class="dev-media-undo-text">${label || 'Image removed'}</span><button type="button" class="dev-media-undo-button">Undo</button><span class="dev-media-undo-count">10s</span>`;
    const count = toast.querySelector('.dev-media-undo-count');
    const text = toast.querySelector('.dev-media-undo-text');
    const item = { element: toast, interval: null };
    document.body.appendChild(toast);
    // The toast must never cover the work: it sits outside the removed
    // element, on its right, centered on its height, and flips to the left
    // when the viewport has no room on the right.
    const pos = position || {};
    const margin = 12;
    const w = toast.offsetWidth || 220;
    const h = toast.offsetHeight || 40;
    const anchored = typeof pos.right === 'number' && typeof pos.height === 'number';
    let left = anchored ? pos.right + margin : (pos.left || 0) + 8;
    let top = anchored ? (pos.top || 0) + pos.height / 2 - h / 2 : (pos.top || 0) + 8;
    top = Math.max(8, Math.min(top, window.innerHeight - h - 8));
    if (left + w > window.innerWidth - 8) {
      left = Math.max(8, (pos.left || 0) - w - margin);
    }
    toast.style.left = Math.round(left) + 'px';
    toast.style.top = Math.round(top) + 'px';
    let remaining = 10;
    mediaUndoItems.push(item);
    item.interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        dismissMediaUndo(item);
        return;
      }
      count.textContent = remaining + 's';
    }, 1000);
    toast.querySelector('.dev-media-undo-button').addEventListener('click', () => {
      const restored = restore();
      if (!restored) {
        text.textContent = 'Could not restore';
        count.textContent = '';
        setTimeout(() => dismissMediaUndo(item), 1200);
        return;
      }
      dismissMediaUndo(item);
    });
  }

  // Per-item controls are always visible while editing. A hover-reveal pass
  // was tried and reverted on the user's order: hiding them made every
  // control undiscoverable.
  function gateStack(section, target, buttons) {
    return;
  }

  // Media controls live in one fixed gutter outside the card. They are never
  // placed over the content, and every control is stacked in its own slot so
  // two utilities can never land on the same spot.
  function positionMediaOverlay(section) {
    const overlay = section._mediaOverlay;
    if (!overlay) return;
    const sectionRect = section.getBoundingClientRect();
    if (sectionRect.bottom < -200 || sectionRect.top > window.innerHeight + 200) return;
    const gutterRight = sectionRect.right + 14;
    const gutterLeft = sectionRect.left - 38;
    const useLeft = gutterRight + 28 > window.innerWidth - 8;
    overlay.querySelectorAll('.dev-media-control').forEach(button => {
      const target = button._mediaTarget;
      if (!target || !target.isConnected) {
        button.hidden = true;
        return;
      }
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        button.hidden = true;
        return;
      }
      button.hidden = false;
      const order = { drag: 0, top: 1, up: 2, down: 3, bottom: 4, move: 5, edit: 5, remove: 6 };
      const slot = order[button._slot];
      if (slot === undefined) return;
      const left = useLeft ? gutterLeft : gutterRight;
      const top = Math.max(8, Math.min(rect.top + slot * 28, window.innerHeight - 32));
      button.style.left = left + 'px';
      button.style.top = top + 'px';
    });
  }

  let overlayScrollBound = false;
  function bindOverlayScroll() {
    if (overlayScrollBound) return;
    overlayScrollBound = true;
    let raf = 0;
    const run = () => {
      raf = 0;
      document.querySelectorAll('#projekte .project-detail[data-section]').forEach(section => {
        if (section._mediaOverlay) positionMediaOverlay(section);
      });
    };
    window.addEventListener('scroll', () => {
      if (!raf) raf = requestAnimationFrame(run);
    }, { passive: true });
  }

  function createMediaOverlay(section, project, key, sectionTitle) {
    if (section._mediaOverlay) section._mediaOverlay.remove();
    if (!Array.isArray(project[key + '-media']) || !project[key + '-media'].length) {
      delete section._mediaOverlay;
      return;
    }
    const overlay = document.createElement('div');
    overlay.className = 'dev-media-overlay dev-media-overlay-floating';
    document.body.appendChild(overlay);
    section._mediaOverlay = overlay;
    bindOverlayScroll();
    const addControl = (target, slot, icon, label, disabled) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'dev-media-control' + (slot === 'remove' ? ' dev-media-x' : '');
      button.dataset.slot = slot;
      button.innerHTML = icon;
      button.title = label;
      button.setAttribute('aria-label', label + ' in ' + sectionTitle.trim());
      button.disabled = !!disabled;
      button._mediaTarget = target;
      button._slot = slot;
      overlay.appendChild(button);
      return button;
    };
    const list = project[key + '-media'];
    if (Array.isArray(list)) {
      section.querySelectorAll('[data-media-key]').forEach(el => {
        const index = Number(el.dataset.mediaIndex);
        const meta = mediaField(list[index]);
        if (!meta || (meta.kind !== 'Image' && meta.kind !== 'Embed' && meta.kind !== 'Link' && meta.kind !== 'Icon' && meta.kind !== 'Text')) return;
        if (getComputedStyle(el).display === 'none') return;
        if (meta.kind === 'Icon') {
          const removeIcon = addControl(el, 'remove', CROSS_SVG, 'Remove icon (Undo available)', false);
          removeIcon.classList.add('dev-media-control-icon');
          gateStack(section, el, [removeIcon]);
          removeIcon.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            removeMediaItem(section, project, key, el, 'Icon removed');
          });
          return;
        }
        if (meta.kind === 'Text') {
          el.setAttribute('contenteditable', 'true');
          if (el.dataset.textItemBound !== '1') {
            el.dataset.textItemBound = '1';
            el.addEventListener('input', () => {
              if (el.dataset.historyPushed !== '1') {
                pushHistory();
                el.dataset.historyPushed = '1';
              }
              const at = Number(el.dataset.mediaIndex);
              const current = project[key + '-media'];
              if (Array.isArray(current) && current[at]) {
                current[at].text = el.innerHTML;
                setDirty(true);
              }
            });
            el.addEventListener('blur', () => { delete el.dataset.historyPushed; });
          }
          const removeText = addControl(el, 'remove', CROSS_SVG, 'Remove text (Undo available)', false);
          removeText.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            removeMediaItem(section, project, key, el, 'Text removed');
          });
          return;
        }
        if (el.dataset.mediaDragBound !== '1') {
          el.dataset.mediaDragBound = '1';
          el.addEventListener('pointerdown', event => armMediaDrag(event, section, project, key, el));
          el.addEventListener('dragstart', event => {
            if (state.open) event.preventDefault();
          });
        }
        const noun = meta.kind === 'Embed' ? 'prototype' : meta.kind === 'Link' ? 'link' : 'image';
        const visible = mediaElements(section, key).filter(entry => getComputedStyle(entry).display !== 'none');
        const isFirst = visible[0] === el;
        const isLast = visible[visible.length - 1] === el;
        const drag = addControl(el, 'drag', DRAG_SVG, 'Drag ' + noun + ' to reorder', false);
        drag.addEventListener('pointerdown', event => startMediaDrag(event, section, project, key, el));
        const toTop = addControl(el, 'top', ARROW_TO_LINE_UP, 'Move ' + noun + ' to top', isFirst);
        toTop.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          const at = Number(el.dataset.mediaIndex);
          if (at > 0) reorderMediaItem(section, project, key, at, 0);
        });
        const up = addControl(el, 'up', ARROW_UP, 'Move ' + noun + ' up', visibleMediaNeighbor(section, key, el, -1) === null);
        up.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          const target = visibleMediaNeighbor(section, key, el, -1);
          if (target !== null) reorderMediaItem(section, project, key, Number(el.dataset.mediaIndex), target);
        });
        const down = addControl(el, 'down', ARROW_DOWN, 'Move ' + noun + ' down', visibleMediaNeighbor(section, key, el, 1) === null);
        down.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          const target = visibleMediaNeighbor(section, key, el, 1);
          if (target !== null) reorderMediaItem(section, project, key, Number(el.dataset.mediaIndex), target);
        });
        const toBottom = addControl(el, 'bottom', ARROW_TO_LINE_DOWN, 'Move ' + noun + ' to bottom', isLast);
        toBottom.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          const media = project[key + '-media'];
          const at = Number(el.dataset.mediaIndex);
          if (Array.isArray(media) && at < media.length - 1) reorderMediaItem(section, project, key, at, media.length - 1);
        });
        const stack = [drag, toTop, up, down, toBottom];
        if (meta.kind === 'Embed') {
          const move = addControl(el, 'move', MOVE_SVG, 'Move prototype to another section', false);
          move.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const at = Number(el.dataset.mediaIndex);
            openMoveSub(project, key, at, list[at]);
          });
          stack.push(move);
          gateStack(section, el, stack);
          return;
        }
        if (meta.kind === 'Link') {
          const anchor = el.matches('a') ? el : el.querySelector('a');
          if (anchor) {
            anchor.addEventListener('click', event => {
              if (!state.open) return;
              event.preventDefault();
              event.stopPropagation();
              const at = Number(el.dataset.mediaIndex);
              openLinkSub(project, key, at, list[at]);
            }, true);
          }
          const edit = addControl(el, 'edit', EDIT_SVG, 'Edit link', false);
          edit.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const at = Number(el.dataset.mediaIndex);
            openLinkSub(project, key, at, list[at]);
          });
          const remove = addControl(el, 'remove', CROSS_SVG, 'Remove link (Undo available)', false);
          remove.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            removeMediaItem(section, project, key, el, 'Link removed');
          });
          stack.push(edit, remove);
          gateStack(section, el, stack);
          return;
        }
        const remove = addControl(el, 'remove', CROSS_SVG, 'Remove image (Undo available)', false);
        remove.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          removeMediaItem(section, project, key, el);
        });
        stack.push(remove);
        gateStack(section, el, stack);
      });
    }
    section.querySelectorAll('.project-detail-text a.glightbox').forEach(anchor => {
      if (anchor.closest('[data-media-key]')) return;
      const image = anchor.querySelector('img');
      const href = anchor.getAttribute('href') || '';
      if (!image || !/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(href)) return;
      const units = rawImageUnits(project[key + '-text']);
      const rawIndex = units.findIndex(unit => unit.href === href);
      const rawButtons = [];
      const trackRaw = button => { rawButtons.push(button); return button; };
      const toTop = trackRaw(addControl(image, 'top', ARROW_TO_LINE_UP, 'Move image to top', rawIndex <= 0));
      toTop.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        moveRawUnitTo(project, key, href, 'first');
        refreshMediaMoveControls();
      });
      const up = trackRaw(addControl(image, 'up', ARROW_UP, 'Move image up', rawIndex <= 0));
      up.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        moveRawUnit(project, key, href, -1);
        refreshMediaMoveControls();
      });
      const down = trackRaw(addControl(image, 'down', ARROW_DOWN, 'Move image down', rawIndex < 0 || rawIndex === units.length - 1));
      down.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        moveRawUnit(project, key, href, 1);
        refreshMediaMoveControls();
      });
      const toBottom = trackRaw(addControl(image, 'bottom', ARROW_TO_LINE_DOWN, 'Move image to bottom', rawIndex < 0 || rawIndex === units.length - 1));
      toBottom.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        moveRawUnitTo(project, key, href, 'last');
        refreshMediaMoveControls();
      });
      const remove = trackRaw(addControl(image, 'remove', CROSS_SVG, 'Remove image (Undo available)', false));
      remove.classList.add('dev-media-control-raw');
      remove.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const rect = image.getBoundingClientRect();
        removeRawImage(project, key, href, { top: rect.top, left: rect.left, right: rect.right, height: rect.height });
      });
      gateStack(section, anchor, rawButtons);
    });
    section.appendChild(overlay);
    positionMediaOverlay(section);
  }

  // ---------- seamless media move, delete and drag ----------
  // The media block renders one element per item in array order. A reorder or
  // delete therefore only moves or removes nodes and renumbers the indices; a
  // full re-render (which made the card blink) is not needed.
  function mediaElements(section, key) {
    return [...section.querySelectorAll('[data-media-key="' + key + '"]')];
  }

  // Up/Down step over media that is hidden at the current width, so one press
  // always changes the visible position. Returns the array index of the
  // neighbouring visible item, or null at the end.
  function visibleMediaNeighbor(section, key, el, delta) {
    const visible = mediaElements(section, key).filter(entry => getComputedStyle(entry).display !== 'none');
    const at = visible.indexOf(el);
    const target = visible[at + delta];
    return target ? Number(target.dataset.mediaIndex) : null;
  }

  function renumberMediaElements(section, key) {
    mediaElements(section, key).forEach((el, index) => { el.dataset.mediaIndex = String(index); });
  }

  function rebuildMediaOverlay(section, project, key) {
    const title = ((section.querySelector(':scope > h3') || {}).textContent || key || '').trim();
    createMediaOverlay(section, project, key, title);
  }

  function syncMediaSheet(project, key, list) {
    if (!mediaTarget || mediaTarget.project !== project || mediaTarget.key !== key || mediaTarget.raw) return;
    const index = list.indexOf(mediaTarget.item);
    if (index === -1) {
      closeSub();
      return;
    }
    mediaTarget.index = index;
    refreshMediaMoveControls();
  }

  function reorderMediaItem(section, project, key, from, to) {
    const list = project[key + '-media'];
    if (!Array.isArray(list) || from === to || !list[from] || to < 0 || to >= list.length) return false;
    pushHistory();
    const item = list[from];
    list.splice(from, 1);
    list.splice(to, 0, item);
    const els = mediaElements(section, key);
    const el = els[from];
    if (el) {
      const rest = els.filter(entry => entry !== el);
      if (to >= rest.length) {
        if (rest.length) rest[rest.length - 1].after(el);
        else el.parentElement.appendChild(el);
      } else {
        rest[to].before(el);
      }
    }
    renumberMediaElements(section, key);
    rebuildMediaOverlay(section, project, key);
    setDirty(true);
    if (window.glightbox && window.glightbox.reload) window.glightbox.reload();
    syncMediaSheet(project, key, list);
    return true;
  }

  function removeMediaItem(section, project, key, el, label) {
    const list = project[key + '-media'];
    const index = Number(el.dataset.mediaIndex);
    if (!Array.isArray(list) || !list[index]) return;
    const item = list[index];
    const rect = el.getBoundingClientRect();
    pushHistory();
    list.splice(index, 1);
    setDirty(true);
    el.remove();
    renumberMediaElements(section, key);
    rebuildMediaOverlay(section, project, key);
    if (window.glightbox && window.glightbox.reload) window.glightbox.reload();
    syncMediaSheet(project, key, list);
    showMediaUndo({ top: rect.top, left: rect.left, right: rect.right, height: rect.height }, () => {
      const current = projectsData.find(entry => entry.id === project.id);
      if (!current) return false;
      const media = current[key + '-media'];
      if (!Array.isArray(media)) return false;
      media.splice(Math.min(index, media.length), 0, item);
      setDirty(true);
      const sectionNow = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
      if (!document.contains(section) || sectionNow !== section) {
        rerenderPreservingOpen();
        return true;
      }
      if (!mediaElements(section, key).length) {
        // The media block was the only item; a re-render puts it back into the
        // section's block order instead of appending it at the end.
        rerenderPreservingOpen();
        return true;
      }
      const remaining = mediaElements(section, key);
      if (index < remaining.length) remaining[index].before(el);
      else remaining[remaining.length - 1].after(el);
      renumberMediaElements(section, key);
      rebuildMediaOverlay(section, current, key);
      if (window.glightbox && window.glightbox.reload) window.glightbox.reload();
      return true;
    }, label);
  }

  // Move a raw text image to the start or end of the section's image run.
  // Everything between the images (prose, headings) stays where it is.
  function moveRawUnitTo(project, key, href, edge) {
    const text = project[key + '-text'];
    const units = rawImageUnits(text);
    const index = units.findIndex(unit => unit.href === href);
    const last = units.length - 1;
    if (index < 0) return false;
    if ((edge === 'first' && index === 0) || (edge === 'last' && index === last)) return false;
    pushHistory();
    const unit = units[index];
    const block = text.slice(unit.start, unit.end);
    const rest = text.slice(0, unit.start) + text.slice(unit.end);
    const nextText = edge === 'first' ? block + rest : rest + block;
    project[key + '-text'] = nextText;
    setDirty(true);
    const section = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
    const textEl = section ? section.querySelector('.project-detail-text') : null;
    const nextUnits = rawImageUnits(nextText);
    const findAnchor = target => textEl
      ? [...textEl.querySelectorAll('a.glightbox')].find(entry => entry.getAttribute('href') === target) || null
      : null;
    const descOf = node => node && node.nextElementSibling && node.nextElementSibling.classList.contains('glightbox-desc')
      ? node.nextElementSibling
      : null;
    const currentAnchor = findAnchor(href);
    if (textEl && currentAnchor) {
      const currentDesc = descOf(currentAnchor);
      const parent = currentAnchor.parentElement;
      currentAnchor.remove();
      if (currentDesc) currentDesc.remove();
      if (edge === 'first') {
        const targetAnchor = findAnchor(nextUnits[1].href);
        parent.insertBefore(currentAnchor, targetAnchor);
      } else {
        const targetAnchor = findAnchor(nextUnits[nextUnits.length - 2].href);
        const reference = targetAnchor
          ? (descOf(targetAnchor) ? descOf(targetAnchor).nextSibling : targetAnchor.nextSibling)
          : null;
        parent.insertBefore(currentAnchor, reference);
      }
      if (currentDesc) parent.insertBefore(currentDesc, currentAnchor.nextSibling);
      rebuildMediaOverlay(section, project, key);
    } else {
      rerenderPreservingOpen();
    }
    return true;
  }

  function moveRawUnit(project, key, href, delta) {
    const text = project[key + '-text'];
    const units = rawImageUnits(text);
    const index = units.findIndex(unit => unit.href === href);
    const next = index + delta;
    if (index < 0 || next < 0 || next >= units.length) return false;
    pushHistory();
    // Swap the two image blocks; everything between them (prose, headings)
    // stays where it is. Every byte outside the two blocks is carried over
    // unchanged, and pushHistory stores the pre-move text for Undo.
    const a = units[index];
    const b = units[next];
    const nextText = delta < 0
      ? text.slice(0, b.start) + text.slice(a.start, a.end) + text.slice(b.end, a.start) + text.slice(b.start, b.end) + text.slice(a.end)
      : text.slice(0, a.start) + text.slice(b.start, b.end) + text.slice(a.end, b.start) + text.slice(a.start, a.end) + text.slice(b.end);
    project[key + '-text'] = nextText;
    setDirty(true);
    // Move the rendered anchor and its caption div in place as well; a
    // re-render here made the whole card reload and jump.
    const section = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
    const textEl = section ? section.querySelector('.project-detail-text') : null;
    const findAnchor = target => textEl
      ? [...textEl.querySelectorAll('a.glightbox')].find(entry => entry.getAttribute('href') === target) || null
      : null;
    const currentAnchor = findAnchor(href);
    const targetAnchor = findAnchor(units[next].href);
    const descOf = node => node && node.nextElementSibling && node.nextElementSibling.classList.contains('glightbox-desc')
      ? node.nextElementSibling
      : null;
    if (textEl && currentAnchor && targetAnchor) {
      const currentDesc = descOf(currentAnchor);
      const targetDesc = descOf(targetAnchor);
      const parent = currentAnchor.parentElement;
      if (delta < 0) {
        parent.insertBefore(currentAnchor, targetAnchor);
        if (currentDesc) parent.insertBefore(currentDesc, currentAnchor.nextSibling);
      } else {
        const reference = targetDesc ? targetDesc.nextSibling : targetAnchor.nextSibling;
        parent.insertBefore(currentAnchor, reference);
        if (currentDesc) parent.insertBefore(currentDesc, currentAnchor.nextSibling);
      }
      rebuildMediaOverlay(section, project, key);
    } else {
      rerenderPreservingOpen();
    }
    return true;
  }

  // Icons are media items like images. The insertion gap decides the array
  // index and the block slot, so an icon can land between two images instead
  // of only behind the row.
  // Text is a first-class media item, so prose can sit between two images,
  // an icon and a link, or anywhere else in a run.
  function insertTextItemAt(project, key, mediaIndex) {
    pushHistory();
    if (!Array.isArray(project[key + '-media'])) project[key + '-media'] = [];
    const media = project[key + '-media'];
    const at = Math.max(0, Math.min(mediaIndex, media.length));
    media.splice(at, 0, { text: '<p><br></p>' });
    setDirty(true);
    rerenderPreservingOpen();
    setTimeout(() => {
      const section = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
      const el = section ? section.querySelector('[data-media-key="' + key + '"][data-media-index="' + at + '"]') : null;
      if (!el) return;
      el.scrollIntoView({ block: 'center' });
      el.focus();
      placeCaretStart(el);
    }, 60);
  }

  function insertIconAt(project, key, iconKey, mediaIndex, blockPos) {
    pushHistory();
    if (!Array.isArray(project[key + '-media'])) project[key + '-media'] = [];
    const media = project[key + '-media'];
    const at = Math.max(0, Math.min(mediaIndex, media.length));
    media.splice(at, 0, { icon: iconKey });
    placeMediaBlock(project, key, blockPos);
    setDirty(true);
    rerenderPreservingOpen();
    setTimeout(() => {
      const section = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
      if (section) section.scrollIntoView({ block: 'center' });
    }, 60);
  }

  function insertIcon(project, key, iconKey) {
    insertIconAt(project, key, iconKey, Array.isArray(project[key + '-media']) ? project[key + '-media'].length : 0, blockOrderFor(project, key).length);
  }

  // An upload is inserted at the chosen gap and rendered first, then the alt
  // sheet opens. The legacy append-only entry point is kept for callers that
  // do not track a gap.
  function insertUploadedImage(section, project, key, path) {
    const media = Array.isArray(project[key + '-media']) ? project[key + '-media'] : [];
    insertImageAt(project, key, path, media.length, blockOrderFor(project, key).length);
  }

  function placeCaretStart(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Real content children of a section body, in document order. Chrome (insert
  // points, remove controls, overlays, the legacy add row) is skipped. Media
  // items carry their array index so an insertion can land between two images.
  // The icon tray is transparent: its children count as one media run.
  function contentItems(body) {
    const items = [];
    const isChrome = el => el.classList.contains('dev-insert-point') ||
      el.classList.contains('dev-block-remove') ||
      el.classList.contains('dev-section-tools') ||
      el.classList.contains('dev-media-overlay') ||
      el.classList.contains('dev-add-media-row') ||
      el.classList.contains('dev-empty-section');
    const pushMedia = (el, tray) => {
      if (el.hasAttribute && el.hasAttribute('data-block-index')) {
        items.push({ el, type: 'media', blockIndex: Number(el.getAttribute('data-block-index')), tray: tray || null });
        return true;
      }
      if (el.hasAttribute && el.hasAttribute('data-media-key')) {
        items.push({ el, type: 'media', mediaIndex: Number(el.getAttribute('data-media-index')), tray: tray || null });
        return true;
      }
      const nested = el.querySelector ? el.querySelector('[data-block-index]') : null;
      if (nested) {
        items.push({ el, type: 'media', blockIndex: Number(nested.getAttribute('data-block-index')), tray: tray || null });
        return true;
      }
      return false;
    };
    [...body.children].forEach(el => {
      if (isChrome(el)) return;
      if (el.classList.contains('dev-tray')) {
        [...el.children].forEach(kid => {
          if (kid.classList.contains('dev-insert-point')) return;
          if (kid.classList.contains('dev-empty-section')) return;
          if (!pushMedia(kid, el)) items.push({ el: kid, type: 'media', mediaIndex: items.filter(x => x.type === 'media').length, tray: el });
        });
        return;
      }
      if (el.classList.contains('project-detail-text')) {
        items.push({ el, type: 'text' });
        return;
      }
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        items.push({ el, type: 'list' });
        return;
      }
      pushMedia(el, null);
    });
    return items;
  }

  // Blocks in document order. Consecutive media items form one block, so the
  // block order stays a three-type list even when every image gets its own
  // insertion gap.
  function blockGroups(body) {
    const groups = [];
    let current = null;
    contentItems(body).forEach(item => {
      const type = item.type;
      if (type === 'media' && current && current.type === 'media') {
        current.nodes.push(item.el);
        return;
      }
      current = { type, nodes: [item.el] };
      groups.push(current);
    });
    return groups;
  }

  function closeInsertMenus(except) {
    document.querySelectorAll('#projekte .dev-insert-menu').forEach(menu => {
      if (menu !== except) menu.hidden = true;
    });
  }

  // One [+] per gap: before the first block, between blocks, between two
  // media items, and after the last block. Clicking it offers the elements
  // that can be inserted there; the menu is the choice, the gap is the slot.
  // Text lives at body level (never inside the tray); intra-run gaps offer
  // media only.
  // Every gap uses the same block menu and migrates the section on first use,
  // so there is one insertion model everywhere — including between two images.
  function buildBlockGapRow(project, key, index) {
    const row = document.createElement('div');
    row.className = 'dev-insert-point';
    const inner = document.createElement('div');
    inner.className = 'dev-insert-inner';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dev-insert-point-button';
    button.innerHTML = PLUS_SVG;
    button.title = 'Insert here';
    button.setAttribute('aria-label', 'Insert here');
    button.setAttribute('aria-expanded', 'false');
    const menu = blockGapMenu(project, key, index, button);
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const open = menu.hidden;
      closeInsertMenus(menu);
      menu.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      if (open) {
        const first = menu.querySelector('.dev-insert-choice');
        if (first) first.focus();
      }
    });
    inner.appendChild(button);
    row.appendChild(inner);
    row.appendChild(menu);
    return row;
  }

  function addInsertPoints(section, project, key) {
    const body = section.querySelector(':scope > .project-detail-body');
    if (!body) return;
    body.querySelectorAll(':scope > .dev-insert-point').forEach(el => el.remove());
    const tray = body.querySelector(':scope > .dev-tray');
    if (tray) tray.querySelectorAll(':scope > .dev-insert-point').forEach(el => el.remove());
    const items = contentItems(body);
    const groups = blockGroups(body);
    const hasText = !!body.querySelector(':scope > .project-detail-text');
    const topNode = item => (item.type === 'media' && item.tray) ? item.tray : item.el;
    if (!items.length && !body.querySelector(':scope > .dev-empty-section')) {
      body.appendChild(buildInsertPoint(project, key, 0, 0, hasText, false));
      return;
    }
    if (!items.length) return;
    items.forEach((item, i) => {
      const point = buildBlockGapRow(project, key, i);
      const intraMedia = i > 0 && i < items.length && items[i - 1].type === 'media' && items[i].type === 'media';
      if (intraMedia) {
        point.classList.add('dev-insert-point-inline');
        (item.tray || body).insertBefore(point, item.el);
      } else {
        body.insertBefore(point, topNode(item));
      }
      // A tray run also gets inline edge gaps, so icons can be added before
      // the first and after the last one without leaving the row.
      if (item.type === 'media' && item.tray) {
        const runStart = i === 0 || items[i - 1].type !== 'media' || items[i - 1].tray !== item.tray;
        const runEnd = i === items.length - 1 || items[i + 1].type !== 'media' || items[i + 1].tray !== item.tray;
        if (runStart) {
          const point = buildBlockGapRow(project, key, i);
          point.classList.add('dev-insert-point-inline');
          item.tray.insertBefore(point, item.tray.firstChild);
        }
        if (runEnd) {
          const point = buildBlockGapRow(project, key, i + 1);
          point.classList.add('dev-insert-point-inline');
          item.tray.insertBefore(point, item.el.nextSibling);
        }
      }
    });
    body.appendChild(buildBlockGapRow(project, key, items.length));
  }

  // Block position of gap i: how many block groups end before it. A gap
  // inside a media run sits at that run's position.
  function blockPosForGap(groups, items, gap) {
    if (!gap) return 0;
    if (gap >= items.length) return groups.length;
    let seen = [];
    for (let i = 0; i < gap; i++) {
      const type = items[i].type;
      const last = seen[seen.length - 1];
      if (type === 'media' && last === 'media') continue;
      seen.push(type);
    }
    const nextType = items[gap].type;
    const lastSeen = seen[seen.length - 1];
    if (nextType === 'media' && lastSeen === 'media') return seen.length - 1;
    return seen.length;
  }

  function buildInsertPoint(project, key, mediaIndex, blockPos, hasText, intraMedia) {
    const row = document.createElement('div');
    row.className = 'dev-insert-point';
    const inner = document.createElement('div');
    inner.className = 'dev-insert-inner';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dev-insert-point-button';
    button.innerHTML = PLUS_SVG;
    button.title = 'Insert here';
    button.setAttribute('aria-label', 'Insert here');
    button.setAttribute('aria-expanded', 'false');
    const menu = document.createElement('div');
    menu.className = 'dev-insert-menu';
    menu.hidden = true;
    if (!hasText || intraMedia) {
      const textChoice = document.createElement('button');
      textChoice.type = 'button';
      textChoice.className = 'dev-insert-choice';
      textChoice.textContent = 'Text';
      textChoice.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        menu.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        if (intraMedia) insertTextItemAt(project, key, mediaIndex);
        else createTextAt(project, key, blockPos);
      });
      menu.appendChild(textChoice);
    }
    const imageChoice = document.createElement('button');
    imageChoice.type = 'button';
    imageChoice.className = 'dev-insert-choice';
    imageChoice.textContent = 'Image';
    imageChoice.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      pickAndInsertImage(project, key, mediaIndex, blockPos);
    });
    menu.appendChild(imageChoice);
    const iconChoice = document.createElement('button');
    iconChoice.type = 'button';
    iconChoice.className = 'dev-insert-choice';
    iconChoice.textContent = 'Icon';
    iconChoice.setAttribute('aria-expanded', 'false');
    menu.appendChild(iconChoice);
    const grid = document.createElement('div');
    grid.className = 'dev-icon-grid';
    grid.hidden = true;
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Add an icon');
    const icons = window.portfolioIconMap || {};
    Object.keys(icons).forEach(iconKey => {
      const choice = document.createElement('button');
      choice.type = 'button';
      choice.className = 'dev-icon-choice';
      choice.dataset.icon = iconKey;
      choice.title = icons[iconKey].title || iconKey;
      const img = document.createElement('img');
      img.src = icons[iconKey].src;
      img.alt = '';
      choice.appendChild(img);
      choice.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        menu.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        insertIconAt(project, key, iconKey, mediaIndex, blockPos);
      });
      grid.appendChild(choice);
    });
    iconChoice.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      grid.hidden = !grid.hidden;
      iconChoice.setAttribute('aria-expanded', String(!grid.hidden));
      if (!grid.hidden) {
        const first = grid.querySelector('button');
        if (first) first.focus();
      }
    });
    menu.appendChild(grid);
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = menu.hidden;
      closeInsertMenus(menu);
      grid.hidden = true;
      iconChoice.setAttribute('aria-expanded', 'false');
      menu.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        const first = menu.querySelector('.dev-insert-choice');
        if (first) first.focus();
      }
    });
    inner.appendChild(button);
    row.appendChild(inner);
    row.appendChild(menu);
    return row;
  }

  function pickAndInsertImage(project, key, mediaIndex, blockPos) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.hidden = true;
    document.body.appendChild(input);
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      input.remove();
      if (!file) return;
      uploadMediaFile(file, (path, message) => {
        if (!path) {
          showMediaUndo({ top: 8, left: 8 }, () => false, message || 'Image upload failed.');
          return;
        }
        insertImageAt(project, key, path, mediaIndex, blockPos);
      });
    });
    input.click();
  }

  function placeMediaBlock(project, key, blockPos) {
    const order = blockOrderFor(project, key).filter(type => type !== 'media');
    order.splice(Math.max(0, Math.min(blockPos, order.length)), 0, 'media');
    storeBlockOrder(project, key, order);
  }

  function insertImageAt(project, key, path, mediaIndex, blockPos) {
    pushHistory();
    if (!Array.isArray(project[key + '-media'])) project[key + '-media'] = [];
    const media = project[key + '-media'];
    const at = Math.max(0, Math.min(mediaIndex, media.length));
    media.splice(at, 0, { src: path, alt: '' });
    placeMediaBlock(project, key, blockPos);
    setDirty(true);
    rerenderPreservingOpen();
    setTimeout(() => {
      const section = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
      const el = section ? section.querySelector('[data-media-key="' + key + '"][data-media-index="' + at + '"]') : null;
      if (el) markMediaEditable(el);
      openMediaSub(project, key, at, media[at], 'src', 'Image', null, true);
    }, 60);
  }

  function createTextAt(project, key, blockPos) {
    const section = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
    const body = section ? section.querySelector(':scope > .project-detail-body') : null;
    const types = body ? blockGroups(body).map(group => group.type) : [];
    if (types.indexOf('text') !== -1) return;
    const order = types.slice();
    order.splice(Math.max(0, Math.min(blockPos, order.length)), 0, 'text');
    pushHistory();
    project[key + '-text'] = '<p><br></p>';
    storeBlockOrder(project, key, order);
    setDirty(true);
    rerenderPreservingOpen();
    setTimeout(() => {
      const now = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
      const text = now ? now.querySelector(':scope > .project-detail-body > .project-detail-text') : null;
      if (!text) return;
      text.scrollIntoView({ block: 'center' });
      text.focus();
      placeCaretStart(text);
    }, 60);
  }

  // A text or list block carries its own remove control. It appears when the
  // block is hovered or focused, so it targets the block it sits on.
  function addBlockRemovals(section, project, key) {
    const body = section.querySelector(':scope > .project-detail-body');
    if (!body) return;
    section.querySelectorAll(':scope > .dev-block-remove').forEach(el => el.remove());
    const blocks = [
      { type: 'text', el: body.querySelector(':scope > .project-detail-text'), label: 'Remove text block (Undo available)' },
      { type: 'list', el: body.querySelector(':scope > ul, :scope > ol'), label: 'Remove list block (Undo available)' }
    ];
    blocks.forEach(block => {
      if (!block.el) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'dev-block-remove';
      button.dataset.block = block.type;
      button.innerHTML = CROSS_SVG;
      button.title = block.label;
      button.setAttribute('aria-label', block.label);
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        removeBlock(project, key, block.type);
      });
      button.style.top = block.el.offsetTop + 'px';
      section.appendChild(button);
    });
  }

  // ---------- text fragments ----------
  // Every direct child of a text stream is addressable: it can be removed, and
  // a paragraph can be inserted before it — including between two raw images.
  // Saves go through the same innerHTML path the inline editor uses, so the
  // stored <key>-text string stays in sync with what is on screen.
  function saveTextStream(el, project, key) {
    normalizeListParents(el);
    project[key + '-text'] = el.innerHTML;
    setDirty(true);
  }

  function positionFragControls(section) {
    const wrap = section.querySelector(':scope > .dev-frag-controls');
    if (!wrap) return;
    const sectionRect = section.getBoundingClientRect();
    [...wrap.children].forEach(row => {
      const target = row._target;
      if (row._atEnd) {
        const text = row.parentElement ? row.parentElement.previousElementSibling : null;
        const lastFrag = wrap.querySelectorAll('.dev-frag-row[data-target]');
        const anchor = [...wrap.children].filter(entry => entry._target).pop();
        const node = anchor && anchor._target;
        if (!node || !node.isConnected) {
          row.style.display = 'none';
          return;
        }
        const rect = node.getBoundingClientRect();
        row.style.display = '';
        row.style.top = Math.max(0, rect.bottom - sectionRect.top + 4) + 'px';
        return;
      }
      if (!target || !target.isConnected) {
        row.style.display = 'none';
        return;
      }
      const rect = target.getBoundingClientRect();
      row.style.display = '';
      row.style.top = Math.max(0, rect.top - sectionRect.top + 4) + 'px';
    });
  }

  // Only headings get their own remove control; paragraphs are removed by
  // selecting them, and the whole stream by the block control. Anything more
  // duplicates the block control and lands on the text.
  function addTextFragmentControls(section, project, key) {
    const text = section.querySelector(':scope > .project-detail-body > .project-detail-text');
    section.querySelectorAll(':scope > .dev-frag-controls').forEach(el => el.remove());
    if (!text) return;
    const headings = [...text.children].filter(child => /^H[1-6]$/.test(child.tagName));
    if (!headings.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'dev-frag-controls';
    headings.forEach(child => {
      const row = document.createElement('div');
      row.className = 'dev-frag-row';
      row._target = child;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'dev-frag-button dev-frag-remove';
      remove.innerHTML = CROSS_SVG;
      remove.title = 'Remove this heading (Undo available)';
      remove.setAttribute('aria-label', 'Remove this heading (Undo available)');
      remove.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const before = text.innerHTML;
        pushHistory();
        child.remove();
        saveTextStream(text, project, key);
        const sectionRect = section.getBoundingClientRect();
        showMediaUndo({ top: sectionRect.top + 8, left: sectionRect.left + sectionRect.width / 2, right: sectionRect.left + sectionRect.width / 2, height: 24 }, () => {
          const now = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"] .project-detail-text');
          if (!now) return false;
          now.innerHTML = before;
          project[key + '-text'] = now.innerHTML;
          setDirty(true);
          rerenderPreservingOpen();
          return true;
        }, 'Heading removed');
        rerenderPreservingOpen();
      });
      row.appendChild(remove);
      wrap.appendChild(row);
    });
    section.appendChild(wrap);
    requestAnimationFrame(() => positionFragControls(section));
    if (section._fragObserver) section._fragObserver.disconnect();
    const observer = new ResizeObserver(() => positionFragControls(section));
    observer.observe(text);
    section._fragObserver = observer;
  }

  // The project heading inside the expanded card is editable too, and stays in
  // sync with the card front. Clearing it is allowed.
  function markCardTitleHeading(heading, project) {
    if (!heading.isContentEditable) heading.setAttribute('contenteditable', 'true');
    if (heading.dataset.cardTitleBound === '1') return;
    heading.dataset.cardTitleBound = '1';
    heading.addEventListener('input', () => {
      if (heading.dataset.historyPushed !== '1') {
        pushHistory();
        heading.dataset.historyPushed = '1';
      }
      project.title = heading.textContent.trim();
      const collapse = heading.closest('.multi-collapse');
      if (collapse) {
        collapse.querySelectorAll('article > h2, article > h3').forEach(other => {
          if (other !== heading) other.textContent = project.title;
        });
      }
      const cluster = document.querySelector('#thumbCluster-' + project.id);
      if (cluster) cluster.querySelectorAll('.card-title').forEach(title => { title.textContent = project.title; });
      setDirty(true);
    });
    heading.addEventListener('blur', () => { delete heading.dataset.historyPushed; });
  }

  function removeBlock(project, key, type) {
    const field = key + '-' + (type === 'list' ? 'list' : 'text');
    if (!Object.prototype.hasOwnProperty.call(project, field)) return false;
    const previous = project[field];
    const order = Array.isArray(project[key + '-order']) ? project[key + '-order'].slice() : null;
    const listType = type === 'list' ? project[key + '-list-type'] : undefined;
    const section = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
    const rect = section ? section.getBoundingClientRect() : { top: 0, left: 0 };
    pushHistory();
    delete project[field];
    if (type === 'list') delete project[key + '-list-type'];
    if (Array.isArray(project[key + '-order'])) {
      const next = project[key + '-order'].filter(entry => entry !== type);
      if (next.length) project[key + '-order'] = next;
      else delete project[key + '-order'];
    }
    setDirty(true);
    rerenderPreservingOpen();
    showMediaUndo({ top: rect.top, left: rect.left, right: rect.right, height: rect.height }, () => {
      const current = projectsData.find(entry => entry.id === project.id);
      if (!current) return false;
      current[field] = previous;
      if (type === 'list' && listType !== undefined) current[key + '-list-type'] = listType;
      if (order) current[key + '-order'] = order;
      setDirty(true);
      rerenderPreservingOpen();
      return true;
    }, type === 'list' ? 'List block removed' : 'Text block removed');
    return true;
  }

  // A list must not sit inside a paragraph: browsers nest <ul> in <p> when a
  // list is created from one, and re-parsing that HTML would split the
  // paragraph apart on the next render. Move the list out and keep the
  // surrounding text as its own paragraphs.
  function normalizeListParents(root) {
    if (!root) return;
    [...root.querySelectorAll('p')].forEach(p => {
      if (!p.querySelector(':scope > ul, :scope > ol')) return;
      const frag = document.createDocumentFragment();
      let buffer = null;
      [...p.childNodes].forEach(node => {
        if (node.nodeType === 1 && (node.tagName === 'UL' || node.tagName === 'OL')) {
          if (buffer && buffer.textContent.trim()) frag.appendChild(buffer);
          buffer = null;
          frag.appendChild(node);
        } else {
          if (!buffer) buffer = document.createElement('p');
          buffer.appendChild(node);
        }
      });
      if (buffer && buffer.textContent.trim()) frag.appendChild(buffer);
      p.replaceWith(frag);
    });
  }

  function buildTextToolbar() {
    if (textToolbar) return textToolbar;
    textToolbar = document.createElement('div');
    textToolbar.id = 'devTextToolbar';
    textToolbar.className = 'dev-text-toolbar';
    textToolbar.hidden = true;
    textToolbar.innerHTML = '<button type="button" data-format="bold" title="Bold"><strong>B</strong></button>' +
      '<button type="button" data-format="italic" title="Italic"><em>I</em></button>' +
      '<button type="button" data-format="insertUnorderedList" title="Bulleted list">' + LIST_UL_SVG + '</button>' +
      '<button type="button" data-format="insertOrderedList" title="Numbered list">' + LIST_OL_SVG + '</button>' +
      '<button type="button" data-format="clear" title="Clear formatting">Clear</button>' +
      '<input type="url" id="devTextLinkUrl" placeholder="Link URL" aria-label="Link URL">' +
      '<button type="button" data-format="link" title="Apply link">Link</button>';
    textToolbar.addEventListener('mousedown', event => {
      if (event.target.tagName !== 'INPUT') event.preventDefault();
    });
    textToolbar.addEventListener('click', event => {
      const button = event.target.closest('[data-format]');
      if (!button) return;
      applyTextFormat(button.dataset.format);
    });
    document.body.appendChild(textToolbar);
    return textToolbar;
  }

  function showTextToolbar(text) {
    const toolbarEl = buildTextToolbar();
    const rect = text.getBoundingClientRect();
    toolbarEl.hidden = false;
    const width = toolbarEl.offsetWidth;
    toolbarEl.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)) + 'px';
    toolbarEl.style.top = Math.max(8, rect.top - toolbarEl.offsetHeight - 8) + 'px';
  }

  function hideTextToolbar() {
    if (textToolbar) textToolbar.hidden = true;
  }

  function updateTextToolbar() {
    if (!state.open) {
      hideTextToolbar();
      return;
    }
    if (textToolbar && textToolbar.contains(document.activeElement)) return;
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    let node = range.startContainer;
    if (node.nodeType !== 1) node = node.parentElement;
    const text = node ? node.closest('.project-detail-text') : null;
    if (!text || !text.isContentEditable) {
      hideTextToolbar();
      return;
    }
    activeText = text;
    savedRange = range.cloneRange();
    showTextToolbar(text);
  }

  function applyTextFormat(format) {
    if (!activeText) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    if (savedRange) selection.addRange(savedRange);
    if (format === 'clear') {
      document.execCommand('removeFormat', false, null);
    } else if (format === 'link') {
      const input = textToolbar.querySelector('#devTextLinkUrl');
      const url = input.value.trim();
      if (!url) {
        input.focus();
        return;
      }
      if (savedRange && savedRange.collapsed) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.textContent = url;
        savedRange.insertNode(anchor);
        anchor.after(document.createTextNode('\u00a0'));
      } else {
        document.execCommand('createLink', false, url);
      }
      input.value = '';
    } else {
      document.execCommand(format, false, null);
      if (format === 'insertUnorderedList' || format === 'insertOrderedList') normalizeListParents(activeText);
    }
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
    activeText.focus();
    if (window.getSelection().rangeCount) savedRange = window.getSelection().getRangeAt(0).cloneRange();
    showTextToolbar(activeText);
  }

  let mediaDragState = null;
  let suppressMediaClick = false;

  function startMediaDrag(event, section, project, key, el) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    beginMediaDrag(section, project, key, el);
  }

  // A plain pointerdown on the image may still become a click that opens the
  // media sheet. Only a movement of 6 px starts the drag, and the click that
  // follows a real drag is swallowed.
  function armMediaDrag(event, section, project, key, el) {
    if (event.button !== 0) return;
    if (event.target.closest && event.target.closest('.dev-media-control')) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const cleanup = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
    };
    const onUp = () => cleanup();
    const onMove = moveEvent => {
      if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < 6) return;
      if ((moveEvent.buttons & 1) === 0) {
        cleanup();
        return;
      }
      moveEvent.preventDefault();
      cleanup();
      beginMediaDrag(section, project, key, el);
      onMediaDragMove(moveEvent);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp, { once: true });
    document.addEventListener('pointercancel', onUp, { once: true });
  }

  function beginMediaDrag(section, project, key, el) {
    closeSub();
    const line = document.createElement('div');
    line.className = 'dev-media-drop-line';
    line.hidden = true;
    document.body.appendChild(line);
    el.classList.add('dev-media-dragging');
    mediaDragState = {
      section,
      project,
      key,
      el,
      from: Number(el.dataset.mediaIndex),
      dropIndex: null,
      line,
      scrollDir: 0,
      raf: 0
    };
    document.addEventListener('pointermove', onMediaDragMove);
    document.addEventListener('pointerup', endMediaDrag, { once: true });
    document.addEventListener('pointercancel', endMediaDrag, { once: true });
  }

  function onMediaDragMove(event) {
    const drag = mediaDragState;
    if (!drag) return;
    const over = document.elementFromPoint(event.clientX, event.clientY);
    const target = over && over.closest ? over.closest('[data-media-key="' + drag.key + '"]') : null;
    if (target && drag.section.contains(target)) {
      const rect = target.getBoundingClientRect();
      const after = event.clientY > rect.top + rect.height / 2;
      drag.dropIndex = Number(target.dataset.mediaIndex) + (after ? 1 : 0);
      drag.line.hidden = false;
      drag.line.style.top = (after ? rect.bottom - 1 : rect.top) + 'px';
      drag.line.style.left = rect.left + 'px';
      drag.line.style.width = rect.width + 'px';
    }
    const edge = 80;
    drag.scrollDir = event.clientY < edge ? -1 : event.clientY > window.innerHeight - edge ? 1 : 0;
    if (drag.scrollDir && !drag.raf) drag.raf = requestAnimationFrame(scrollMediaDrag);
  }

  function scrollMediaDrag() {
    const drag = mediaDragState;
    if (!drag) return;
    drag.raf = 0;
    if (!drag.scrollDir) return;
    window.scrollBy(0, drag.scrollDir * 12);
    drag.raf = requestAnimationFrame(scrollMediaDrag);
  }

  function endMediaDrag() {
    const drag = mediaDragState;
    mediaDragState = null;
    if (!drag) return;
    document.removeEventListener('pointermove', onMediaDragMove);
    document.removeEventListener('pointerup', endMediaDrag);
    document.removeEventListener('pointercancel', endMediaDrag);
    if (drag.raf) cancelAnimationFrame(drag.raf);
    drag.line.remove();
    drag.el.classList.remove('dev-media-dragging');
    suppressMediaClick = true;
    setTimeout(() => { suppressMediaClick = false; }, 350);
    if (drag.dropIndex === null) return;
    const to = drag.dropIndex > drag.from ? drag.dropIndex - 1 : drag.dropIndex;
    if (to !== drag.from) reorderMediaItem(drag.section, drag.project, drag.key, drag.from, to);
  }

  function addMediaControls() {
    if (mediaObservers.length) {
      mediaObservers.forEach(observer => observer.disconnect());
      mediaObservers = [];
    }
    document.querySelectorAll('#projekte .project-detail[data-section]').forEach(section => {
      const body = section.querySelector(':scope > .project-detail-body');
      const project = projectOfSection(section);
      const key = section.dataset.section;
      if (!body || !project || !key) return;
      const sectionTitle = (section.querySelector(':scope > h3') || {}).textContent || key;
      createMediaOverlay(section, project, key, sectionTitle);
      const observer = new ResizeObserver(() => positionMediaOverlay(section));
      observer.observe(section);
      mediaObservers.push(observer);
    });
  }

  function addSectionControls() {
    document.querySelectorAll('#projekte .multi-collapse').forEach(collapse => {
      if (collapse.querySelector(':scope > .dev-add-section-row')) return;
      const project = projectsData.find(p => p.id === collapse.id.replace('thumbCollapse-', ''));
      if (!project) return;
      const row = document.createElement('div');
      row.className = 'dev-add-section-row';
      row.innerHTML = '<button type="button" class="dev-add-section">+ Section</button>';
      row.querySelector('.dev-add-section').addEventListener('click', () => openSectionSub(project));
      collapse.appendChild(row);
    });
  }

  function removeSectionHandles() {
    cancelSectionDrag();
    document.querySelectorAll('.dev-reorder-handle, .dev-section-remove, .dev-section-blocks, .dev-section-tools').forEach(handle => handle.remove());
    document.querySelectorAll('.project-detail.dev-dragging, .project-detail.dev-before, .project-detail.dev-after')
      .forEach(section => section.classList.remove('dev-dragging', 'dev-before', 'dev-after'));
  }

  function startSectionDrag(event) {
    if (event.button !== 0) return;
    const section = event.currentTarget.closest('.project-detail');
    if (!section) return;
    event.preventDefault();
    dragState = { section, target: null, before: false };
    section.classList.add('dev-dragging');
    document.addEventListener('pointermove', onSectionDragMove);
    document.addEventListener('pointerup', endSectionDrag, { once: true });
    document.addEventListener('pointercancel', endSectionDrag, { once: true });
  }

  function onSectionDragMove(event) {
    if (!dragState) return;
    const dragged = dragState.section;
    const over = document.elementFromPoint(event.clientX, event.clientY);
    const target = over && over.closest ? over.closest('.project-detail[data-section]') : null;
    clearDragMarks(dragged);
    if (target && target !== dragged && target.parentElement === dragged.parentElement) {
      const rect = target.getBoundingClientRect();
      dragState.before = event.clientY < rect.top + rect.height / 2;
      target.classList.add(dragState.before ? 'dev-before' : 'dev-after');
      dragState.target = target;
    } else {
      dragState.target = null;
    }
    autoScrollSections(event.clientY);
  }

  function clearDragMarks(except) {
    document.querySelectorAll('.project-detail.dev-before, .project-detail.dev-after').forEach(section => {
      if (section !== except) section.classList.remove('dev-before', 'dev-after');
    });
  }

  function autoScrollSections(y) {
    const edge = 90;
    if (y < edge) dragScrollDir = -1;
    else if (y > window.innerHeight - edge) dragScrollDir = 1;
    else dragScrollDir = 0;
    if (dragScrollDir && !dragRaf) dragRaf = requestAnimationFrame(scrollStepSections);
  }

  function scrollStepSections() {
    dragRaf = 0;
    if (!dragState || !dragScrollDir) return;
    window.scrollBy(0, dragScrollDir * 14);
    dragRaf = requestAnimationFrame(scrollStepSections);
  }

  function endSectionDrag() {
    const drag = dragState;
    dragState = null;
    dragScrollDir = 0;
    if (dragRaf) {
      cancelAnimationFrame(dragRaf);
      dragRaf = 0;
    }
    document.removeEventListener('pointermove', onSectionDragMove);
    document.removeEventListener('pointerup', endSectionDrag);
    document.removeEventListener('pointercancel', endSectionDrag);
    if (!drag) return;
    drag.section.classList.remove('dev-dragging');
    clearDragMarks();
    if (drag.target) {
      drag.section.parentElement.insertBefore(drag.section, drag.before ? drag.target : drag.target.nextSibling);
      const collapse = drag.section.closest('.multi-collapse');
      const project = projectOfSection(drag.section);
      if (project && collapse) {
        const nextOrder = sectionsOf(collapse).map(section => section.dataset.section);
        const prevOrder = Array.isArray(project['section-order']) ? project['section-order'].join(',') : '';
        if (nextOrder.join(',') !== prevOrder) {
          pushHistory();
          project['section-order'] = nextOrder;
          setDirty(true);
        }
      }
    }
  }

  function cancelSectionDrag() {
    if (!dragState) return;
    dragState = null;
    dragScrollDir = 0;
    if (dragRaf) {
      cancelAnimationFrame(dragRaf);
      dragRaf = 0;
    }
    document.removeEventListener('pointermove', onSectionDragMove);
    document.removeEventListener('pointerup', endSectionDrag);
    document.removeEventListener('pointercancel', endSectionDrag);
    document.querySelectorAll('.project-detail.dev-dragging, .project-detail.dev-before, .project-detail.dev-after')
      .forEach(section => section.classList.remove('dev-dragging', 'dev-before', 'dev-after'));
  }

  // Re-render without the card closing: the rebuilt markup comes back with the
  // collapse closed, so the open state is restored synchronously, before the
  // browser paints, and the scroll position is put back at once. Bootstrap's
  // animated collapse('show') was what made the card blink.
  function rerenderPreservingOpen() {
    const open = [...document.querySelectorAll('#projekte .multi-collapse.show')].map(collapse => collapse.id);
    const y = window.scrollY;
    render();
    open.forEach(id => {
      const collapse = document.getElementById(id);
      if (!collapse) return;
      collapse.classList.add('show');
      document.querySelectorAll('#projekte [data-toggle="collapse"][href="#' + id + '"]').forEach(trigger => {
        trigger.classList.remove('collapsed');
        trigger.setAttribute('aria-expanded', 'true');
      });
    });
    window.scrollTo({ top: y, behavior: 'instant' });
  }

  function mediaField(item) {
    if (typeof item === 'string') return { field: null, kind: 'Image' };
    if (!item) return null;
    if (item.text) return { field: 'text', kind: 'Text' };
    if (item.icon) return { field: null, kind: 'Icon' };
    if (item.video) return { field: 'video', kind: 'Video' };
    if (item.embed) return { field: 'embed', kind: 'Embed' };
    if (item.link) return { field: 'link', kind: 'Link' };
    if (item.src) return { field: 'src', kind: 'Image' };
    return null;
  }

  // A raw image is an anchor inside a section's -text HTML. Its move unit is
  // the anchor plus the caption div that follows it, so a move can never
  // separate an image from its caption.
  function rawImageUnits(text) {
    if (typeof text !== 'string') return [];
    const units = [];
    const re = /<a\b[^>]*href="([^"]+\.(?:png|jpe?g|webp|gif|svg)(?:\?[^"]*)?)"[^>]*>[\s\S]*?<\/a>/gi;
    let match;
    while ((match = re.exec(text))) {
      const start = match.index;
      let end = start + match[0].length;
      const desc = text.slice(end).match(/^\s*<div class="glightbox-desc[^"]*"[^>]*>[\s\S]*?<\/div>/);
      if (desc) end += desc[0].length;
      units.push({ href: match[1], start, end });
    }
    return units;
  }

  function projectSectionList(project, excludeKey) {
    const order = Array.isArray(project['section-order']) ? project['section-order'] : sectionOrder;
    return order.filter(key => key !== excludeKey).map(key => ({
      key,
      title: project[key + '-title'] || sectionTitles[key] || key
    }));
  }

  function mediaItemLabel(item, index) {
    let text = '';
    if (typeof item === 'string') text = item.split('/').pop();
    else if (item && item.icon) text = 'Icon ' + item.icon;
    else if (item && item.video) text = 'Video';
    else if (item && item.embed) text = 'Embed';
    else if (item && item.link) text = item.label || 'Link';
    else if (item && item.src) text = item.alt || item.src.split('/').pop();
    if (!text) text = 'Media';
    if (text.length > 30) text = text.slice(0, 29) + '…';
    return '#' + (index + 1) + ' · ' + text;
  }

  function markRawImageEditable(anchor) {
    if (!anchor || anchor.dataset.rawBound === '1') return;
    if (anchor.closest('[data-media-key]')) return;
    const img = anchor.querySelector('img');
    const href = anchor.getAttribute('href') || '';
    if (!img || !/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(href)) return;
    const section = anchor.closest('.project-detail');
    const collapse = anchor.closest('.multi-collapse');
    if (!section || !collapse) return;
    const project = projectsData.find(p => p.id === collapse.id.replace('thumbCollapse-', ''));
    const key = section.dataset.section;
    if (!project || !key) return;
    anchor.dataset.rawBound = '1';
    anchor.addEventListener('click', event => {
      if (!state.open) return;
      event.preventDefault();
      event.stopPropagation();
      openRawImageSub(project, key, href, img.getAttribute('alt') || '');
    }, true);
  }

  function openRawImageSub(project, key, href, alt) {
    mediaTarget = { raw: true, project, key, href, alt, item: null, kind: 'Image', current: '' };
    openSub('media');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function saveRawImageAlt(target, alt) {
    const text = target.project[target.key + '-text'];
    if (typeof text !== 'string') return false;
    const escaped = target.href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const anchorRe = new RegExp('(<a\\b[^>]*href="' + escaped + '"[^>]*>)([\\s\\S]*?)(<\\/a>)', 'i');
    const imgRe = /<img\b[^>]*>/i;
    let changed = false;
    const next = text.replace(anchorRe, (match, open, inner, close) => {
      const imgTag = inner.match(imgRe);
      if (!imgTag) return match;
      const attr = 'alt="' + escapeHtml(alt) + '"';
      const tag = /\balt="[^"]*"/i.test(imgTag[0])
        ? imgTag[0].replace(/\balt="[^"]*"/i, attr)
        : imgTag[0].replace(/\s*\/?>$/, matchEnd => ' ' + attr + matchEnd);
      if (tag === imgTag[0]) return match;
      changed = true;
      return open + inner.replace(imgRe, tag) + close;
    });
    if (!changed) return false;
    pushHistory();
    target.project[target.key + '-text'] = next;
    setDirty(true);
    return true;
  }

  function markMediaEditable(el) {
    if (el.dataset.mediaBound === '1') return;
    if (el.dataset.mediaTitle === undefined) el.dataset.mediaTitle = el.getAttribute('title') || '';
    el.dataset.mediaBound = '1';
    el.title = 'Click to edit the image text (dev)';
    // Resolved at click time, never at bind time: the item keeps this element
    // when the media list is reordered, so a captured index would go stale.
    el.addEventListener('click', event => {
      if (!state.open) return;
      if (suppressMediaClick) {
        // The pointerup that ended a drag produces a click; it must neither
        // open the media sheet nor reach GLightbox.
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const project = projectsData.find(p => p.id === el.dataset.mediaProject);
      const key = el.dataset.mediaKey;
      const index = Number(el.dataset.mediaIndex);
      const list = project && key ? project[key + '-media'] : null;
      if (!Array.isArray(list)) return;
      const item = list[index];
      const meta = mediaField(item);
      if (!meta || meta.kind !== 'Image') return;
      event.preventDefault();
      event.stopPropagation();
      openMediaSub(project, key, index, item, meta.field, meta.kind);
    }, true);
  }

  function clearEditing() {
    hideTextToolbar();
    removeSectionHandles();
    dismissAllMediaUndo();
    if (mediaObservers.length) {
      mediaObservers.forEach(observer => observer.disconnect());
      mediaObservers = [];
    }
    document.querySelectorAll('.dev-media-overlay').forEach(el => el.remove());
    document.querySelectorAll('#projekte .project-detail').forEach(section => { delete section._mediaOverlay; });
    document.querySelectorAll('#projekte .dev-add-media-row').forEach(el => el.remove());
    document.querySelectorAll('#projekte .dev-insert-point').forEach(el => el.remove());
    document.querySelectorAll('#projekte .dev-block-remove').forEach(el => el.remove());
    document.querySelectorAll('#projekte .dev-add-section-row').forEach(el => el.remove());
    document.querySelectorAll('#projekte [contenteditable="true"]').forEach(el => el.removeAttribute('contenteditable'));
    document.querySelectorAll('#kontakt [contenteditable="true"]').forEach(el => el.removeAttribute('contenteditable'));
    document.querySelectorAll('#projekte [data-history-pushed]').forEach(el => { delete el.dataset.historyPushed; });
    document.querySelectorAll('#projekte [data-media-key]').forEach(el => {
      if (el.dataset.mediaTitle) el.setAttribute('title', el.dataset.mediaTitle);
      else el.removeAttribute('title');
    });
  }

  // ---------- presets ----------
  function openList(on) {
    if (!list) return;
    if (on) renderList();
    list.hidden = !on;
  }

  function renderList() {
    if (!list) return;
    hidePresetPreview();
    const presets = readPresets();
    const items = presets.filter(p => !state.filter || p.name.toLowerCase().includes(state.filter));
    list.innerHTML = items.length ? '' : '<div class="dev-preset-empty">No presets</div>';
    items.forEach(preset => {
      const row = document.createElement('div');
      row.className = 'dev-preset-row' + (preset.name === state.selected ? ' is-current' : '');
      const name = document.createElement('button');
      name.type = 'button';
      name.className = 'dev-preset-name';
      const label = document.createElement('span');
      label.className = 'dev-preset-name-text';
      label.textContent = preset.name;
      const time = document.createElement('span');
      time.className = 'dev-preset-time';
      time.textContent = formatPresetTime(preset.savedAt);
      name.appendChild(label);
      name.appendChild(time);
      name.addEventListener('click', () => loadPreset(preset.name));
      row.addEventListener('mouseenter', () => showPresetPreview(preset, row));
      row.addEventListener('mouseleave', hidePresetPreview);
      name.addEventListener('focus', () => showPresetPreview(preset, row));
      name.addEventListener('blur', hidePresetPreview);
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'dev-preset-delete';
      del.innerHTML = CROSS_SVG;
      del.title = 'Delete preset';
      del.setAttribute('aria-label', 'Delete preset ' + preset.name);
      del.addEventListener('click', event => { event.stopPropagation(); deletePreset(preset.name); });
      row.appendChild(name);
      row.appendChild(del);
      list.appendChild(row);
    });
  }

  function formatPresetTime(value) {
    const date = new Date(value);
    if (!value || Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function ensurePresetPreview() {
    if (presetPreview) return presetPreview;
    presetPreview = document.createElement('div');
    presetPreview.id = 'devPresetPreview';
    presetPreview.className = 'dev-preset-preview';
    presetPreview.hidden = true;
    document.body.appendChild(presetPreview);
    return presetPreview;
  }

  function presetPreviewHtml(preset) {
    const data = Array.isArray(preset.data) ? preset.data : [];
    const current = Array.isArray(projectsData) ? projectsData : [];
    let sections = 0;
    let media = 0;
    const rows = data.map(project => {
      const order = Array.isArray(project['section-order']) ? project['section-order'] : [];
      sections += order.length;
      Object.keys(project).forEach(key => {
        if (key.endsWith('-media') && Array.isArray(project[key])) media += project[key].length;
      });
      const now = current.find(entry => entry.id === project.id);
      let state = 'new card';
      let strength = 'is-new';
      if (now) {
        let changed = 0;
        const keys = new Set(Object.keys(project).concat(Object.keys(now)));
        keys.forEach(key => {
          if (JSON.stringify(project[key]) !== JSON.stringify(now[key])) changed += 1;
        });
        state = changed ? changed + (changed === 1 ? ' changed field' : ' changed fields') : 'identical to current';
        strength = changed ? 'is-changed' : 'is-same';
      }
      return '<li class="' + strength + '"><span class="dev-preset-preview-title">' + esc(project.title || project.id || 'Untitled') + '</span>' +
        '<span class="dev-preset-preview-meta">' + order.length + ' sections · ' + state + '</span></li>';
    }).join('');
    return '<div class="dev-preset-preview-head">' + esc(preset.name) + '</div>' +
      '<div class="dev-preset-preview-time">' + esc(formatPresetTime(preset.savedAt) || 'Unknown time') + '</div>' +
      '<div class="dev-preset-preview-totals">' + data.length + ' cards · ' + sections + ' sections · ' + media + ' media items</div>' +
      '<ul class="dev-preset-preview-list">' + rows + '</ul>';
  }

  function showPresetPreview(preset, anchor) {
    if (state.sub !== 'presets') return;
    const el = ensurePresetPreview();
    el.innerHTML = presetPreviewHtml(preset);
    el.hidden = false;
    placePresetPreview(anchor);
  }

  function placePresetPreview(anchor) {
    if (!presetPreview || presetPreview.hidden) return;
    const sheet = document.getElementById('devSubBar');
    const rect = anchor.getBoundingClientRect();
    const sheetRect = sheet ? sheet.getBoundingClientRect() : rect;
    const width = presetPreview.offsetWidth;
    const height = presetPreview.offsetHeight;
    let left = sheetRect.left - width - 12;
    if (left < 8) left = Math.min(sheetRect.right + 12, window.innerWidth - width - 8);
    const top = Math.max(8, Math.min(rect.top, window.innerHeight - height - 8));
    presetPreview.style.left = left + 'px';
    presetPreview.style.top = top + 'px';
  }

  function hidePresetPreview() {
    if (presetPreview) presetPreview.hidden = true;
  }

  function setSelected(name) {
    state.selected = name;
    try {
      if (name) localStorage.setItem(CURRENT, name);
      else localStorage.removeItem(CURRENT);
    } catch (e) {}
    const current = document.getElementById('devPresetCurrent');
    if (current) current.textContent = name || 'None';
    const sheetCurrent = document.getElementById('devSheetCurrent');
    if (sheetCurrent) sheetCurrent.textContent = name || 'None';
    if (input && input.isConnected) input.value = '';
    state.filter = '';
    renderList();
    updateButtons();
  }

  function updateButtons() {
    if (!toolbar) return;
    const roots = [toolbar, actionBar].filter(Boolean);
    roots.forEach(root => {
      root.querySelectorAll('[data-act="new"]').forEach(button => {
        button.disabled = !autoSessionActive;
        button.title = autoSessionActive
          ? 'Create a new working preset from the session’s original state'
          : 'Available after the first edit';
      });
      root.querySelectorAll('[data-act="undo"]').forEach(button => { button.disabled = history.length === 0; });
      root.querySelectorAll('[data-act="redo"]').forEach(button => { button.disabled = redoStack.length === 0; });
      root.querySelectorAll('[data-act="revert"]').forEach(button => { button.disabled = !state.dirty || !baseline; });
    });
  }

  function newPreset() {
    if (!state.open || !autoSessionActive || !autoSessionName) return;
    flushPresetAutosave();
    const original = autoSessionOriginal ? JSON.parse(JSON.stringify(autoSessionOriginal)) : snapshot();
    const nextName = nextPresetName();
    writePresetEntry(nextName, original);
    autoSessionName = nextName;
    autoSessionActive = true;
    setSelected(nextName);
    applyData(original);
    rerenderPreservingOpen();
    setBaseline(projectsData);
    setDirty(false);
    closeSub();
    openList(false);
    updateButtons();
  }

  function savePresetWithName(name) {
    writePresetEntry(name, snapshot());
    setSelected(name);
    openList(false);
    setBaseline(projectsData);
    setDirty(false);
    closeSub();
  }

  function loadPreset(name, force) {
    if (!name) return;
    const entry = readPresets().find(p => p.name === name);
    if (!entry) return;
    if (state.dirty && !force) {
      confirmSub('Discard unsaved changes?', 'Discard', () => loadPreset(name, true));
      return;
    }
    closeSub();
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    applyData(JSON.parse(JSON.stringify(entry.data)));
    setSelected(name);
    openList(false);
    render();
    setBaseline(projectsData);
    setDirty(false);
    resetAutoSession(false);
  }

  function deletePreset(name, force) {
    if (!force) {
      confirmSub('Delete preset "' + name + '"?', 'Delete', () => deletePreset(name, true));
      return;
    }
    writePresets(readPresets().filter(p => p.name !== name));
    if (state.selected === name) {
      if (autoSessionName === name) resetAutoSession(false);
      setSelected(null);
      setDirty(true);
    } else {
      renderList();
    }
  }

  // ---------- sub toolbar ----------
  function ensureSubBar() {
    if (!subBar) {
      subBar = document.createElement('div');
      subBar.id = 'devSubBar';
      subBar.setAttribute('aria-label', 'Dev sub panel');
      // Inside the popover, below the main row, instead of a second sheet.
      toolbar.appendChild(subBar);
    }
    if (!subBarHandle) {
      subBarHandle = document.createElement('button');
      subBarHandle.type = 'button';
      subBarHandle.id = 'devSubBarHandle';
      subBarHandle.className = 'dev-subbar-handle';
      subBarHandle.setAttribute('aria-controls', 'devSubBar');
      subBarHandle.hidden = true;
      subBarHandle.innerHTML = '<i class="fas fa-chevron-down" aria-hidden="true"></i>';
      subBarHandle.addEventListener('click', toggleSubBarCollapsed);
      document.body.appendChild(subBarHandle);
    }
    return subBar;
  }

  function updateSubBarHandle() {
    if (!subBarHandle) return;
    const open = !!subBar && subBar.classList.contains('is-open');
    subBarHandle.hidden = !open;
    if (!open) return;
    const collapsed = subBar.classList.contains('is-collapsed');
    subBarHandle.classList.toggle('is-collapsed', collapsed);
    subBarHandle.setAttribute('aria-expanded', String(!collapsed));
    subBarHandle.setAttribute('aria-label', collapsed ? 'Expand dev panel' : 'Collapse dev panel');
    subBarHandle.title = collapsed ? 'Expand dev panel' : 'Collapse dev panel';
  }

  function toggleSubBarCollapsed() {
    if (!subBar || !subBar.classList.contains('is-open')) return;
    subBar.classList.toggle('is-collapsed');
    updateSubBarHandle();
  }

  function updateBarHeight() {
    if (!toolbar) return;
    if (state.open) placePopover();
  }

  // Positions the control stack. A dragged card keeps its stored corner; an
  // untouched one opens above the Edit button, right edges aligned, with the
  // action card docked between it and the button.
  function placePopover() {
    const anchor = document.getElementById('devPresetToggle');
    const popover = toolbar;
    if (!popover) return;
    const width = popover.offsetWidth || 340;
    const height = popover.offsetHeight || 200;
    const stack = actionBar && actionBar.classList.contains('is-open') ? actionBar.offsetHeight + 8 : 0;
    const stored = readBarPos();
    if (stored) {
      popover.dataset.anchored = '0';
      const maxTop = Math.max(8, window.innerHeight - height - stack - 16);
      popover.style.left = Math.min(Math.max(8, stored.x), window.innerWidth - width - 8) + 'px';
      popover.style.top = Math.min(Math.max(8, stored.y), maxTop) + 'px';
      placeActionBar();
      return;
    }
    if (!anchor) return;
    popover.dataset.anchored = '1';
    const box = anchor.getBoundingClientRect();
    const left = Math.min(Math.max(8, box.right - width), window.innerWidth - width - 8);
    const stackHeight = height + stack;
    let top;
    if (box.top - stackHeight - 12 >= 8) top = box.top - stackHeight - 12;
    else if (box.bottom + 12 + stackHeight <= window.innerHeight - 8) top = box.bottom + 12;
    else top = Math.max(8, window.innerHeight - stackHeight - 16);
    popover.dataset.side = top < box.top ? 'above' : 'below';
    popover.style.left = left + 'px';
    popover.style.top = top + 'px';
    placeActionBar();
  }

  function openSub(mode) {
    ensureSubBar();
    openList(false);
    if (mode !== 'presets') {
      input = null;
      list = null;
    }
    state.sub = mode;
    subBar.classList.toggle('is-card', mode === 'card');
    if (mode === 'card') buildCardSub();
    else if (mode === 'media') buildMediaSub();
    else if (mode === 'move') buildMoveSub();
    else if (mode === 'link') buildLinkSub();
    else if (mode === 'section') buildSectionSub();
    else if (mode === 'blocks') buildBlocksSub();
    else if (mode === 'node') buildNodeSub();
    else if (mode === 'presets') buildPresetSheet();
    else if (mode === 'preset') buildPresetSub();
    else if (mode === 'help') buildHelpSub();
    subBar.classList.add('is-open');
    subBar.classList.remove('is-collapsed');
    toolbar.dataset.sheet = mode;
    prependSheetBar(mode);
    renderActionCard();
    updateSubBarHandle();
    updateBarHeight();
  }

  function prependSheetBar(mode) {
    const bar = document.createElement('div');
    bar.className = 'dev-cc-sheetbar';
    bar.innerHTML = '<button type="button" class="dev-cc-back" data-act="sub-close" aria-label="Back to controls">' + CC_BACK + '</button>' +
      '<span class="dev-cc-sheet-title">' + esc(SHEET_TITLES[mode] || 'Editing') + '</span>';
    subBar.prepend(bar);
  }

  function closeSub() {
    hidePresetPreview();
    if (previewObserver) {
      previewObserver.disconnect();
      previewObserver = null;
    }
    state.sub = null;
    mediaTarget = null;
    sectionTarget = null;
    blockTarget = null;
    confirmAction = null;
    if (subBar) {
      subBar.classList.remove('is-open', 'is-card', 'is-collapsed');
      subBar.innerHTML = '';
    }
    if (toolbar) delete toolbar.dataset.sheet;
    input = null;
    list = null;
    renderActionCard();
    updateSubBarHandle();
    updateBarHeight();
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

  function buildPresetSheet() {
    subBar.innerHTML = `
      <div class="dev-sub-head">Current: <strong id="devSheetCurrent">${esc(state.selected || 'None')}</strong></div>
      <div class="dev-preset-picker">
        <input type="search" class="dev-preset-search" id="devPresetSearch" placeholder="Search presets" autocomplete="off" aria-label="Search presets">
        <div class="dev-preset-list" id="devPresetList"></div>
      </div>
      <div class="dev-data-write">
        <button type="button" class="dev-preset-button" data-act="write-data">Write projects-data.js</button>
        <p class="dev-data-status" id="devDataStatus" role="status"></p>
      </div>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button" data-act="new">New</button>
      </div>`;
    input = subBar.querySelector('#devPresetSearch');
    list = subBar.querySelector('#devPresetList');
    input.value = '';
    state.filter = '';
    renderList();
    list.hidden = false;
    input.addEventListener('input', () => {
      state.filter = input.value.trim().toLowerCase();
      renderList();
    });
    subBar.querySelector('[data-act="write-data"]').addEventListener('click', confirmWriteData);
    updateButtons();
    setTimeout(() => {
      if (input && input.isConnected) input.focus();
    }, 0);
  }

  function confirmWriteData() {
    confirmSub('Overwrite lib/js/projects-data.js with the current data? The file is replaced; review git diff before committing.', 'Write file', writeDataFile);
  }

  async function writeDataFile() {
    let message;
    try {
      const response = await fetch('/__dev/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-upload': '1' },
        body: JSON.stringify(projectsData)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || ('HTTP ' + response.status));
      message = 'Written: ' + result.path + ' (' + result.projects + ' projects). Review git diff, then commit.';
    } catch (error) {
      message = 'Could not write: ' + error.message + '. Start the dev server with node tools/dev-server.mjs, then try again.';
    }
    if (!state.open) return;
    openSub('presets');
    const status = document.getElementById('devDataStatus');
    if (status) status.textContent = message;
  }

  function buildPresetSub() {
    let overwrite = false;
    subBar.innerHTML = `
      <div class="dev-sub-head">New preset</div>
      <div class="dev-sub-row">
        <label class="dev-sub-label">Name<input class="dev-sub-input" id="devPresetName" value="" placeholder="Preset name" autocomplete="off"></label>
      </div>
      <div class="dev-sub-error" id="devPresetError" role="alert"></div>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button dev-primary" data-act="save-preset">Save preset</button>
        <button type="button" class="dev-preset-button" data-act="sub-close">Cancel</button>
      </div>`;
    const nameInput = subBar.querySelector('#devPresetName');
    const error = subBar.querySelector('#devPresetError');
    const saveBtn = subBar.querySelector('[data-act="save-preset"]');
    nameInput.addEventListener('input', () => {
      overwrite = false;
      saveBtn.textContent = 'Save preset';
      error.textContent = '';
    });
    const attempt = () => {
      const name = nameInput.value.trim();
      if (!name) {
        error.textContent = 'Enter a preset name.';
        nameInput.focus();
        return;
      }
      if (readPresets().some(preset => preset.name === name) && !overwrite) {
        overwrite = true;
        saveBtn.textContent = 'Overwrite preset';
        error.textContent = 'A preset with this name already exists. Save again to overwrite it.';
        return;
      }
      savePresetWithName(name);
    };
    saveBtn.addEventListener('click', attempt);
    nameInput.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      attempt();
    });
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
    nameInput.focus();
    nameInput.select();
  }

  function confirmSub(message, label, action) {
    ensureSubBar();
    openList(false);
    state.sub = 'confirm';
    confirmAction = action;
    subBar.innerHTML = `
      <div class="dev-sub-head">Confirm</div>
      <p class="dev-sub-message">${esc(message)}</p>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button dev-danger" data-act="confirm">${esc(label)}</button>
        <button type="button" class="dev-preset-button" data-act="sub-close">Cancel</button>
      </div>`;
    subBar.querySelector('[data-act="confirm"]').addEventListener('click', () => {
      const actionToRun = confirmAction;
      closeSub();
      if (actionToRun) actionToRun();
    });
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
    subBar.querySelector('[data-act="confirm"]').focus();
    subBar.classList.add('is-open');
    subBar.classList.remove('is-collapsed');
    toolbar.dataset.sheet = 'confirm';
    prependSheetBar('confirm');
    renderActionCard();
    updateSubBarHandle();
    updateBarHeight();
  }

  const THUMB_MAX_WIDTH = 360;
  const THUMB_MAX_HEIGHT = 460;

  function readThumbFile(file, done) {
    if (!file || !/^image\/(png|jpeg|webp)$/.test(file.type)) {
      done(null, 'Choose a PNG, JPG or WebP image.');
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const sourceWidth = image.naturalWidth;
      const sourceHeight = image.naturalHeight;
      if (!sourceWidth || !sourceHeight) {
        URL.revokeObjectURL(url);
        done(null, 'This image could not be read. Try a PNG or JPG.');
        return;
      }
      const scale = Math.min(1, THUMB_MAX_WIDTH / sourceWidth, THUMB_MAX_HEIGHT / sourceHeight);
      const width = Math.max(1, Math.round(sourceWidth * scale));
      const height = Math.max(1, Math.round(sourceHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      const outputType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url);
        if (!blob) {
          done(null, 'This image could not be read. Try a PNG or JPG.');
          return;
        }
        fetch('/__dev/thumbnail', {
          method: 'POST',
          headers: { 'Content-Type': blob.type, 'X-File-Name': encodeURIComponent(file.name), 'X-Dev-Upload': '1' },
          body: blob
        })
          .then(response => {
            if (!response.ok) throw new Error('upload failed');
            return response.json();
          })
          .then(payload => {
            if (!payload || !payload.path) throw new Error('missing path');
            done({ path: payload.path, width, height, name: payload.path.split('/').pop() }, '');
          })
          .catch(() => {
            done(null, 'Thumbnail upload failed. Start the dev server with "node tools/dev-server.mjs" and reload.');
          });
      }, outputType, 0.9);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      done(null, 'This image could not be read. Try a PNG or JPG.');
    };
    image.src = url;
  }

  function uploadMediaFile(file, done) {
    if (!file || !/^image\/(png|jpeg|webp)$/.test(file.type)) {
      done(null, 'Choose a PNG, JPG or WebP image.');
      return;
    }
    fetch('/__dev/media', {
      method: 'POST',
      headers: { 'Content-Type': file.type, 'X-File-Name': encodeURIComponent(file.name), 'X-Dev-Upload': '1' },
      body: file
    })
      .then(response => {
        if (!response.ok) throw new Error('upload failed');
        return response.json();
      })
      .then(payload => {
        if (!payload || !payload.path) throw new Error('missing path');
        done(payload.path, '');
      })
      .catch(() => {
        done(null, 'Image upload failed. Start the dev server with "node tools/dev-server.mjs" and reload.');
      });
  }

  function buildCardSub() {
    cardTemplate = '__blank__';
    let pickedThumb = '';
    let thumbInfo = null;
    const options = [{ value: '__blank__', title: 'Blank card' }]
      .concat(projectsData.map(project => ({ value: project.id, title: project.title })));
    subBar.innerHTML = `
      <div class="dev-card-form">
        <div class="dev-card-preview-wrap">
          <div class="dev-card-preview-heading">
            <span class="dev-card-preview-kicker">Template</span>
            <span class="dev-card-preview-label" id="devPreviewName" aria-live="polite">Blank card</span>
          </div>
          <div class="dev-card-preview-stage">
            <button type="button" class="dev-card-nav" data-act="preview-prev" aria-label="Previous template">‹</button>
            <div class="dev-card-preview" id="devCardPreview"></div>
            <button type="button" class="dev-card-nav" data-act="preview-next" aria-label="Next template">›</button>
          </div>
          <div class="dev-card-preview-foot">
            <span id="devThumbMeta">Drag an image onto the thumbnail or choose one · recommended 180 × 230px</span>
            <button type="button" class="dev-text-button" data-act="clear-thumb" hidden>Remove</button>
          </div>
          <input type="file" class="dev-thumb-input" accept="image/png,image/jpeg,image/webp" hidden>
        </div>
        <div class="dev-card-fields">
          <div class="dev-sub-fields">
            <label class="dev-sub-label">ID<input class="dev-sub-input" id="devCardId" placeholder="e.g. smart-search-bar" autocomplete="off"></label>
            <label class="dev-sub-label">Title<input class="dev-sub-input" id="devCardTitle" placeholder="e.g. Smart Search Bar" autocomplete="off"></label>
          </div>
          <details class="dev-card-extra">
            <summary>Description &amp; tags</summary>
            <div class="dev-sub-fields">
              <label class="dev-sub-label">Card description<textarea class="dev-sub-input dev-sub-textarea" id="devCardDesc" rows="2" placeholder="e.g. Intelligent search with autocomplete for the VEDA Horizon platform" autocomplete="off"></textarea></label>
              <div class="dev-sub-label dev-tag-field">
                <span>Tags</span>
                <div class="dev-tag-editor" id="devCardTagEditor">
                  <span class="dev-tag-list" id="devCardTagList"></span>
                  <input class="dev-tag-input" id="devCardTagInput" placeholder="Type a tag, Enter adds it" autocomplete="off" aria-label="Add a tag">
                </div>
              </div>
            </div>
          </details>
          <div class="dev-sub-error" id="devCardError" role="alert"></div>
          <div class="dev-sub-actions">
            <button type="button" class="dev-preset-button dev-primary" data-act="create">Create card</button>
            <button type="button" class="dev-preset-button" data-act="sub-close">Cancel</button>
          </div>
        </div>
      </div>`;
    const idInput = subBar.querySelector('#devCardId');
    const titleInput = subBar.querySelector('#devCardTitle');
    const descInput = subBar.querySelector('#devCardDesc');
    const tagList = subBar.querySelector('#devCardTagList');
    const tagInput = subBar.querySelector('#devCardTagInput');
    let pickedTags = [];
    const error = subBar.querySelector('#devCardError');
    const preview = subBar.querySelector('#devCardPreview');
    const previewName = subBar.querySelector('#devPreviewName');
    const thumbMeta = subBar.querySelector('#devThumbMeta');
    const clearThumbButton = subBar.querySelector('[data-act="clear-thumb"]');
    const thumbFileInput = subBar.querySelector('.dev-thumb-input');
    const pickControl = mode => `<button type="button" class="dev-thumb-pick-chip" data-thumb-pick aria-label="${mode === 'replace' ? 'Replace thumbnail image' : 'Choose thumbnail image'}">${mode === 'replace' ? 'Replace' : 'Choose image'}</button>`;
    const fitPreviewCard = () => {
      const scaler = preview.querySelector('.dev-card-preview-scaler');
      if (!scaler) return;
      const width = preview.clientWidth;
      const height = preview.clientHeight;
      const baseWidth = scaler.offsetWidth;
      const baseHeight = scaler.offsetHeight;
      if (!width || !height || !baseWidth || !baseHeight) return;
      const scale = Math.min(width / baseWidth, height / baseHeight);
      const x = (width - baseWidth * scale) / 2;
      const y = (height - baseHeight * scale) / 2;
      scaler.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
    };
    const currentTemplate = () => cardTemplate === '__blank__' ? null : projectsData.find(project => project.id === cardTemplate);
    const renderPreview = () => {
      const template = currentTemplate();
      const thumbSource = pickedThumb || (template && template.thumbnail) || '';
      const thumbClass = pickedThumb ? 'thumbnail-custom' : ((template && template['thumbnail-class']) || 'thumbnail-custom');
      const hasThumb = !!pickedThumb || !!(template && (template.thumbnail || template['thumbnail-class']));
      const pick = hasThumb ? pickControl('replace') : pickControl('choose');
      const typedTitle = titleInput.value.trim();
      const title = typedTitle || (idInput.value.trim() ? prettify(idInput.value.trim()) : (template ? template.title : 'New card'));
      const desc = descInput.value.trim() || (template
        ? (template['short-desc-desktop'] || template['short-desc-mobile'] || 'Card description')
        : (titleInput.value.trim() || 'Card description'));
      const tags = pickedTags.length
        ? pickedTags.slice()
        : (template && Array.isArray(template.tags) && template.tags.length ? template.tags.slice() : ['Neu']);
      const cardProject = {
        id: template ? template.id : 'dev-card-preview',
        title: title,
        'thumbnail-class': thumbClass,
        thumbnail: thumbSource,
        'short-desc-mobile': desc,
        'short-desc-tablet': desc,
        'short-desc-desktop': desc,
        tags: tags
      };
      const cardHtml = typeof window.buildCardFrontHtml === 'function' ? window.buildCardFrontHtml(cardProject) : '';
      preview.innerHTML = `<div class="dev-card-preview-scaler">${cardHtml}</div>`;
      const thumbSlot = preview.querySelector('.dev-card-preview-scaler [class*="thumbnail-"]');
      if (thumbSlot && pick) {
        thumbSlot.classList.add('dev-thumb-slot');
        thumbSlot.insertAdjacentHTML('beforeend', pick);
      }
      fitPreviewCard();
    };
    const updateThumbMeta = () => {
      clearThumbButton.hidden = !pickedThumb;
      thumbMeta.classList.remove('is-error');
      thumbMeta.textContent = pickedThumb
        ? `${thumbInfo.path} · ${thumbInfo.width} × ${thumbInfo.height}px`
        : 'Drag an image onto the thumbnail or choose one · recommended 180 × 230px';
    };
    const applyThumbFile = file => {
      readThumbFile(file, (result, message) => {
        if (!result) {
          thumbMeta.textContent = message;
          thumbMeta.classList.add('is-error');
          return;
        }
        pickedThumb = result.path;
        thumbInfo = result;
        error.textContent = '';
        updateThumbMeta();
        renderPreview();
      });
    };
    const renderTags = () => {
      tagList.innerHTML = '';
      pickedTags.forEach((tag, index) => {
        const chip = document.createElement('span');
        chip.className = 'dev-tag';
        chip.textContent = tag;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'dev-tag-remove';
        remove.innerHTML = CROSS_SVG;
        remove.setAttribute('aria-label', 'Remove tag ' + tag);
        remove.addEventListener('click', () => {
          pickedTags.splice(index, 1);
          renderTags();
          renderPreview();
        });
        chip.appendChild(remove);
        tagList.appendChild(chip);
      });
    };
    const addTag = () => {
      const value = tagInput.value.replace(/^,+|,+$/g, '').trim();
      if (!value) return;
      if (!pickedTags.some(tag => tag.toLowerCase() === value.toLowerCase())) pickedTags.push(value);
      tagInput.value = '';
      renderTags();
      renderPreview();
    };
    tagInput.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        addTag();
        return;
      }
      if (event.key === 'Backspace' && !tagInput.value && pickedTags.length) {
        event.preventDefault();
        pickedTags.pop();
        renderTags();
        renderPreview();
      }
    });
    tagInput.addEventListener('blur', addTag);
    tagInput.addEventListener('input', () => { error.textContent = ''; });
    const revealTemplateCard = id => {
      const cluster = document.getElementById('thumbCluster-' + id);
      const collapse = document.getElementById('thumbCollapse-' + id);
      if (!cluster) return;
      cluster.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (collapse && typeof $ !== 'undefined' && $.fn.collapse) {
        $(collapse).collapse('show');
      }
    };
    const cycle = delta => {
      const index = options.findIndex(option => option.value === cardTemplate);
      cardTemplate = options[(index + delta + options.length) % options.length].value;
      const option = options.find(entry => entry.value === cardTemplate) || options[0];
      previewName.textContent = option.title;
      updateThumbMeta();
      renderPreview();
      if (cardTemplate !== '__blank__') revealTemplateCard(cardTemplate);
    };
    subBar.querySelector('[data-act="preview-prev"]').addEventListener('click', () => cycle(-1));
    subBar.querySelector('[data-act="preview-next"]').addEventListener('click', () => cycle(1));
    preview.addEventListener('click', event => {
      event.preventDefault();
      if (event.target.closest('[data-thumb-pick]')) thumbFileInput.click();
    });
    thumbFileInput.addEventListener('change', () => {
      if (thumbFileInput.files && thumbFileInput.files[0]) applyThumbFile(thumbFileInput.files[0]);
      thumbFileInput.value = '';
    });
    preview.addEventListener('dragover', event => {
      if (!event.dataTransfer || !Array.from(event.dataTransfer.types).includes('Files')) return;
      event.preventDefault();
      const slot = preview.querySelector('.dev-thumb-slot');
      if (slot) slot.classList.add('is-dragover');
    });
    preview.addEventListener('dragleave', event => {
      const slot = preview.querySelector('.dev-thumb-slot');
      if (slot && !slot.contains(event.relatedTarget)) slot.classList.remove('is-dragover');
    });
    preview.addEventListener('drop', event => {
      if (!event.dataTransfer || !event.dataTransfer.files.length) return;
      event.preventDefault();
      const slot = preview.querySelector('.dev-thumb-slot');
      if (slot) slot.classList.remove('is-dragover');
      applyThumbFile(event.dataTransfer.files[0]);
    });
    clearThumbButton.addEventListener('click', () => {
      pickedThumb = '';
      thumbInfo = null;
      error.textContent = '';
      updateThumbMeta();
      renderPreview();
    });
    [idInput, titleInput, descInput].forEach(field => {
      field.addEventListener('input', () => {
        error.textContent = '';
        renderPreview();
      });
    });
    subBar.querySelector('[data-act="create"]').addEventListener('click', () => {
      createCardFromForm(cardTemplate, idInput.value, titleInput.value, pickedThumb, descInput.value, pickedTags);
    });
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(closeButton => closeButton.addEventListener('click', closeSub));
    [idInput, titleInput].forEach(field => {
      field.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        createCardFromForm(cardTemplate, idInput.value, titleInput.value, pickedThumb, descInput.value, pickedTags);
      });
    });
    renderTags();
    updateThumbMeta();
    renderPreview();
    if (previewObserver) previewObserver.disconnect();
    previewObserver = new ResizeObserver(fitPreviewCard);
    previewObserver.observe(preview);
    idInput.focus();
  }

  function createCardFromForm(templateId, idValue, titleValue, thumbValue, descValue, tagsValue) {
    const error = subBar ? subBar.querySelector('#devCardError') : null;
    const id = String(idValue || '').trim();
    const title = String(titleValue || '').trim() || prettify(id);
    const thumb = String(thumbValue || '').trim();
    const desc = String(descValue || '').trim();
    const tags = Array.isArray(tagsValue) ? tagsValue.map(tag => String(tag).trim()).filter(Boolean) : [];
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
        'short-desc-mobile': desc || title,
        'short-desc-tablet': desc || title,
        'short-desc-desktop': desc || title,
        tags: tags.length ? tags : ['Neu'],
        // A new card starts on the content model with one empty paragraph, so
        // the editor opens on a block it can type into and grow from.
        content: [{ type: 'text', html: '<p><br></p>' }]
      };
    } else {
      const template = projectsData.find(project => project.id === templateId);
      if (!template) return fail('Template not found.');
      project = JSON.parse(JSON.stringify(template));
      project.id = id;
      project.title = title;
      if (window.convertProjectToContent) window.convertProjectToContent(project);
      if (desc) {
        project['short-desc-mobile'] = desc;
        project['short-desc-tablet'] = desc;
        project['short-desc-desktop'] = desc;
      }
      if (tags.length) project.tags = tags;
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
    const { project, key, index, item, pending, raw, isNew } = target;
    const isObject = item && typeof item === 'object';
    // A caption only reaches the page when the image opens in the lightbox.
    const captionApplies = !raw && (pending || typeof item === 'string' || (isObject && !item.href && item.lightbox !== false));
    const alt = raw ? target.alt || '' : (isObject ? item.alt || '' : '');
    const caption = isObject ? item.caption || '' : '';
    const units = raw ? rawImageUnits(project[key + '-text']) : [];
    const rawIndex = raw ? units.findIndex(unit => unit.href === target.href) : -1;
    const head = raw ? 'Edit image' : (isNew || pending) ? 'New image' : 'Edit image';
    const context = raw
      ? '<span id="devMediaContext">' + esc(key) + ' · text image' + (rawIndex >= 0 ? ' #' + (rawIndex + 1) : '') + '</span>'
      : pending ? esc(key) : '<span id="devMediaContext">' + esc(key) + ' #' + (index + 1) + '</span>';
    const canMove = !pending && (raw || (Array.isArray(project[key + '-media']) && !!project[key + '-media'][index]));
    const moveRow = canMove ? `
      <div class="dev-sub-row dev-media-move-row">
        <div class="dev-media-move-group">
          <span class="dev-media-move-label">Order</span>
          <div class="dev-media-order-buttons">
            <button type="button" class="dev-preset-button" data-act="media-up">Up</button>
            <button type="button" class="dev-preset-button" data-act="media-down">Down</button>
          </div>
        </div>
        <label class="dev-sub-label">Move to section
          <select class="dev-sub-input" id="devMediaSection">
            <option value="">Choose…</option>
            ${projectSectionList(project, key).map(section => `<option value="${esc(section.key)}">${esc(section.title)}</option>`).join('')}
          </select>
        </label>
        <label class="dev-sub-label">Position
          <select class="dev-sub-input" id="devMediaPosition" disabled></select>
        </label>
        <button type="button" class="dev-preset-button" data-act="media-move">Move</button>
      </div>` : '';
    subBar.innerHTML = `
      <div class="dev-sub-head">${head} — <strong>${esc(project.title)}</strong> · ${context}</div>
      ${isNew ? '<p class="dev-media-note">The image is already in this section. Alt text is required to save; Cancel keeps it without alt text.</p>' : ''}
      <div class="dev-sub-row">
        <label class="dev-sub-label">Alt text (required)
          <input class="dev-sub-input" id="devMediaAlt" value="${esc(alt)}" autocomplete="off" placeholder="Describe what the image shows.">
        </label>
        ${captionApplies ? `
        <label class="dev-sub-label">Caption (optional)
          <input class="dev-sub-input" id="devMediaCaption" value="${esc(caption)}" autocomplete="off" placeholder="Appears in the lightbox.">
        </label>` : ''}
      </div>${moveRow}
      <div class="dev-sub-error" id="devMediaError" role="alert"></div>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button dev-primary" data-act="save-media">Save</button>
        <button type="button" class="dev-preset-button" data-act="sub-close">Cancel</button>
      </div>`;
    const altInput = subBar.querySelector('#devMediaAlt');
    const error = subBar.querySelector('#devMediaError');
    if (altInput) altInput.addEventListener('input', () => { error.textContent = ''; });
    subBar.querySelector('[data-act="save-media"]').addEventListener('click', saveMediaSub);
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
    const sectionSelect = subBar.querySelector('#devMediaSection');
    const positionSelect = subBar.querySelector('#devMediaPosition');
    const positionsFor = targetKey => {
      if (!targetKey) return [];
      if (raw) {
        return [
          { value: 'start', label: 'Beginning of text' },
          { value: 'end', label: 'End of text' }
        ];
      }
      const targetList = project[targetKey + '-media'];
      const options = [{ value: 'start', label: 'Beginning' }];
      if (Array.isArray(targetList)) {
        targetList.forEach((entry, position) => {
          options.push({ value: 'after:' + position, label: 'After ' + mediaItemLabel(entry, position) });
        });
      }
      return options;
    };
    const fillPositions = () => {
      if (!positionSelect) return;
      const options = positionsFor(sectionSelect ? sectionSelect.value : '');
      positionSelect.innerHTML = options.map(option => `<option value="${option.value}">${esc(option.label)}</option>`).join('');
      positionSelect.disabled = !options.length;
    };
    if (sectionSelect) {
      sectionSelect.addEventListener('change', () => {
        if (error) error.textContent = '';
        fillPositions();
      });
    }
    fillPositions();
    const upButton = subBar.querySelector('[data-act="media-up"]');
    const downButton = subBar.querySelector('[data-act="media-down"]');
    const moveButton = subBar.querySelector('[data-act="media-move"]');
    if (upButton) upButton.addEventListener('click', () => moveMediaWithin(-1));
    if (downButton) downButton.addEventListener('click', () => moveMediaWithin(1));
    if (moveButton) moveButton.addEventListener('click', moveMediaToSection);
    refreshMediaMoveControls();
    if (altInput) {
      altInput.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        saveMediaSub();
      });
    }
    // The sheet is still display:none while it is being built, so the focus
    // call has to wait until openSub() has shown it.
    setTimeout(() => {
      if (altInput && altInput.isConnected) altInput.focus();
    }, 0);
  }

  function saveMediaSub() {
    const target = mediaTarget;
    if (!target) {
      closeSub();
      return;
    }
    const { project, key, index, item, pending, raw } = target;
    const altInput = subBar.querySelector('#devMediaAlt');
    const captionInput = subBar.querySelector('#devMediaCaption');
    const error = subBar.querySelector('#devMediaError');
    const alt = altInput ? altInput.value.trim() : '';
    if (!alt) {
      if (error) error.textContent = 'Enter alt text: describe what the image shows.';
      if (altInput) altInput.focus();
      return;
    }
    const caption = captionInput ? captionInput.value.trim() : '';
    if (raw) {
      const changed = saveRawImageAlt(target, alt);
      closeSub();
      if (changed) rerenderPreservingOpen();
      return;
    }
    pushHistory();
    if (pending) {
      const mediaKey = key + '-media';
      if (!Array.isArray(project[mediaKey])) project[mediaKey] = [];
      const entry = { src: target.current, alt };
      if (caption) entry.caption = caption;
      project[mediaKey].push(entry);
    } else if (typeof item === 'string') {
      // A plain string becomes a full image entry on its first edit, so the
      // alt text has somewhere to live. The path itself stays unchanged.
      const entry = { src: item, alt };
      if (caption) entry.caption = caption;
      project[key + '-media'][index] = entry;
    } else {
      item.alt = alt;
      if (captionInput) {
        if (caption) item.caption = caption;
        else delete item.caption;
      }
    }
    setDirty(true);
    closeSub();
    rerenderPreservingOpen();
  }

  // ---------- move media ----------
  // Same-section moves keep the sheet open so several steps can be done in a
  // row. Cross-section moves close it: the image leaves the visible area, so
  // the sheet would point at nothing.
  function mediaMoveState() {
    const target = mediaTarget;
    if (!target || target.pending) return null;
    const project = target.project;
    if (target.raw) {
      const units = rawImageUnits(project[target.key + '-text']);
      const index = units.findIndex(unit => unit.href === target.href);
      if (index < 0) return null;
      return { kind: 'raw', units, index, last: units.length - 1 };
    }
    const list = project[target.key + '-media'];
    if (!Array.isArray(list) || !list[target.index]) return null;
    return { kind: 'media', list, index: target.index, last: list.length - 1 };
  }

  function refreshMediaMoveControls() {
    if (!subBar || !mediaTarget) return;
    const move = mediaMoveState();
    const up = subBar.querySelector('[data-act="media-up"]');
    const down = subBar.querySelector('[data-act="media-down"]');
    if (up) up.disabled = !move || move.index <= 0;
    if (down) down.disabled = !move || move.index >= move.last;
    const context = subBar.querySelector('#devMediaContext');
    if (context && move) {
      context.textContent = mediaTarget.raw
        ? mediaTarget.key + ' · text image #' + (move.index + 1)
        : mediaTarget.key + ' #' + (move.index + 1);
    }
  }

  function moveMediaWithin(delta) {
    const target = mediaTarget;
    const move = mediaMoveState();
    if (!target || !move) return;
    const next = move.index + delta;
    if (next < 0 || next > move.last) return;
    if (move.kind === 'media') {
      // Seamless: the node moves, the card never re-renders.
      const section = document.querySelector('#thumbCollapse-' + target.project.id + ' .project-detail[data-section="' + target.key + '"]');
      if (section) reorderMediaItem(section, target.project, target.key, move.index, next);
      return;
    }
    moveRawUnit(target.project, target.key, target.href, delta);
    refreshMediaMoveControls();
  }

  function mediaToastPosition(project, key, move) {
    const section = document.querySelector('#thumbCollapse-' + project.id + ' .project-detail[data-section="' + key + '"]');
    let element = null;
    if (section && move) {
      if (move.kind === 'raw') {
        element = [...section.querySelectorAll('.project-detail-text a.glightbox')]
          .find(anchor => anchor.getAttribute('href') === move.units[move.index].href) || null;
      } else {
        element = section.querySelector('[data-media-key][data-media-index="' + move.index + '"]');
      }
    }
    const rect = element ? element.getBoundingClientRect() : null;
    return rect ? { top: rect.top, left: rect.left } : { top: 120, left: 120 };
  }

  function openLinkSub(project, key, index, item, isNew) {
    mediaTarget = { project, key, index, item: item || null, field: 'link', kind: 'Link', current: item ? item.link || '' : '', pending: null, isNew: !!isNew };
    openSub('link');
  }

  function buildLinkSub() {
    const target = mediaTarget;
    if (!target) {
      closeSub();
      return;
    }
    const { project, key, index, item, isNew } = target;
    const current = item || {};
    const context = isNew ? esc(key) : esc(key) + ' #' + (index + 1);
    subBar.innerHTML = `
      <div class="dev-sub-head">${isNew ? 'New link' : 'Edit link'} — <strong>${esc(project.title)}</strong> · ${context}</div>
      <div class="dev-sub-row">
        <label class="dev-sub-label">URL (required)
          <input class="dev-sub-input" id="devLinkUrl" value="${esc(current.link || '')}" autocomplete="off" placeholder="https://…">
        </label>
        <label class="dev-sub-label">Label (optional)
          <input class="dev-sub-input" id="devLinkLabel" value="${esc(current.label || '')}" autocomplete="off" placeholder="Text shown on the page">
        </label>
      </div>
      <div class="dev-sub-row">
        <label class="dev-sub-label">Title (optional, tooltip)
          <input class="dev-sub-input" id="devLinkTitle" value="${esc(current.title || '')}" autocomplete="off" placeholder="Shown on hover">
        </label>
      </div>
      <div class="dev-sub-error" id="devLinkError" role="alert"></div>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button dev-primary" data-act="save-link">Save</button>
        <button type="button" class="dev-preset-button" data-act="sub-close">Cancel</button>
      </div>`;
    const urlInput = subBar.querySelector('#devLinkUrl');
    const labelInput = subBar.querySelector('#devLinkLabel');
    const titleInput = subBar.querySelector('#devLinkTitle');
    const error = subBar.querySelector('#devLinkError');
    const save = () => {
      const url = urlInput.value.trim();
      if (!url) {
        error.textContent = 'Enter a URL.';
        urlInput.focus();
        return;
      }
      const label = labelInput.value.trim();
      const title = titleInput.value.trim();
      pushHistory();
      if (isNew) {
        if (!Array.isArray(project[key + '-media'])) project[key + '-media'] = [];
        const entry = { link: url };
        if (label) entry.label = label;
        if (title) entry.title = title;
        project[key + '-media'].push(entry);
      } else {
        item.link = url;
        if (label) item.label = label;
        else delete item.label;
        if (title) item.title = title;
        else delete item.title;
      }
      setDirty(true);
      closeSub();
      rerenderPreservingOpen();
    };
    subBar.querySelector('[data-act="save-link"]').addEventListener('click', save);
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
    [urlInput, labelInput, titleInput].forEach(input => input.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      save();
    }));
    setTimeout(() => {
      if (urlInput.isConnected) urlInput.focus();
    }, 0);
  }

  function movePositionOptions(project, targetKey) {
    const list = project[targetKey + '-media'];
    const options = [{ value: 'start', label: 'Beginning' }];
    if (Array.isArray(list)) {
      list.forEach((entry, position) => {
        options.push({ value: 'after:' + position, label: 'After ' + mediaItemLabel(entry, position) });
      });
    }
    return options;
  }

  function openMoveSub(project, key, index, item) {
    mediaTarget = { project, key, index, item, field: null, kind: 'Embed', current: '', pending: null };
    openSub('move');
  }

  function buildMoveSub() {
    const target = mediaTarget;
    if (!target) {
      closeSub();
      return;
    }
    const { project, key, index } = target;
    const sections = projectSectionList(project, key);
    subBar.innerHTML = `
      <div class="dev-sub-head">Move — <strong>${esc(project.title)}</strong> · ${esc(key)} #${index + 1}</div>
      <div class="dev-sub-row">
        <label class="dev-sub-label">Move to section
          <select class="dev-sub-input" id="devMediaSection">
            <option value="">Choose…</option>
            ${sections.map(section => `<option value="${esc(section.key)}">${esc(section.title)}</option>`).join('')}
          </select>
        </label>
        <label class="dev-sub-label">Position
          <select class="dev-sub-input" id="devMediaPosition" disabled></select>
        </label>
        <button type="button" class="dev-preset-button" data-act="move-item">Move</button>
      </div>
      <div class="dev-sub-error" id="devMediaError" role="alert"></div>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button" data-act="sub-close">Cancel</button>
      </div>`;
    const sectionSelect = subBar.querySelector('#devMediaSection');
    const positionSelect = subBar.querySelector('#devMediaPosition');
    const error = subBar.querySelector('#devMediaError');
    const fillPositions = () => {
      const targetKey = sectionSelect.value;
      const options = targetKey ? movePositionOptions(project, targetKey) : [];
      positionSelect.innerHTML = options.map(option => `<option value="${option.value}">${esc(option.label)}</option>`).join('');
      positionSelect.disabled = !options.length;
    };
    sectionSelect.addEventListener('change', () => {
      if (error) error.textContent = '';
      fillPositions();
    });
    fillPositions();
    subBar.querySelector('[data-act="move-item"]').addEventListener('click', moveMediaToSection);
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
  }

  function moveMediaToSection() {    const target = mediaTarget;
    const move = mediaMoveState();
    if (!target || !move) return;
    const sectionSelect = subBar.querySelector('#devMediaSection');
    const positionSelect = subBar.querySelector('#devMediaPosition');
    const error = subBar.querySelector('#devMediaError');
    const targetKey = sectionSelect ? sectionSelect.value : '';
    if (!targetKey) {
      if (error) error.textContent = 'Choose a section first.';
      if (sectionSelect) sectionSelect.focus();
      return;
    }
    const project = target.project;
    const sourceKey = target.key;
    if (targetKey === sourceKey) return;
    const position = positionSelect ? positionSelect.value : 'start';
    const toastAt = mediaToastPosition(project, sourceKey, move);

    if (move.kind === 'raw') {
      // The text image stays a text image: the block moves into the target
      // section's -text, so its own lightbox markup survives unchanged.
      const text = project[sourceKey + '-text'];
      const unit = move.units[move.index];
      const unitHtml = text.slice(unit.start, unit.end).replace(/^\s+/, '');
      const nextSource = text.slice(0, unit.start) + text.slice(unit.end);
      const prevTarget = project[targetKey + '-text'];
      const hasTargetText = typeof prevTarget === 'string' && prevTarget.trim() !== '';
      const nextTarget = position === 'start'
        ? (hasTargetText ? unitHtml + '\n' + prevTarget : unitHtml)
        : (hasTargetText ? prevTarget + '\n' + unitHtml : unitHtml);
      pushHistory();
      project[sourceKey + '-text'] = nextSource;
      project[targetKey + '-text'] = nextTarget;
      setDirty(true);
      closeSub();
      rerenderPreservingOpen();
      showMediaUndo(toastAt, () => {
        const current = projectsData.find(entry => entry.id === project.id);
        if (!current || current[sourceKey + '-text'] !== nextSource) return false;
        if (current[targetKey + '-text'] !== nextTarget) return false;
        current[sourceKey + '-text'] = text;
        if (prevTarget === undefined) delete current[targetKey + '-text'];
        else current[targetKey + '-text'] = prevTarget;
        setDirty(true);
        rerenderPreservingOpen();
        return true;
      }, 'Image moved');
      return;
    }

    const list = move.list;
    const item = list[move.index];
    const movedLabel = mediaField(item) && mediaField(item).kind === 'Embed' ? 'Prototype moved' : 'Image moved';
    const sourceIndex = move.index;
    const existingTarget = project[targetKey + '-media'];
    const targetHadMedia = Array.isArray(existingTarget);
    let insertAt = 0;
    if (position.indexOf('after:') === 0) {
      insertAt = Math.min(Number(position.slice(6)) + 1, Array.isArray(existingTarget) ? existingTarget.length : 0);
    }
    pushHistory();
    if (!Array.isArray(project[targetKey + '-media'])) project[targetKey + '-media'] = [];
    const destination = project[targetKey + '-media'];
    list.splice(sourceIndex, 1);
    destination.splice(insertAt, 0, item);
    setDirty(true);
    closeSub();
    rerenderPreservingOpen();
    showMediaUndo(toastAt, () => {
      const current = projectsData.find(entry => entry.id === project.id);
      if (!current) return false;
      const destinationList = current[targetKey + '-media'];
      const sourceList = current[sourceKey + '-media'];
      if (!Array.isArray(destinationList) || !Array.isArray(sourceList)) return false;
      if (destinationList[insertAt] !== item) return false;
      destinationList.splice(insertAt, 1);
      if (!targetHadMedia && destinationList.length === 0) delete current[targetKey + '-media'];
      sourceList.splice(Math.min(sourceIndex, sourceList.length), 0, item);
      setDirty(true);
      rerenderPreservingOpen();
      return true;
    }, movedLabel);
  }

  function buildHelpSub() {
    subBar.innerHTML = `
      <div class="dev-sub-head">Dev help</div>
      <ul class="dev-sub-help">
        <li><strong>Edit:</strong> click a section title, text, list, card title, teaser or tag.</li>
        <li><strong>Add:</strong> the [+] between blocks inserts Text, Image or Icon exactly there; between two icons it offers Image or Icon. Click again, press Escape or click elsewhere to close the menu. Text inside a section is edited directly — click into it and type.</li>
        <li><strong>Reorder:</strong> drag the section handle while editing.</li>
        <li><strong>Blocks:</strong> the block-order button on a section opens its block order; Up and Down move the text, list and media blocks. The order is stored only while it differs from the default. A text block is removed with its own ×, an emptied one removes itself, both with Undo.</li>
        <li><strong>Sections:</strong> + Section at the end of a card adds one with a title and an editable key; empty the title to reset it to the default label; the remove control on a section removes it and Undo restores it.</li>
        <li><strong>Media:</strong> hover an image, icon or link to reveal its controls; the image arrows move it to the top, up, down or bottom. Click an image to set its alt text and caption; a plain path becomes a full image entry on its first save. Move to section places it in another section at the chosen position — a text image moves into that section's text and keeps its lightbox markup. The remove control sits above small artwork instead of covering it, and every removal offers Undo.</li>
        <li><strong>Presets:</strong> the Presets tile opens the list; the first edit creates a random-named working preset and autosaves into it continuously. New creates a fresh working preset from the session’s original state and keeps the previous one. There is no manual Save; the working preset is always current. “Write projects-data.js” is the separate action that writes the data file.</li>
        <li><strong>Write file:</strong> “Write projects-data.js” in the Presets sheet replaces the data file with the current state through the local dev server. Use it deliberately: it rewrites the array as JSON, so review git diff and commit by hand afterwards.</li>
        <li><strong>New card:</strong> the New card tile cycles templates with the arrows, the thumbnail uploads on click, and ID and title are required.</li>
        <li><strong>Undo / Redo / Discard Changes:</strong> step back, step forward through undone steps, or discard everything since the last preset load, New, or editor start.</li>
        <li><strong>Reload guard:</strong> warns while the toolbar is open or changes are unsaved.</li>
        <li><strong>Move:</strong> drag the card by its handle; Alt + drag moves the edit button for the moment, the pointer trail takes over again on the next move.</li>
        <li><strong>Shortcuts:</strong> Shift + ° opens the testing panel; Shift + &gt; hides or shows the edit button.</li>
        <li><strong>Leave dev:</strong> open <code>?dev=0</code>.</li>
      </ul>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button" data-act="convert-content">Convert all cards to the content model</button>
        <button type="button" class="dev-preset-button" data-act="sub-close">Close</button>
      </div>`;
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
    const convert = subBar.querySelector('[data-act="convert-content"]');
    if (convert) convert.addEventListener('click', () => {
      pushHistory();
      projectsData.forEach(project => {
        if (!Array.isArray(project.content)) window.convertProjectToContent(project);
      });
      setDirty(true);
      rerenderPreservingOpen();
      closeSub();
    });
  }

  function openMediaSub(project, key, index, item, field, kind, pending, isNew) {
    mediaTarget = {
      project,
      key,
      index,
      item,
      field,
      kind,
      current: item && field ? item[field] : (item || pending || ''),
      pending: pending || null,
      isNew: !!isNew
    };
    openSub('media');
  }

  // ---------- add section ----------
  function slugFromTitle(value) {
    return String(value)
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function sectionKeyTaken(project, key) {
    if ((project['section-order'] || sectionOrder).indexOf(key) !== -1) return true;
    return ['title', 'text', 'media', 'list', 'list-type', 'class'].some(suffix =>
      Object.prototype.hasOwnProperty.call(project, key + '-' + suffix));
  }

  function openSectionSub(project) {
    sectionTarget = project;
    openSub('section');
  }

  function buildSectionSub() {
    const project = sectionTarget;
    if (!project) {
      closeSub();
      return;
    }
    subBar.innerHTML = `
      <div class="dev-sub-head">New section — <strong>${esc(project.title)}</strong></div>
      <div class="dev-sub-row">
        <label class="dev-sub-label">Title
          <input class="dev-sub-input" id="devSectionTitle" autocomplete="off" placeholder="e.g. Ausblick">
        </label>
        <label class="dev-sub-label">Key
          <input class="dev-sub-input" id="devSectionKey" autocomplete="off" placeholder="ausblick">
        </label>
      </div>
      <div class="dev-sub-error" id="devSectionError" role="alert"></div>
      <div class="dev-sub-actions">
        <button type="button" class="dev-preset-button dev-primary" data-act="save-section">Add section</button>
        <button type="button" class="dev-preset-button" data-act="sub-close">Cancel</button>
      </div>`;
    const titleInput = subBar.querySelector('#devSectionTitle');
    const keyInput = subBar.querySelector('#devSectionKey');
    const error = subBar.querySelector('#devSectionError');
    let keyTouched = false;
    titleInput.addEventListener('input', () => {
      error.textContent = '';
      if (!keyTouched) keyInput.value = slugFromTitle(titleInput.value);
    });
    keyInput.addEventListener('input', () => {
      keyTouched = true;
      error.textContent = '';
      keyInput.value = keyInput.value
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/-{2,}/g, '-');
    });
    subBar.querySelector('[data-act="save-section"]').addEventListener('click', saveSectionSub);
    subBar.querySelectorAll('[data-act="sub-close"]').forEach(button => button.addEventListener('click', closeSub));
    [titleInput, keyInput].forEach(input => {
      input.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        saveSectionSub();
      });
    });
    setTimeout(() => {
      if (titleInput.isConnected) titleInput.focus();
    }, 0);
  }

  function saveSectionSub() {
    const project = sectionTarget;
    if (!project) {
      closeSub();
      return;
    }
    const titleInput = subBar.querySelector('#devSectionTitle');
    const keyInput = subBar.querySelector('#devSectionKey');
    const error = subBar.querySelector('#devSectionError');
    const title = titleInput.value.trim();
    const key = keyInput.value.trim().replace(/^-+|-+$/g, '');
    if (!title) {
      error.textContent = 'Enter a section title.';
      titleInput.focus();
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) {
      error.textContent = 'The key must be lowercase letters, digits and single hyphens, for example ausblick.';
      keyInput.focus();
      return;
    }
    if (sectionKeyTaken(project, key)) {
      error.textContent = 'This key already exists in this card. Choose another one.';
      keyInput.focus();
      return;
    }
    if (!Array.isArray(project['section-order'])) project['section-order'] = sectionOrder.slice();
    pushHistory();
    project['section-order'].push(key);
    project[key + '-title'] = title;
    setDirty(true);
    closeSub();
    rerenderPreservingOpen();
    setTimeout(() => {
      const collapse = document.getElementById('thumbCollapse-' + project.id);
      const section = collapse && collapse.querySelector('[data-section="' + key + '"]');
      if (!section) return;
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const text = section.querySelector('.project-detail-text');
      if (text) text.focus();
    }, 350);
  }

  function readGameDelay() {
    let value = 40;
    try {
      const stored = localStorage.getItem(GAME_DELAY_KEY);
      if (stored !== null) {
        const raw = Number(stored);
        if (Number.isFinite(raw)) value = raw;
      }
    } catch (e) {}
    return GAME_DELAYS.includes(value) ? value : 40;
  }

  function applyGameDelay(value) {
    document.documentElement.style.setProperty('--game-cta-delay', value + 'ms');
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-game-delay-value]').forEach(button => {
        const active = Number(button.getAttribute('data-game-delay-value')) === value;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem(GAME_DELAY_KEY, String(value)); } catch (e) {}
  }

  function readGameDuration() {
    let value = 320;
    try {
      const stored = localStorage.getItem(GAME_DURATION_KEY);
      if (stored !== null) {
        const raw = Number(stored);
        if (Number.isFinite(raw)) value = raw;
      }
    } catch (e) {}
    return GAME_DURATIONS.includes(value) ? value : 320;
  }

  function applyGameDuration(value) {
    document.documentElement.style.setProperty('--game-cta-duration', value + 'ms');
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-game-duration-value]').forEach(button => {
        const active = Number(button.getAttribute('data-game-duration-value')) === value;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem(GAME_DURATION_KEY, String(value)); } catch (e) {}
  }

  // ---------- nav glass ----------
  function glassApi() {
    return window.navGlass || null;
  }  function applyGlass(key, value, attribute) {
    const api = glassApi();
    if (api) api.set(key, value);
    applyGlassRow(attribute, value);
  }

  function syncGlassRows() {
    const api = glassApi();
    const panel = document.getElementById('devCtaPanel');
    if (!panel) return;
    const supported = !!api;
    panel.querySelectorAll('[data-glass-depth-value], [data-glass-spectrum-value], [data-glass-tint-value], [data-glass-blur-value]').forEach(button => {
      button.disabled = !supported;
    });
    if (!supported) return;
    const current = api.get();
    applyGlassRow('data-glass-depth-value', current.depth);
    applyGlassRow('data-glass-spectrum-value', current.spectrum);
    applyGlassRow('data-glass-tint-value', current.tint);
    applyGlassRow('data-glass-blur-value', current.blur);
  }

  function applyGlassRow(attribute, value) {
    const panel = document.getElementById('devCtaPanel');
    if (!panel) return;
    panel.querySelectorAll('[' + attribute + ']').forEach(button => {
      const active = Number(button.getAttribute(attribute)) === Number(value);
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  // ---------- intro timing ----------
  function readIntroNumber(key, allowed, fallback) {
    let value = fallback;
    try {
      const raw = Number(localStorage.getItem(key));
      if (Number.isFinite(raw)) value = raw;
    } catch (e) {}
    return allowed.includes(value) ? value : fallback;
  }

  function applyIntro(key, value, attribute) {
    try { localStorage.setItem(key, String(value)); } catch (e) {}
    applyIntroVars();
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[' + attribute + ']').forEach(button => {
        const active = Number(button.getAttribute(attribute)) === Number(value);
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
  }

  // The cell cascade lives in CSS, so the panel writes custom properties.
  function applyIntroVars() {
    const root = document.documentElement;
    const delay = readIntroNumber(INTRO_DELAY_KEY, INTRO_DELAYS, 1600);
    const step = readIntroNumber(INTRO_STEP_KEY, INTRO_STEPS, 90);
    root.style.setProperty('--intro-start', (delay + 550) + 'ms');
    root.style.setProperty('--intro-step', step + 'ms');
  }

  function syncIntroRows() {
    applyIntroVars();
    const panel = document.getElementById('devCtaPanel');
    if (!panel) return;
    const delay = readIntroNumber(INTRO_DELAY_KEY, INTRO_DELAYS, 1600);
    const step = readIntroNumber(INTRO_STEP_KEY, INTRO_STEPS, 90);
    panel.querySelectorAll('[data-intro-delay-value]').forEach(button => {
      button.classList.toggle('is-active', Number(button.getAttribute('data-intro-delay-value')) === delay);
    });
    panel.querySelectorAll('[data-intro-step-value]').forEach(button => {
      button.classList.toggle('is-active', Number(button.getAttribute('data-intro-step-value')) === step);
    });
  }

  // ---------- shadow variant ----------
  function readShadowVariant() {
    let value = 'current';
    try { value = localStorage.getItem(SHADOW_KEY) || 'current'; } catch (e) {}
    return SHADOW_VARIANTS.some(item => item.id === value) ? value : 'current';
  }

  function applyShadowVariant(id) {
    if (id === 'current') {
      document.documentElement.removeAttribute('data-shadow-variant');
    } else {
      document.documentElement.setAttribute('data-shadow-variant', id);
    }
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-shadow-variant-value]').forEach(button => {
        const active = button.getAttribute('data-shadow-variant-value') === id;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem(SHADOW_KEY, id); } catch (e) {}
  }

  // ---------- type scale ----------
  function readTypeScale() {
    let value = 'current';
    try { value = localStorage.getItem(TYPE_KEY) || 'current'; } catch (e) {}
    return TYPE_SCALES.some(item => item.id === value) ? value : 'current';
  }

  function applyTypeScale(id) {
    if (id === 'proposed') {
      document.documentElement.setAttribute('data-type-scale', 'proposed');
    } else {
      document.documentElement.removeAttribute('data-type-scale');
    }
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-type-scale-value]').forEach(button => {
        const active = button.getAttribute('data-type-scale-value') === id;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem(TYPE_KEY, id); } catch (e) {}
  }

  // ---------- navigation pill ----------
  // Two live numbers: distance from the pill to the viewport bottom and the
  // gap between its items. Written as root custom properties, so the CSS
  // fallbacks keep working when nothing is stored.
  const NAV_BOTTOM_KEY = 'portfolio-nav-bottom';
  const NAV_GAP_KEY = 'portfolio-nav-gap';
  const NAV_HOVER_SCALE_KEY = 'portfolio-nav-hover-scale';
  const NAV_HOVER_SHADOW_KEY = 'portfolio-nav-hover-shadow';
  const NAV_SHADOW_KEY = 'portfolio-nav-shadow';

  // The input event carries no modifier keys, so Shift and Alt are tracked
  // from the keyboard while a drag runs. Shift is ten times finer, Alt five
  // times coarser than the base step.
  const navModifiers = { fine: false, coarse: false };
  function trackNavModifiers(event) {
    navModifiers.fine = !!event.shiftKey;
    navModifiers.coarse = !!event.altKey;
  }
  document.addEventListener('keydown', trackNavModifiers);
  document.addEventListener('keyup', trackNavModifiers);
  window.addEventListener('blur', function () {
    navModifiers.fine = false;
    navModifiers.coarse = false;
  });

  function snapped(input, base) {
    const step = navModifiers.fine ? base / 10 : navModifiers.coarse ? base * 5 : base;
    const value = Math.round(Number(input.value) / step) * step;
    const clean = Number(value.toFixed(3));
    input.value = String(clean);
    return clean;
  }

  function readNumber(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return fallback;
      const raw = Number(stored);
      return Number.isFinite(raw) ? raw : fallback;
    } catch (error) { return fallback; }
  }

  // Apple-style steppers: a −/+ pair for precise steps; the existing value
  // label is the readout. Shift is ten times finer, Alt five times coarser.
  const NAV_STEPPERS = {
    bottom: { input: '[data-nav-bottom-input]', key: NAV_BOTTOM_KEY, step: 1 },
    gap: { input: '[data-nav-gap-input]', key: NAV_GAP_KEY, step: 1 },
    shadow: { input: '[data-nav-shadow-input]', key: NAV_SHADOW_KEY, step: 0.1 },
    'hover-scale': { input: '[data-nav-hover-scale-input]', key: NAV_HOVER_SCALE_KEY, step: 0.01 },
    'hover-shadow': { input: '[data-nav-hover-shadow-input]', key: NAV_HOVER_SHADOW_KEY, step: 0.1 }
  };

  function navStep(key, direction) {
    const config = NAV_STEPPERS[key];
    if (!config) return;
    const input = document.querySelector(config.input);
    if (!input) return;
    const base = config.step;
    const step = navModifiers.fine ? base / 10 : navModifiers.coarse ? base * 5 : base;
    const min = Number(input.min);
    const max = Number(input.max);
    let value = Number(input.value) + direction * step;
    value = Math.min(max, Math.max(min, value));
    value = Number(value.toFixed(3));
    input.value = String(value);
    setNav(config.key, value);
  }

  function syncSteppers() {
    Object.keys(NAV_STEPPERS).forEach(key => {
      const config = NAV_STEPPERS[key];
      const input = document.querySelector(config.input);
      if (!input) return;
      const value = Number(input.value);
      const min = Number(input.min);
      const max = Number(input.max);
      document.querySelectorAll('[data-nav-step="' + key + '"]').forEach(button => {
        const direction = Number(button.getAttribute('data-dir'));
        button.disabled = direction < 0 ? value <= min + 1e-9 : value >= max - 1e-9;
      });
    });
  }

  function applyNav() {
    const bottom = readNumber(NAV_BOTTOM_KEY, 10);
    const gap = readNumber(NAV_GAP_KEY, 12);
    const hoverScale = readNumber(NAV_HOVER_SCALE_KEY, 1.02);
    const hoverShadow = readNumber(NAV_HOVER_SHADOW_KEY, 1);
    const idleShadow = readNumber(NAV_SHADOW_KEY, 1);
    document.documentElement.style.setProperty('--nav-bottom', bottom + 'px');
    document.documentElement.style.setProperty('--nav-gap', gap + 'px');
    document.documentElement.style.setProperty('--nav-hover-scale', String(hoverScale));
    document.documentElement.style.setProperty('--nav-hover-shadow', String(hoverShadow));
    document.documentElement.style.setProperty('--nav-shadow', String(idleShadow));
    const bottomValue = document.querySelector('[data-nav-bottom-value]');
    const gapValue = document.querySelector('[data-nav-gap-value]');
    const bottomInput = document.querySelector('[data-nav-bottom-input]');
    const gapInput = document.querySelector('[data-nav-gap-input]');
    const scaleValue = document.querySelector('[data-nav-hover-scale-value]');
    const shadowValue = document.querySelector('[data-nav-hover-shadow-value]');
    const idleValue = document.querySelector('[data-nav-shadow-value]');
    const scaleInput = document.querySelector('[data-nav-hover-scale-input]');
    const shadowInput = document.querySelector('[data-nav-hover-shadow-input]');
    const idleInput = document.querySelector('[data-nav-shadow-input]');
    if (bottomValue) bottomValue.textContent = bottom + ' px';
    if (gapValue) gapValue.textContent = gap + ' px';
    // The knobs follow the stored values too, otherwise a reload leaves the
    // slider at its markup default while the label shows the stored number.
    if (bottomInput) bottomInput.value = String(bottom);
    if (gapInput) gapInput.value = String(gap);
    if (scaleValue) scaleValue.textContent = hoverScale.toFixed(3) + '×';
    if (shadowValue) shadowValue.textContent = hoverShadow.toFixed(2);
    if (idleValue) idleValue.textContent = idleShadow.toFixed(2);
    if (scaleInput) scaleInput.value = String(hoverScale);
    if (shadowInput) shadowInput.value = String(hoverShadow);
    if (idleInput) idleInput.value = String(idleShadow);
    syncSteppers();
  }

  function setNav(key, value) {
    try { localStorage.setItem(key, String(value)); } catch (error) {}
    applyNav();
  }

  // The ranges and values from before the fivefold widening. The button puts
  // the five sliders back to that configuration; a reload restores the wide
  // ranges with these values.
  const NAV_DEFAULTS = [
    { selector: '[data-nav-bottom-input]', min: 0, max: 48, step: 1, value: 10, key: NAV_BOTTOM_KEY },
    { selector: '[data-nav-gap-input]', min: 0, max: 40, step: 1, value: 12, key: NAV_GAP_KEY },
    { selector: '[data-nav-shadow-input]', min: 0, max: 3, step: 0.01, value: 1, key: NAV_SHADOW_KEY },
    { selector: '[data-nav-hover-scale-input]', min: 0.8, max: 1.3, step: 0.001, value: 1.02, key: NAV_HOVER_SCALE_KEY },
    { selector: '[data-nav-hover-shadow-input]', min: 0, max: 4, step: 0.01, value: 1, key: NAV_HOVER_SHADOW_KEY }
  ];

  function restoreNavDefaults() {
    NAV_DEFAULTS.forEach(item => {
      const input = document.querySelector(item.selector);
      if (input) {
        input.min = String(item.min);
        input.max = String(item.max);
        input.step = String(item.step);
        input.value = String(item.value);
      }
      setNav(item.key, item.value);
    });
  }

  // ---------- section heading alignment ----------
  // The two section headings carry Bootstrap text utilities with !important,
  // so they are written inline with priority, same as the footer rows.
  const HEADING_ALIGN_KEY = 'portfolio-heading-align';
  const HEADING_PARTS = [
    { id: 'kompetenzen', label: 'Kompetenzen', targets: ['#kontext > h1', '#kontext > h2'] },
    { id: 'showcases', label: 'Showcases', targets: ['#projekte > h1', '#projekte > h2'] }
  ];

  function readHeadingAlign() {
    try { return JSON.parse(localStorage.getItem(HEADING_ALIGN_KEY) || '{}') || {}; } catch (error) { return {}; }
  }

  function applyHeadingAlign(id, value) {
    const state = readHeadingAlign();
    state[id] = value === 'center' ? 'center' : 'left';
    try { localStorage.setItem(HEADING_ALIGN_KEY, JSON.stringify(state)); } catch (error) {}
    renderHeadingAlign();
    applyNav();
  }

  function renderHeadingAlign() {
    const state = readHeadingAlign();
    HEADING_PARTS.forEach(part => {
      const value = state[part.id] === 'center' ? 'center' : 'left';
      part.targets.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.style.setProperty('text-align', value, 'important');
      });
      const panel = document.getElementById('devCtaPanel');
      if (!panel) return;
      panel.querySelectorAll('[data-heading-part="' + part.id + '"]').forEach(button => {
        const active = button.getAttribute('data-heading-align-value') === value;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    });
  }

  // ---------- friction reveal mode ----------
  const REVEAL_KEY = 'portfolio-cta-reveal';

  function readReveal() {
    let value = 'scroll';
    try { value = localStorage.getItem(REVEAL_KEY) || 'scroll'; } catch (e) {}
    return value === 'hover' ? 'hover' : 'scroll';
  }

  const BAND_KEY = 'portfolio-cta-band';
  const BANDS = [
    { id: 'center', label: 'Center' },
    { id: 'late', label: 'Late' }
  ];

  function readBand() {
    let value = 'center';
    try { value = localStorage.getItem(BAND_KEY) || 'center'; } catch (e) {}
    return value === 'late' ? 'late' : 'center';
  }

  function applyBand(id) {
    const value = id === 'late' ? 'late' : 'center';
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-band-value]').forEach(button => {
        const active = button.getAttribute('data-band-value') === value;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem(BAND_KEY, value); } catch (e) {}
    if (typeof window.applyCtaBand === 'function') window.applyCtaBand(value);
  }

  function applyReveal(id) {
    const value = id === 'scroll' ? 'scroll' : 'hover';
    document.documentElement.setAttribute('data-cta-reveal', value);
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-reveal-value]').forEach(button => {
        const active = button.getAttribute('data-reveal-value') === value;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem(REVEAL_KEY, value); } catch (e) {}
    if (typeof window.applyCtaReveal === 'function') window.applyCtaReveal(value);
  }

  // ---------- footer alignment, one control per element ----------
  // Each footer element gets its own Left / Center pair, so they can be
  // judged separately. Values are written inline with priority, because
  // Bootstrap utilities on the heading and the caption carry !important.
  const FOOTER_ALIGN_KEY = 'portfolio-footer-align';
  const FOOTER_PARTS = [
    { id: 'heading', label: 'H2', target: '#kontakt h2', prop: 'text-align' },
    { id: 'caption', label: 'Caption', target: '#kontaktCaption', prop: 'text-align' },
    { id: 'contact', label: 'Contact', target: '#kontakt .contact-actions', prop: 'justify-content', center: 'center', left: 'flex-start' },
    { id: 'social', label: 'Social', target: '#socialIconsWrap', prop: 'justify-content', center: 'center', left: 'flex-start' },
    { id: 'copyright', label: 'Copyright', target: '#copyright', prop: 'text-align' }
  ];

  function readFooterAlign() {
    try { return JSON.parse(localStorage.getItem(FOOTER_ALIGN_KEY) || '{}') || {}; } catch (error) { return {}; }
  }

  function syncFooterRows(state) {
    const panel = document.getElementById('devCtaPanel');
    if (!panel) return;
    FOOTER_PARTS.forEach(part => {
      const value = state[part.id] === 'center' ? 'center' : 'left';
      panel.querySelectorAll('[data-footer-part="' + part.id + '"]').forEach(button => {
        const active = button.getAttribute('data-footer-align-value') === value;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    });
  }

  function applyFooterAlign(id, value) {
    const state = readFooterAlign();
    state[id] = value === 'center' ? 'center' : 'left';
    try { localStorage.setItem(FOOTER_ALIGN_KEY, JSON.stringify(state)); } catch (error) {}
    renderFooterAlign();
  }

  function renderFooterAlign() {
    const state = readFooterAlign();
    FOOTER_PARTS.forEach(part => {
      const el = document.querySelector(part.target);
      if (!el) return;
      const value = state[part.id] === 'center' ? 'center' : 'left';
      const css = value === 'center' ? (part.center || 'center') : (part.left || 'left');
      el.style.setProperty(part.prop, css, 'important');
      if (part.id === 'caption') {
        if (value === 'center') {
          el.style.setProperty('margin-left', 'auto', 'important');
          el.style.setProperty('margin-right', 'auto', 'important');
        } else {
          el.style.removeProperty('margin-left');
          el.style.removeProperty('margin-right');
        }
      }
    });
    syncFooterRows(state);
  }

  // ---------- contact copy variants ----------
  function readContactVariant() {
    let value = 'mail-only';
    try { value = localStorage.getItem(CONTACT_KEY) || 'mail-only'; } catch (e) {}
    return CONTACT_VARIANTS.some(item => item.id === value) ? value : 'mail-only';
  }

  function applyContactVariant(id) {
    const variant = CONTACT_VARIANTS.find(item => item.id === id) || CONTACT_VARIANTS.find(item => item.id === 'mail-only');
    const mail = document.getElementById('contactMail');
    const address = mail ? mail.querySelector('.contact-mail-address') : null;
    const label = mail ? mail.querySelector('.contact-mail-label') : null;
    const copy = document.getElementById('contactCopy');

    if (label) label.textContent = variant.mailLabel;
    if (address) address.hidden = !variant.showAddress;
    if (mail) mail.classList.toggle('has-address', variant.showAddress);
    if (copy) copy.hidden = !variant.showCopy;

    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-contact-variant-value]').forEach(button => {
        const active = button.getAttribute('data-contact-variant-value') === variant.id;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem(CONTACT_KEY, variant.id); } catch (e) {}
  }

  // Dev overlay for the rider's scroll band: two lines for the start/end of the
  // trigger range, a tint between them, and a marker for the track's live top.
  function buildRiderOverlay(panel) {
    const overlay = document.createElement('div');
    overlay.id = 'riderBandOverlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="rider-band-zone"></div>' +
      '<div class="rider-band-line" data-line="start"><span data-label="start">start</span></div>' +
      '<div class="rider-band-line" data-line="end"><span data-label="end">end</span></div>' +
      '<div class="rider-band-line is-track" data-line="track"><span data-label="track">track</span></div>';
    document.body.appendChild(overlay);

    const lines = {
      start: overlay.querySelector('[data-line="start"]'),
      end: overlay.querySelector('[data-line="end"]'),
      track: overlay.querySelector('[data-line="track"]')
    };
    const zone = overlay.querySelector('.rider-band-zone');

    function update() {
      const riderGroup = panel.querySelector('.dev-cta-group[data-group="rider"]');
      const riderOpen = !riderGroup || !riderGroup.classList.contains('is-collapsed');
      const visible = !panel.classList.contains('is-closed') && getComputedStyle(panel).display !== 'none' && riderOpen && riderBandVisible && !!window.riderBand;
      overlay.classList.toggle('is-visible', visible);
      if (!visible) return;
      const height = window.innerHeight;
      const startPct = window.riderBand.start();
      const endPct = window.riderBand.end();
      const offset = window.riderBand.offset ? window.riderBand.offset() : 0;
      const startY = height * startPct / 100;
      const endY = height * endPct / 100;
      lines.start.style.top = startY + 'px';
      lines.end.style.top = endY + 'px';
      lines.start.querySelector('[data-label="start"]').textContent =
        'start ' + Math.round(startPct) + '% · ' + Math.round(startY) + 'px';
      lines.end.querySelector('[data-label="end"]').textContent =
        'end ' + Math.round(endPct) + '% · ' + Math.round(endY) + 'px';
      zone.style.top = endY + 'px';
      zone.style.height = Math.max(0, startY - endY) + 'px';
      const track = document.querySelector('.kontext-rider-track');
      if (track) {
        const top = track.getBoundingClientRect().top + offset;
        lines.track.hidden = false;
        lines.track.style.top = top + 'px';
        lines.track.querySelector('[data-label="track"]').textContent = 'track ' + Math.round(top) + 'px';
      } else {
        lines.track.hidden = true;
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    if (window.ResizeObserver) new ResizeObserver(update).observe(document.body);
    new MutationObserver(update).observe(panel, { attributes: true, attributeFilter: ['hidden', 'style', 'class'] });
    update();
    return update;
  }

  function applyProtoFrame() {
    document.documentElement.dataset.protoShell = protoShell;
    document.documentElement.dataset.protoScreen = protoScreen;
    document.querySelectorAll('[data-proto-shell-value]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.protoShellValue === protoShell));
    });
    document.querySelectorAll('[data-proto-screen-value]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.protoScreenValue === protoScreen));
    });
  }

  function buildCtaPanel() {
    if (document.getElementById('devCtaPanel')) return;
    const panel = document.createElement('div');
    panel.id = 'devCtaPanel';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', 'CTA variants');
    // Visibility is remembered: shown on the first visit, then whatever the
    // keystroke left behind survives a reload.
    let storedOpen = '1';
    try { storedOpen = localStorage.getItem(CTA_OPEN_KEY) || '1'; } catch (e) {}
    panel.hidden = false;
    panel.classList.toggle('is-closed', storedOpen === '0');
    // One row per topic: the label keeps its column, the options wrap inside
    // their own column so a narrow panel never drops buttons to the edge.
    const row = (label, buttons, key) =>
      '<div class="dev-cta-row" data-row="' + (key || label.toLowerCase().replace(/\s+/g, '-')) + '">' +
      '<span class="dev-cta-label">' + label + '</span>' +
      '<div class="dev-cta-options">' + buttons + '</div></div>';

    const group = (title, rows) => {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return '<div class="dev-cta-group" data-group="' + slug + '">' +
        '<button type="button" class="dev-cta-group-title" data-group-toggle aria-expanded="true" aria-controls="dev-group-' + slug + '">' +
          '<span>' + title + '</span>' +
          '<svg class="dev-cta-group-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
            '<path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>' +
          '</svg>' +
        '</button>' +
        '<div class="dev-cta-group-body" id="dev-group-' + slug + '">' + rows + '</div>' +
      '</div>';
    };

    const setGroupCollapsed = (group, collapsed) => {
      group.classList.toggle('is-collapsed', collapsed);
      const title = group.querySelector('[data-group-toggle]');
      if (title) title.setAttribute('aria-expanded', String(!collapsed));
    };

    const saveGroupState = () => {
      const state = {};
      panel.querySelectorAll('.dev-cta-group').forEach(group => {
        const key = group.getAttribute('data-group');
        if (key) state[key] = group.classList.contains('is-collapsed');
      });
      try { localStorage.setItem(GROUP_STATE_KEY, JSON.stringify(state)); } catch (e) {}
    };

    const toggleGroup = group => {
      setGroupCollapsed(group, !group.classList.contains('is-collapsed'));
      saveGroupState();
    };

    const stepper = (key, label) =>
      '<span class="dev-stepper" role="group" aria-label="' + label + ' stepper">' +
        '<button type="button" class="dev-stepper-button" data-nav-step="' + key + '" data-dir="-1" aria-label="Decrease ' + label + '">−</button>' +
        '<button type="button" class="dev-stepper-button" data-nav-step="' + key + '" data-dir="1" aria-label="Increase ' + label + '">+</button>' +
      '</span>';

    panel.innerHTML = '<div class="dev-cta-head">' +
      '<span class="dev-cta-grip" title="Drag to move" aria-hidden="true">' + DRAG_SVG + '</span>' +
      '<span class="dev-cta-title">Testing</span>' +
      '<span class="dev-cta-spacer" aria-hidden="true"></span>' +
      '<a class="dev-panel-link" href="./styleguide.html" target="_blank" rel="noopener">Styleguide' +
        '<svg class="dev-panel-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
          '<path d="M14 3h7v7"></path><path d="M10 14 21 3"></path><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path>' +
        '</svg></a>' +
      '<button type="button" class="dev-panel-link" data-strips-toggle aria-pressed="false">Strips</button>' +
      '<button type="button" class="dev-panel-link" data-select-toggle aria-pressed="false">Select</button>' +
      '<button type="button" class="dev-panel-link dev-panel-toggle" data-panel-toggle aria-expanded="true" aria-label="Close testing panel">' +
        '<svg class="dev-panel-toggle-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
          '<path d="M4 10l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>' +
        '</svg>' +
      '</button>' +
      '</div>' +
      group('Rider',
        row('Start', '<input type="range" class="dev-range" min="20" max="95" step="1" value="62" data-rider-start-input aria-label="Rider band start">' +
          '<span class="dev-cta-label" data-rider-start-value>62%</span>', 'rider-start') +
        row('End', '<input type="range" class="dev-range" min="5" max="80" step="1" value="18" data-rider-end-input aria-label="Rider band end">' +
          '<span class="dev-cta-label" data-rider-end-value>18%</span>', 'rider-end') +
        row('Height', '<input type="range" class="dev-range" min="10" max="70" step="1" value="44" data-rider-height-input aria-label="Rider band height">' +
          '<span class="dev-cta-label" data-rider-height-value>44%</span>', 'rider-height') +
        row('Track offset', '<input type="range" class="dev-range" min="-400" max="400" step="1" value="0" data-rider-offset-input aria-label="Rider track offset">' +
          '<span class="dev-cta-label" data-rider-offset-value>0 px</span>', 'rider-offset') +
        row('Show band', '<button type="button" class="dev-band-toggle" role="switch" aria-checked="' + (riderBandVisible ? 'true' : 'false') + '" data-rider-band-toggle>' +
          '<span class="dev-cta-group-switch" aria-hidden="true"></span>' +
          '<span class="dev-band-toggle-label" data-rider-band-state>' + (riderBandVisible ? 'On' : 'Off') + '</span>' +
        '</button>', 'rider-band')) +
      group('Friction game',
        row('Reveal delay', GAME_DELAYS.map(value => `<button type="button" class="dev-preset-button" data-game-delay-value="${value}" aria-pressed="false" title="${value} ms">${value}</button>`).join(''), 'game-delay') +
        row('Reveal duration', GAME_DURATIONS.map(value => `<button type="button" class="dev-preset-button" data-game-duration-value="${value}" aria-pressed="false" title="${value} ms">${value}</button>`).join(''), 'game-duration') +
        row('Reveal',
          '<button type="button" class="dev-preset-button" data-reveal-value="hover" aria-pressed="true">Hover</button>' +
          '<button type="button" class="dev-preset-button" data-reveal-value="scroll" aria-pressed="false">Scroll</button>', 'reveal') +
        row('Band', BANDS.map(item => `<button type="button" class="dev-preset-button" data-band-value="${item.id}" aria-pressed="false">${item.label}</button>`).join(''), 'band')) +
      group('Glass',
        row('Depth', GLASS_DEPTHS.map(value => `<button type="button" class="dev-preset-button" data-glass-depth-value="${value}" aria-pressed="false">${value}</button>`).join(''), 'glass-depth') +
        row('Dispersion', GLASS_SPECTRA.map(value => `<button type="button" class="dev-preset-button" data-glass-spectrum-value="${value}" aria-pressed="false">${value}</button>`).join(''), 'glass-spectrum') +
        row('Tint %', GLASS_TINTS.map(value => `<button type="button" class="dev-preset-button" data-glass-tint-value="${value}" aria-pressed="false">${value}</button>`).join(''), 'glass-tint') +
        row('Blur', GLASS_BLURS.map(value => `<button type="button" class="dev-preset-button" data-glass-blur-value="${value}" aria-pressed="false">${value}</button>`).join(''), 'glass-blur')) +
      group('Intro',
        row('Delay', INTRO_DELAYS.map(value => `<button type="button" class="dev-preset-button" data-intro-delay-value="${value}" aria-pressed="false" title="${value} ms">${value}</button>`).join('') +
          '<button type="button" class="dev-preset-button" data-intro-replay aria-pressed="false">Replay</button>', 'intro-delay') +
        row('Stagger', INTRO_STEPS.map(value => `<button type="button" class="dev-preset-button" data-intro-step-value="${value}" aria-pressed="false" title="${value} ms">${value}</button>`).join(''), 'intro-step')) +
      group('Surface',
        row('Shadow', SHADOW_VARIANTS.map(item => `<button type="button" class="dev-preset-button" data-shadow-variant-value="${item.id}" aria-pressed="false">${item.label}</button>`).join(''), 'shadow') +
        row('Type', TYPE_SCALES.map(item => `<button type="button" class="dev-preset-button" data-type-scale-value="${item.id}" aria-pressed="false">${item.label}</button>`).join(''), 'type')) +
      group('Phone frame',
        row('Outer shell',
          '<button type="button" class="dev-preset-button" data-proto-shell-value="bare" aria-pressed="false">Bare</button>' +
          '<button type="button" class="dev-preset-button" data-proto-shell-value="minimal" aria-pressed="false">Minimal</button>' +
          '<button type="button" class="dev-preset-button" data-proto-shell-value="slab" aria-pressed="false">Slab</button>', 'proto-shell') +
        row('Inner shell',
          '<button type="button" class="dev-preset-button" data-proto-screen-value="native" aria-pressed="false">Native</button>' +
          '<button type="button" class="dev-preset-button" data-proto-screen-value="se" aria-pressed="false">iPhone SE</button>', 'proto-screen')) +
      group('Navigation',
        row('Bottom', '<input type="range" class="dev-range" min="-240" max="240" step="1" value="10" data-nav-bottom-input aria-label="Nav bottom offset">' +
          '<span class="dev-cta-label" data-nav-bottom-value>10 px</span>' + stepper('bottom', 'Bottom'), 'nav-bottom') +
        row('Item gap', '<input type="range" class="dev-range" min="0" max="200" step="1" value="12" data-nav-gap-input aria-label="Nav item gap">' +
          '<span class="dev-cta-label" data-nav-gap-value>12 px</span>' + stepper('gap', 'Item gap'), 'nav-gap') +
        row('Idle shadow', '<input type="range" class="dev-range" min="0" max="15" step="0.01" value="1" data-nav-shadow-input aria-label="Nav idle shadow">' +
          '<span class="dev-cta-label" data-nav-shadow-value>1.00</span>' + stepper('shadow', 'Idle shadow'), 'nav-shadow') +
        row('Hover scale', '<input type="range" class="dev-range" min="0.1" max="2.6" step="0.001" value="1.02" data-nav-hover-scale-input aria-label="Nav hover scale">' +
          '<span class="dev-cta-label" data-nav-hover-scale-value>1.020×</span>' + stepper('hover-scale', 'Hover scale'), 'nav-hover-scale') +
        row('Hover shadow', '<input type="range" class="dev-range" min="0" max="20" step="0.01" value="1" data-nav-hover-shadow-input aria-label="Nav hover shadow">' +
          '<span class="dev-cta-label" data-nav-hover-shadow-value>1.00</span>' + stepper('hover-shadow', 'Hover shadow'), 'nav-hover-shadow') +
        row('Defaults', '<button type="button" class="dev-preset-button" data-nav-defaults title="Ranges and values before the fivefold widening">Restore original</button>', 'nav-defaults')) +
      group('Headings',
        HEADING_PARTS.map(part =>
          row(part.label,
            '<button type="button" class="dev-preset-button" data-heading-part="' + part.id + '" data-heading-align-value="left" aria-pressed="true">Left</button>' +
            '<button type="button" class="dev-preset-button" data-heading-part="' + part.id + '" data-heading-align-value="center" aria-pressed="false">Center</button>', 'heading-' + part.id)
        ).join('')) +
      group('Footer',
        row('Mail variant', CONTACT_VARIANTS.map(item => `<button type="button" class="dev-preset-button" data-contact-variant-value="${item.id}" aria-pressed="false">${item.label}</button>`).join(''), 'contact-variant') +
        FOOTER_PARTS.map(part =>
          row(part.label,
            '<button type="button" class="dev-preset-button" data-footer-part="' + part.id + '" data-footer-align-value="left" aria-pressed="true">Left</button>' +
            '<button type="button" class="dev-preset-button" data-footer-part="' + part.id + '" data-footer-align-value="center" aria-pressed="false">Center</button>', 'footer-' + part.id)
        ).join('')) +
      '<div class="dev-cta-selection" hidden>' +
        '<button type="button" class="dev-preset-button dev-copy-selection" data-copy-selection>Copy selection for agent</button>' +
        '<span class="dev-cta-label" data-copy-status role="status" aria-live="polite"></span>' +
      '</div>';

    let storedGroups = {};
    try { storedGroups = JSON.parse(localStorage.getItem(GROUP_STATE_KEY)) || {}; } catch (e) {}
    panel.querySelectorAll('.dev-cta-group').forEach(group => {
      const key = group.getAttribute('data-group');
      if (key && storedGroups[key]) setGroupCollapsed(group, true);
    });

    document.body.appendChild(panel);
    updateCtaPanelToggle(panel);
    applyProtoFrame();
    panel.querySelectorAll('[data-proto-shell-value]').forEach(button => {
      button.addEventListener('click', () => {
        protoShell = button.dataset.protoShellValue;
        try { localStorage.setItem(PROTO_SHELL_KEY, protoShell); } catch (e) {}
        applyProtoFrame();
      });
    });
    panel.querySelectorAll('[data-proto-screen-value]').forEach(button => {
      button.addEventListener('click', () => {
        protoScreen = button.dataset.protoScreenValue;
        try { localStorage.setItem(PROTO_SCREEN_KEY, protoScreen); } catch (e) {}
        applyProtoFrame();
      });
    });
    const riderStart = panel.querySelector('[data-rider-start-input]');
    const riderEnd = panel.querySelector('[data-rider-end-input]');
    const riderHeight = panel.querySelector('[data-rider-height-input]');
    const riderOffset = panel.querySelector('[data-rider-offset-input]');
    const riderStartLabel = panel.querySelector('[data-rider-start-value]');
    const riderEndLabel = panel.querySelector('[data-rider-end-value]');
    const riderHeightLabel = panel.querySelector('[data-rider-height-value]');
    const riderOffsetLabel = panel.querySelector('[data-rider-offset-value]');
    if (window.riderBand) {
      if (riderStart) { riderStart.value = String(window.riderBand.start()); riderStartLabel.textContent = window.riderBand.start() + '%'; }
      if (riderEnd) { riderEnd.value = String(window.riderBand.end()); riderEndLabel.textContent = window.riderBand.end() + '%'; }
      if (riderHeight) { riderHeight.value = String(window.riderBand.height()); riderHeightLabel.textContent = window.riderBand.height() + '%'; }
      if (riderOffset) { riderOffset.value = String(window.riderBand.offset()); riderOffsetLabel.textContent = window.riderBand.offset() + ' px'; }
    }
    const updateRiderOverlay = buildRiderOverlay(panel);
    applyGameDelay(readGameDelay());
    applyGameDuration(readGameDuration());
    panel.addEventListener('input', event => {
      const riderStartInput = event.target.closest('[data-rider-start-input]');
      if (riderStartInput && window.riderBand) {
        const value = window.riderBand.setStart(Number(riderStartInput.value));
        riderStartInput.value = String(value);
        riderStartLabel.textContent = value + '%';
        riderEnd.value = String(window.riderBand.end());
        riderEndLabel.textContent = window.riderBand.end() + '%';
        riderHeight.value = String(window.riderBand.height());
        riderHeightLabel.textContent = window.riderBand.height() + '%';
        updateRiderOverlay();
      }
      const riderEndInput = event.target.closest('[data-rider-end-input]');
      if (riderEndInput && window.riderBand) {
        const value = window.riderBand.setEnd(Number(riderEndInput.value));
        riderEndInput.value = String(value);
        riderEndLabel.textContent = value + '%';
        riderStart.value = String(window.riderBand.start());
        riderStartLabel.textContent = window.riderBand.start() + '%';
        riderHeight.value = String(window.riderBand.height());
        riderHeightLabel.textContent = window.riderBand.height() + '%';
        updateRiderOverlay();
      }
      const riderHeightInput = event.target.closest('[data-rider-height-input]');
      if (riderHeightInput && window.riderBand) {
        const value = window.riderBand.setHeight(Number(riderHeightInput.value));
        riderHeightInput.value = String(value);
        riderHeightLabel.textContent = value + '%';
        riderStart.value = String(window.riderBand.start());
        riderStartLabel.textContent = window.riderBand.start() + '%';
        riderEnd.value = String(window.riderBand.end());
        riderEndLabel.textContent = window.riderBand.end() + '%';
        updateRiderOverlay();
      }
      const riderOffsetInput = event.target.closest('[data-rider-offset-input]');
      if (riderOffsetInput && window.riderBand) {
        const value = window.riderBand.setOffset(Number(riderOffsetInput.value));
        riderOffsetInput.value = String(value);
        riderOffsetLabel.textContent = value + ' px';
        updateRiderOverlay();
      }
      const bottom = event.target.closest('[data-nav-bottom-input]');
      if (bottom) setNav(NAV_BOTTOM_KEY, Number(bottom.value));
      const gap = event.target.closest('[data-nav-gap-input]');
      if (gap) setNav(NAV_GAP_KEY, Number(gap.value));
      const idleShadow = event.target.closest('[data-nav-shadow-input]');
      if (idleShadow) setNav(NAV_SHADOW_KEY, snapped(idleShadow, 0.1));
      const hoverScale = event.target.closest('[data-nav-hover-scale-input]');
      if (hoverScale) setNav(NAV_HOVER_SCALE_KEY, snapped(hoverScale, 0.01));
      const hoverShadow = event.target.closest('[data-nav-hover-shadow-input]');
      if (hoverShadow) setNav(NAV_HOVER_SHADOW_KEY, snapped(hoverShadow, 0.1));
    });
    wireCtaPanelDrag(panel);
    wireCtaPanelResize(panel);
    restoreCtaPanelBox(panel);
    panel.addEventListener('click', event => {
      const panelToggle = event.target.closest('[data-panel-toggle]');
      if (panelToggle) {
        toggleCtaPanel();
        return;
      }
      const groupToggle = event.target.closest('[data-group-toggle]');
      if (groupToggle) {
        const group = groupToggle.closest('.dev-cta-group');
        toggleGroup(group);
        if (group.getAttribute('data-group') === 'rider') updateRiderOverlay();
        return;
      }
      const bandToggle = event.target.closest('[data-rider-band-toggle]');
      if (bandToggle) {
        riderBandVisible = !riderBandVisible;
        bandToggle.setAttribute('aria-checked', String(riderBandVisible));
        const label = bandToggle.querySelector('[data-rider-band-state]');
        if (label) label.textContent = riderBandVisible ? 'On' : 'Off';
        try { localStorage.setItem(BAND_VISIBLE_KEY, riderBandVisible ? '1' : '0'); } catch (e) {}
        updateRiderOverlay();
        return;
      }
      if (event.target.closest('[data-nav-defaults]')) {
        restoreNavDefaults();
        return;
      }
      const stepButton = event.target.closest('[data-nav-step]');
      if (stepButton) {
        navStep(stepButton.getAttribute('data-nav-step'), Number(stepButton.getAttribute('data-dir')));
        return;
      }
      const delayButton = event.target.closest('[data-game-delay-value]');
      if (delayButton) applyGameDelay(Number(delayButton.getAttribute('data-game-delay-value')));
      const durationButton = event.target.closest('[data-game-duration-value]');
      if (durationButton) applyGameDuration(Number(durationButton.getAttribute('data-game-duration-value')));
      const depthButton = event.target.closest('[data-glass-depth-value]');
      if (depthButton) applyGlass('depth', Number(depthButton.getAttribute('data-glass-depth-value')), 'data-glass-depth-value');
      const spectrumButton = event.target.closest('[data-glass-spectrum-value]');
      if (spectrumButton) applyGlass('spectrum', Number(spectrumButton.getAttribute('data-glass-spectrum-value')), 'data-glass-spectrum-value');
      const tintButton = event.target.closest('[data-glass-tint-value]');
      if (tintButton) applyGlass('tint', Number(tintButton.getAttribute('data-glass-tint-value')), 'data-glass-tint-value');
      const blurButton = event.target.closest('[data-glass-blur-value]');
      if (blurButton) applyGlass('blur', Number(blurButton.getAttribute('data-glass-blur-value')), 'data-glass-blur-value');
      const replayButton = event.target.closest('[data-intro-replay]');
      if (replayButton && window.replayIntro) window.replayIntro();
      const introDelayButton = event.target.closest('[data-intro-delay-value]');
      if (introDelayButton) applyIntro(INTRO_DELAY_KEY, Number(introDelayButton.getAttribute('data-intro-delay-value')), 'data-intro-delay-value');
      const introStepButton = event.target.closest('[data-intro-step-value]');
      if (introStepButton) applyIntro(INTRO_STEP_KEY, Number(introStepButton.getAttribute('data-intro-step-value')), 'data-intro-step-value');
      const shadowButton = event.target.closest('[data-shadow-variant-value]');
      if (shadowButton) applyShadowVariant(shadowButton.getAttribute('data-shadow-variant-value'));
      const typeButton = event.target.closest('[data-type-scale-value]');
      if (typeButton) applyTypeScale(typeButton.getAttribute('data-type-scale-value'));
      const contactButton = event.target.closest('[data-contact-variant-value]');
      if (contactButton) applyContactVariant(contactButton.getAttribute('data-contact-variant-value'));
      const stripsToggle = event.target.closest('[data-strips-toggle]');
      if (stripsToggle) {
        const panel = document.getElementById('devStripsPanel');
        toggleStripsPanel(panel ? panel.hidden : true);
        stripsToggle.setAttribute('aria-pressed', String(panel ? !panel.hidden : true));
      }
      const selectToggle = event.target.closest('[data-select-toggle]');
      if (selectToggle) toggleSelectionMode();
      const copyButton = event.target.closest('[data-copy-selection]');
      if (copyButton) copySelection(copyButton);
      const headingButton = event.target.closest('[data-heading-part]');
      if (headingButton) {
        applyHeadingAlign(
          headingButton.getAttribute('data-heading-part'),
          headingButton.getAttribute('data-heading-align-value')
        );
      }
      const bandButton = event.target.closest('[data-band-value]');
      if (bandButton) applyBand(bandButton.getAttribute('data-band-value'));
      const revealButton = event.target.closest('[data-reveal-value]');
      if (revealButton) applyReveal(revealButton.getAttribute('data-reveal-value'));
      const alignButton = event.target.closest('[data-footer-part]');
      if (alignButton) {
        applyFooterAlign(
          alignButton.getAttribute('data-footer-part'),
          alignButton.getAttribute('data-footer-align-value')
        );
      }
    });
    syncGlassRows();
    syncIntroRows();
    applyShadowVariant(readShadowVariant());
    applyTypeScale(readTypeScale());
    applyContactVariant(readContactVariant());
    applyContactCopy();
    renderFooterAlign();
    applyReveal(readReveal());
    applyBand(readBand());
    renderHeadingAlign();
    applyNav();
  }

  // ---------- selection mode for the testing panel ----------
  // Rows can be ticked and handed over as one JSON block, so a question about
  // the current configuration carries exact values instead of screenshots.
  function rowValue(row) {
    const active = row.querySelector('.dev-preset-button.is-active');
    if (active) {
      for (const attribute of active.attributes) {
        if (attribute.name.startsWith('data-') && attribute.name.endsWith('-value')) return attribute.value;
      }
    }
    const range = row.querySelector('input[type="range"]');
    if (range) return Number(range.value);
    return null;
  }

  function selectionSnapshot() {
    const values = {};
    document.querySelectorAll('#devCtaPanel .dev-cta-row').forEach(row => {
      const checkbox = row.querySelector('[data-row-check]');
      if (!checkbox || !checkbox.checked) return;
      const group = row.closest('.dev-cta-group');
      const groupTitle = group ? group.querySelector('.dev-cta-group-title').textContent.trim() : '';
      const label = row.querySelector('.dev-cta-label').textContent.trim();
      values[groupTitle + ' · ' + label] = rowValue(row);
    });
    return {
      // Every value below was read in this theme. Glass tint/blur are shared
      // settings, not per-theme values.
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      values: values
    };
  }

  function toggleSelectionMode(on) {
    const panel = document.getElementById('devCtaPanel');
    if (!panel) return;
    const active = on === undefined ? !panel.classList.contains('is-selecting') : on;
    panel.classList.toggle('is-selecting', active);
    const toggle = panel.querySelector('[data-select-toggle]');
    if (toggle) {
      toggle.classList.toggle('is-active', active);
      toggle.setAttribute('aria-pressed', String(active));
      toggle.textContent = active ? 'Done' : 'Select';
    }
    const bar = panel.querySelector('.dev-cta-selection');
    if (bar) bar.hidden = !active;
    panel.querySelectorAll('.dev-cta-row').forEach(row => {
      let box = row.querySelector('[data-row-check]');
      if (active && !box) {
        box = document.createElement('input');
        box.type = 'checkbox';
        box.className = 'dev-row-check';
        box.setAttribute('data-row-check', '');
        box.setAttribute('aria-label', 'Select row');
        row.insertBefore(box, row.firstChild);
      }
      if (box) box.hidden = !active;
    });
  }

  function copySelection(button) {
    const data = selectionSnapshot();
    const keys = Object.keys(data.values);
    const status = document.querySelector('[data-copy-status]');
    if (!keys.length) {
      if (status) status.textContent = 'Nothing selected';
      return;
    }
    const text = JSON.stringify(data, null, 2);
    const done = () => {
      if (status) status.textContent = keys.length + ' rows copied';
      if (button) {
        const previous = button.textContent;
        button.textContent = 'Copied';
        setTimeout(() => { button.textContent = previous; }, 1600);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => {
        if (status) status.textContent = 'Copy failed';
      });
    } else if (status) status.textContent = 'Copy not available';
  }

  // ---------- strips review panel ----------
  // Same frame, width and drag behaviour as the testing panel. The review
  // controls from #brandLab are moved into it instead of opening a tab.
  function buildStripsPanel() {
    if (document.getElementById('devStripsPanel')) return document.getElementById('devStripsPanel');
    const lab = document.getElementById('brandLab');
    if (!lab) return null;

    const panel = document.createElement('div');
    panel.id = 'devStripsPanel';
    panel.hidden = true;
    panel.innerHTML = '<div class="dev-cta-head">' +
        '<span class="dev-cta-grip" title="Drag to move" aria-hidden="true">' + DRAG_SVG + '</span>' +
        '<span class="dev-cta-title">Strips</span>' +
        '<span class="dev-cta-spacer" aria-hidden="true"></span>' +
        '<button type="button" class="dev-panel-link" data-strips-close>Close</button>' +
      '</div>' +
      '<div class="dev-strips-body"></div>';
    document.body.appendChild(panel);

    const body = panel.querySelector('.dev-strips-body');
    body.appendChild(lab);
    lab.hidden = false;

    const close = panel.querySelector('[data-strips-close]');
    if (close) close.addEventListener('click', () => toggleStripsPanel(false));

    wireCtaPanelDrag(panel);
    if (!panel.hidden) applyStoredCtaPanelBox(panel);
    return panel;
  }

  function toggleStripsPanel(show) {
    const panel = buildStripsPanel();
    if (!panel) return;
    panel.hidden = show === undefined ? !panel.hidden : !show;
    if (!panel.hidden) applyStoredCtaPanelBox(panel);
  }

  // ---------- CTA panel position and visibility ----------
  function clampCtaPanelPosition(panel, left, top) {
    const maxLeft = Math.max(8, window.innerWidth - panel.offsetWidth - 8);
    const maxTop = Math.max(8, window.innerHeight - panel.offsetHeight - 8);
    return {
      left: Math.min(Math.max(8, left), maxLeft),
      top: Math.min(Math.max(8, top), maxTop)
    };
  }

  function placeCtaPanel(panel, position) {
    const clamped = clampCtaPanelPosition(panel, position.left, position.top);
    panel.style.left = clamped.left + 'px';
    panel.style.top = clamped.top + 'px';
    panel.style.bottom = 'auto';
    return clamped;
  }

  function readCtaPanelBox(panel) {
    try {
      const raw = localStorage.getItem(panelPosKey(panel));
      if (!raw) return null;
      const box = JSON.parse(raw);
      if (!box || !Number.isFinite(box.left) || !Number.isFinite(box.top)) return null;
      return box;
    } catch (e) {
      return null;
    }
  }

  // The testing panel keeps the original key, so positions from earlier
  // sessions survive; every other panel gets its own suffix.
  function panelPosKey(panel) {
    if (!panel || !panel.id || panel.id === 'devCtaPanel') return CTA_POS_KEY;
    return CTA_POS_KEY + ':' + panel.id;
  }

  function saveCtaPanelBox(box, panel) {
    try { localStorage.setItem(panelPosKey(panel), JSON.stringify(box)); } catch (e) {}
  }

  function currentBox(panel) {
    const rect = panel.getBoundingClientRect();
    return {
      left: Math.round(rect.left),
      top: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  }

  function restoreCtaPanelBox(panel) {
    const stored = readCtaPanelBox();
    if (stored) applyStoredCtaPanelBox(panel);
    window.addEventListener('resize', () => {
      if (panel.hidden || panel.classList.contains('is-closed')) return;
      const rect = panel.getBoundingClientRect();
      saveCtaPanelBox(placeCtaPanel(panel, { left: rect.left, top: rect.top }), panel);
    });
  }

  function applyStoredCtaPanelBox(panel) {
    const stored = readCtaPanelBox(panel);
    if (!stored) {
      panel.style.width = '';
      panel.style.height = '';
      panel.style.maxWidth = '';
      panel.style.maxHeight = '';
      return;
    }
    // A stored size from a taller window must not push the panel below the
    // viewport: then its content cannot scroll and the page scrolls instead.
    const limit = Math.max(240, window.innerHeight - 150);
    const height = Math.min(stored.height || limit, limit);
    if (stored.width) panel.style.width = stored.width + 'px';
    panel.style.height = height + 'px';
    panel.style.maxWidth = 'none';
    panel.style.maxHeight = 'none';
    placeCtaPanel(panel, stored);
  }

  var PANEL_MIN_WIDTH = 320;
  var PANEL_MIN_HEIGHT = 200;

  function wireCtaPanelDrag(panel) {
    // The whole panel surface drags; interactive elements keep their own
    // behaviour, so a click on a button never starts a drag.
    const interactive = 'button, input, select, textarea, a, label';
    let drag = null;
    panel.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      if (event.target.closest && event.target.closest(interactive)) return;
      const rect = panel.getBoundingClientRect();
      drag = { dx: event.clientX - rect.left, dy: event.clientY - rect.top, pointerId: event.pointerId };
      panel.setPointerCapture(event.pointerId);
      panel.classList.add('is-dragging');
      event.preventDefault();
    });
    panel.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      placeCtaPanel(panel, { left: event.clientX - drag.dx, top: event.clientY - drag.dy });
    });
    const endDrag = event => {
      if (!drag || (event.pointerId !== undefined && event.pointerId !== drag.pointerId)) return;
      drag = null;
      panel.classList.remove('is-dragging');
      saveCtaPanelBox(currentBox(panel), panel);
    };
    panel.addEventListener('pointerup', endDrag);
    panel.addEventListener('pointercancel', endDrag);
  }

  // Window-like resizing: no grip, no handle elements. The pointer position
  // near an edge sets the cursor, and a drag from there resizes the panel.
  var PANEL_EDGE = 8;

  function edgeSide(panel, event) {
    const rect = panel.getBoundingClientRect();
    const nearLeft = event.clientX - rect.left <= PANEL_EDGE;
    const nearRight = rect.right - event.clientX <= PANEL_EDGE;
    const nearTop = event.clientY - rect.top <= PANEL_EDGE;
    const nearBottom = rect.bottom - event.clientY <= PANEL_EDGE;
    let side = '';
    if (nearTop) side += 'n';
    if (nearBottom) side += 's';
    if (nearLeft) side += 'w';
    if (nearRight) side += 'e';
    return side;
  }

  function cursorForSide(side) {
    if (side === 'n' || side === 's') return 'ns-resize';
    if (side === 'e' || side === 'w') return 'ew-resize';
    if (side === 'ne' || side === 'sw') return 'nesw-resize';
    if (side === 'nw' || side === 'se') return 'nwse-resize';
    return '';
  }

  function wireCtaPanelResize(panel) {
    let state = null;

    panel.addEventListener('pointermove', event => {
      if (state) return;
      if (event.buttons) return;
      const side = edgeSide(panel, event);
      panel.style.cursor = cursorForSide(side) || '';
    });

    panel.addEventListener('pointerleave', () => {
      if (!state) panel.style.cursor = '';
    });

    // Capture phase: an edge press must resize, not drag the whole panel.
    panel.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      const side = edgeSide(panel, event);
      if (!side) return;
      const rect = panel.getBoundingClientRect();
      state = {
        side: side,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
      panel.setPointerCapture(event.pointerId);
      panel.classList.add('is-resizing');
      event.preventDefault();
      event.stopPropagation();
    }, true);

    panel.addEventListener('pointermove', event => {
      if (!state || event.pointerId !== state.pointerId) return;
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      let width = state.width;
      let height = state.height;
      let left = state.left;
      let top = state.top;

      if (state.side.indexOf('e') !== -1) width = Math.max(PANEL_MIN_WIDTH, state.width + dx);
      if (state.side.indexOf('s') !== -1) height = Math.max(PANEL_MIN_HEIGHT, state.height + dy);
      if (state.side.indexOf('w') !== -1) {
        width = Math.max(PANEL_MIN_WIDTH, state.width - dx);
        left = state.left + (state.width - width);
      }
      if (state.side.indexOf('n') !== -1) {
        height = Math.max(PANEL_MIN_HEIGHT, state.height - dy);
        top = state.top + (state.height - height);
      }

      panel.style.width = width + 'px';
      panel.style.height = height + 'px';
      panel.style.maxWidth = 'none';
      panel.style.maxHeight = 'none';
      placeCtaPanel(panel, { left: left, top: top });
    });

    const end = event => {
      if (!state || (event.pointerId !== undefined && event.pointerId !== state.pointerId)) return;
      state = null;
      panel.classList.remove('is-resizing');
      panel.style.cursor = '';
      saveCtaPanelBox(currentBox(panel), panel);
    };
    panel.addEventListener('pointerup', end);
    panel.addEventListener('pointercancel', end);
  }

  function isCtaPanelTextField(target) {
    if (!target) return false;
    if (target.isContentEditable) return true;
    const tag = (target.tagName || '').toLowerCase();
    if (tag === 'textarea' || tag === 'select') return true;
    if (tag === 'input') {
      const type = (target.getAttribute('type') || 'text').toLowerCase();
      return ['text', 'search', 'email', 'url', 'tel', 'password', 'number',
        'date', 'datetime-local', 'month', 'week', 'time'].indexOf(type) !== -1;
    }
    return false;
  }

  // Shift + ° is identified by the character it produces, never by a key
  // code: on Apple German keyboards the <> key also reports "Backquote", so a
  // code check made Shift + > toggle the panel as well as the edit button.
  function isCaretKey(event) {
    const key = event.key || '';
    if (key === '^' || key === '°') return true;
    if (key === 'Dead' && (!event.code || event.code === 'Unidentified')) return true;
    return false;
  }

  function updateCtaPanelToggle(panel) {
    if (!panel) return;
    const toggle = panel.querySelector('[data-panel-toggle]');
    if (!toggle) return;
    const closed = panel.classList.contains('is-closed');
    toggle.setAttribute('aria-expanded', String(!closed));
    toggle.setAttribute('aria-label', closed ? 'Open testing panel' : 'Close testing panel');
  }

  function toggleCtaPanel(show) {
    const panel = document.getElementById('devCtaPanel');
    if (!panel) return;
    const closed = show === undefined ? !panel.classList.contains('is-closed') : !show;
    panel.classList.toggle('is-closed', closed);
    updateCtaPanelToggle(panel);
    try { localStorage.setItem(CTA_OPEN_KEY, closed ? '0' : '1'); } catch (e) {}
    if (!closed) applyStoredCtaPanelBox(panel);
  }

  function wireTextToolbar() {
    document.addEventListener('selectionchange', updateTextToolbar);
    document.addEventListener('focusin', updateTextToolbar);
    window.addEventListener('resize', hideTextToolbar);
    window.addEventListener('scroll', hideTextToolbar, { passive: true });
  }

  function wireCtaPanelShortcut() {
    document.addEventListener('keydown', event => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isCtaPanelTextField(event.target)) return;
      if (!event.shiftKey || !isCaretKey(event)) return;
      event.preventDefault();
      toggleCtaPanel();
    });
  }

  // Shift + > hides the edit button: it follows the pointer and can sit over
  // the content being judged. The same shortcut brings it back; the state is
  // deliberately not stored, so a reload restores the button.
  function wireEditToggleShortcut() {
    document.addEventListener('keydown', event => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isCtaPanelTextField(event.target)) return;
      if (!event.shiftKey || event.key !== '>') return;
      event.preventDefault();
      const button = document.getElementById('devPresetToggle');
      if (!button) return;
      button.style.display = button.style.display === 'none' ? '' : 'none';
    });
  }

  // ---------- toolbar ----------
  const SHEET_TITLES = {
    card: 'New Card',
    media: 'Media',
    move: 'Move',
    link: 'Link',
    section: 'New section',
    blocks: 'Blocks',
    presets: 'Presets',
    preset: 'Preset',
    help: 'Help',
    confirm: 'Confirm'
  };
  const BAR_POS_KEY = 'portfolio-dev-bar-pos';
  const CC_BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>';
  const CC_ICONS = {
    presets: '<svg class="dev-cc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z"></path></svg>',
    save: '<svg class="dev-cc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"></path></svg>',
    undo: '<svg class="dev-cc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14l-5-5 5-5"></path><path d="M4 9h9a6 6 0 110 12h-3"></path></svg>',
    redo: '<svg class="dev-cc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14l5-5-5-5"></path><path d="M20 9h-9a6 6 0 100 12h3"></path></svg>',
    revert: '<svg class="dev-cc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path></svg>',
    card: '<svg class="dev-cc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>',
    help: '<svg class="dev-cc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9.5 9.2a2.6 2.6 0 115.1.6c0 1.6-2.6 2-2.6 3.7"></path><path d="M12 17h.01"></path></svg>'
  };

  function readBarPos() {
    try {
      const value = JSON.parse(localStorage.getItem(BAR_POS_KEY) || 'null');
      if (!value || typeof value.x !== 'number' || typeof value.y !== 'number') return null;
      return value;
    } catch (e) {
      return null;
    }
  }

  function writeBarPos(value) {
    try {
      if (value) localStorage.setItem(BAR_POS_KEY, JSON.stringify({ x: Math.round(value.x), y: Math.round(value.y) }));
      else localStorage.removeItem(BAR_POS_KEY);
    } catch (e) {}
  }

  function buildToolbar() {
    toolbar = document.createElement('div');
    toolbar.id = 'devPresetBar';
    toolbar.setAttribute('role', 'dialog');
    toolbar.setAttribute('aria-label', 'Dev controls');
    toolbar.innerHTML = '' +
      '<div class="dev-cc-head">' +
        '<span class="dev-cc-grip" aria-hidden="true"></span>' +
        '<span class="dev-cc-title">Editing</span>' +
        '<button type="button" class="dev-cc-close" data-act="close" aria-label="Close the editor">' + CROSS_SVG + '</button>' +
      '</div>' +
      '<div class="dev-cc-grid">' +
        '<button type="button" class="dev-cc-tile" data-act="presets">' + CC_ICONS.presets +
          '<span class="dev-cc-label">Presets</span><span class="dev-cc-value" id="devPresetCurrent">None</span></button>' +
        '<button type="button" class="dev-cc-tile" data-act="undo">' + CC_ICONS.undo +
          '<span class="dev-cc-label">Undo</span></button>' +
        '<button type="button" class="dev-cc-tile" data-act="redo">' + CC_ICONS.redo +
          '<span class="dev-cc-label">Redo</span></button>' +
        '<button type="button" class="dev-cc-tile" data-act="revert">' + CC_ICONS.revert +
          '<span class="dev-cc-label">Discard Changes</span></button>' +
        '<button type="button" class="dev-cc-tile" data-act="new-card">' + CC_ICONS.card +
          '<span class="dev-cc-label">New Card</span></button>' +
        '<button type="button" class="dev-cc-tile" data-act="help">' + CC_ICONS.help +
          '<span class="dev-cc-label">Help</span></button>' +
      '</div>';
    document.body.appendChild(toolbar);
    ensureSubBar();
    updateButtons();
    requestAnimationFrame(updateBarHeight);
    toolbar.addEventListener('click', event => {
      const target = event.target.closest('[data-act]');
      if (!target || !toolbar.contains(target)) return;
      handleAction(target.getAttribute('data-act'));
    });
    actionBar = document.createElement('div');
    actionBar.id = 'devActionBar';
    actionBar.setAttribute('aria-label', 'Dev actions');
    document.body.appendChild(actionBar);
    actionBar.addEventListener('click', event => {
      const target = event.target.closest('[data-act]');
      if (target) handleAction(target.getAttribute('data-act'));
    });
    renderActionCard();
    makeBarDraggable();
    if (window.ResizeObserver && !window.__devBarObserver) {
      // Sheet content, the details disclosure and font loading all change the
      // card's height after it opens; keep the dock and the anchor in step.
      window.__devBarObserver = new ResizeObserver(() => updateBarHeight());
      window.__devBarObserver.observe(toolbar);
    }
  }

  function handleAction(act) {
    if (act === 'close') toggle(false);
    if (act === 'presets') openSub('presets');
    if (act === 'new') newPreset();
    if (act === 'new-card') openSub('card');
    if (act === 'undo') undo();
    if (act === 'redo') redo();
    if (act === 'revert') revert();
    if (act === 'help') openSub('help');
    if (act === 'sub-close') closeSub();
  }

  // The action card is docked below the control card. A sheet moves its own
  // action row into it, so the primary buttons never scroll out of reach.
  function renderActionCard() {
    if (!actionBar) return;
    const sheetActions = subBar ? subBar.querySelector('.dev-sub-actions') : null;
    actionBar.innerHTML = '';
    if (sheetActions) {
      actionBar.appendChild(sheetActions);
    } else {
      actionBar.innerHTML = '<button type="button" class="dev-preset-button" data-act="close">Close</button>';
    }
    updateButtons();
    requestAnimationFrame(placeActionBar);
  }

  function placeActionBar() {
    if (!actionBar || !toolbar) return;
    const open = toolbar.classList.contains('is-open');
    actionBar.classList.toggle('is-open', open);
    if (!open) return;
    // Layout values, not the animated rect: during the card's opening
    // transition the rect is still scaled by .98 and the dock would inherit it.
    const left = parseFloat(toolbar.style.left) || 0;
    const top = parseFloat(toolbar.style.top) || 0;
    const width = toolbar.offsetWidth;
    const height = actionBar.offsetHeight || 48;
    const gap = 8;
    let dockTop = top + toolbar.offsetHeight + gap;
    if (dockTop + height > window.innerHeight - 8) dockTop = Math.max(8, top - height - gap);
    actionBar.style.left = left + 'px';
    actionBar.style.top = dockTop + 'px';
    actionBar.style.width = width + 'px';
  }

  function makeBarDraggable() {
    const head = toolbar.querySelector('.dev-cc-head');
    if (!head) return;
    let drag = null;
    head.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('button')) return;
      event.preventDefault();
      const rect = toolbar.getBoundingClientRect();
      drag = { dx: event.clientX - rect.left, dy: event.clientY - rect.top, moved: false };
      toolbar.classList.add('is-dragging');
      if (head.setPointerCapture) head.setPointerCapture(event.pointerId);
    });
    head.addEventListener('pointermove', event => {
      if (!drag) return;
      const width = toolbar.offsetWidth;
      const height = toolbar.offsetHeight;
      const dock = actionBar ? actionBar.offsetHeight + 8 : 0;
      const left = Math.min(Math.max(8, event.clientX - drag.dx), window.innerWidth - width - 8);
      const top = Math.min(Math.max(8, event.clientY - drag.dy), Math.max(8, window.innerHeight - height - dock - 16));
      if (!drag.moved && (Math.abs(left - parseFloat(toolbar.style.left)) > 2 || Math.abs(top - parseFloat(toolbar.style.top)) > 2)) drag.moved = true;
      toolbar.style.left = left + 'px';
      toolbar.style.top = top + 'px';
      toolbar.dataset.anchored = '0';
      placeActionBar();
    });
    const end = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      toolbar.classList.remove('is-dragging');
      if (moved) writeBarPos({ x: parseFloat(toolbar.style.left), y: parseFloat(toolbar.style.top) });
    };
    head.addEventListener('pointerup', end);
    head.addEventListener('pointercancel', end);
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
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false">' +
      '<path d="M4 6h10"></path><path d="M18 6h2"></path><circle cx="16" cy="6" r="2"></circle>' +
      '<path d="M4 12h4"></path><path d="M12 12h8"></path><circle cx="10" cy="12" r="2"></circle>' +
      '<path d="M4 18h10"></path><path d="M18 18h2"></path><circle cx="16" cy="18" r="2"></circle>' +
      '</svg>';
    btn.addEventListener('click', () => toggle());
    // Body, not the nav: the nav carries a backdrop filter, which turns a
    // fixed child into a locally positioned one and broke the trail.
    document.body.appendChild(btn);
    followPointer(btn);
  }

  // The toggle follows the pointer with a short lag. The position is written
  // directly and the lag comes from a CSS transition; a rAF loop stops in a
  // background tab and would leave the button stuck.
  // The toggle follows the pointer. Alt + drag moves it for the moment; the
  // trail takes over again on the next pointer move, so it never gets lost.
  function followPointer(btn) {
    // The button sits just below-right of the cursor, so it travels in the
    // same direction and never covers the pointer it belongs to.
    const OFFSET = { x: 30, y: 30 };
    const MARGIN = 8;
    const size = 44;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function clamp(point) {
      return {
        x: Math.min(Math.max(MARGIN, point.x), window.innerWidth - size - MARGIN),
        y: Math.min(Math.max(MARGIN, point.y), window.innerHeight - size - MARGIN)
      };
    }

    function place(point) {
      const clamped = clamp(point);
      btn.style.transform = 'translate3d(' + clamped.x.toFixed(1) + 'px,' + clamped.y.toFixed(1) + 'px,0)';
      return clamped;
    }

    let position = place({ x: window.innerWidth - size - 24, y: window.innerHeight - size - 110 });
    if (!reduceMotion) btn.classList.add('is-following');

    // Catch zone: inside 110px the button holds still and grows a little, so
    // the pointer can actually reach it; it resumes beyond 170px. The gap
    // between the two numbers is hysteresis, which stops flicker at the edge.
    let held = false;
    let last = null;
    let settleTimer = 0;
    let settleAnim = null;
    let drag = null;
    let suppressClick = false;

    // The follow transition is short, so the button keeps up while the pointer
    // moves. When it stops, a longer expo tail glides the last pixels instead
    // of snapping to the target.
    function cancelSettle() {
      clearTimeout(settleTimer);
      if (settleAnim) {
        settleAnim.cancel();
        settleAnim = null;
      }
    }

    function settle() {
      const target = btn.style.transform;
      if (!target) return;
      const from = getComputedStyle(btn).transform;
      if (!from || from === 'none' || from === target) return;
      cancelSettle();
      settleAnim = btn.animate(
        [{ transform: from }, { transform: target }],
        { duration: 620, easing: 'cubic-bezier(.16, 1, .3, 1)' }
      );
      settleAnim.addEventListener('finish', function () {
        if (settleAnim) {
          settleAnim.cancel();
          settleAnim = null;
        }
      });
    }

    function scheduleSettle() {
      cancelSettle();
      settleTimer = setTimeout(settle, 110);
    }

    // Alt + drag: the only way to place the button by hand.
    btn.addEventListener('pointerdown', event => {
      if (!event.altKey || event.button !== 0) return;
      event.preventDefault();
      const box = btn.getBoundingClientRect();
      drag = { pointerX: event.clientX, pointerY: event.clientY, left: box.left, top: box.top, moved: false };
      cancelSettle();
      document.body.classList.add('dev-toggle-drag');
      if (btn.setPointerCapture) btn.setPointerCapture(event.pointerId);
    });
    btn.addEventListener('pointermove', event => {
      if (!drag) return;
      event.preventDefault();
      if (Math.abs(event.clientX - drag.pointerX) + Math.abs(event.clientY - drag.pointerY) > 3) drag.moved = true;
      position = place({ x: drag.left + event.clientX - drag.pointerX, y: drag.top + event.clientY - drag.pointerY });
    });
    const endDrag = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      document.body.classList.remove('dev-toggle-drag');
      if (!moved) return;
      suppressClick = true;
      btn.classList.remove('is-ready');
      setTimeout(() => { suppressClick = false; }, 0);
    };
    btn.addEventListener('pointerup', endDrag);
    btn.addEventListener('pointercancel', endDrag);

    // Alt + click never toggles: Alt means "move". A click right after a drag
    // is swallowed even if the key was released in time.
    btn.addEventListener('click', event => {
      if (!event.altKey && !suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);

    if (reduceMotion) return;

    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      // Frozen while the popover is open (the button is its anchor) and
      // while the friction game runs (it would chase the paddle hand).
      if (state.open) return;
      if (document.body.classList.contains('kontext-game-on')) return;
      // A click can emit a stray move at 0,0, which parked the button in the
      // top-left corner. A jump that fast cannot be a real cursor either.
      if (event.clientX === 0 && event.clientY === 0) return;
      if (last) {
        const jump = Math.hypot(event.clientX - last.x, event.clientY - last.y);
        const turned = performance.now() - last.at;
        if (jump > 1200 && turned < 80) return;
      }
      last = { x: event.clientX, y: event.clientY, at: performance.now() };
      // Distance to the intended position, never to the animating box: the
      // transition and the 1.08 scale move the rect, which fed the distance
      // back into the hold and made it flicker at the boundary.
      const dx = event.clientX - (position.x + size / 2);
      const dy = event.clientY - (position.y + size / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (held) {
        if (distance < 170) return;
        held = false;
        btn.classList.remove('is-ready');
      } else if (distance < 110) {
        held = true;
        btn.classList.add('is-ready');
        return;
      }

      position = place({ x: event.clientX + OFFSET.x, y: event.clientY + OFFSET.y });
      scheduleSettle();
    }, { passive: true });

    window.addEventListener('resize', () => {
      position = place(position);
    });
  }

  // The edit controls add in-flow rows to the open card, so the document grows
  // by hundreds of pixels on every open. Keep the content under the top of the
  // viewport where it was instead of letting the page appear to scroll.
  function keepViewportAnchor(mutate) {
    const marker = document.elementFromPoint(Math.round(window.innerWidth * 0.55), 140);
    const before = marker ? marker.getBoundingClientRect().top : 0;
    mutate();
    if (!marker) return;
    requestAnimationFrame(() => {
      if (!marker.isConnected) return;
      const delta = marker.getBoundingClientRect().top - before;
      if (Math.abs(delta) > 0.5) window.scrollTo({ top: window.scrollY + delta, left: window.scrollX, behavior: 'instant' });
    });
  }

  // Mode transitions: the card and action bar ease through .is-open; the
  // in-page chrome eases through body-level entering/leaving classes. The
  // classes are short-lived so re-renders, which rebuild the same nodes,
  // never replay the entrance. Leaving delays the DOM cleanup until the
  // fade finishes; reopening inside that window cancels it.
  let leaveTimer = 0;
  let enterTimer = 0;

  function toggle(on) {
    const active = on === undefined ? !state.open : on;
    state.open = active;
    const btn = document.getElementById('devPresetToggle');
    if (btn) btn.setAttribute('aria-pressed', String(active));
    if (active) {
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = 0;
      }
      document.body.classList.remove('dev-edit-leaving');
      document.body.classList.add('dev-edit');
      toolbar.classList.toggle('is-open', true);
      if (actionBar) actionBar.classList.toggle('is-open', true);
      keepViewportAnchor(() => {
        resetAutoSession(true);
        applyEditing();
      });
      document.body.classList.add('dev-edit-entering');
      if (enterTimer) clearTimeout(enterTimer);
      enterTimer = setTimeout(() => {
        enterTimer = 0;
        document.body.classList.remove('dev-edit-entering');
      }, 350);
      renderList();
      updateBarHeight();
      placePopover();
    } else {
      toolbar.classList.toggle('is-open', false);
      if (actionBar) actionBar.classList.toggle('is-open', false);
      openList(false);
      closeSub();
      closeInsertMenus();
      hideTextToolbar();
      document.body.classList.add('dev-edit-leaving');
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        leaveTimer = 0;
        keepViewportAnchor(() => clearEditing());
        document.body.classList.remove('dev-edit', 'dev-edit-leaving', 'dev-edit-entering');
      }, 200);
    }
  }

  // ---------- init ----------
  function init() {
    buildToolbar();
    makeToggle();
    buildCtaPanel();
    wireCtaPanelShortcut();
    wireTextToolbar();
    wireEditToggleShortcut();
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
    window.addEventListener('resize', hidePresetPreview);
    window.addEventListener('scroll', hidePresetPreview, { passive: true });
    document.addEventListener('portfolio-rendered', () => {
      if (state.open) applyEditing();
    });
    document.addEventListener('pointerdown', event => {
      if (!state.open) return;
      if (!event.target.closest('.dev-insert-point')) closeInsertMenus();
    }, true);
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const openMenu = document.querySelector('#projekte .dev-insert-menu:not([hidden])');
      if (openMenu) {
        openMenu.hidden = true;
        document.querySelectorAll('#projekte .dev-insert-point-button[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
        return;
      }
      const templateMenu = subBar ? subBar.querySelector('#devTemplateMenu') : null;
      if (templateMenu && !templateMenu.hidden) {
        templateMenu.hidden = true;
        const templateButton = subBar.querySelector('#devTemplateButton');
        if (templateButton) templateButton.setAttribute('aria-expanded', 'false');
        return;
      }
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

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
  const CTA_KEY = 'portfolio-cta-variant';
  const CTA_POS_KEY = 'portfolio-cta-panel-pos';
  const CTA_RING_KEY = 'portfolio-cta-ring-spread';
  const CTA_RINGS = [0, 2, 4];
  const GLASS_DEPTHS = [0.5, 1, 1.5, 2, 3, 4, 5];
  const GLASS_SPECTRA = [0, 0.3, 0.6, 1.2, 2, 3];
  const GLASS_TINTS = [0, 7, 15, 25, 40, 60, 80];
  const GLASS_BLURS = [0, 0.5, 1, 2, 4, 8];
  const CTA_VARIANTS = [
    { id: 'current', label: 'Current' },
    { id: 'current-teal-ring', label: 'Teal halo ring' },
    { id: 'current-jade-ring', label: 'Solid jade ring' }
  ];
  const NAV_KEY = 'portfolio-nav-state';
  const NAV_STATES = [
    { id: 'current', label: 'Current' },
    { id: 'swap', label: 'Swap' },
    { id: 'soft', label: 'Soft' }
  ];
  const GAME_DELAY_KEY = 'portfolio-game-delay';
  const GAME_DELAYS = [0, 40, 80, 120, 160, 200];
  const GAME_DURATION_KEY = 'portfolio-game-duration';
  const GAME_DURATIONS = [0, 160, 240, 320, 400, 480, 600];
  const state = { open: false, selected: null, filter: '', dirty: false, sub: null };
  const IMAGE_PICKER_OPTIONS = { multiple: false, types: [{ description: 'Images', accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/webp': ['.webp'] } }] };
  const CROSS_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2 2l8 8M10 2l-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
  const PRESET_ADJECTIVES = ['Quiet', 'Amber', 'Gentle', 'Silver', 'Golden', 'Little', 'Distant', 'Velvet', 'Bright', 'Slow', 'Hidden', 'Warm', 'Open', 'Soft', 'Calm', 'Brave'];
  const PRESET_NOUNS = ['Meadow', 'Harbor', 'Field', 'Orbit', 'Ember', 'Pine', 'River', 'Cloud', 'Stone', 'Garden', 'Window', 'Lantern', 'Drift', 'Shore', 'Fern', 'Comet'];
  let toolbar = null;
  let input = null;
  let list = null;
  let newButton = null;
  let saveButton = null;
  let loadButton = null;
  let undoButton = null;
  let revertButton = null;
  let subBar = null;
  let subBarHandle = null;
  let cardTemplate = '__blank__';
  let mediaTarget = null;
  let confirmAction = null;
  let previewObserver = null;
  let mediaObservers = [];
  let mediaUndoItems = [];
  let dragState = null;
  let dragScrollDir = 0;
  let dragRaf = 0;
  let history = [];
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

  window.addEventListener('beforeunload', event => {
    if (autoSessionActive) flushPresetAutosave();
    if (!state.open && !state.dirty) return;
    event.preventDefault();
    event.returnValue = '';
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
    addSectionHandles();
    addMediaControls();
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
      if (section.querySelector(':scope > .dev-reorder-handle')) return;
      const handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'dev-reorder-handle';
      handle.textContent = '⠿';
      handle.title = 'Drag section';
      handle.setAttribute('aria-label', 'Drag section');
      handle.addEventListener('pointerdown', startSectionDrag);
      section.appendChild(handle);
    });
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

  function showMediaUndo(position, restore) {
    const toast = document.createElement('div');
    toast.className = 'dev-media-undo';
    const left = Math.max(8, Math.min((position ? position.left : 0) + 8, window.innerWidth - 228));
    const top = Math.max(8, Math.min((position ? position.top : 0) + 8, window.innerHeight - 56));
    toast.style.left = left + 'px';
    toast.style.top = top + 'px';
    toast.innerHTML = '<span class="dev-media-undo-text">Image removed</span><button type="button" class="dev-media-undo-button">Undo</button><span class="dev-media-undo-count">10s</span>';
    const count = toast.querySelector('.dev-media-undo-count');
    const text = toast.querySelector('.dev-media-undo-text');
    const item = { element: toast, interval: null };
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
    document.body.appendChild(toast);
  }

  function positionMediaOverlay(section) {
    const overlay = section.querySelector(':scope > .dev-media-overlay');
    if (!overlay) return;
    const sectionRect = section.getBoundingClientRect();
    overlay.querySelectorAll('.dev-media-x').forEach(button => {
      const target = button._mediaTarget;
      if (!target || !target.isConnected) {
        button.hidden = true;
        return;
      }
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height || !sectionRect.width) {
        button.hidden = true;
        return;
      }
      button.hidden = false;
      button.style.top = Math.max(8, rect.top - sectionRect.top + 8) + 'px';
      button.style.left = Math.max(8, rect.right - sectionRect.left - 32) + 'px';
    });
  }

  function createMediaOverlay(section, project, key, sectionTitle) {
    const old = section.querySelector(':scope > .dev-media-overlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.className = 'dev-media-overlay';
    const addButton = (target, remove) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'dev-media-x';
      button.innerHTML = CROSS_SVG;
      button.title = 'Remove image (Undo available)';
      button.setAttribute('aria-label', 'Remove image from ' + sectionTitle.trim());
      button._mediaTarget = target;
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        remove();
      });
      overlay.appendChild(button);
    };
    const list = project[key + '-media'];
    if (Array.isArray(list)) {
      section.querySelectorAll('[data-media-key]').forEach(el => {
        const index = Number(el.dataset.mediaIndex);
        const meta = mediaField(list[index]);
        if (!meta || meta.kind !== 'Image') return;
        if (getComputedStyle(el).display === 'none') return;
        addButton(el, () => {
          if (!Array.isArray(list)) return;
          const rect = el.getBoundingClientRect();
          const item = list[index];
          const prevItem = index > 0 ? list[index - 1] : undefined;
          const nextItem = index < list.length - 1 ? list[index + 1] : undefined;
          pushHistory();
          list.splice(index, 1);
          setDirty(true);
          showMediaUndo({ top: rect.top, left: rect.left }, () => {
            const target = projectsData.find(p => p.id === project.id);
            const media = target ? target[key + '-media'] : null;
            if (!Array.isArray(media)) return false;
            let at = media.length;
            if (nextItem !== undefined && media.includes(nextItem)) at = media.indexOf(nextItem);
            else if (prevItem !== undefined && media.includes(prevItem)) at = media.indexOf(prevItem) + 1;
            media.splice(at, 0, item);
            setDirty(true);
            rerenderPreservingOpen();
            return true;
          });
          rerenderPreservingOpen();
        });
      });
    }
    section.querySelectorAll('.project-detail-text a.glightbox').forEach(anchor => {
      if (anchor.closest('[data-media-key]')) return;
      const image = anchor.querySelector('img');
      const href = anchor.getAttribute('href') || '';
      if (!image || !/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(href)) return;
      addButton(image, () => {
        const rect = image.getBoundingClientRect();
        removeRawImage(project, key, href, { top: rect.top, left: rect.left });
      });
    });
    section.appendChild(overlay);
    positionMediaOverlay(section);
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
      if (!body.querySelector(':scope > .dev-add-media-row')) {
        const row = document.createElement('div');
        row.className = 'dev-add-media-row';
        row.innerHTML = '<button type="button" class="dev-add-media">+ Image</button><input type="file" class="dev-add-media-file" accept="image/png,image/jpeg,image/webp" hidden><span class="dev-add-media-error" role="alert"></span>';
        const button = row.querySelector('.dev-add-media');
        const fileInput = row.querySelector('.dev-add-media-file');
        const error = row.querySelector('.dev-add-media-error');
        const addPath = path => {
          pushHistory();
          const mediaKey = key + '-media';
          if (!Array.isArray(project[mediaKey])) project[mediaKey] = [];
          project[mediaKey].push(path);
          setDirty(true);
          rerenderPreservingOpen();
        };
        const upload = file => {
          const label = button.textContent;
          button.disabled = true;
          button.textContent = 'Uploading…';
          error.textContent = '';
          uploadMediaFile(file, (path, message) => {
            if (!path) {
              button.disabled = false;
              button.textContent = label;
              error.textContent = message;
              return;
            }
            addPath(path);
          });
        };
        button.addEventListener('click', () => {
          if (button.disabled) return;
          error.textContent = '';
          if (typeof window.showOpenFilePicker === 'function') {
            window.showOpenFilePicker(IMAGE_PICKER_OPTIONS)
              .then(handles => {
                if (!handles || !handles.length) {
                  const cancel = new Error('Cancelled');
                  cancel.name = 'AbortError';
                  throw cancel;
                }
                return handles[0].getFile();
              })
              .then(upload)
              .catch(pickerError => {
                if (pickerError && pickerError.name === 'AbortError') return;
                fileInput.click();
              });
          } else {
            fileInput.click();
          }
        });
        fileInput.addEventListener('change', () => {
          if (fileInput.files && fileInput.files[0]) upload(fileInput.files[0]);
          fileInput.value = '';
        });
        body.appendChild(row);
      }
      const observer = new ResizeObserver(() => positionMediaOverlay(section));
      observer.observe(section);
      mediaObservers.push(observer);
    });
  }

  function removeSectionHandles() {
    cancelSectionDrag();
    document.querySelectorAll('.dev-reorder-handle').forEach(handle => handle.remove());
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
    removeSectionHandles();
    dismissAllMediaUndo();
    if (mediaObservers.length) {
      mediaObservers.forEach(observer => observer.disconnect());
      mediaObservers = [];
    }
    document.querySelectorAll('#projekte .dev-media-overlay').forEach(el => el.remove());
    document.querySelectorAll('#projekte .dev-add-media-row').forEach(el => el.remove());
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
      del.innerHTML = CROSS_SVG;
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
    if (newButton) {
      newButton.disabled = !autoSessionActive;
      newButton.title = autoSessionActive
        ? 'Create a new working preset from the session’s original state'
        : 'Available after the first edit';
    }
    if (saveButton) saveButton.disabled = !hasSelection;
    if (loadButton) loadButton.disabled = !hasSelection;
    if (undoButton) undoButton.disabled = history.length === 0;
    if (revertButton) revertButton.disabled = !state.dirty || !baseline;
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

  function savePreset() {
    if (!state.selected) return;
    savePresetWithName(state.selected);
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
      subBar.setAttribute('aria-label', 'Dev sub toolbar');
      document.body.appendChild(subBar);
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
    document.documentElement.style.setProperty('--dev-bar-height', toolbar.offsetHeight + 'px');
  }

  function openSub(mode) {
    ensureSubBar();
    openList(false);
    state.sub = mode;
    subBar.classList.toggle('is-card', mode === 'card');
    if (mode === 'card') buildCardSub();
    else if (mode === 'media') buildMediaSub();
    else if (mode === 'preset') buildPresetSub();
    else if (mode === 'help') buildHelpSub();
    subBar.classList.add('is-open');
    subBar.classList.remove('is-collapsed');
    updateSubBarHandle();
    updateBarHeight();
  }

  function closeSub() {
    if (previewObserver) {
      previewObserver.disconnect();
      previewObserver = null;
    }
    state.sub = null;
    mediaTarget = null;
    confirmAction = null;
    if (subBar) {
      subBar.classList.remove('is-open', 'is-card', 'is-collapsed');
      subBar.innerHTML = '';
    }
    updateSubBarHandle();
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
            <span id="devThumbMeta">Click the thumbnail to choose an image · PNG/JPG · portrait · recommended 180 × 230px · max 360 × 460px</span>
            <button type="button" class="dev-text-button" data-act="clear-thumb" hidden>Remove</button>
          </div>
        </div>
        <div class="dev-card-fields">
          <div class="dev-sub-fields">
            <label class="dev-sub-label">ID<input class="dev-sub-input" id="devCardId" placeholder="e.g. smart-search-bar" autocomplete="off"></label>
            <label class="dev-sub-label">Title<input class="dev-sub-input" id="devCardTitle" placeholder="e.g. Smart Search Bar" autocomplete="off"></label>
            <label class="dev-sub-label">Card description<textarea class="dev-sub-input dev-sub-textarea" id="devCardDesc" rows="2" placeholder="e.g. Intelligent search with autocomplete for the VEDA Horizon platform" autocomplete="off"></textarea></label>
            <div class="dev-sub-label dev-tag-field">
              <span>Tags</span>
              <div class="dev-tag-editor" id="devCardTagEditor">
                <span class="dev-tag-list" id="devCardTagList"></span>
                <input class="dev-tag-input" id="devCardTagInput" placeholder="Type a tag, Enter adds it" autocomplete="off" aria-label="Add a tag">
              </div>
            </div>
          </div>
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
    const pickControl = mode => `<input type="file" class="dev-thumb-file" accept="image/png,image/jpeg,image/webp" aria-label="${mode === 'replace' ? 'Replace thumbnail image' : 'Choose thumbnail image'}"><span class="dev-thumb-pick-chip" aria-hidden="true">${mode === 'replace' ? 'Replace' : 'Choose image'}</span>`;
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
        : 'Click the thumbnail to choose an image · PNG/JPG · portrait · recommended 180 × 230px · max 360 × 460px';
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
      const input = event.target.closest('.dev-thumb-file');
      if (!input || typeof window.showOpenFilePicker !== 'function') return;
      event.preventDefault();
      window.showOpenFilePicker(IMAGE_PICKER_OPTIONS)
        .then(handles => {
          if (!handles || !handles.length) {
            const cancel = new Error('Cancelled');
            cancel.name = 'AbortError';
            throw cancel;
          }
          return handles[0].getFile();
        })
        .then(file => applyThumbFile(file))
        .catch(error => {
          if (error && error.name === 'AbortError') return;
          thumbMeta.textContent = 'The file picker did not open. Drag the image onto the thumbnail or try again.';
          thumbMeta.classList.add('is-error');
          input.click();
        });
    }, true);
    preview.addEventListener('change', event => {
      const input = event.target;
      if (!input.classList || !input.classList.contains('dev-thumb-file')) return;
      if (input.files && input.files[0]) applyThumbFile(input.files[0]);
      input.value = '';
    });
    preview.addEventListener('dragover', event => {
      if (!preview.querySelector('.dev-thumb-file')) return;
      if (!event.dataTransfer || !Array.from(event.dataTransfer.types).includes('Files')) return;
      event.preventDefault();
      const thumb = preview.querySelector('.dev-preview-thumb');
      if (thumb) thumb.classList.add('is-dragover');
    });
    preview.addEventListener('dragleave', event => {
      const thumb = preview.querySelector('.dev-preview-thumb');
      if (thumb && !thumb.contains(event.relatedTarget)) thumb.classList.remove('is-dragover');
    });
    preview.addEventListener('drop', event => {
      if (!preview.querySelector('.dev-thumb-file')) return;
      if (!event.dataTransfer || !event.dataTransfer.files.length) return;
      event.preventDefault();
      const thumb = preview.querySelector('.dev-preview-thumb');
      if (thumb) thumb.classList.remove('is-dragover');
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
        <button type="button" class="dev-preset-button dev-primary" data-act="save-media">Save</button>
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
        <li><strong>Reorder:</strong> drag the ⠿ handle on a section while editing.</li>
        <li><strong>Media:</strong> click an image, link, embed or video to edit its path; use + Image below a section to add one; the × on each image removes it (Undo restores).</li>
        <li><strong>Presets:</strong> the first edit creates a random-named working preset and autosaves into it continuously. New Preset creates a fresh working preset from the session’s original state and keeps the previous working preset. Save and Load remain; New Preset is disabled until the first edit.</li>
        <li><strong>New card:</strong> + Card, cycle templates with the arrows, click the thumbnail to upload an image, enter ID and title.</li>
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

  // ---------- CTA variants ----------
  function readCtaVariant() {
    let value = 'current';
    try { value = localStorage.getItem(CTA_KEY) || 'current'; } catch (e) {}
    return CTA_VARIANTS.some(item => item.id === value) ? value : 'current';
  }

  function applyCtaVariant(id) {
    if (id === 'current') {
      document.documentElement.removeAttribute('data-cta-variant');
    } else {
      document.documentElement.setAttribute('data-cta-variant', id);
    }
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-cta-variant-value]').forEach(button => {
        const active = button.getAttribute('data-cta-variant-value') === id;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      const isCurrent = id === 'current';
      panel.querySelectorAll('[data-cta-state-value], [data-cta-ring-value]').forEach(button => {
        button.disabled = isCurrent;
      });
      if (isCurrent) applyCtaState('idle');
    }
    try { localStorage.setItem(CTA_KEY, id); } catch (e) {}
  }

  function readCtaRing() {
    let value = 0;
    try {
      const stored = localStorage.getItem(CTA_RING_KEY);
      if (stored !== null) {
        const raw = Number(stored);
        if (Number.isFinite(raw)) value = raw;
      }
    } catch (e) {}
    return CTA_RINGS.includes(value) ? value : 0;
  }

  function applyCtaRing(value) {
    if (value === 0) {
      document.documentElement.removeAttribute('data-cta-ring');
    } else {
      document.documentElement.setAttribute('data-cta-ring', String(value));
    }
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-cta-ring-value]').forEach(button => {
        const active = Number(button.getAttribute('data-cta-ring-value')) === value;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem(CTA_RING_KEY, String(value)); } catch (e) {}
  }

  function applyCtaState(state) {
    if (state === 'hover') {
      document.documentElement.setAttribute('data-cta-state', 'hover');
    } else {
      document.documentElement.removeAttribute('data-cta-state');
    }
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-cta-state-value]').forEach(button => {
        const active = button.getAttribute('data-cta-state-value') === state;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
  }

  function readNavState() {
    let value = 'current';
    try { value = localStorage.getItem(NAV_KEY) || 'current'; } catch (e) {}
    return NAV_STATES.some(item => item.id === value) ? value : 'current';
  }

  function applyNavState(id) {
    if (id === 'current') {
      document.documentElement.removeAttribute('data-nav-state');
    } else {
      document.documentElement.setAttribute('data-nav-state', id);
    }
    const panel = document.getElementById('devCtaPanel');
    if (panel) {
      panel.querySelectorAll('[data-nav-state-value]').forEach(button => {
        const active = button.getAttribute('data-nav-state-value') === id;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    try { localStorage.setItem(NAV_KEY, id); } catch (e) {}
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
  }

  function applyGlass(key, value, attribute) {
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

  function buildCtaPanel() {
    if (document.getElementById('devCtaPanel')) return;
    const panel = document.createElement('div');
    panel.id = 'devCtaPanel';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', 'CTA variants');
    panel.hidden = true;
    panel.innerHTML = '<div class="dev-cta-head"><span class="dev-cta-grip" title="Drag to move" aria-hidden="true">⠿</span><span class="dev-cta-title">Testing</span></div>' +
      '<div class="dev-cta-row"><span class="dev-cta-label">CTA</span>' +
      CTA_VARIANTS.map(item => `<button type="button" class="dev-preset-button" data-cta-variant-value="${item.id}" aria-pressed="false">${item.label}</button>`).join('') + '</div>' +
      '<div class="dev-cta-row"><span class="dev-cta-label">Ring</span>' +
      CTA_RINGS.map(value => `<button type="button" class="dev-preset-button" data-cta-ring-value="${value}" aria-pressed="false" title="Idle ring ${value}px to 10px on hover">${value}px</button>`).join('') + '</div>' +
      '<div class="dev-cta-row"><span class="dev-cta-label">State</span>' +
      '<button type="button" class="dev-preset-button" data-cta-state-value="idle" aria-pressed="true">Idle</button>' +
      '<button type="button" class="dev-preset-button" data-cta-state-value="hover" aria-pressed="false">Hover</button></div>' +
      '<div class="dev-cta-row"><span class="dev-cta-label">Nav</span>' +
      NAV_STATES.map(item => `<button type="button" class="dev-preset-button" data-nav-state-value="${item.id}" aria-pressed="false">${item.label}</button>`).join('') + '</div>' +
      '<div class="dev-cta-row"><span class="dev-cta-label">Reveal delay</span>' +
      GAME_DELAYS.map(value => `<button type="button" class="dev-preset-button" data-game-delay-value="${value}" aria-pressed="false" title="${value} ms">${value}</button>`).join('') + '</div>' +
      '<div class="dev-cta-row"><span class="dev-cta-label">Reveal duration</span>' +
      GAME_DURATIONS.map(value => `<button type="button" class="dev-preset-button" data-game-duration-value="${value}" aria-pressed="false" title="${value} ms">${value}</button>`).join('') + '</div>' +
      '<div class="dev-cta-row"><span class="dev-cta-label">Glass depth</span>' +
      GLASS_DEPTHS.map(value => `<button type="button" class="dev-preset-button" data-glass-depth-value="${value}" aria-pressed="false">${value}</button>`).join('') + '</div>' +
      '<div class="dev-cta-row"><span class="dev-cta-label">Dispersion</span>' +
      GLASS_SPECTRA.map(value => `<button type="button" class="dev-preset-button" data-glass-spectrum-value="${value}" aria-pressed="false">${value}</button>`).join('') + '</div>' +
      '<div class="dev-cta-row"><span class="dev-cta-label">Glass tint %</span>' +
      GLASS_TINTS.map(value => `<button type="button" class="dev-preset-button" data-glass-tint-value="${value}" aria-pressed="false">${value}</button>`).join('') + '</div>' +
      '<div class="dev-cta-row"><span class="dev-cta-label">Glass blur</span>' +
      GLASS_BLURS.map(value => `<button type="button" class="dev-preset-button" data-glass-blur-value="${value}" aria-pressed="false">${value}</button>`).join('') + '</div>';
    document.body.appendChild(panel);
    applyCtaVariant(readCtaVariant());
    applyCtaRing(readCtaRing());
    applyCtaState('idle');
    applyNavState(readNavState());
    applyGameDelay(readGameDelay());
    applyGameDuration(readGameDuration());
    wireCtaPanelDrag(panel);
    restoreCtaPanelPosition(panel);
    panel.addEventListener('click', event => {
      const variant = event.target.closest('[data-cta-variant-value]');
      if (variant) {
        applyCtaVariant(variant.getAttribute('data-cta-variant-value'));
        return;
      }
      const stateButton = event.target.closest('[data-cta-state-value]');
      if (stateButton) applyCtaState(stateButton.getAttribute('data-cta-state-value'));
      const ringButton = event.target.closest('[data-cta-ring-value]');
      if (ringButton) applyCtaRing(Number(ringButton.getAttribute('data-cta-ring-value')));
      const navButton = event.target.closest('[data-nav-state-value]');
      if (navButton) applyNavState(navButton.getAttribute('data-nav-state-value'));
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
    });
    syncGlassRows();
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

  function readCtaPanelPosition() {
    try {
      const raw = localStorage.getItem(CTA_POS_KEY);
      if (!raw) return null;
      const position = JSON.parse(raw);
      if (!position || !Number.isFinite(position.left) || !Number.isFinite(position.top)) return null;
      return position;
    } catch (e) {
      return null;
    }
  }

  function saveCtaPanelPosition(position) {
    try { localStorage.setItem(CTA_POS_KEY, JSON.stringify(position)); } catch (e) {}
  }

  function restoreCtaPanelPosition(panel) {
    if (!panel.hidden) applyStoredCtaPanelPosition(panel);
    window.addEventListener('resize', () => {
      if (panel.hidden) return;
      const rect = panel.getBoundingClientRect();
      saveCtaPanelPosition(placeCtaPanel(panel, { left: rect.left, top: rect.top }));
    });
  }

  function applyStoredCtaPanelPosition(panel) {
    const stored = readCtaPanelPosition();
    if (!stored) return;
    // Measure at the default anchor first: an out-of-range coordinate squeezes
    // the shrink-to-fit width against the viewport edge.
    panel.style.left = '';
    panel.style.top = '';
    panel.style.bottom = '';
    placeCtaPanel(panel, stored);
  }

  function wireCtaPanelDrag(panel) {
    const grip = panel.querySelector('.dev-cta-grip');
    if (!grip) return;
    let drag = null;
    grip.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      const rect = panel.getBoundingClientRect();
      drag = { dx: event.clientX - rect.left, dy: event.clientY - rect.top, pointerId: event.pointerId };
      grip.setPointerCapture(event.pointerId);
      panel.classList.add('is-dragging');
      event.preventDefault();
    });
    grip.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      placeCtaPanel(panel, { left: event.clientX - drag.dx, top: event.clientY - drag.dy });
    });
    const endDrag = event => {
      if (!drag || (event.pointerId !== undefined && event.pointerId !== drag.pointerId)) return;
      drag = null;
      panel.classList.remove('is-dragging');
      const rect = panel.getBoundingClientRect();
      saveCtaPanelPosition({ left: rect.left, top: rect.top });
    };
    grip.addEventListener('pointerup', endDrag);
    grip.addEventListener('pointercancel', endDrag);
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

  // Shift + °. German keyboard: ° is the second assignment of the dead key left
  // of 1, so code "Backquote" together with shiftKey is what matches.
  function isCaretKey(event) {
    const code = event.code || '';
    const key = event.key || '';
    if (code === 'Backquote') return true;
    if (key === '^' || key === '°') return true;
    if (key === 'Dead' && (code === '' || code === 'Unidentified' || code === 'Backquote')) return true;
    return false;
  }

  function toggleCtaPanel(show) {
    const panel = document.getElementById('devCtaPanel');
    if (!panel) return;
    panel.hidden = show === undefined ? !panel.hidden : !show;
    if (!panel.hidden) applyStoredCtaPanelPosition(panel);
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
    newButton = toolbar.querySelector('[data-act="new"]');
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
      resetAutoSession(true);
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
    buildCtaPanel();
    wireCtaPanelShortcut();
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

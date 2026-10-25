// kontext.js – desktop-only interactions for the Kompetenzen & Methoden notes
// and the opt-in "Break the friction" mini-game.
(function () {
  'use strict';

  const section = document.getElementById('kontext');
  const wrap = section ? section.querySelector('.kontext-wrap') : null;
  if (!wrap) return;

  const field = document.createElement('div');
  field.className = 'kontext-playfield';
  wrap.before(field);
  field.appendChild(wrap);

  const desktop = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)');
  const CROSS = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2 2l8 8M10 2l-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';

  const notes = {
    'Kommunikation': {
      text: 'Erwartungen offen klären, Entscheidungen festhalten und Feedback früh einholen.',
      projects: ['conn4-ux-analysis', 'employee-dashboard-touchscreen']
    },
    'Zielgruppe': {
      text: 'Wer nutzt das Produkt, in welcher Situation und mit welchem Ziel?',
      projects: ['smart-search-bar', 'conn4-ux-analysis']
    },
    'Design System': {
      text: 'Wiederverwendbare Komponenten und Regeln, damit das Produkt konsistent bleibt.',
      projects: ['employee-dashboard-touchscreen', 'fh-aachen-mobile-redesign']
    },
    'Figma': {
      text: 'Das Werkzeug für Layout, Prototypen und die Übergabe an die Entwicklung.',
      projects: ['smart-search-bar', 'conn4-ux-analysis']
    },
    '8pt-grid': {
      text: 'Abstände und Größen in 8-Pixel-Schritten halten Rhythmus und Implementierung sauber.',
      projects: ['smart-search-bar', 'fh-aachen-mobile-redesign']
    },
    'User Experience': {
      text: 'Das Zusammenspiel aus Nutzen, Verständlichkeit und Aufwand über den ganzen Ablauf.',
      projects: ['conn4-ux-analysis', 'smart-search-bar']
    },
    'Whitespace': {
      text: 'Raum, der Inhalt gruppiert, priorisiert und lesbar macht.',
      projects: ['smart-search-bar', 'fh-aachen-mobile-redesign']
    },
    'Wireframes': {
      text: 'Schnelle, grobe Layouts, um Struktur und Ablauf zu prüfen, bevor Pixel entstehen.',
      projects: ['smart-search-bar', 'digital-verbandbuch']
    },
    'Konzeption': {
      text: 'Vom Problem zu einer begründeten Lösung: Anforderungen, Varianten, Entscheidung.',
      projects: ['conn4-ux-analysis', 'sprachzwirbel']
    },
    'Nutzerverhalten': {
      text: 'Beobachten, was Menschen tatsächlich tun, statt nur zu fragen.',
      projects: ['smart-search-bar', 'industrie-40-rwth']
    },
    'Artificial Intelligence': {
      text: 'KI als Werkzeug für Analyse und Generierung, immer mit menschlicher Kontrolle.',
      projects: ['industrie-40-rwth', 'smart-search-bar']
    },
    'Touch Points': {
      text: 'Alle Stellen, an denen Menschen mit dem Produkt oder der Marke in Kontakt kommen.',
      projects: ['fh-aachen-mobile-redesign', 'conn4-ux-analysis']
    },
    'Usability': {
      text: 'Wie einfach sich ein Ziel erreichen lässt: verständlich, effizient, fehlerarm.',
      projects: ['smart-search-bar', 'conn4-ux-analysis']
    },
    'Prototyping': {
      text: 'Ein klickbarer Entwurf, der Annahmen sichtbar und testbar macht.',
      projects: ['sprachzwirbel', 'industrie-40-rwth']
    },
    'Persona': {
      text: 'Ein verdichtetes Bild einer Nutzergruppe mit Zielen, Kontext und Frustrationen.',
      projects: ['smart-search-bar', 'conn4-ux-analysis']
    },
    'User Research': {
      text: 'Interviews, Beobachtung und Tests, um Annahmen durch Erkenntnisse zu ersetzen.',
      projects: ['conn4-ux-analysis', 'smart-search-bar']
    },
    'Interaktion': {
      text: 'Wie Eingaben, Feedback und Zustände zusammen einen verständlichen Ablauf ergeben.',
      projects: ['industrie-40-rwth', 'sprachzwirbel']
    },
    'User Flow': {
      text: 'Die Schritte, die jemand vom Einstieg bis zum Ziel geht.',
      projects: ['smart-search-bar', 'digital-verbandbuch']
    },
    'Microinteractions': {
      text: 'Kleine Rückmeldungen, die Orientierung geben und Vertrauen aufbauen.',
      projects: ['smart-search-bar', 'fh-aachen-mobile-redesign']
    },
    'Motion Design': {
      text: 'Bewegung, die Zustandswechsel erklärt und nicht nur dekoriert.',
      projects: ['sprachzwirbel', 'conn4-ux-analysis']
    },
    'Usability Heuristics': {
      text: 'Prüfpunkte wie Sichtbarkeit, Konsistenz und Fehlervermeidung, um Oberflächen zu bewerten.',
      projects: ['conn4-ux-analysis', 'smart-search-bar']
    },
    'User Interface': {
      text: 'Die sichtbare Ebene: Layout, Typografie, Farbe und Komponenten.',
      projects: ['employee-dashboard-touchscreen', 'fh-aachen-mobile-redesign']
    }
  };

  let detail = null;
  let activeNote = null;
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;
    buildNoteDetail();
    decorateNotes();
    buildGame();
  }

  function buildNoteDetail() {
    detail = document.createElement('div');
    detail.className = 'kontext-note-detail';
    detail.hidden = true;
    detail.setAttribute('role', 'region');
    detail.setAttribute('aria-label', 'Notiz-Details');
    detail.innerHTML =
      '<button type="button" class="kontext-note-close" aria-label="Details schließen">' + CROSS + '</button>' +
      '<h3 class="kontext-note-heading"></h3>' +
      '<p class="kontext-note-copy"></p>' +
      '<p class="kontext-note-seen"><span>Gesehen in</span><span class="kontext-note-links"></span></p>';
    field.insertAdjacentElement('afterend', detail);

    detail.querySelector('.kontext-note-close').addEventListener('click', closeNote);
    detail.querySelector('.kontext-note-links').addEventListener('click', event => {
      const link = event.target.closest('a[data-project]');
      if (!link) return;
      event.preventDefault();
      openProject(link.getAttribute('data-project'));
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && detail && !detail.hidden) closeNote();
    });

    // A click anywhere outside the detail card dismisses it. Presses on a note
    // are left to the note's own handler, which switches the selection.
    document.addEventListener('pointerdown', event => {
      if (!detail || detail.hidden) return;
      if (detail.contains(event.target)) return;
      if (activeNote && activeNote.contains(event.target)) return;
      closeNote();
    }, true);
  }

  function decorateNotes() {
    wrap.querySelectorAll('div[class*="note-"]').forEach(note => {
      const label = note.textContent.trim();
      if (!notes[label]) return;
      note.tabIndex = 0;
      note.setAttribute('role', 'button');
      note.setAttribute('aria-expanded', 'false');
      note.addEventListener('click', () => openNote(note));
      note.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openNote(note);
      });
    });
  }

  function openNote(note) {
    if (playing || !desktop.matches || !detail) return;
    if (activeNote === note && !detail.hidden) {
      closeNote();
      return;
    }
    if (activeNote) {
      activeNote.classList.remove('is-active');
      activeNote.setAttribute('aria-expanded', 'false');
    }
    const label = note.textContent.trim();
    const data = notes[label];
    if (!data) return;

    activeNote = note;
    note.classList.add('is-active');
    note.setAttribute('aria-expanded', 'true');
    detail.querySelector('.kontext-note-heading').textContent = label;
    detail.querySelector('.kontext-note-copy').textContent = data.text;
    detail.querySelector('.kontext-note-links').innerHTML = data.projects.map(id => {
      const project = (typeof projectsData !== 'undefined' ? projectsData : []).find(item => item.id === id);
      return project
        ? '<a href="#thumbCluster-' + id + '" data-project="' + id + '">' + project.title + '</a>'
        : '';
    }).join('<span class="kontext-note-sep">, </span>');
    detail.hidden = false;
  }

  function closeNote() {
    if (!detail) return;
    detail.hidden = true;
    if (activeNote) {
      activeNote.classList.remove('is-active');
      activeNote.setAttribute('aria-expanded', 'false');
      activeNote = null;
    }
  }

  function openProject(id) {
    const cluster = document.getElementById('thumbCluster-' + id);
    const collapse = document.getElementById('thumbCollapse-' + id);
    if (collapse && window.$ && $.fn.collapse) $(collapse).collapse('show');
    if (cluster) cluster.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeNote();
  }

  // ---------- game ----------
  let hud = null;
  let paddleEl = null;
  let ballEl = null;
  let launchButton = null;
  let statusEl = null;
  let timeEl = null;
  let livesEl = null;
  let rewardEl = null;
  let bestEl = null;
  let runEl = null;
  let againButton = null;
  let closeButton = null;
  let playing = false;
  let launched = false;
  let cleared = false;
  let lives = 3;
  let start = 0;
  let time = 0;
  let raf = 0;
  let last = 0;
  let bricks = [];
  let revealEl = null;
  let introDone = false;
  let introTimers = [];
  const keys = { left: false, right: false };
  const paddle = { w: 144, h: 12, x: 0, y: 0 };
  const ball = { x: 0, y: 0, r: 7, vx: 0, vy: 0 };
  const bestKey = 'portfolio-friction-best';

  function buildGame() {
    hud = document.createElement('div');
    hud.className = 'kontext-game-hud';
    hud.hidden = true;
    hud.innerHTML =
      '<span class="kontext-game-hud-title">Break the friction</span>' +
      '<span class="kontext-game-status" role="status" aria-live="polite">Click or press Space to launch.</span>' +
      '<span class="kontext-game-time">This run: 0.0 s</span>' +
      '<span class="kontext-game-lives" aria-label="Lives">♥♥♥</span>' +
      '<button type="button" class="kontext-game-close" aria-label="Close game">' + CROSS + '</button>';
    field.before(hud);

    const cta = document.createElement('div');
    cta.className = 'kontext-game-cta';
    cta.innerHTML =
      '<button type="button" class="kontext-game-launch cta cta--secondary">Break the friction</button>' +
      '<p class="kontext-game-hint">Ein kurzes Spiel. Bewege die Maus oder ← →. Klicken oder Leertaste zum Start.</p>';
    field.appendChild(cta);

    rewardEl = document.createElement('div');
    rewardEl.className = 'kontext-game-reward';
    rewardEl.hidden = true;
    rewardEl.innerHTML =
      '<button type="button" class="kontext-game-close kontext-game-reward-close" aria-label="Close game">' + CROSS + '</button>' +
      '<p class="kontext-game-eyebrow">Break the friction</p>' +
      '<h2 class="kontext-game-reward-title">Friction cleared.</h2>' +
      '<div class="kontext-game-result">' +
        '<span class="kontext-game-result-label">Your time</span>' +
        '<p class="kontext-game-result-value"><span class="kontext-game-run"></span><span class="kontext-game-result-unit">s</span></p>' +
        '<p class="kontext-game-best" hidden></p>' +
      '</div>' +
      '<p class="kontext-game-reward-copy">This game is an affordance test: one action, clear feedback, no dead ends.</p>' +
      '<button type="button" class="kontext-game-again cta cta--secondary">Play again</button>';
    field.appendChild(rewardEl);

    launchButton = cta.querySelector('.kontext-game-launch');
    bestEl = rewardEl.querySelector('.kontext-game-best');
    runEl = rewardEl.querySelector('.kontext-game-run');
    againButton = rewardEl.querySelector('.kontext-game-again');
    statusEl = hud.querySelector('.kontext-game-status');
    timeEl = hud.querySelector('.kontext-game-time');
    livesEl = hud.querySelector('.kontext-game-lives');
    closeButton = hud.querySelector('.kontext-game-close');

    launchButton.addEventListener('click', openGame);
    againButton.addEventListener('click', () => { if (!playing) startRound(); });
    closeButton.addEventListener('click', closeGame);
    rewardEl.querySelector('.kontext-game-reward-close').addEventListener('click', closeGame);

    document.addEventListener('keydown', event => {
      if (!playing) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeGame();
      } else if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        launch();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        keys.left = true;
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        keys.right = true;
      }
    });
    document.addEventListener('keyup', event => {
      if (event.key === 'ArrowLeft') keys.left = false;
      if (event.key === 'ArrowRight') keys.right = false;
    });
    field.addEventListener('mousemove', event => {
      if (!playing || !introDone) return;
      const rect = field.getBoundingClientRect();
      paddle.x = Math.max(0, Math.min(field.clientWidth - paddle.w, event.clientX - rect.left - paddle.w / 2));
      if (!launched) {
        ball.x = paddle.x + paddle.w / 2;
        ball.y = paddle.y - ball.r - 2;
      }
      paint();
    });
    field.addEventListener('click', () => {
      launch();
    });
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    introTimers.push(id);
    return id;
  }

  function clearIntroTimers() {
    introTimers.forEach(clearTimeout);
    introTimers = [];
  }

  function openGame() {
    if (!desktop.matches) return;
    closeNote();
    if (!playing) startRound();
  }

  function startRound() {
    closeNote();
    clearIntroTimers();
    field.classList.remove('is-closing', 'is-paddle-in', 'is-ball-in', 'is-revealing');

    // Rebuild the surface and the shapes for every round: a class toggled on an
    // existing element does not restart its CSS animation.
    revealEl = document.createElement('div');
    revealEl.className = 'kontext-game-reveal';
    field.prepend(revealEl);

    paddleEl = document.createElement('div');
    paddleEl.className = 'kontext-paddle';
    paddleEl.innerHTML = '<div class="kontext-paddle-shape"></div>';
    ballEl = document.createElement('div');
    ballEl.className = 'kontext-ball';
    ballEl.innerHTML = '<div class="kontext-ball-shape"></div>';
    field.append(paddleEl, ballEl);

    playing = true;
    introDone = false;
    launched = false;
    cleared = false;
    lives = 3;
    time = 0;
    start = 0;
    keys.left = false;
    keys.right = false;
    wrap.classList.add('is-playing');
    field.classList.add('is-playing');
    const hudVisible = !hud.hidden && hud.classList.contains('is-visible');
    hud.hidden = false;
    if (!hudVisible) hud.classList.remove('is-visible');
    rewardEl.hidden = true;
    bestEl.hidden = true;
    statusEl.textContent = 'Click or press Space to launch.';
    statusEl.classList.add('is-waiting');
    timeEl.textContent = 'This run: 0.0 s';
    livesEl.textContent = '♥♥♥';
    wrap.querySelectorAll('div[class*="note-"]').forEach(note => note.classList.remove('is-cleared'));

    requestAnimationFrame(() => {
      // Bottom-up choreography: surface, HUD, paddle, ball, then control.
      field.classList.add('is-revealing');
      if (!hudVisible) later(() => hud.classList.add('is-visible'), 400);
      later(() => {
        measure();
        paint();
        field.classList.add('is-paddle-in');
        const nav = document.querySelector('nav.navbar.fixed-bottom');
        const reserve = (nav ? nav.getBoundingClientRect().height : 0) + 16;
        const bottom = field.getBoundingClientRect().bottom;
        if (bottom > window.innerHeight - reserve) {
          window.scrollBy({ top: bottom - (window.innerHeight - reserve), behavior: 'smooth' });
        }
      }, 900);
      later(() => field.classList.add('is-ball-in'), 1600);
      later(() => {
        introDone = true;
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }, 2200);
    });
  }

  function closeGame() {
    playing = false;
    clearIntroTimers();
    introDone = false;
    launched = false;
    cancelAnimationFrame(raf);
    hud.hidden = true;
    hud.classList.remove('is-visible');
    wrap.classList.remove('is-playing');
    field.classList.remove('is-playing');
    wrap.querySelectorAll('div[class*="note-"]').forEach(note => note.classList.remove('is-cleared'));
    rewardEl.hidden = true;
    bestEl.hidden = true;
    if (paddleEl) paddleEl.remove();
    if (ballEl) ballEl.remove();
    if (revealEl) revealEl.remove();
    paddleEl = null;
    ballEl = null;
    revealEl = null;
    keys.left = false;
    keys.right = false;
  }

  function measure() {
    const fieldRect = field.getBoundingClientRect();
    const width = field.clientWidth;
    const height = field.clientHeight;
    paddle.y = height - 30;
    paddle.x = width / 2 - paddle.w / 2;
    ball.x = width / 2;
    ball.y = paddle.y - ball.r - 2;
    ball.vx = 0;
    ball.vy = 0;
    bricks = [...wrap.querySelectorAll('div[class*="note-"]')].map(note => {
      const rect = note.getBoundingClientRect();
      return {
        el: note,
        x: rect.left - fieldRect.left,
        y: rect.top - fieldRect.top,
        w: rect.width,
        h: rect.height,
        alive: true
      };
    });
    if (paddleEl) {
      paddleEl.style.width = paddle.w + 'px';
      paddleEl.style.height = paddle.h + 'px';
    }
  }

  function paint() {
    if (paddleEl) paddleEl.style.transform = 'translate(' + paddle.x + 'px, ' + paddle.y + 'px)';
    if (ballEl) ballEl.style.transform = 'translate(' + (ball.x - ball.r) + 'px, ' + (ball.y - ball.r) + 'px)';
  }

  function frame(now) {
    if (!playing) return;
    const delta = Math.min((now - (last || now)) / 1000, 0.033);
    last = now;
    update(delta);
    paint();
    raf = requestAnimationFrame(frame);
  }

  function update(delta) {
    const width = field.clientWidth;
    const height = field.clientHeight;

    if (keys.left) paddle.x -= 560 * delta;
    if (keys.right) paddle.x += 560 * delta;
    paddle.x = Math.max(0, Math.min(width - paddle.w, paddle.x));

    if (!launched) {
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - ball.r - 2;
      return;
    }

    ball.x += ball.vx * delta;
    ball.y += ball.vy * delta;

    if (ball.x - ball.r < 0) {
      ball.x = ball.r;
      ball.vx = Math.abs(ball.vx);
    } else if (ball.x + ball.r > width) {
      ball.x = width - ball.r;
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y - ball.r < 0) {
      ball.y = ball.r;
      ball.vy = Math.abs(ball.vy);
    }

    if (ball.vy > 0 &&
        ball.y + ball.r >= paddle.y &&
        ball.y - ball.r <= paddle.y + paddle.h &&
        ball.x >= paddle.x - ball.r &&
        ball.x <= paddle.x + paddle.w + ball.r) {
      const hit = Math.max(-1, Math.min(1, (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2)));
      const speed = Math.min(560, Math.hypot(ball.vx, ball.vy) + 8);
      const angle = hit * (Math.PI / 3);
      ball.vx = Math.sin(angle) * speed;
      ball.vy = -Math.cos(angle) * speed;
      ball.y = paddle.y - ball.r - 1;
    }

    for (const brick of bricks) {
      if (!brick.alive) continue;
      if (ball.x + ball.r < brick.x || ball.x - ball.r > brick.x + brick.w ||
          ball.y + ball.r < brick.y || ball.y - ball.r > brick.y + brick.h) continue;
      brick.alive = false;
      brick.el.classList.add('is-cleared');
      const overlapX = Math.min(ball.x + ball.r - brick.x, brick.x + brick.w - (ball.x - ball.r));
      const overlapY = Math.min(ball.y + ball.r - brick.y, brick.y + brick.h - (ball.y - ball.r));
      if (overlapX < overlapY) ball.vx *= -1;
      else ball.vy *= -1;
      break;
    }

    if (ball.y - ball.r > height) {
      lives -= 1;
      livesEl.textContent = lives > 0 ? '♥'.repeat(lives) : '—';
      if (lives <= 0) {
        playing = false;
        cancelAnimationFrame(raf);
        statusEl.classList.remove('is-waiting');
        statusEl.textContent = 'No lives left.';
        return;
      }
      launched = false;
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - ball.r - 2;
      ball.vx = 0;
      ball.vy = 0;
      statusEl.textContent = 'One more try.';
      statusEl.classList.add('is-waiting');
      return;
    }

    if (launched && start) {
      time = (performance.now() - start) / 1000;
      timeEl.textContent = 'This run: ' + time.toFixed(1) + ' s';
    }

    if (bricks.length && bricks.every(brick => !brick.alive)) win();
  }

  function launch() {
    if (!playing || !introDone || launched || cleared) return;
    launched = true;
    start = performance.now();
    const speed = 340;
    const angle = -Math.PI / 3 - Math.random() * (Math.PI / 6);
    ball.vx = Math.cos(angle) * speed;
    ball.vy = Math.sin(angle) * speed;
    statusEl.classList.remove('is-waiting');
    statusEl.textContent = 'Playing.';
  }

  function win() {
    if (cleared) return;
    cleared = true;
    playing = false;
    cancelAnimationFrame(raf);
    statusEl.classList.remove('is-waiting');
    statusEl.textContent = 'Friction cleared.';
    rewardEl.hidden = false;
    const previous = readBest();
    const isBest = previous === null || time < previous;
    if (isBest) {
      try { localStorage.setItem(bestKey, time.toFixed(1)); } catch (e) {}
    }
    bestEl.hidden = false;
    runEl.textContent = time.toFixed(1);
    bestEl.textContent = isBest
      ? 'New best'
      : 'Your best: ' + previous.toFixed(1) + ' s';
    bestEl.classList.toggle('is-new', isBest);
  }

  function readBest() {
    const raw = parseFloat(localStorage.getItem(bestKey));
    return Number.isFinite(raw) ? raw : null;
  }

  if (localStorage.getItem('portfolio-dev') === '1') {
    window.__kontextGame = { clear: win };
  }

  document.addEventListener('kontext-notes-ready', init);
  if (wrap.querySelector('div[class*="note-"]')) init();
})();

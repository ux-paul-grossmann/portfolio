// nav-ink.js – keeps the navigation labels legible on the glass pill.
//
// The elements behind the pill are sampled and their background colours
// averaged, which switches the labels between dark and light ink. Where the
// backdrop cannot be read (image, video, canvas, CSS gradient) the current
// theme decides instead. Blend modes are deliberately not used: inside a
// backdrop-filter element they blend against the glass surface rather than the
// page, which produced white text on white ground.
(function () {
  'use strict';

  var SELECTOR = 'nav.navbar.fixed-bottom > .container';
  var MODES = ['nav-ink-dark', 'nav-ink-light'];
  var current = '';

  function channelLuminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function parseColor(value) {
    var match = value && value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    var parts = match[1].split(/[,\s\/]+/).filter(Boolean).map(Number);
    if (parts.length < 3) return null;
    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: parts.length > 3 ? parts[3] : 1
    };
  }

  // Walks up from the hit element to the first sufficiently opaque background.
  // Returns null when a background image (photo, gradient) is in the way.
  function backgroundLuminance(node) {
    var element = node;
    while (element && element !== document.documentElement) {
      var style = getComputedStyle(element);
      if (style.backgroundImage && style.backgroundImage !== 'none') return null;
      var color = parseColor(style.backgroundColor);
      if (color && color.a > 0.5) return channelLuminance(color.r, color.g, color.b);
      element = element.parentElement;
    }
    return null;
  }

  function isUnreadable(node) {
    return /^(IMG|VIDEO|CANVAS|PICTURE|IFRAME)$/i.test(node.tagName || '');
  }

  function themeInk() {
    return document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  }

  function sample(pill) {
    var rect = pill.getBoundingClientRect();
    var columns = 5;
    var rows = 3;
    var readable = 0;
    var unknown = 0;
    var total = 0;

    for (var column = 1; column < columns; column++) {
      for (var row = 1; row < rows; row++) {
        var x = rect.left + (rect.width * column) / columns;
        var y = rect.top + (rect.height * row) / rows;
        var stack = document.elementsFromPoint(x, y);
        var node = null;
        for (var i = 0; i < stack.length; i++) {
          // Skip the whole bar, not just the pill: the bar is transparent and
          // would otherwise resolve to the page colour behind everything.
          if (stack[i].closest && stack[i].closest('nav.navbar.fixed-bottom')) continue;
          node = stack[i];
          break;
        }
        if (!node || isUnreadable(node)) {
          unknown++;
          continue;
        }
        var luminance = backgroundLuminance(node);
        if (luminance === null) {
          unknown++;
          continue;
        }
        readable++;
        total += luminance;
      }
    }

    if (!readable || unknown > readable) return themeInk();
    return total / readable < 0.5 ? 'light' : 'dark';
  }

  function apply(mode) {
    if (mode === current) return;
    current = mode;
    var root = document.documentElement;
    MODES.forEach(function (name) { root.classList.remove(name); });
    root.classList.add('nav-ink-' + mode);
  }

  function update() {
    var pill = document.querySelector(SELECTOR);
    if (!pill) return;
    var rect = pill.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    apply(sample(pill));
  }

  function init() {
    var pill = document.querySelector(SELECTOR);
    if (!pill) return;

    // A timeout rather than requestAnimationFrame: animation frames are paused
    // in background tabs, which froze the ink colour during development.
    var pending = 0;
    var schedule = function () {
      if (pending) return;
      pending = setTimeout(function () {
        pending = 0;
        update();
      }, 80);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('portfolio-rendered', schedule);

    // Theme switches change the fallback ink without any scrolling
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(schedule).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

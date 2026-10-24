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

  // WCAG-style relative luminance: the weighted average alone misjudges mid
  // greys, where the choice between dark and light ink matters most.
  function linear(channel) {
    var value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  }

  function channelLuminance(r, g, b) {
    return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  }

  function contrast(a, b) {
    var light = Math.max(a, b);
    var dark = Math.min(a, b);
    return (light + 0.05) / (dark + 0.05);
  }

  var INK_LUMINANCE = { dark: channelLuminance(14, 20, 21), light: 1 };

  // Picks whichever ink has the better contrast against the sampled backdrop.
  function bestInk(luminance) {
    var withDark = contrast(luminance, INK_LUMINANCE.dark);
    var withLight = contrast(luminance, INK_LUMINANCE.light);
    return withDark >= withLight ? 'dark' : 'light';
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
    return /^(VIDEO|CANVAS|IFRAME)$/i.test(node.tagName || '');
  }

  // Same-origin images can be read. The area behind the sample point is mapped
  // through the element's background-size and background-position (or object-fit
  // for plain images), so a bright patch in a dark photo is judged on its own.
  var imageCache = {};

  function loadImage(url) {
    if (imageCache[url]) return imageCache[url];
    var promise = new Promise(function (resolve) {
      var probe = new Image();
      probe.crossOrigin = 'anonymous';
      probe.onload = function () { resolve(probe); };
      probe.onerror = function () { resolve(null); };
      probe.src = url;
    });
    imageCache[url] = promise;
    return promise;
  }

  function fitScale(fit, elementWidth, elementHeight, imageWidth, imageHeight) {
    if (fit === 'contain') {
      return Math.min(elementWidth / imageWidth, elementHeight / imageHeight);
    }
    if (fit === 'fill') return null;
    if (fit === 'none') return 1;
    return Math.max(elementWidth / imageWidth, elementHeight / imageHeight);
  }

  function positionFraction(value) {
    if (!value) return 0.5;
    var trimmed = value.trim();
    if (trimmed === 'left' || trimmed === 'top') return 0;
    if (trimmed === 'right' || trimmed === 'bottom') return 1;
    if (trimmed === 'center') return 0.5;
    var numeric = parseFloat(trimmed);
    if (!isFinite(numeric)) return 0.5;
    return trimmed.indexOf('%') !== -1 ? numeric / 100 : 0;
  }

  function imageLuminanceAt(url, element, x, y, fit, position) {
    return loadImage(url).then(function (image) {
      if (!image) return null;
      try {
        var rect = element.getBoundingClientRect();
        var scale = fitScale(fit, rect.width, rect.height, image.naturalWidth, image.naturalHeight);
        var drawnWidth = scale === null ? rect.width : image.naturalWidth * scale;
        var drawnHeight = scale === null ? rect.height : image.naturalHeight * scale;
        var parts = (position || '50% 50%').split(/\s+/);
        var fx = positionFraction(parts[0]);
        var fy = positionFraction(parts[1] || parts[0]);
        var offsetX = rect.left + (rect.width - drawnWidth) * fx;
        var offsetY = rect.top + (rect.height - drawnHeight) * fy;

        var u = (x - offsetX) / drawnWidth;
        var v = (y - offsetY) / drawnHeight;
        if (u < 0 || u > 1 || v < 0 || v > 1) return null;

        var patch = 12;
        var sourceX = Math.min(Math.max(0, u * image.naturalWidth - patch / 2), Math.max(0, image.naturalWidth - patch));
        var sourceY = Math.min(Math.max(0, v * image.naturalHeight - patch / 2), Math.max(0, image.naturalHeight - patch));

        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        var context = canvas.getContext('2d');
        context.drawImage(image, sourceX, sourceY, patch, patch, 0, 0, 1, 1);
        var data = context.getImageData(0, 0, 1, 1).data;
        if (data[3] < 24) return null;
        return channelLuminance(data[0], data[1], data[2]);
      } catch (e) {
        return null;
      }
    });
  }

  function backgroundImageInfo(node) {
    var element = node;
    while (element && element !== document.documentElement) {
      var style = getComputedStyle(element);
      var image = style.backgroundImage;
      if (image && image !== 'none') {
        var match = image.match(/url\(["']?([^"')]+)["']?\)/);
        if (!match) return null;
        var fit = style.backgroundSize === 'contain'
          ? 'contain'
          : style.backgroundSize === 'auto' || style.backgroundSize === 'cover'
            ? 'cover'
            : 'fill';
        return { url: match[1], fit: fit, element: element, position: style.backgroundPosition };
      }
      var color = parseColor(style.backgroundColor);
      if (color && color.a > 0.5) return null;
      element = element.parentElement;
    }
    return null;
  }

  function nodeLuminance(node, x, y) {
    if (!node) return Promise.resolve(null);
    if (node.tagName === 'IMG' && node.currentSrc) {
      var imgStyle = getComputedStyle(node);
      return imageLuminanceAt(node.currentSrc, node, x, y, imgStyle.objectFit || 'fill', imgStyle.objectPosition || '50% 50%');
    }
    var info = backgroundImageInfo(node);
    if (info) return imageLuminanceAt(info.url, info.element, x, y, info.fit, info.position);
    return Promise.resolve(backgroundLuminance(node));
  }

  function themeInk() {
    return document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  }

  function apply(mode) {
    if (mode === current) return;
    current = mode;
    var root = document.documentElement;
    MODES.forEach(function (name) { root.classList.remove(name); });
    root.classList.add('nav-ink-' + mode);
  }

  var updateToken = 0;

  function linksOf(pill) {
    return Array.prototype.slice.call(
      pill.querySelectorAll('.navbar-nav .nav-link:not(.active)')
    );
  }

  // Samples three points along one label and returns the ink it needs.
  function inkForLink(link) {
    var rect = link.getBoundingClientRect();
    var reads = [];
    for (var column = 0; column < 3; column++) {
      var x = rect.left + rect.width * (0.2 + column * 0.3);
      var y = rect.top + rect.height / 2;
      var stack = document.elementsFromPoint(x, y);
      var node = null;
      for (var i = 0; i < stack.length; i++) {
        if (stack[i].closest && stack[i].closest('nav.navbar.fixed-bottom')) continue;
        node = stack[i];
        break;
      }
      if (!node || isUnreadable(node)) continue;
      reads.push(nodeLuminance(node, x, y));
    }

    return Promise.all(reads).then(function (values) {
      var readable = values.filter(function (value) { return value !== null && value !== undefined; });
      if (!readable.length) return themeInk();
      var total = readable.reduce(function (sum, value) { return sum + value; }, 0);
      return bestInk(total / readable.length);
    });
  }

  function update() {
    var pill = document.querySelector(SELECTOR);
    if (!pill) return;
    var rect = pill.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var token = ++updateToken;
    var links = linksOf(pill);
    Promise.all(links.map(inkForLink)).then(function (modes) {
      // Ignore results that arrive after a newer sample started
      if (token !== updateToken) return;
      links.forEach(function (link, index) {
        var dark = modes[index] === 'dark';
        link.style.setProperty('--nav-ink', dark ? 'rgb(14 20 21)' : 'rgb(255 255 255)');
      });
      var majority = modes.filter(function (mode) { return mode === 'light'; }).length;
      apply(majority > modes.length / 2 ? 'light' : 'dark');
    });
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

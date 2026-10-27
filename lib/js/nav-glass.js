// nav-glass.js – refraction for the desktop navigation pill.
//
// Port of the displacement-map maths from Vaso (MIT, github.com/huozhi/vaso):
// the pill is treated as a rounded-rectangle lens whose bezel bends the backdrop
// following Snell's law. The map is generated per size into a canvas, handed to
// an SVG feDisplacementMap, and applied through backdrop-filter.
//
// Chromium renders SVG filters inside backdrop-filter; Safari and Firefox drop
// the declaration, so style.css keeps a plain frost as the fallback and this
// script only runs where the filter is supported.
(function () {
  'use strict';

  // Two glass surfaces: the navigation pill and the dev edit button. Each
  // gets its own displacement map, because a map is built for one size.
  var TARGETS = [
    { selector: 'nav.navbar.fixed-bottom > .container', filterId: 'nav-lens', cls: 'has-nav-lens' },
    { selector: '#devPresetToggle', filterId: 'dev-lens', cls: 'has-dev-lens' },
    { selector: 'nav.navbar.fixed-bottom .navbar-toggler', filterId: 'menu-lens', cls: 'has-menu-lens' }
  ];
  var IOR = 1.5;            // index of refraction of the simulated glass
  var BEZEL_RATIO = 0.6;    // share of the shorter side (per half) that curves
  var REFRACTION = 0.35;    // peak displacement per unit of depth, as a share of the bezel
  var DISPERSION = 0.5;     // spread between least and most refracted wavelengths
  var MAX_MAP_PIXELS = 160000;
  var SPECTRUM_STEP = 1.25; // max pixels between bands before they show as ghosts
  var SMALL_GLASS_SIZE = 80;
  var SMALL_GLASS_SAMPLES = 5;
  var MAX_SPECTRUM_SAMPLES = 9;
  var PROFILE_SAMPLES = 256;

  // Live settings, also owned by the dev panel: depth and spectrum drive the
  // filter, tint and blur are read by style.css through custom properties.
  var DEFAULTS = { depth: 2, spectrum: 0.6, tint: 25, blur: 0.5 };
  var KEYS = {
    depth: 'portfolio-glass-depth',
    spectrum: 'portfolio-glass-spectrum',
    tint: 'portfolio-glass-tint',
    blur: 'portfolio-glass-blur'
  };
  var settings = readSettings();

  var profile = buildProfile();

  function readSettings() {
    var result = {};
    for (var key in DEFAULTS) {
      var value = DEFAULTS[key];
      try {
        var stored = localStorage.getItem(KEYS[key]);
        if (stored !== null) {
          var parsed = Number(stored);
          if (isFinite(parsed)) value = parsed;
        }
      } catch (e) {}
      result[key] = value;
    }
    return result;
  }

  function applySettings() {
    var root = document.documentElement;
    root.style.setProperty('--nav-glass-tint', String(settings.tint / 100));
    root.style.setProperty('--nav-glass-blur', settings.blur + 'px');
  }

  function setSetting(key, value) {
    if (!(key in DEFAULTS)) return;
    var number = Number(value);
    if (!isFinite(number)) return;
    settings[key] = number;
    try { localStorage.setItem(KEYS[key], String(number)); } catch (e) {}
    applySettings();
    update();
  }

  function getSettings() {
    return { depth: settings.depth, spectrum: settings.spectrum, tint: settings.tint, blur: settings.blur };
  }

  function buildProfile() {
    var values = new Float32Array(PROFILE_SAMPLES);
    var max = 0;
    for (var i = 0; i < PROFILE_SAMPLES; i++) {
      var u = 1 - i / (PROFILE_SAMPLES - 1);
      var slope = (u * u * u) / Math.pow(Math.max(1 - u * u * u * u, 1e-9), 0.75);
      var incident = Math.atan(slope);
      var refracted = Math.asin(Math.sin(incident) / IOR);
      var offset = Math.tan(incident - refracted);
      values[i] = offset;
      if (offset > max) max = offset;
    }
    for (var j = 0; j < PROFILE_SAMPLES; j++) values[j] /= max;
    return values;
  }

  function sampleProfile(t) {
    var f = Math.min(Math.max(t, 0), 1) * (PROFILE_SAMPLES - 1);
    var i = Math.floor(f);
    var next = profile[Math.min(i + 1, PROFILE_SAMPLES - 1)];
    return profile[i] + (next - profile[i]) * (f - i);
  }

  // Encodes the unit displacement field of a rounded rectangle into the red and
  // green channels: neutral 128 is no displacement, 0 and 255 are full push.
  function buildMap(width, height, radius, bezel) {
    var resolution = Math.min(1, Math.sqrt(MAX_MAP_PIXELS / (width * height)));
    var mapWidth = Math.max(1, Math.round(width * resolution));
    var mapHeight = Math.max(1, Math.round(height * resolution));
    var canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    var context = canvas.getContext('2d');
    if (!context) return '';

    var image = context.createImageData(mapWidth, mapHeight);
    var data = image.data;
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    // Round the lens at least as much as the bezel so the field has no seams
    var corner = Math.min(Math.max(radius, bezel), halfWidth, halfHeight);

    for (var y = 0; y < mapHeight; y++) {
      var cy = (y + 0.5) / resolution - halfHeight;
      for (var x = 0; x < mapWidth; x++) {
        var cx = (x + 0.5) / resolution - halfWidth;
        var qx = Math.abs(cx) - (halfWidth - corner);
        var qy = Math.abs(cy) - (halfHeight - corner);

        var distance;
        var nx = 0;
        var ny = 0;
        if (qx > 0 && qy > 0) {
          var length = Math.sqrt(qx * qx + qy * qy);
          distance = corner - length;
          nx = qx / length;
          ny = qy / length;
        } else if (qx > qy) {
          distance = corner - qx;
          nx = 1;
        } else {
          distance = corner - qy;
          ny = 1;
        }

        var dx = 0;
        var dy = 0;
        if (distance >= 0 && distance < bezel) {
          var magnitude = sampleProfile(distance / bezel);
          // Light bends toward the centre of a convex lens, so sample inward
          dx = -Math.sign(cx) * nx * magnitude;
          dy = -Math.sign(cy) * ny * magnitude;
        }

        var index = (y * mapWidth + x) * 4;
        data[index] = 128 + dx * 127;
        data[index + 1] = 128 + dy * 127;
        data[index + 2] = 128;
        data[index + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);
    return canvas.toDataURL();
  }

  function ensureFilter(id) {
    var existing = document.getElementById(id);
    if (existing) return existing;

    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.id = id + '-defs';
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none';

    var defs = document.createElementNS(ns, 'defs');
    var filter = document.createElementNS(ns, 'filter');
    filter.id = id;
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('primitiveUnits', 'userSpaceOnUse');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    var map = document.createElementNS(ns, 'feImage');
    map.setAttribute('preserveAspectRatio', 'none');
    map.setAttribute('result', 'map');
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);

    filter.lensMap = map;
    return filter;
  }

  // Spectral dispersion: the backdrop is refracted several times, each sample
  // standing in for a band of wavelengths. Red bends the least, violet the most.
  // Every channel's weights sum to 1, so undispersed areas stay neutral.
  function buildSpectrum(samples) {
    var centres = [0, 0.5, 1];
    var weights = centres.map(function (centre) {
      var channel = [];
      var total = 0;
      for (var i = 0; i < samples; i++) {
        var d = i / (samples - 1) - centre;
        var w = Math.exp(-(d * d) / (2 * 0.3 * 0.3));
        channel.push(w);
        total += w;
      }
      return channel.map(function (w) { return w / total; });
    });
    var matrices = [];
    for (var i = 0; i < samples; i++) {
      matrices.push(
        weights[0][i].toFixed(4) + ' 0 0 0 0  0 ' +
        weights[1][i].toFixed(4) + ' 0 0 0  0 0 ' +
        weights[2][i].toFixed(4) + ' 0 0  0 0 0 1 0'
      );
    }
    return matrices;
  }

  function buildFilter(filter, map, scale, spreadPx) {
    var ns = 'http://www.w3.org/2000/svg';

    while (filter.firstChild) filter.removeChild(filter.firstChild);
    filter.appendChild(map);

    var samples = 0;
    if (spreadPx > 0.5) {
      var limit = Math.min(filter.offsetWidth || SMALL_GLASS_SIZE, SMALL_GLASS_SIZE) < SMALL_GLASS_SIZE
        ? SMALL_GLASS_SAMPLES
        : MAX_SPECTRUM_SAMPLES;
      samples = Math.min(limit, Math.max(3, Math.ceil(spreadPx / SPECTRUM_STEP) + 1));
    }

    if (!samples) {
      var single = document.createElementNS(ns, 'feDisplacementMap');
      single.setAttribute('in', 'SourceGraphic');
      single.setAttribute('in2', 'map');
      single.setAttribute('scale', String(scale));
      single.setAttribute('xChannelSelector', 'R');
      single.setAttribute('yChannelSelector', 'G');
      filter.appendChild(single);
      return;
    }

    var matrices = buildSpectrum(samples);
    var previous = null;
    for (var i = 0; i < samples; i++) {
      var displaced = document.createElementNS(ns, 'feDisplacementMap');
      displaced.setAttribute('in', 'SourceGraphic');
      displaced.setAttribute('in2', 'map');
      displaced.setAttribute('scale', String(scale + spreadPx * (i / (samples - 1) - 0.5) * 2));
      displaced.setAttribute('xChannelSelector', 'R');
      displaced.setAttribute('yChannelSelector', 'G');
      displaced.setAttribute('result', 'displaced' + i);

      var tint = document.createElementNS(ns, 'feColorMatrix');
      tint.setAttribute('in', 'displaced' + i);
      tint.setAttribute('type', 'matrix');
      tint.setAttribute('values', matrices[i]);
      tint.setAttribute('result', 'band' + i);

      filter.appendChild(displaced);
      filter.appendChild(tint);

      if (i > 0) {
        var merge = document.createElementNS(ns, 'feComposite');
        merge.setAttribute('in', previous);
        merge.setAttribute('in2', 'band' + i);
        merge.setAttribute('operator', 'lighter');
        merge.setAttribute('result', 'spectrum' + i);
        filter.appendChild(merge);
        previous = 'spectrum' + i;
      } else {
        previous = 'band0';
      }
    }
  }

  function supported() {
    return typeof CSS !== 'undefined' && CSS.supports &&
      CSS.supports('backdrop-filter', 'url(#a)');
  }

  function updateTarget(target) {
    var element = document.querySelector(target.selector);
    if (!element) return;

    var width = element.offsetWidth;
    var height = element.offsetHeight;
    if (!width || !height) return;

    var radius = parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;
    var bezel = (Math.min(width, height) / 2) * BEZEL_RATIO;
    var filter = ensureFilter(target.filterId);
    var map = filter.lensMap;

    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    filter.setAttribute('width', String(width));
    filter.setAttribute('height', String(height));
    map.setAttribute('href', buildMap(width, height, radius, bezel));
    map.setAttribute('x', '0');
    map.setAttribute('y', '0');
    map.setAttribute('width', String(width));
    map.setAttribute('height', String(height));

    // The map stores unit vectors in [-0.5, 0.5], so double the scale for the full offset
    var scale = 2 * settings.depth * bezel * REFRACTION;
    // Total separation between the red and violet images at the rim
    var spreadPx = settings.spectrum * bezel * DISPERSION * Math.min(1, Math.abs(settings.depth) * 4);
    buildFilter(filter, map, scale, spreadPx);

    document.documentElement.classList.add(target.cls);
  }

  function update() {
    for (var i = 0; i < TARGETS.length; i++) updateTarget(TARGETS[i]);
  }

  function init() {
    if (!supported()) return;
    var element = document.querySelector(TARGETS[0].selector);
    if (!element) return;

    applySettings();
    window.navGlass = {
      get: getSettings,
      set: setSetting,
      refresh: update
    };

    var pending = 0;
    var schedule = function () {
      clearTimeout(pending);
      pending = setTimeout(update, 100);
    };

    update();
    window.addEventListener('resize', schedule);
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(schedule).observe(element);
    }
    document.addEventListener('portfolio-rendered', schedule);

    // The dev edit button is appended after this script; build its lens once
    // it exists.
    if (typeof MutationObserver !== 'undefined') {
      var watcher = new MutationObserver(function () {
        if (!document.getElementById('devPresetToggle')) return;
        watcher.disconnect();
        schedule();
      });
      watcher.observe(document.body, { childList: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

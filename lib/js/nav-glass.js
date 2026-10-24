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

  var SELECTOR = 'nav.navbar.fixed-bottom > .container';
  var FILTER_ID = 'nav-lens';
  var IOR = 1.5;            // index of refraction of the simulated glass
  var BEZEL_RATIO = 0.6;    // share of the shorter side (per half) that curves
  var REFRACTION = 0.35;    // peak displacement per unit of depth, as a share of the bezel
  var MAX_MAP_PIXELS = 160000;
  var DEPTH = 1.4;
  var PROFILE_SAMPLES = 256;

  var profile = buildProfile();

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

  function ensureFilter() {
    var existing = document.getElementById(FILTER_ID);
    if (existing) return existing;

    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.id = 'nav-lens-defs';
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none';

    var defs = document.createElementNS(ns, 'defs');
    var filter = document.createElementNS(ns, 'filter');
    filter.id = FILTER_ID;
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('primitiveUnits', 'userSpaceOnUse');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    var map = document.createElementNS(ns, 'feImage');
    map.setAttribute('preserveAspectRatio', 'none');
    map.setAttribute('result', 'map');

    var displacement = document.createElementNS(ns, 'feDisplacementMap');
    displacement.setAttribute('in', 'SourceGraphic');
    displacement.setAttribute('in2', 'map');
    displacement.setAttribute('xChannelSelector', 'R');
    displacement.setAttribute('yChannelSelector', 'G');

    filter.appendChild(map);
    filter.appendChild(displacement);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);
    return filter;
  }

  function supported() {
    return typeof CSS !== 'undefined' && CSS.supports &&
      CSS.supports('backdrop-filter', 'url(#a)');
  }

  function update() {
    var element = document.querySelector(SELECTOR);
    if (!element) return;

    var width = element.offsetWidth;
    var height = element.offsetHeight;
    if (!width || !height) return;

    var radius = parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;
    var bezel = (Math.min(width, height) / 2) * BEZEL_RATIO;
    var filter = ensureFilter();
    var map = filter.querySelector('feImage');
    var displacement = filter.querySelector('feDisplacementMap');

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
    displacement.setAttribute('scale', String(2 * DEPTH * bezel * REFRACTION));

    document.documentElement.classList.add('has-nav-lens');
  }

  function init() {
    if (!supported()) return;
    var element = document.querySelector(SELECTOR);
    if (!element) return;

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// TEMPORARY comparison harness for the inline-link control bar.
// Three structures, chosen with ?variant=bar|stack|lean on top of ?dev=1.
// Deliberately outside the design system: plain bar, system font, no tokens.
// Delete this file and its script tag once one variant is promoted.
(function () {
  var params = new URLSearchParams(location.search);
  if (params.get('dev') !== '1' && !params.has('variant')) return;
  var current = params.get('variant') || 'bar';
  var names = { bar: 'Bar (7 in a row)', stack: 'Stack (2 rows)', lean: 'Lean (5 in a row)' };
  var bar = document.createElement('div');
  bar.id = 'linkVariantPicker';
  bar.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:3000;display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;background:#000;color:#fff;font:12px/1.4 -apple-system,system-ui,sans-serif;box-shadow:0 2px 10px rgb(0 0 0 / .4)';
  bar.innerHTML = '<span style="opacity:.65">Link bar</span>' + Object.keys(names).map(function (key) {
    var url = new URL(location.href);
    url.searchParams.set('variant', key);
    var on = key === current;
    return '<a href="' + url + '" style="padding:4px 8px;border-radius:4px;text-decoration:none;color:#fff;background:' + (on ? '#2f6f6f' : 'transparent') + ';border:1px solid ' + (on ? '#2f6f6f' : '#444') + '">' + names[key] + '</a>';
  }).join('');
  document.body.appendChild(bar);
})();

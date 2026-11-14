// card-index.js — a floating section index beside every expanded project card.
//
// The index is a sticky column inside a rail that spans the card's height in
// document coordinates. Sticking is done by CSS, not by a scroll handler, so
// the column cannot lag behind the card while scrolling. Left-column cards
// keep their index on the left, right-column cards on the right, so two open
// cards never fight for the same gutter.
(function () {
  'use strict';

  var FALLBACK = { width: 168, gap: 24, top: 112, scroll: 24 };
  var states = [];

  // The testing panel drives these through custom properties.
  function measure() {
    var styles = getComputedStyle(document.documentElement);
    var width = parseFloat(styles.getPropertyValue('--ci-width'));
    var gap = parseFloat(styles.getPropertyValue('--ci-gap'));
    var top = parseFloat(styles.getPropertyValue('--ci-top'));
    var scroll = parseFloat(styles.getPropertyValue('--ci-scroll'));
    return {
      width: width > 0 ? width : FALLBACK.width,
      gap: gap >= 0 ? gap : FALLBACK.gap,
      top: top >= 0 ? top : FALLBACK.top,
      scroll: scroll >= 0 ? scroll : FALLBACK.scroll
    };
  }

  function columnSide(cardEl) {
    var cluster = cardEl.closest('.cluster');
    var row = cluster && cluster.parentElement;
    if (!row) return 'left';
    var rowRect = row.getBoundingClientRect();
    var cardRect = cardEl.getBoundingClientRect();
    return cardRect.left + cardRect.width / 2 < rowRect.left + rowRect.width / 2 ? 'left' : 'right';
  }

  function remove(collapse) {
    states = states.filter(function (state) {
      if (state.collapse !== collapse) return true;
      if (state.observer) state.observer.disconnect();
      if (state.ro) state.ro.disconnect();
      if (state.rail) state.rail.remove();
      return false;
    });
    if (!states.length) document.body.classList.remove('card-index-on');
  }

  // Offsets are summed through the offsetParent chain, which is independent of
  // the scroll position. Viewport maths would be stale the moment the page
  // moves, and a fraction of a pixel off is visible as a shiver.
  function offsetWithin(el, ancestor, axis) {
    var value = 0;
    var node = el;
    while (node && node !== ancestor) {
      value += axis === 'left' ? node.offsetLeft : node.offsetTop;
      node = node.offsetParent;
    }
    return value;
  }

  function place(state) {
    var card = state.card;
    var rect = card.getBoundingClientRect();
    var parent = state.rail.offsetParent || document.body;
    var size = measure();
    var side = columnSide(card);
    var room = side === 'left' ? rect.left - size.gap : window.innerWidth - rect.right - size.gap;
    if (room < size.width) {
      state.rail.hidden = true;
      return;
    }
    state.rail.hidden = false;
    var cardLeft = offsetWithin(card, parent, 'left');
    var cardTop = offsetWithin(card, parent, 'top');
    var left = side === 'left' ? cardLeft - size.gap - size.width : cardLeft + rect.width + size.gap;
    state.rail.style.left = left + 'px';
    state.rail.style.top = cardTop + 'px';
    state.rail.style.height = Math.max(0, rect.height) + 'px';
    state.rail.style.width = size.width + 'px';
  }

  function placeAll() {
    states.forEach(place);
  }

  function build(collapse) {
    remove(collapse);
    var card = collapse.querySelector('.card');
    if (!card) return;
    var sections = Array.prototype.slice.call(collapse.querySelectorAll('.project-detail[data-section]'));
    if (sections.length < 2) return;

    var rail = document.createElement('div');
    rail.className = 'card-index-rail';
    var nav = document.createElement('nav');
    nav.className = 'card-index';
    nav.setAttribute('aria-label', 'Sections in this project: ' + (collapse.id || ''));

    var links = sections.map(function (section, index) {
      if (!section.id) section.id = collapse.id.replace('thumbCollapse-', 'section-') + '-' + index;
      var heading = section.querySelector(':scope > h3');
      var label = (heading ? heading.textContent : section.dataset.section || '').trim();
      var link = document.createElement('a');
      link.href = '#' + section.id;
      var num = document.createElement('span');
      num.className = 'ci-num';
      num.textContent = String(index + 1).padStart(2, '0');
      var text = document.createElement('span');
      text.className = 'ci-label';
      text.textContent = label;
      link.appendChild(num);
      link.appendChild(text);
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var offset = measure().scroll;
        var target = section.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
      });
      nav.appendChild(link);
      return link;
    });

    rail.appendChild(nav);
    document.body.appendChild(rail);
    document.body.classList.add('card-index-on');

    var state = { collapse: collapse, card: card, rail: rail, nav: nav, links: links, sections: sections, observer: null, ro: null };
    states.push(state);
    place(state);
    spy(state);

    // The card changes height while images load; the rail follows it.
    if ('ResizeObserver' in window) {
      state.ro = new ResizeObserver(function () { place(state); });
      state.ro.observe(card);
    }
  }

  function spy(state) {
    if (!('IntersectionObserver' in window) || !state.links.length) return;
    var visible = {};
    state.observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      var bestId = null;
      var bestRatio = 0;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] > bestRatio) {
          bestRatio = visible[id];
          bestId = id;
        }
      });
      if (!bestId) return;
      state.links.forEach(function (link) {
        link.classList.toggle('is-current', link.getAttribute('href') === '#' + bestId);
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] });
    state.sections.forEach(function (section) {
      state.observer.observe(section);
    });
  }

  function buildAllOpen() {
    document.querySelectorAll('.multi-collapse.show').forEach(build);
  }

  if (window.jQuery) {
    window.jQuery(document).on('shown.bs.collapse', function (event) {
      var collapse = event.target;
      if (!collapse.classList || !collapse.classList.contains('multi-collapse')) return;
      build(collapse);
    });
    window.jQuery(document).on('hidden.bs.collapse', function (event) {
      remove(event.target);
    });
  }

  document.addEventListener('portfolio-rendered', buildAllOpen);
  document.addEventListener('card-index-refresh', placeAll);
  window.addEventListener('resize', placeAll);
  document.addEventListener('DOMContentLoaded', buildAllOpen);
})();

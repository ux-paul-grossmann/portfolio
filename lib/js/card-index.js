// card-index.js — a floating section index beside every expanded project card.
//
// Mirrors the styleguide's section index: a column of uppercase anchor links,
// the current section marked through a scroll-spy. A left-column card keeps its
// index on the left, a right-column card on the right, so two open cards never
// fight for the same gutter. Numbers come from CSS counters on the headings.
(function () {
  'use strict';

  var INDEX_WIDTH = 168;
  var GAP = 24;
  var TOP = 112;
  var states = [];

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
      if (state.nav) state.nav.remove();
      return false;
    });
    if (!states.length) document.body.classList.remove('card-index-on');
  }

  function build(collapse) {
    remove(collapse);
    var card = collapse.querySelector('.card');
    if (!card) return;
    var sections = Array.prototype.slice.call(collapse.querySelectorAll('.project-detail[data-section]'));
    if (sections.length < 2) return;

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
        section.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
      nav.appendChild(link);
      return link;
    });

    var state = { collapse: collapse, card: card, nav: nav, links: links, sections: sections, observer: null };
    states.push(state);
    document.body.appendChild(nav);
    document.body.classList.add('card-index-on');
    place(state);
    spy(state);
  }

  // The index behaves like a sticky column inside the card: it starts at the
  // card's top edge, pins below the top offset while the card scrolls past it,
  // and stops at the card's bottom instead of running past it.
  function place(state) {
    var cardRect = state.card.getBoundingClientRect();
    var side = columnSide(state.card);
    var room = side === 'left' ? cardRect.left - GAP : window.innerWidth - cardRect.right - GAP;
    var inView = cardRect.bottom > 0 && cardRect.top < window.innerHeight;
    if (room < INDEX_WIDTH || !inView) {
      state.nav.hidden = true;
      return;
    }
    state.nav.hidden = false;
    var navHeight = state.nav.offsetHeight || 240;
    var top = Math.max(cardRect.top, TOP);
    var maxTop = cardRect.bottom - navHeight - 8;
    if (maxTop < top) top = Math.max(8, maxTop);
    state.nav.style.left = (side === 'left' ? cardRect.left - GAP - INDEX_WIDTH : cardRect.right + GAP) + 'px';
    state.nav.style.top = Math.round(top) + 'px';
    state.nav.style.width = INDEX_WIDTH + 'px';
  }

  function placeAll() {
    states.forEach(place);
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
  window.addEventListener('scroll', placeAll, { passive: true });
  window.addEventListener('resize', placeAll);
  document.addEventListener('DOMContentLoaded', buildAllOpen);
})();

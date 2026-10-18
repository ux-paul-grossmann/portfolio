// Initial page-load stagger: theme toggle slides in from right
document.addEventListener('DOMContentLoaded', function(){
    var t = document.getElementById('theme-toggle');
    if (!t) return;
    t.style.opacity = '1';
    t.style.visibility = 'visible';
    var m = window.motion || window.Motion;
    if (m && m.animate) {
        t.style.opacity = '0';
        m.animate(t, { x: [60, 0], opacity: [0, 1] }, { duration: 0.30, easing: [0.34, 1.56, 0.64, 1], delay: 0.55 });
    }
});

var __menuOpen = false;
var __menuHeight = null;   // measured once the menu is expanded, reused so the next open can start with it
var __origToggleBottom = '68px';
var __origHochBottom = '116px';
function isMobile(){ return window.matchMedia('(max-width: 575.98px)').matches; }
function arrowShouldShow(){ return $(window).scrollTop() > 150; }

// Phase 'start' runs when the menu BEGINS to expand, so the buttons move with it
// instead of after it. Phase 'settled' runs once it is fully open and only
// measures the height for the next open. The arrow is part of the sequence only
// when it is legitimately visible — above the fold it stays hidden.
function positionForMenu(open, phase){
    var hoch = document.querySelector('.scrolltop');
    var toggle = document.getElementById('theme-toggle');
    var m = window.motion || window.Motion;
    if (open) {
        document.body.classList.add('menu-open');
        if (phase === 'settled') {
            var nav = document.querySelector('nav.navbar.fixed-bottom');
            var collapse = document.getElementById('navbarToggler');
            if (nav && collapse && collapse.classList.contains('show')) {
                __menuHeight = Math.round(nav.getBoundingClientRect().height);
                document.documentElement.style.setProperty('--menu-height', __menuHeight + 'px');
            }
            return;
        }
        if (__menuHeight) document.documentElement.style.setProperty('--menu-height', __menuHeight + 'px');
        if (!m || !m.animate || !toggle) return;
        var showArrow = arrowShouldShow();
        var beforeT = toggle.getBoundingClientRect().bottom;
        var beforeA = hoch ? hoch.getBoundingClientRect().bottom : 0;
        toggle.style.transition = 'none';
        if (hoch) {
            hoch.style.transition = 'none';
            if (showArrow) { hoch.style.display = 'flex'; hoch.style.opacity = '0'; }
        }
        void toggle.offsetHeight;
        var dyT = +(beforeT - toggle.getBoundingClientRect().bottom).toFixed(1);
        toggle.style.transform = 'translateY(' + dyT + 'px)';
        m.animate(toggle, { y: [dyT, 0], opacity: [0.85, 1] }, { duration: 0.30, easing: [0.4,0,0.2,1], delay: 0 });
        if (hoch && showArrow) {
            var dyA = +(beforeA - hoch.getBoundingClientRect().bottom).toFixed(1);
            hoch.style.transform = 'translateY(' + dyA + 'px)';
            m.animate(hoch, { y: [dyA, -4, 0], opacity: [0, 1] }, { duration: 0.44, easing: [0.4,0,0.2,1], delay: 0.1 });
        }
        setTimeout(function(){ toggle.style.transition = ''; if (hoch) hoch.style.transition = ''; }, 700);
    } else {
        document.body.classList.remove('menu-open');
        document.documentElement.style.removeProperty('--menu-height');
        if (hoch) {
            if (!arrowShouldShow()) {
                if (m && m.animate) {
                    m.animate(hoch, { y: [0, 12], opacity: [1, 0] }, { duration: 0.22, easing: [0.4,0,0.2,1] }).finished.then(function(){ if(!__menuOpen) { hoch.style.display='none'; hoch.style.opacity=''; }});
                } else { $(hoch).stop(true,true).fadeOut(); }
                __scrollChoreo = false;
            } else { hoch.style.display='flex'; hoch.style.opacity='1'; }
        }
    }
}
$(document).on('show.bs.collapse', '#navbarToggler', function(){ __menuOpen = true; positionForMenu(true, 'start'); });
$(document).on('shown.bs.collapse', '#navbarToggler', function(){ positionForMenu(true, 'settled'); });
$(document).on('hide.bs.collapse', '#navbarToggler', function(){ __menuOpen = false; positionForMenu(false); });
$(document).on('hidden.bs.collapse', '#navbarToggler', function(){ positionForMenu(false); });
$(window).on('resize', function(){ if(__menuOpen && isMobile()) positionForMenu(true, 'settled'); else if (!isMobile()) document.body.classList.remove('menu-open'); });

var __scrollChoreo = false;

// Breakpoint change: the toggle's horizontal offset is layout dependent — on
// desktop it moves aside so the arrow can take its corner, on mobile the two
// are stacked and no offset must remain. The choreography writes that offset as
// an inline style, which survives a viewport change (for example switching the
// device toolbar between desktop and mobile), because the reset only runs on
// scroll. Re-derive it whenever the breakpoint is crossed.
var __mobileQuery = window.matchMedia('(max-width: 575.98px)');
__mobileQuery.addEventListener('change', function () {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    if (__mobileQuery.matches) {
        toggle.style.transform = 'translateX(0)';
    } else {
        toggle.style.transform = __scrollChoreo ? 'translateX(-46px)' : 'translateX(0)';
    }
});

$(window).scroll(function() {
    // The buttons are positioned above the open menu by CSS, so the arrow may
    // still follow the scroll threshold here instead of being forced visible.
    var shouldShow = $(this).scrollTop() > 150;
    var toggle = document.getElementById('theme-toggle');
    var hoch = document.querySelector('.scrolltop');
    if (!toggle || !hoch) return;
    var _isMobile = isMobile();

    var m = window.motion || window.Motion;

    if (shouldShow && !__scrollChoreo) {
        __scrollChoreo = true;
        if (m && m.animate) {
            if (_isMobile) {
                // Mobile Paper B (2D2-0): stacked bottom-right, no horizontal shift
                hoch.style.display = 'flex';
                hoch.style.opacity = '0';
                m.animate(hoch, { y: [16, 0], opacity: [0, 1] }, { duration: 0.32, easing: [0.4, 0, 0.2, 1], delay: 0 });
            } else {
                // Desktop: Theme-Toggle slides left – 8px gap to HOCH in end state
                m.animate(toggle, { x: -46 }, { duration: 0.32, easing: [0.4, 0, 0.2, 1], delay: 0.06 });
                // HOCH slides up from below into Toggle's old spot
                hoch.style.display = 'flex';
                hoch.style.opacity = '0';
                m.animate(hoch, { y: [40, 0], opacity: [0, 1] }, { duration: 0.34, easing: [0.4, 0, 0.2, 1], delay: 0.16 });
            }
        } else {
            if (_isMobile) $(hoch).stop(true, true).fadeIn();
            else { toggle.style.transform = 'translateX(-46px)'; $(hoch).stop(true, true).fadeIn(); }
        }
    } else if (!shouldShow && __scrollChoreo) {
        __scrollChoreo = false;
        if (m && m.animate) {
            if (_isMobile) {
                // Overshoot direkt ohne Anfangs-Bremsen
                m.animate(hoch, { y: [0, 16], opacity: [1, 0] }, { duration: 0.30, easing: [0.34, 0, 0.64, 1.4] }).finished.then(function(){ hoch.style.display = 'none'; hoch.style.opacity = ''; });
            } else {
                m.animate(toggle, { x: 0 }, { duration: 0.28, easing: [0.4, 0, 0.2, 1] });
                m.animate(hoch, { y: [0, 40], opacity: [1, 0] }, { duration: 0.24, easing: [0.4, 0, 0.2, 1] }).finished.then(function(){ hoch.style.display = 'none'; hoch.style.opacity = ''; });
            }
        } else {
            if (_isMobile) $(hoch).stop(true, true).fadeOut();
            else { toggle.style.transform = 'translateX(0)'; $(hoch).stop(true, true).fadeOut(); }
        }
    }
});

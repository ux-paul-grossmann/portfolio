// Initial page-load stagger: theme toggle slides in from right
document.addEventListener('DOMContentLoaded', function(){
    var t = document.getElementById('theme-toggle');
    if (!t) return;
    t.style.opacity = '1';
    t.style.visibility = 'visible';
    var m = window.motion || window.Motion;
    if (m && m.animate) {
        t.style.opacity = '0';
        m.animate(t, { x: [40, 0], opacity: [0, 1] }, { duration: 0.48, easing: [0.4, 0, 0.2, 1], delay: 0.55 });
    }
});

var __menuOpen = false;
var __origToggleBottom = '68px';
var __origHochBottom = '116px';
function isMobile(){ return window.matchMedia('(max-width: 575.98px)').matches; }
function positionForMenu(open){
    var hoch = document.querySelector('.scrolltop');
    if (open) {
        document.body.classList.add('menu-open');
        if (hoch) { hoch.style.display = 'flex'; hoch.style.opacity = '1'; }
        var m = window.motion || window.Motion;
        var toggle = document.getElementById('theme-toggle');
        if (m && m.animate && toggle && hoch) {
            m.animate(toggle, { y: [12, 0], opacity: [0.9,1] }, { duration: 0.28, easing: [0.4,0,0.2,1] });
            m.animate(hoch, { y: [12, 0], opacity: [0,1] }, { duration: 0.30, easing: [0.4,0,0.2,1], delay: 0.06 });
        }
    } else {
        document.body.classList.remove('menu-open');
        if (hoch) {
            var shouldShow = $(window).scrollTop() > 150;
            if (!shouldShow) {
                var m2 = window.motion || window.Motion;
                if (m2 && m2.animate) {
                    m2.animate(hoch, { y: [0, 12], opacity: [1, 0] }, { duration: 0.22, easing: [0.4,0,0.2,1] }).finished.then(function(){ if(!__menuOpen) { hoch.style.display='none'; hoch.style.opacity=''; }});
                } else { $(hoch).stop(true,true).fadeOut(); }
                __scrollChoreo = false;
            } else { hoch.style.display='flex'; hoch.style.opacity='1'; }
        }
    }
}
$(document).on('show.bs.collapse', '#navbarToggler', function(){ __menuOpen = true; positionForMenu(true); });
$(document).on('shown.bs.collapse', '#navbarToggler', function(){ positionForMenu(true); });
$(document).on('hide.bs.collapse', '#navbarToggler', function(){ __menuOpen = false; positionForMenu(false); });
$(document).on('hidden.bs.collapse', '#navbarToggler', function(){ positionForMenu(false); });
$(window).on('resize', function(){ if(__menuOpen && isMobile()) positionForMenu(true); else if (!isMobile()) document.body.classList.remove('menu-open'); });

var __scrollChoreo = false;
$(window).scroll(function() {
    if (__menuOpen && isMobile()) return; // menu open → keep above menu, ignore scroll choreo
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
                m.animate(hoch, { y: [16, 0], opacity: [0, 1] }, { duration: 0.32, easing: [0.4, 0, 0.2, 1], delay: 0.08 });
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
                m.animate(hoch, { y: [0, 16], opacity: [1, 0] }, { duration: 0.22, easing: [0.4, 0, 0.2, 1] }).finished.then(function(){ hoch.style.display = 'none'; hoch.style.opacity = ''; });
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

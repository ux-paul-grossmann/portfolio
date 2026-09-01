// Initial page-load stagger: theme toggle slides in from right
document.addEventListener('DOMContentLoaded', function(){
    var t = document.getElementById('theme-toggle');
    if (!t) return;
    var m = window.motion || window.Motion;
    if (m && m.animate) {
        t.style.opacity = '0';
        m.animate(t, { x: [40, 0], opacity: [0, 1] }, { duration: 0.48, easing: [0.4, 0, 0.2, 1], delay: 0.55 });
    }
});

var __scrollChoreo = false;
$(window).scroll(function() {
    var shouldShow = $(this).scrollTop() > 150;
    var toggle = document.getElementById('theme-toggle');
    var hoch = document.querySelector('.scrolltop');
    if (!toggle || !hoch) return;

    var m = window.motion || window.Motion;

    if (shouldShow && !__scrollChoreo) {
        __scrollChoreo = true;
        if (m && m.animate) {
            // Theme-Toggle slides left – 8px gap to HOCH in end state
            m.animate(toggle, { x: -46 }, { duration: 0.32, easing: [0.4, 0, 0.2, 1], delay: 0.06 });
            // HOCH slides up from below into Toggle's old spot
            hoch.style.display = 'flex';
            hoch.style.opacity = '0';
            m.animate(hoch, { y: [40, 0], opacity: [0, 1] }, { duration: 0.34, easing: [0.4, 0, 0.2, 1], delay: 0.16 });
        } else {
            toggle.style.transform = 'translateX(-46px)';
            $(hoch).stop(true, true).fadeIn();
        }
    } else if (!shouldShow && __scrollChoreo) {
        __scrollChoreo = false;
        if (m && m.animate) {
            m.animate(toggle, { x: 0 }, { duration: 0.28, easing: [0.4, 0, 0.2, 1] });
            m.animate(hoch, { y: [0, 40], opacity: [1, 0] }, { duration: 0.24, easing: [0.4, 0, 0.2, 1] }).finished.then(function(){ hoch.style.display = 'none'; hoch.style.opacity = ''; });
        } else {
            toggle.style.transform = 'translateX(0)';
            $(hoch).stop(true, true).fadeOut();
        }
    }
});

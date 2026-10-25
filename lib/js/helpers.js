// Theme toggle – material light/dark, system preference, persist in localStorage
(function() {
    var STORAGE_KEY = 'theme';
    var mq = window.matchMedia('(prefers-color-scheme: dark)');

    function getPreferred() {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark') return 'dark';
        if (stored === 'light') return 'light';
        // migrate legacy values – clear so system preference wins
        if (stored === 'material' || stored === 'lightPlus' || stored === ':root') {
            localStorage.removeItem(STORAGE_KEY);
            return mq.matches ? 'dark' : 'light';
        }
        return mq.matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        var isDark = theme === 'dark';
        document.body.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('dark', isDark);
        document.body.classList.remove('lightPlus', 'material');
        document.documentElement.classList.remove('lightPlus', 'material');
        // keep .dark only for dark; light = :root (material light palette)
        var icon = document.getElementById('theme-toggle-icon');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.setAttribute('aria-label', isDark ? 'Zu hellem Theme wechseln' : 'Zu dunklem Theme wechseln');
        }
    }

    var current = getPreferred();
    applyTheme(current);

    // Follow system changes only when user has no explicit choice
    function onSystemChange(e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    }
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);

    document.addEventListener('DOMContentLoaded', function() {
        applyTheme(getPreferred());
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var isDark = document.body.classList.contains('dark');
            var next = isDark ? 'light' : 'dark';
            localStorage.setItem(STORAGE_KEY, next);
            applyTheme(next);
        });
    });
})();

// Brand caption: cycle the candidate lines once per page load.
(function() {
    var lines = [
        'Interfaces people understand.',
        'Works the way you expect.',
        'Designed to feel effortless.',
        'Built around the people using it.'
    ];
    var key = 'portfolio-tagline-index';
    var el = document.getElementById('ci-brand-caption');
    if (!el) return;
    var index = 0;
    try { index = parseInt(localStorage.getItem(key), 10) || 0; } catch (e) {}
    el.textContent = lines[index % lines.length];
    try { localStorage.setItem(key, String((index + 1) % lines.length)); } catch (e) {}
})();

function notizRotator () {
    $('.kontext-wrap div').each(function() {
        var a = Math.random() * 20 - 5;
        $(this).css('transform', 'rotate(' + a + 'deg)');
    });
}

// B4-Validation
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();



//   Form-Auto-Expand-Helper
var inputTextArea = document.querySelector("#inputTextArea");
// auto-expand the textarea (the contact form was replaced, so it may be absent)
if (inputTextArea) {
    inputTextArea.addEventListener('keydown', autosize);
}

function autosize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = 'height:auto;';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }, 100);
}


$(window).on("scroll", function() {
	var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    var auslese = (scrollHeight - scrollPosition) / scrollHeight;
    //console.log(auslese)
	if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
	    inputTextArea.focus();
	} else {
        inputTextArea.blur();
    }
});

//  B4-ToolTip-Helper 


$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})


// Slick-Carousel-Plugin
$('.carousel').carousel().swipeCarousel({
    // options here
});
$('.carousel').carousel({
    interval: 3000
})

//

// $('.card').hover(function () {
//     $(this).addClass('darken');
//     $('article').addClass('darken');
//     $('.card ').not($(this)).addClass('lighten');

// }, function () {
//         $('.card').removeClass('darken lighten');
//         $('article').removeClass('darken lighten');
// })


// $('.card').hover(function () {
//     $('.dim').fadeIn(200);
// },
//     function () {
//         $('.dim').fadeOut(200);
//     }

// );


// Color Selection Iphone-Device
$(document).ready(function() {
    // iphone8
    $("button.select-black").click(function() {
        $(".marvel-device.iphone8").removeClass("silver");
        $(".marvel-device.iphone8").removeClass("gold");
      $(".marvel-device.iphone8").addClass("black");
    });
  
    $("button.select-silver").click(function() {
        $(".marvel-device.iphone8").removeClass("gold");
        $(".marvel-device.iphone8").removeClass("black");
        $(".marvel-device.iphone8").addClass("silver");
    });
  
    $("button.select-gold").click(function() {
        $(".marvel-device.iphone8").removeClass("black");
        $(".marvel-device.iphone8").removeClass("silver");
      $(".marvel-device.iphone8").addClass("gold");
    });

    // iphone5s
    $("button.select-black").click(function() {
        $(".marvel-device.iphone5s").removeClass("silver");
        $(".marvel-device.iphone5s").removeClass("gold");
      $(".marvel-device.iphone5s").addClass("black");
    });
  
    $("button.select-silver").click(function() {
        $(".marvel-device.iphone5s").removeClass("gold");
        $(".marvel-device.iphone5s").removeClass("black");
        $(".marvel-device.iphone5s").addClass("silver");
    });
  
    $("button.select-gold").click(function() {
        $(".marvel-device.iphone5s").removeClass("black");
        $(".marvel-device.iphone5s").removeClass("silver");
      $(".marvel-device.iphone5s").addClass("gold");
    });
  });

// lazyloading...
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
    load_delay: 1500
    // ... more custom settings?
});


// (theme handled above – light/dark material toggle)


//////////////////////////////////////////







// var zooming = new Zooming().listen('.img-zoomable')


// zooming.config({

//     scrollThreshold: 1000,
//     enableGrab: false,
//     bgColor: 'transparent',
//     zIndex: -1

// });
var glightbox = GLightbox({
    selector: '.glightbox',
    openEffect: 'zoom',
    closeEffect: 'fade',
    autoplayVideos: true
});

// Rotate control for the image lightbox. Phone screenshots are often shown
// sideways, so on touch the lightbox gets one button that turns the current
// image a quarter further. Desktop keeps its chevrons only.
(function () {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'glightbox-rotate';
    button.setAttribute('aria-label', 'Bild drehen');
    button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
        '<path d="M21 12a9 9 0 1 1-3.2-6.9"></path><path d="M21 3v5h-5"></path></svg>';
    document.body.appendChild(button);

    var turn = 0;

    function reset() {
        turn = 0;
        document.querySelectorAll('.gslide img').forEach(function (img) {
            img.style.transform = '';
            img.style.transformOrigin = '';
        });
    }

    function apply() {
        var slide = glightbox.activeSlide;
        var img = slide ? slide.querySelector('img') : null;
        if (!img) return;
        if (!turn) { img.style.transform = ''; return; }
        var w = img.offsetWidth;
        var h = img.offsetHeight;
        if (!w || !h) return;
        var sideways = turn % 180 !== 0;
        var boxW = sideways ? h : w;
        var boxH = sideways ? w : h;
        var scale = Math.min(1, (window.innerWidth * 0.94) / boxW, (window.innerHeight * 0.86) / boxH);
        img.style.transformOrigin = 'center center';
        img.style.transform = 'rotate(' + turn + 'deg) scale(' + scale + ')';
    }

    button.addEventListener('click', function () {
        turn = (turn + 90) % 360;
        apply();
    });

    glightbox.on('open', function () { reset(); button.classList.add('is-visible'); });
    glightbox.on('close', function () { button.classList.remove('is-visible'); reset(); });
    glightbox.on('slide_changed', function () { reset(); });
    window.addEventListener('resize', function () { if (button.classList.contains('is-visible')) apply(); });
})();


document.querySelector('#scrollDownChevron').addEventListener('click', () => {
    window.scrollBy({
        top: window.innerHeight * 0.8, // Scroll 80% of viewport height
        behavior: 'smooth'
    });
});


// const lightbox = GLightbox({
//     selector: 'glightbox',
//     touchNavigation: true,
//     loop: true,
//     autoplayVideos: true
// });

//////////////////////////////////////////

//////////////////////////////////////////

const currentYear = new Date().getFullYear();

// Update the footer span (if it exists)
const footerYear = document.getElementById("current-year");
if (footerYear) {
    footerYear.textContent = currentYear;
}

// Update the Browser Tab Title
// This adds the year as plain text so the <span> code doesn't show up
document.title = `UX/UI-Designer • Portfolio • Paul Großmann — ${currentYear}`;

// Goldener Schnitt – #ci-profilbild Mitte auf 38.1966vh (flow, clamp on)
(function(){
    var el = document.getElementById('ci-profilbild');
    var profile = document.getElementById('profile');
    var nav = document.querySelector('.navbar.fixed-bottom');
    if (!el) return;
    function getGoldenY(){
        var raw = getComputedStyle(document.documentElement).getPropertyValue('--golden-y').trim();
        if (raw.endsWith('vh')) return window.innerHeight * parseFloat(raw) / 100;
        if (raw.endsWith('%')) return window.innerHeight * parseFloat(raw) / 100;
        return window.innerHeight * 0.3819660113;
    }
    function isFixed(){ return document.documentElement.getAttribute('data-golden-mode') === 'fixed'; }
    function isClampOff(){ return document.documentElement.getAttribute('data-golden-clamp') === 'off'; }
    function apply(){
        if (isFixed()) { el.style.marginTop = ''; return; }
        var prev = el.style.marginTop;
        el.style.marginTop = '0px';
        var scrollY = window.scrollY || window.pageYOffset;
        var rect = el.getBoundingClientRect();
        var curTopDoc = rect.top + scrollY;
        var curCenterDoc = curTopDoc + rect.height / 2;
        var desiredDoc = getGoldenY();
        var delta = desiredDoc - curCenterDoc;
        var newMargin = delta;
        if (!isClampOff()) {
            var headerBottomDoc = profile ? profile.getBoundingClientRect().bottom + scrollY : 0;
            var navTopDoc = nav ? nav.getBoundingClientRect().top + scrollY : scrollY + window.innerHeight;
            var newTopDoc = curTopDoc + delta;
            var newBottomDoc = newTopDoc + rect.height;
            var gap = 12;
            if (newTopDoc < headerBottomDoc + gap) newMargin = headerBottomDoc + gap - curTopDoc;
            if (newBottomDoc > navTopDoc - gap) {
                if (rect.height < (navTopDoc - headerBottomDoc - gap*2)) {
                    var maxTopDoc = navTopDoc - gap - rect.height;
                    if (curTopDoc + newMargin > maxTopDoc) newMargin = maxTopDoc - curTopDoc;
                }
            }
            if (newMargin < 0) newMargin = 0;
        }
        el.style.marginTop = newMargin + 'px';
        // eslint-disable-next-line no-unused-vars
        prev = prev;
    }
    var raf = null;
    function schedule(){ if(raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); }
    window.addEventListener('load', schedule);
    window.addEventListener('resize', schedule);
    document.addEventListener('DOMContentLoaded', schedule);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    new MutationObserver(schedule).observe(document.documentElement, {attributes:true, attributeFilter:['data-golden-mode','data-golden-clamp','style']});
})();
// Fixed UI: compensate the scrollbar width while GLightbox hides the page scrollbar.
(function() {
    function setScrollbarWidth() {
        if (document.documentElement.classList.contains('glightbox-open')) return;
        var width = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        document.documentElement.style.setProperty('--scrollbar-width', width + 'px');
    }
    function schedule() { setTimeout(setScrollbarWidth, 0); }
    window.addEventListener('load', schedule);
    window.addEventListener('resize', setScrollbarWidth);
    document.addEventListener('portfolio-rendered', schedule);
    document.addEventListener('DOMContentLoaded', schedule);
    schedule();
})();

//////////////////////////////////////////
// Navigation highlight: marks the section currently in view.
// Bootstrap's data-spy has no data-target here, so it never ran.
//////////////////////////////////////////
(function () {
    var nav = document.querySelector('nav.navbar.fixed-bottom');
    if (!nav) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll('.navbar-nav .nav-link'));
    var sections = links.map(function (link) {
        var hash = link.getAttribute('href') || '';
        return hash.charAt(0) === '#' ? document.querySelector(hash) : null;
    });

    if (!links.length) return;

    var pending = 0;

    function update() {
        var marker = window.scrollY + window.innerHeight * 0.72;
        var currentId = null;

        sections.forEach(function (section) {
            if (!section) return;
            if (section.offsetTop <= marker) currentId = section.id;
        });

        // At the very bottom the last section wins, even if it starts below the marker
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 4) {
            for (var i = sections.length - 1; i >= 0; i--) {
                if (sections[i]) { currentId = sections[i].id; break; }
            }
        }

        links.forEach(function (link) {
            var isCurrent = currentId !== null && link.getAttribute('href') === '#' + currentId;
            link.classList.toggle('active', isCurrent);
            if (isCurrent) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function schedule() {
        if (pending) return;
        pending = setTimeout(function () {
            pending = 0;
            update();
        }, 80);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('portfolio-rendered', schedule);
    update();
})();

// Illustration: marks the tab an automated assistant is working in, so the
// person at the keyboard sees which tab is in use before interfering.
// Only active when the tab itself carries the sessionStorage flag; a normal
// visitor tab never sets it and never sees anything.
(function () {
    var KEY = 'portfolio-agent-tab';
    var active = false;
    try { active = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
    if (!active) return;

    document.documentElement.classList.add('agent-active');
    if (document.title.indexOf('●') !== 0) document.title = '● ' + document.title;

    var pill = document.createElement('div');
    pill.className = 'agent-pill';
    pill.setAttribute('role', 'status');
    pill.innerHTML = '<span class="agent-pill-dot" aria-hidden="true"></span><span class="agent-pill-text">Agent arbeitet in diesem Tab</span>';
    document.body.appendChild(pill);

    var link = document.createElement('link');
    link.rel = 'icon';
    link.href = 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#00bcd4"/><circle cx="16" cy="16" r="6" fill="#00181a"/></svg>'
    );
    document.head.appendChild(link);
})();

// Contact caption: two lines alternate per load, so both can be judged in the
// wild. A caption saved in dev mode wins and stops the rotation.
(function () {
    var el = document.getElementById('kontaktCaption');
    if (!el) return;

    var saved = null;
    try {
        var copy = JSON.parse(localStorage.getItem('portfolio-contact-copy') || '{}');
        saved = copy && copy.caption ? copy.caption : null;
    } catch (error) {}
    if (saved) return;

    var lines = [
        'Ich freue mich auf Ihre Nachricht und ein erstes Gespräch.',
        'Schreiben Sie mir – ich antworte in der Regel innerhalb eines Werktags.'
    ];
    var index = 1;
    try {
        var stored = parseInt(localStorage.getItem('portfolio-contact-caption-index'), 10);
        index = isNaN(stored) ? 0 : (stored + 1) % lines.length;
    } catch (error) {}
    try { localStorage.setItem('portfolio-contact-caption-index', String(index)); } catch (error) {}
    el.textContent = lines[index];
})();

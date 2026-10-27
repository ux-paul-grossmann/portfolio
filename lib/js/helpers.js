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
    // The contact form is gone, so the element can be null; the scroll
    // handler must not throw on every scroll because of it.
    if (!inputTextArea) return;
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

    // GLightbox's touch layer is switched off: its drag vector follows the
    // slide and its pinch zooms around the image centre. The layer below owns
    // swipes, panning while zoomed and the two-finger pinch at the midpoint.
    // Its mouse drag only binds mouse events, so it stays on where a fine
    // pointer exists and is off on phones, where it would fight the layer.
    glightbox.settings.touchNavigation = false;
    glightbox.settings.draggable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var turns = new Map();
    var sources = new Map();

    function turnFor(slide) {
        return turns.get(slide) || 0;
    }

    function originalFor(slide, img) {
        var entry = sources.get(slide);
        if (!entry) {
            entry = { image: new Image(), src: img.getAttribute('src') };
            entry.image.src = entry.src;
            sources.set(slide, entry);
        }
        return entry;
    }

    function restore(slide) {
        slide.classList.remove('lb-rotated');
        slide.style.removeProperty('--lb-max-w');
        slide.style.removeProperty('--lb-max-h');
        slide.style.removeProperty('--lb-band');
    }

    function restoreImage(slide) {
        var img = slide.querySelector('img');
        var entry = img ? sources.get(slide) : null;
        if (img && entry && entry.src) img.setAttribute('src', entry.src);
        restore(slide);
    }

    function reset() {
        turns.clear();
        document.querySelectorAll('.gslide img').forEach(function (img) {
            img.style.transform = '';
            img.style.transformOrigin = '';
        });
        sources.forEach(function (entry, slide) {
            var img = slide.querySelector('img');
            if (img) img.setAttribute('src', entry.src);
            restore(slide);
        });
    }

    // The pixels are turned, not the element. A rotated wrapper also rotates
    // the drag vector the zoom library writes to the image, so a pan follows
    // the turned axes and its distance is multiplied by the wrapper's fit
    // scale (measured: 75px right became 94px down at 90 degrees). With baked
    // pixels the image stays upright and pinch and pan keep their screen axes.
    function apply() {
        var slide = glightbox.activeSlide;
        if (!slide) return;
        var img = slide.querySelector('img');
        if (!img) return;
        var turn = turnFor(slide);
        if (!turn) {
            restoreImage(slide);
            return;
        }
        var entry = originalFor(slide, img);
        if (!entry.image.complete || !entry.image.naturalWidth) {
            entry.image.addEventListener('load', function () {
                if (turnFor(slide)) apply();
            }, { once: true });
            return;
        }
        var naturalW = entry.image.naturalWidth;
        var naturalH = entry.image.naturalHeight;
        var sideways = turn % 180 !== 0;
        // Cap the pixels at what a phone screen can show: a 12MP source would
        // otherwise cost 48MB per turn for no visible gain.
        var cap = Math.max(window.innerWidth, window.innerHeight) * (window.devicePixelRatio || 1) * 1.25;
        var factor = Math.min(1, cap / Math.max(naturalW, naturalH));
        var width = Math.max(1, Math.round(naturalW * factor));
        var height = Math.max(1, Math.round(naturalH * factor));
        var canvas = document.createElement('canvas');
        canvas.width = sideways ? height : width;
        canvas.height = sideways ? width : height;
        var context = canvas.getContext('2d');
        if (!context) return;
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(turn * Math.PI / 180);
        context.drawImage(entry.image, -width / 2, -height / 2, width, height);
        var png = /\.png(\?|$)/i.test(entry.src);
        img.setAttribute('src', canvas.toDataURL(png ? 'image/png' : 'image/jpeg', 0.92));
        // Fit box and band lift live in CSS variables on the slide, not as
        // inline sizes on the image: the zoom library wipes the image's inline
        // style when a pinch returns to scale 1.
        var description = slide.querySelector('.gslide-description:not(.is-empty)');
        var bandH = description ? description.getBoundingClientRect().height : 0;
        slide.style.setProperty('--lb-max-w', (window.innerWidth - 24) + 'px');
        slide.style.setProperty('--lb-max-h', (window.innerHeight - bandH - 96) + 'px');
        slide.style.setProperty('--lb-band', bandH + 'px');
        slide.classList.add('lb-rotated');
    }

    button.addEventListener('click', function () {
        var slide = glightbox.activeSlide;
        if (!slide) return;
        // A turn starts from the neutral view, like every photo viewer.
        clearView(slide);
        turns.set(slide, (turnFor(slide) + 90) % 360);
        apply();
    });

    // ---------- touch: pinch at the midpoint, pan in screen axes ----------
    var views = new Map();
    var touch = null;

    function viewFor(slide) {
        var view = views.get(slide);
        if (!view) {
            view = { z: 1, tx: 0, ty: 0 };
            views.set(slide, view);
        }
        return view;
    }

    function drawView(slide) {
        var img = slide.querySelector('img');
        var view = views.get(slide);
        if (!img || !view) return;
        img.style.transform = view.z === 1 && !view.tx && !view.ty
            ? ''
            : 'translate(' + view.tx + 'px, ' + view.ty + 'px) scale(' + view.z + ')';
    }

    function clearView(slide) {
        views.delete(slide);
        var img = slide ? slide.querySelector('img') : null;
        if (img) img.style.transform = '';
    }

    function clearAllViews() {
        views.forEach(function (view, slide) { clearView(slide); });
        views.clear();
    }

    // The visual centre minus the applied translation is the layout centre;
    // it does not move while the image scales.
    function centreOf(img, view) {
        var rect = img.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - view.tx, y: rect.top + rect.height / 2 - view.ty };
    }

    function clampView(slide, view, centre) {
        var img = slide.querySelector('img');
        if (!img) return view;
        var halfW = img.offsetWidth * view.z / 2;
        var halfH = img.offsetHeight * view.z / 2;
        var tx = view.tx;
        var ty = view.ty;
        if (halfW * 2 <= window.innerWidth) tx = 0;
        else tx = Math.min(Math.max(tx, window.innerWidth - halfW - centre.x), halfW - centre.x);
        if (halfH * 2 <= window.innerHeight) ty = 0;
        else ty = Math.min(Math.max(ty, window.innerHeight - halfH - centre.y), halfH - centre.y);
        return { z: view.z, tx: tx, ty: ty };
    }

    function mediaOf(target) {
        var slide = glightbox.activeSlide;
        if (!slide) return null;
        var media = slide.querySelector('.gslide-media');
        if (!media || !media.contains(target)) return null;
        return slide;
    }

    function pinching(slide, touches) {
        var view = viewFor(slide);
        var a = touches[0];
        var b = touches[1];
        var img = slide.querySelector('img');
        var centre = centreOf(img, view);
        return {
            mode: 'pinch',
            slide: slide,
            img: img,
            z: view.z,
            tx: view.tx,
            ty: view.ty,
            cx: centre.x,
            cy: centre.y,
            dist: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY) || 1,
            midX: (a.clientX + b.clientX) / 2,
            midY: (a.clientY + b.clientY) / 2
        };
    }

    function onTouchStart(event) {
        if (!document.body.classList.contains('glightbox-open')) return;
        if (event.target.closest('.gbtn, .gclose, .glightbox-rotate, .gslide-description, a, button')) return;
        var slide = mediaOf(event.target);
        if (!slide) return;
        if (event.touches.length > 1) {
            event.preventDefault();
            event.stopPropagation();
            touch = pinching(slide, event.touches);
            return;
        }
        var view = viewFor(slide);
        if (view.z > 1) {
            event.stopPropagation();
            var img = slide.querySelector('img');
            var centre = centreOf(img, view);
            touch = {
                mode: 'pan', slide: slide, z: view.z, tx: view.tx, ty: view.ty,
                cx: centre.x, cy: centre.y, moved: false,
                x: event.touches[0].clientX, y: event.touches[0].clientY
            };
        } else {
            touch = {
                mode: 'swipe', slide: slide,
                x: event.touches[0].clientX, y: event.touches[0].clientY, dx: 0, dy: 0
            };
        }
    }

    function onTouchMove(event) {
        if (!touch) return;
        if (touch.mode === 'pinch') {
            if (event.touches.length < 2) return;
            event.preventDefault();
            event.stopPropagation();
            var a = event.touches[0];
            var b = event.touches[1];
            var dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY) || 1;
            var z = Math.min(4, Math.max(1, touch.z * dist / touch.dist));
            var midX = (a.clientX + b.clientX) / 2;
            var midY = (a.clientY + b.clientY) / 2;
            var ratio = z / touch.z;
            // Keep the content that sat under the finger midpoint there while
            // the fingers move and spread.
            var view = {
                z: z,
                tx: midX - touch.cx - ratio * (touch.midX - touch.cx - touch.tx),
                ty: midY - touch.cy - ratio * (touch.midY - touch.cy - touch.ty)
            };
            views.set(touch.slide, clampView(touch.slide, view, { x: touch.cx, y: touch.cy }));
            drawView(touch.slide);
            return;
        }
        if (touch.mode === 'pan') {
            var point = event.touches[0];
            if (!point) return;
            touch.moved = true;
            event.preventDefault();
            event.stopPropagation();
            var moved = {
                z: touch.z,
                tx: touch.tx + (point.clientX - touch.x),
                ty: touch.ty + (point.clientY - touch.y)
            };
            views.set(touch.slide, clampView(touch.slide, moved, { x: touch.cx, y: touch.cy }));
            drawView(touch.slide);
            return;
        }
        var finger = event.touches[0];
        if (!finger) return;
        touch.dx = finger.clientX - touch.x;
        touch.dy = finger.clientY - touch.y;
        if (Math.abs(touch.dx) > 8 && Math.abs(touch.dx) > Math.abs(touch.dy)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function onTouchEnd(event) {
        if (!touch) return;
        var state = touch;
        touch = null;
        if (state.mode === 'pinch') {
            event.preventDefault();
            event.stopPropagation();
            var view = viewFor(state.slide);
            if (view.z < 1.05) clearView(state.slide);
            else {
                views.set(state.slide, clampView(state.slide, view, { x: state.cx, y: state.cy }));
                drawView(state.slide);
            }
            return;
        }
        if (state.mode === 'pan') {
            if (state.moved) {
                event.preventDefault();
                event.stopPropagation();
            }
            return;
        }
        if (Math.abs(state.dx) > 40 && Math.abs(state.dx) > Math.abs(state.dy)) {
            event.preventDefault();
            event.stopPropagation();
            if (state.dx < 0) glightbox.nextSlide();
            else glightbox.prevSlide();
        }
    }

    document.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
    document.addEventListener('touchmove', onTouchMove, { capture: true, passive: false });
    document.addEventListener('touchend', onTouchEnd, { capture: true, passive: false });
    // A cancelled gesture aborts in place: no navigation, the current zoom stays.
    document.addEventListener('touchcancel', function () { touch = null; }, { capture: true, passive: true });

    // An empty caption block still reserves height at the bottom and reads as
    // a broken bar. Slide captions are injected after open, so the state is
    // re-checked whenever the description changes instead of once.
    // GLightbox builds one description node per slide; the empty ones must
    // collapse per node, not just the first in the document.
    function syncDescription() {
        document.querySelectorAll('.gslide-description').forEach(function (description) {
            var hasText = description.textContent.trim().length > 0;
            description.classList.toggle('is-empty', !hasText);
        });
    }

    function watchDescription() {
        document.querySelectorAll('.gslide-description').forEach(function (description) {
            if (description.dataset.watched === '1') return;
            description.dataset.watched = '1';
            new MutationObserver(syncDescription).observe(description, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });
        syncDescription();
    }

    // Tap the image to hide the chrome (chevrons, close, rotate, caption),
    // tap again to bring it back. Buttons keep their own click handling.
    function toggleUi() {
        document.documentElement.classList.toggle('lb-ui-hidden');
    }

    glightbox.on('open', function () {
        document.documentElement.classList.remove('lb-ui-hidden');
        reset();
        clearAllViews();
        button.classList.add('is-visible');
        setTimeout(function () { watchDescription(); syncDescription(); }, 80);
    });
    glightbox.on('close', function () {
        button.classList.remove('is-visible');
        reset();
        clearAllViews();
        sources.clear();
        document.documentElement.classList.remove('lb-ui-hidden');
    });
    // A turned slide keeps its pixels when the viewer moves on; restoring it
    // while the slide track is laid out changed the slide's width and left
    // two slides half-visible. The turn is per slide and drops on close.
    glightbox.on('slide_changed', function () {
        views.forEach(function (view, slide) {
            if (slide !== glightbox.activeSlide) clearView(slide);
        });
        setTimeout(function () { watchDescription(); syncDescription(); }, 80);
    });
    document.addEventListener('click', function (event) {
        if (!document.body.classList.contains('glightbox-open')) return;
        if (event.target.closest('.gbtn, .gclose, .glightbox-rotate, .gslide-description, a, button')) return;
        if (!event.target.closest('.gslide-image, .gslide-media, .gslide-inner-content')) return;
        toggleUi();
    });

    window.addEventListener('resize', function () {
        var slide = glightbox.activeSlide;
        if (button.classList.contains('is-visible') && slide && turnFor(slide)) apply();
    });
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

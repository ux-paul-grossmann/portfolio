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
// auto-expand the textarea
inputTextArea.addEventListener('keydown', autosize);

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
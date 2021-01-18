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


// themeswitch
if (localStorage.getItem("theme")) {
    var theme = localStorage.getItem("theme");
    document.body.classList.add(theme)
}

var toggleLight = document.querySelector(".toggle-light");
var toggleDark = document.querySelector(".toggle-dark");
var toggleLightPlus = document.querySelector(".toggle-lightPlus");

toggleLight.addEventListener("click", function(e) {
    e.preventDefault();
    document.body.classList.remove("lightPlus");
    document.body.classList.remove("dark");
    localStorage.removeItem("theme", ":root")
});

toggleDark.addEventListener("click", function(e) {
    e.preventDefault();
    document.body.classList.add("dark");
    document.body.classList.remove("lightPlus");
    localStorage.setItem("theme", "dark")
});
toggleLightPlus.addEventListener("click", function(e) {
    e.preventDefault();
    document.body.classList.add("lightPlus");
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "lightPlus")
});


//////////////////////////////////////////







// var zooming = new Zooming().listen('.img-zoomable')


// zooming.config({

//     scrollThreshold: 1000,
//     enableGrab: false,
//     bgColor: 'transparent',
//     zIndex: -1

// });
var glightbox = GLightbox({
    openEffect: 'zoom',
    closeEffect: 'fade',
    cssEfects: { // This are some of the animations included, no need to overwrite
        fade: { in: 'fadeIn', out: 'fadeOut' },
        zoom: { in: 'zoomIn', out: 'zoomOut' },
    },
    selector: '.glightbox',
    config: {
        ratio: '16:9', // or '4:3'
        muted: true,
        autoplayVideos: true,
        hideControls: true
        
    }
});





// const lightbox = GLightbox({
//     selector: 'glightbox',
//     touchNavigation: true,
//     loop: true,
//     autoplayVideos: true
// });

//////////////////////////////////////////
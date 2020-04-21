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
    console.log(auslese)
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

var toggleLemon = document.querySelector(".toggle-lemon");
var toggleOrca = document.querySelector(".toggle-orca");
var toggleShark = document.querySelector(".toggle-shark");
var toggleKoi = document.querySelector(".toggle-koi");

toggleLemon.addEventListener("click", function(e) {
    e.preventDefault();
    document.body.classList.remove("orca");
    document.body.classList.remove("koi");
    document.body.classList.remove("shark");
    localStorage.removeItem("theme", ":root")
});
toggleOrca.addEventListener("click", function(e) {
    e.preventDefault();
    document.body.classList.add("orca");
    document.body.classList.remove("shark");
    document.body.classList.remove("koi");
    document.body.classList.remove("lemon");
    localStorage.setItem("theme", "orca")
});
toggleShark.addEventListener("click", function(e) {
    e.preventDefault();
    document.body.classList.add("shark");
    document.body.classList.remove("orca");
    document.body.classList.remove("koi");
    document.body.classList.remove("lemon");
    localStorage.setItem("theme", "shark")
});
toggleKoi.addEventListener("click", function(e) {
    e.preventDefault();
    document.body.classList.add("koi");
    document.body.classList.remove("orca");
    document.body.classList.remove("shark");
    document.body.classList.remove("lemon");
    localStorage.setItem("theme", "koi")
});




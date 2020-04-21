
$(window).scroll(function() {
    if ($(this).scrollTop() > 150 ) {
        $('.scrolltop:hidden').stop(true, true).fadeIn();
    } else {
        $('.scrolltop').stop(true, true).fadeOut();
    }
});
$(function(){$(".scroll").click(function(){$("html,body").animate({scrollTop:$(".thetop").offset().top},"3000");return false})})

// $(window).scroll(function() {
//     if ($(this).scrollTop() > 150 ) {
//         $('.scrolltop:hidden').stop(true, true).fadeIn();
//     } else {
//         $('.scrolltop').stop(true, true).fadeOut();
//     }
// });
// $(function(){$(".scroll").click(function(){$("html,body").animate({scrollTop:$(".thetop").offset().top},"3000");return false})})




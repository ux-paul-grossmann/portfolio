
window.sr = ScrollReveal();
// splashscreen-action
sr.reveal('header', {
    duration: 200,
    origin: 'top',
    delay: '250',
    distance: '150px',
    easing: 'ease'
});
// brand-caption
sr.reveal('#ci-brand-caption', {
    duration: 200,
    delay: '400',
    easing: 'ease',
    origin: 'left',
    distance: '30px'
});

sr.reveal('#ci-picture-wrapper img', {
    duration: 1200,
    // origin: 'bottom',
    delay: '100',
    // distance: '30px',
    easing: 'ease'

});
sr.reveal('.kontImgWrap img', {
    duration: 500,
    origin: 'right',
    delay: '1000',
    distance: '30px',
    easing: 'ease',
    reset: false

});
sr.reveal('#ci-profilbild-caption-main', {
    duration: 300,
    origin: 'left',
    distance: '50px',
    delay: '300',
    easing: 'ease'

});
sr.reveal('#ci-profilbild-caption-main-subline', {
    duration: 300,
    origin: 'right',
    distance: '50px',
    delay: '300',
    easing: 'ease'
});
sr.reveal('.navbar', {
    duration: 200,
    origin: 'bottom',
    distance: '100px',
    opacity: 1,
    delay: '250',
    easing: 'ease'
});


sr.reveal('#scrollDownChevron', {
    duration: 1700,
    delay: '1000',
    easing: 'ease',
    origin: 'top',
    distance: '40px'
});



sr.reveal('.kontext-wrap div', {
    interval: 50,
    origin: 'top',
    distance: '20px',
    beforeReveal: notizRotator,
    reset:false

});
sr.reveal('#socialIconsWrap li', {
    interval: 50,
    origin: 'left',
    distance: '20px',
    reset:true

});
function notizRotator () {
    $('.kontext-wrap div').each(function() {
        var a = Math.random() * 20 - 5;
        $(this).css('transform', 'rotate(' + a + 'deg)');
    });
}
sr.reveal('#firstThumbCollapse', {
    duration: 400,
    easing: 'ease',
    origin: 'left',
    distance: '50px',
    delay: 200,
    reset: false

});
sr.reveal('#secondThumbCollapse', {
    duration: 400,
    easing: 'ease',
    origin: 'right',
    distance: '50px',
    delay: 500,
    reset: false
});
sr.reveal('#thirdThumbCollapse', {
    duration: 400,
    easing: 'ease',
    origin: 'left',
    distance: '50px',
    delay: 500,
    reset: false
});
sr.reveal('#fourthThumbCollapse', {
    duration: 400,
    easing: 'ease',
    origin: 'right',
    distance: '50px',
    delay: 200,
    reset: false
});

// sr.reveal('#resume-dl-btn', {
//     duration: 350,
//     origin: 'bottom',
//     delay: '100',
//     distance: '30px',
//     easing: 'ease'

// });
// sr.reveal('#alle-projektbilder-dl-btn', {
//     duration: 350,
//     origin: 'bottom',
//     delay: '400',
//     distance: '30px',
//     easing: 'ease'

// });



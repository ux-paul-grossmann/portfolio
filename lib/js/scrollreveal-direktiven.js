document.addEventListener('DOMContentLoaded', function() {
window.sr = ScrollReveal();
// splashscreen-action
sr.reveal('header', {
    duration: 500,
    origin: 'top',
    delay: '1200',
    distance: '150px',
    easing: 'ease',
    reset: false
});
// brand-caption
sr.reveal('#ci-brand-caption', {
    duration: 200,
    delay: '400',
    easing: 'ease',
    origin: 'left',
    distance: '30px',
    reset: false
});

sr.reveal('#ci-picture-wrapper img', {
    duration: 700,
    origin: 'bottom',
    delay: '100',
    distance: '10px',
    easing: 'ease-out',
    reset: false

});
sr.reveal('#ci-profilbild-caption-main', {
    duration: 450,
    origin: 'left',
    distance: '30px',
    delay: '600',
    easing: 'ease-out',
    reset: false

});


sr.reveal('#ci-profilbild-caption-main-subline', {
    duration: 300,
    origin: 'right',
    distance: '20px',
    delay: '700',
    easing: 'ease-in',
    reset: false
});


sr.reveal('.introText-wrapper #intro-button', {
    duration: 600,
    origin: 'bottom',
    distance: '200px',
    delay: '100', // Set a safe, long delay for visual sequencing
    easing: 'ease-in',
    reset: false
});


sr.reveal('.navbar', {
    duration: 500,
    origin: 'bottom',
    distance: '100px',
    opacity: 1,
    delay: '1500',
    easing: 'ease',
    reset: false
});

sr.reveal('.kontext-wrap div', {
    interval: 5,
    origin: 'bottom',
    distance: '5px',
    beforeReveal: notizRotator,
    reset:false

});
sr.reveal('#socialIconsWrap li', {
    interval: 50,
    origin: 'left',
    distance: '20px',
    reset:false

});

sr.reveal('#firstThumbCollapse', {
    duration: 500,
    easing: 'ease',
    origin: 'left',
    distance: '50px',
    delay: 50,
    reset: false

});
sr.reveal('#secondThumbCollapse', {
    duration: 500,
    easing: 'ease',
    origin: 'right',
    distance: '50px',
    delay: 50,
    reset: false
});
sr.reveal('#thirdThumbCollapse', {
    duration: 500,
    easing: 'ease',
    origin: 'left',
    distance: '50px',
    delay: 100,
    reset: false
});
sr.reveal('#fourthThumbCollapse', {
    duration: 500,
    easing: 'ease',
    origin: 'right',
    distance: '50px',
    delay: 100,
    reset: false
});
sr.reveal('#fifthThumbCollapse', {
    duration: 500,
    easing: 'ease',
    origin: 'left',
    distance: '50px',
    delay: 200,
    reset: false
});
sr.reveal('#sixtThumbCollapse', {
    duration: 500,
    easing: 'ease',
    origin: 'right',
    distance: '50px',
    delay: 200,
    reset: false
});

sr.reveal('.kontImgWrap img', {
    duration: 500,
    origin: 'right',
    delay: '1000',
    distance: '30px',
    easing: 'ease',
    reset: false

});




// sr.reveal('#alle-projektbilder-dl-btn', {
//     duration: 500,
//     easing: 'ease',
//     origin: 'bottom',
//     distance: '10px',
//     delay: 100,
//     reset: false
// });
// sr.reveal('#btn--kontakt', {
//     duration: 500,
//     easing: 'ease',
//     origin: 'bottom',
//     distance: '10px',
//     delay: 100,
//     reset: false
// });

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

});

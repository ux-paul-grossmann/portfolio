document.addEventListener('DOMContentLoaded', function() {
window.sr = ScrollReveal();
// splashscreen-action


sr.reveal('.kontext-wrap div', {
    interval: 5,
    origin: 'bottom',
    distance: '5px',
    beforeReveal: notizRotator,
    reset:false

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

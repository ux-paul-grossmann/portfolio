document.addEventListener('DOMContentLoaded', function() {
    const { animate, inView, stagger } = Motion;

    const config = {
        springImpact: { type: "spring", stiffness: 200, damping: 20, mass: 1.5 },
        springShock:  { type: "spring", stiffness: 400, damping: 30, mass: 1 },
        springFrame:  { type: "spring", stiffness: 80,  damping: 20 },
        
        startImg: 0.1,
        startTextGroup: 0.45, 
        startUiSync: 1.1,
        gapTextStack: 0.15 
    };

    // --- 1. THE HERO ELEMENTS ---
    const heroElements = [
        ["#ci-picture-wrapper img", { y: [-100, 0], scale: [1.2, 1], filter: ["blur(15px)", "blur(0px)"] }, config.startImg, config.springImpact],
        ["#ci-brand-box", { y: [-40, 0] }, config.startUiSync, config.springFrame],
        [".navbar", { y: [50, 0] }, config.startUiSync, config.springFrame]
    ];

    heroElements.forEach(([sel, trans, delay, settings]) => {
        const el = document.querySelector(sel);
        if (el) animate(el, { ...trans, opacity: [0, 1] }, { delay, ...settings });
    });

    // --- 2. THE TEXT STACK (Responsive Check Included) ---
    const textStack = [
        { sel: "#ci-brand-caption",               x: -15, y: 0,  ease: config.springShock }, 
        { sel: "#ci-profilbild-caption-main-subline", x: -12, y: 0,  ease: config.springShock },
        { sel: "#ci-profilbild-caption-main",         x: -12, y: 0,  ease: config.springShock },
        { sel: "#intro-button",                       x: 0,   y: 15, ease: config.springShock } 
    ];

    textStack.forEach((item, index) => {
        const el = document.querySelector(item.sel);
        
        // Safety check: Only animate if element exists AND is not hidden by d-none
        // getComputedStyle checks if the browser has actually set it to 'none'
        if (el && window.getComputedStyle(el).display !== 'none') {
            animate(el, 
                { x: [item.x, 0], y: [item.y, 0], opacity: [0, 1] }, 
                { 
                    delay: config.startTextGroup + (index * config.gapTextStack),
                    ...item.ease 
                }
            );
        }
    });

    // --- 3. SCROLL TRIGGERS ---
    const thumbs = [
        { id: "#firstThumbCollapse", x: -50 }, { id: "#secondThumbCollapse", x: 50 },
        { id: "#thirdThumbCollapse", x: -50 }, { id: "#fourthThumbCollapse", x: 50 },
        { id: "#fifthThumbCollapse", x: -50 }, { id: "#sixtThumbCollapse", x: 50 }
    ];

    thumbs.forEach(thumb => {
        inView(thumb.id, (info) => {
            animate(info.target, { x: [thumb.x, 0], opacity: [0, 1] }, { 
                type: "spring", stiffness: 100, damping: 15 
            });
        });
    });
});
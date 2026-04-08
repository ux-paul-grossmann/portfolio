document.addEventListener('DOMContentLoaded', function() {
    const { animate, inView, stagger } = Motion;
    const landingEase = [0.16, 1, 0.3, 1]; 

    // --- PHASE 1: CORE CONTENT ---
    animate("#ci-picture-wrapper img", 
        { y: [-50, 0], scale: [1.1, 1], opacity: [0, 1], filter: ["blur(8px)", "blur(0px)"] }, 
        { delay: 0.1, duration: 0.8, ease: landingEase }
    );

    animate("#ci-profilbild-caption-main-subline", 
        { y: [-15, 0], opacity: [0, 1] }, 
        { delay: 0.3, duration: 0.6, ease: landingEase }
    );

    animate("#ci-profilbild-caption-main", 
        { y: [-20, 0], opacity: [0, 1] }, 
        { delay: 0.45, duration: 0.6, ease: landingEase }
    );

    animate("#intro-button", 
        { y: [-40, 0], opacity: [0, 1] }, 
        { delay: 0.65, type: "spring", stiffness: 300, damping: 25 } 
    );

    // --- PHASE 2: UI FRAME (The Sync) ---
    // Targeting the Parent Box as identified in your screenshot
    animate("#ci-brand-box", 
        { 
            y: [-30, 0], 
            opacity: [0, 1], 
            filter: ["blur(4px)", "blur(0px)"] 
        }, 
        { delay: 1.0, duration: 0.6, ease: landingEase }
    );

    // Synced Navbar
    animate(".navbar", 
        { y: [40, 0], opacity: [0, 1] }, 
        { delay: 1.0, duration: 0.6, ease: landingEase }
    );

    // --- PHASE 3: SCROLL INDICATOR ---
    animate("#scrollDownChevron", 
        { y: [20, 0], opacity: [0, 1] }, 
        { delay: 1.6, duration: 0.8, ease: landingEase }
    );

    // --- PHASE 4: SCROLL TRIGGERS ---
    const thumbs = [
        { id: "#firstThumbCollapse", x: -40 }, { id: "#secondThumbCollapse", x: 40 },
        { id: "#thirdThumbCollapse", x: -40 }, { id: "#fourthThumbCollapse", x: 40 },
        { id: "#fifthThumbCollapse", x: -40 }, { id: "#sixtThumbCollapse", x: 40 }
    ];

    thumbs.forEach(thumb => {
        inView(thumb.id, (info) => {
            animate(info.target, { x: [thumb.x, 0], opacity: [0, 1] }, { duration: 0.6 });
        });
    });
});
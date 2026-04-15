document.addEventListener('DOMContentLoaded', async function() {
    const { animate, inView, stagger } = Motion;

    // --- 1. GLOBALE KONFIGURATION ---
    const config = {
        springImpact: { type: "spring", stiffness: 200, damping: 20, mass: 1.5 },
        springShock:  { type: "spring", stiffness: 400, damping: 30, mass: 1 },
        springFrame:  { type: "spring", stiffness: 80,  damping: 20 },
        startImg: 0.1,
        startTextStack: 0.45, 
        startUiSync: 1.1,      
        startSubline: 1.6,     
        gapTextStack: 0.15 
    };

    const safeAnimate = (selector, keyframes, options) => {
        const el = document.querySelector(selector);
        if (el) {
            el.style.opacity = "0"; 
            el.style.visibility = "visible";
            return animate(el, { ...keyframes, opacity: [0, 1] }, options);
        }
    };

    // --- 2. HERO & BRAND SECTION ---
    safeAnimate("#ci-picture-wrapper img", 
        { y: [-100, 0], scale: [1.2, 1], filter: ["blur(15px)", "blur(0px)"] }, 
        { delay: config.startImg, ...config.springImpact }
    );

    safeAnimate("#ci-brand-box", 
        { y: [-40, 0] }, 
        { delay: config.startUiSync, ...config.springFrame }
    );

    safeAnimate("#ci-brand-caption", 
        { x: [-30, 0] }, 
        { delay: config.startSubline, easing: "ease-out" }
    );

    // --- 3. NAVIGATION ---
    const navContainer = document.querySelector(".navbar");
    if (navContainer) {
        navContainer.style.opacity = "0";
        navContainer.style.visibility = "visible";
        animate(navContainer, { y: [50, 0], opacity: [0, 1] }, { 
            delay: config.startUiSync, 
            ...config.springFrame 
        });

        const navItems = document.querySelectorAll(".navbar ul li");
        if (navItems.length > 0) {
            navItems.forEach(li => {
                li.style.opacity = "0";
                li.style.visibility = "visible";
            });
            animate(navItems, 
                { x: [-15, 0], opacity: [0, 1] }, 
                { 
                    delay: stagger(0.08, { start: config.startUiSync + 0.3 }),
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25 
                }
            );
        }
    }

    // --- 4. TEXT STACK ---
    const stackItems = [
        { sel: "#ci-profilbild-caption-main-subline", x: -12 },
        { sel: "#ci-profilbild-caption-main",         x: -12 },
        { sel: "#intro-button",                       x: 0, y: [-25, 0] }
    ];

    stackItems.forEach((item, index) => {
        safeAnimate(item.sel, 
            { 
                x: item.x instanceof Array ? item.x : [item.x, 0], 
                y: item.y instanceof Array ? item.y : [item.y, 0] 
            }, 
            { delay: config.startTextStack + (index * config.gapTextStack), ...config.springShock }
        );
    });

    // --- 5. KONTEXT SECTION ---
    const kontextWrap = document.querySelector('.kontext-wrap');
    if (kontextWrap) {
        const noteLabels = ["Kommunikation", "Zielgruppe", "Design System", "Figma", "8pt-grid", "User Experience", "Whitespace", "Wireframes", "Konzeption", "Nutzerverhalten", "Artificial Intelligence", "Touch Points", "Usability", "Prototyping", "Persona", "User Research", "Interaktion", "User Flow", "Microinteractions", "Motion Design", "Usability Heuristics", "User Interface"];
        const noteColors = ['note-yellow', 'note-blue', 'note-magenta', 'note-green'];
        const pinConfig = { width: 28, shaftBaseY: 80, headRadius: 32, hitZoneWidth: 50, hitZoneHeight: 15 };
        const pinThemes = [
            { id: 'blue', highlight: '#38b6ff', base: '#0077c2' },
            { id: 'whitesmoke', highlight: '#ffffff', base: '#cccccc' },
            { id: 'charcoal', highlight: '#666666', base: '#000000' }
        ];

        const getDynamicPinSvg = (pinTilt, headAngle, shaftLength, theme, index) => {
            const totalShaftHeight = pinConfig.shaftBaseY + shaftLength + 50; 
            const tipY = totalShaftHeight + 10;
            return `<svg class="pin-svg" style="width: ${pinConfig.width}px; position: absolute; z-index: 20; opacity: 0; pointer-events: none; transform-origin: 50px ${tipY}px;" viewBox="-30 -20 160 200" xmlns="http://www.w3.org/2000/svg" transform="rotate(${pinTilt}, 50, ${tipY})"><defs><radialGradient id="grad-head-${index}" cx="30%" cy="30%" r="65%"><stop offset="0%" style="stop-color:${theme.highlight};" /><stop offset="100%" style="stop-color:${theme.base};" /></radialGradient><linearGradient id="grad-metal-${index}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#bdc3c7;" /><stop offset="50%" style="stop-color:#7f8c8d;" /><stop offset="100%" style="stop-color:#bdc3c7;" /></linearGradient><filter id="shadow-intense-${index}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="-2" dy="5" stdDeviation="2.5" flood-opacity="0.45"/></filter></defs><g filter="url(#shadow-intense-${index})"><rect x="47" y="${pinConfig.shaftBaseY}" width="6" height="${shaftLength + 50}" fill="url(#grad-metal-${index})"/><path d="M47 ${totalShaftHeight} L53 ${totalShaftHeight} L50 ${tipY} Z" fill="url(#grad-metal-${index})"/><g transform="rotate(${headAngle}, 50, ${pinConfig.shaftBaseY})"><circle cx="50" cy="${pinConfig.shaftBaseY}" r="${pinConfig.headRadius}" fill="url(#grad-head-${index})"/><circle cx="50" cy="${pinConfig.shaftBaseY}" r="${pinConfig.headRadius - 2}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" fill="none"/></g></g><circle cx="50" cy="${tipY}" r="3" fill="rgba(0,0,0,0.5)" filter="blur(1.5px)"/></svg>`;
        };

        noteLabels.forEach((label, idx) => {
            const note = document.createElement('div');
            const randomTheme = pinThemes[Math.floor(Math.random() * pinThemes.length)];
            note.style.color = 'var(--note-text-color)'; // Add this line
            note.className = `p-2 ${noteColors[idx % noteColors.length]}`;
            note.style.opacity = "0";
            note.dataset.noteRot = (Math.random() * 8) - 4;
            note.dataset.pinLeft = Math.floor(Math.random() * pinConfig.hitZoneWidth) + 25;
            note.dataset.pinTop = Math.floor(Math.random() * pinConfig.hitZoneHeight) - 10; 
            const pinTilt = (Math.random() * 90) - 45;
            const headAngle = (Math.random() * 20) + 10;
            const shaftLength = Math.floor(Math.random() * 10) + 20;
            note.innerHTML = `${getDynamicPinSvg(pinTilt, headAngle, shaftLength, randomTheme, idx)}<p>${label}</p>`;
            kontextWrap.appendChild(note);
        });

        const allNotes = kontextWrap.querySelectorAll('div[class*="note-"]');
        inView(".kontext-wrap", () => {
            allNotes.forEach((note, i) => {
                const pin = note.querySelector('.pin-svg');
                const { noteRot, pinLeft, pinTop } = note.dataset;
                
                animate(note, { 
                    opacity: [0, 1],
                    transform: [`translateZ(400px) translateY(-50px) rotate(0deg)`, `translateZ(0px) translateY(0px) rotate(${noteRot}deg)`]
                }, { delay: i * 0.05, duration: 0.6, easing: [0.22, 1, 0.36, 1] });
                
                if (pin) {
                    pin.style.left = `${pinLeft}%`;
                    pin.style.top = `${pinTop}px`;
                    animate(pin, { opacity: [0, 1], transform: ["translateY(-100px) scale(1.5)", "translateY(0px) scale(1)"] }, 
                    { delay: (i * 0.05) + 0.2, duration: 0.4, easing: "ease-out" });
                }
            });
        }, { margin: "-10%" });
    }




// --- 6. SCROLL TRIGGERS (Fixed for JS-rendered cards) ---
function initScrollAnimations() {
    // Get all cluster elements in order
    const clusters = document.querySelectorAll('#projekte .cluster');
    
    if (clusters.length === 0) {
        // Retry after a short delay if cards aren't rendered yet
        setTimeout(initScrollAnimations, 200);
        return;
    }
    
    // Set initial hidden state for all clusters
    clusters.forEach(el => {
        el.style.opacity = '0';
    });
    
    // Alternate left and right slide-in
    clusters.forEach((el, index) => {
        const xDirection = index % 2 === 0 ? -50 : 50;
        const delay = Math.floor(index / 2) * 0.1 + 0.05;
        
        inView(el, () => {
            animate(el, 
                { x: [xDirection, 0], opacity: [0, 1] }, 
                { delay: delay, duration: 0.5, easing: "ease-out" }
            );
        }, { margin: "-10%", threshold: 0.1 });
    });
}

// Call after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initScrollAnimations, 150);
    });
} else {
    setTimeout(initScrollAnimations, 150);
}



 // --- 7. SMOOTH EXPAND & COLLAPSE (CSS-driven, minimal JS) ---
$(document).ready(function() {
    // Disable Bootstrap's transition
    $.fn.collapse.Constructor.prototype.transition = function() {};
    
    // Just ensure display is set properly
    $('.multi-collapse').on('show.bs.collapse', function() {
        $(this).css('display', 'block');
    });
    
    $('.multi-collapse').on('shown.bs.collapse', function() {
        $(this).css('display', 'block');
    });
    
    $('.multi-collapse').on('hidden.bs.collapse', function() {
        $(this).css('display', 'none');
    });
});

// --- 8. INITIALIZE GLIGHTBOX (Medium-style image zoom) ---
const lightbox = GLightbox({
    selector: '.glightbox',
    skin: 'clean',
    openEffect: 'zoom',
    closeEffect: 'fade',
    cssEfects: {
        fade: { in: 'fadeIn', out: 'fadeOut' },
        zoom: { in: 'zoomIn', out: 'zoomOut' }
    }
});

});
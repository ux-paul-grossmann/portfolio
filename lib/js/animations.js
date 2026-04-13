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

// --- KONTEXT: Randomized Pin Placement & Angle ---
const noteLabels = ["Kommunikation", "Zielgruppe", "Kundenbindung", "Testing", "8pt-grid", "User Experience", "Whitespace", "Wireframes", "Konzeption", "Nutzerverhalten", "Emotion Design", "Touch Points", "Usability", "Prototyping", "Persona", "User Research", "Interaktion", "User Flow", "Microinteractions", "Motion Design", "Storyboarding", "User Interface"];

const kontextWrap = document.querySelector('.kontext-wrap');
const noteColors = ['note-yellow', 'note-blue', 'note-magenta', 'note-green'];

if (kontextWrap) {
    noteLabels.forEach(label => {
        const note = document.createElement('div');
        const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
        
        // 1. Randomize Note Rotation
        const noteRot = (Math.random() * 12) - 6;
        
        // 2. Randomize Pin Position (Top half: Left 20-80%, Top 5-20px)
        const pinLeft = Math.floor(Math.random() * 60) + 20;
        const pinTop = Math.floor(Math.random() * 15) + 5;
        
        // 3. Randomize Pin Entry Angle (The tilt of the pin itself)
        const pinTilt = (Math.random() * 40) - 20;

        note.className = `p-2 ${randomColor}`;
        note.style.opacity = "0";
        note.dataset.noteRot = noteRot;
        note.dataset.pinLeft = pinLeft;
        note.dataset.pinTop = pinTop;
        note.dataset.pinTilt = pinTilt;

        note.innerHTML = `<div class="pin"></div><p>${label}</p>`;
        kontextWrap.appendChild(note);
    });

    const allNotes = kontextWrap.querySelectorAll('div[class*="note-"]');

    inView(".kontext-wrap", async () => {
        for (const note of allNotes) {
            const pin = note.querySelector('.pin');
            const { noteRot, pinLeft, pinTop, pinTilt } = note.dataset;

            // Phase 1: Note Lands
            animate(note, { 
                opacity: [0, 1],
                transform: [
                    "translateZ(300px) translateY(-40px) scale(1.3) rotate(0deg)", 
                    `translateZ(0px) translateY(0px) scale(1) rotate(${noteRot}deg)`
                ]
            }, { duration: 0.25, easing: [0.23, 1, 0.32, 1] });

            // Phase 2: Pin Pierces at random position and angle
            setTimeout(() => {
                if (pin) {
                    // Set the random position before animating
                    pin.style.left = `${pinLeft}%`;
                    pin.style.top = `${pinTop}px`;

                    animate(pin, { 
                        opacity: [0, 1],
                        transform: [
                            `rotate(${pinTilt}deg) scale(5) translateY(-30px)`, 
                            `rotate(${pinTilt}deg) scale(1) translateY(0px)`
                        ]
                    }, { duration: 0.18, easing: "ease-out" });
                }
            }, 120);

            await new Promise(r => setTimeout(r, 40)); 
        }
    }, { margin: "-10%" });
}

    // --- 4. SCROLL TRIGGERS ---
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
// projects-data.js – Complete project data for portfolio cards

// Sections are content, not code. Every section can carry text, media and a
// list; the renderer only reads <key>-text, <key>-media and <key>-list.
const sectionTitles = {
  'final-design': `Final Design`,
  'tools': `Verwendete Tools:`,
  'prototype': `Interaktiver High-Fidelity Prototyp`,
  'background': `Projekthintergrund`,
  'organisation': `Organisation`,
  'duration': `Dauer`,
  'target-group': `Zielgruppe`,
  'team': `Interdisziplinäres Team`,
  'goal': `Ziel`,
  'topic': `Thema`,
  'method': `Vorgehen / Methodik`,
  'implementation': `Umsetzung`,
  'design-process': `Designprozess`,
  'achievements': `Meine Leistung im Team`,
  'goals': `Erreichte Ziele`
};

const sectionOrder = [
  'final-design', 'tools', 'prototype', 'background', 'organisation',
  'duration', 'target-group', 'team', 'goal', 'topic', 'method',
  'implementation', 'design-process', 'achievements', 'goals'
];

const projectsData = [
  {
    id: `conn4-ux-analysis`,
    title: `Conn4 UX Analysis`,
    'thumbnail-class': `thumbnail-pic-07`,
    'short-desc-mobile': `UX-Optimierung des m3connect Dashboards`,
    'short-desc-tablet': `UX-Analyse und Optimierung des m3connect conn4 Dashboards`,
    'short-desc-desktop': `UX-Analyse und Optimierung des m3connect conn4 Dashboards`,
    tags: [`UX`, `Usability`, `Dashboard`, `Forschung`, `Analyse`, `Optimierung`, `Nutzerzentrierung`],
    'section-order': [`tools`, `background`, `duration`, `team`, `goal`, `topic`, `method`, `implementation`, `achievements`, `goals`],
    'tools-media': [{ icon: `jira` }, { icon: `miro` }, { icon: `msteams` }, { icon: `office` }],
    'tools-class': `d-flex flex-row align-items-center flex-wrap mb-5`,
    'background-text': `Das m3connect Dashboard "conn4" auf CMS Basis, jahrelang im Einsatz im Unternehmen als auch ein verkauftes Produkt mit den Zielgruppen in Bereichen der Hospitality, wurde einst entwickelt, ohne großen Fokus auf UX und Usability zu geben. In vielen Bereichen war es sehr komplex und brauchte einen Checkup und Optimierung.`,
    'duration-text': `Juni - Oktober 2023`,
    'team-text': `Anfangs zwei UX Designer (Werkstudent + Praktikant, je 20h/Woche), ab September erweitert um UX & UI Designer (Vollzeit).`,
    'goal-text': `Nutzer und deren Verhalten verstehen, Pain Points entdecken, Verbesserungspotenziale identifizieren, Nutzerzufriedenheit steigern, Effizienz verbessern, Wechsel zu nutzerzentrierter Software.`,
    'topic-text': `UX-Analyse, Usability, Dashboard-Optimierung`,
    'method-text': `
    Verstehen, Experimentieren, Ausarbeiten – nach dem Double Diamond Framework. 
    
    <br><br>Definierte und durchgeführte UX-Methoden und -Tools: 
    <ul>
      <li>Stakeholder Map</li> 
      <li>Information Architecture / Sitemap</li> 
      <li>Heuristische Evaluation nach Nielsen Norman Group</li>
      <li>Nutzerumfrage</li> 
      <li>Nutzerinterviews und Shadowing</li> 
      <li>Personas</li> 
      <li>Analytics Metriken Insights (Matomo Tracking)</li>
    </ul> <br>

    Auf Miro fand die visuelle und kollaborative Analyse statt. Vom Aufdecken der Pain Points im conn4 Dashboard bis hin zu den ersten Konzepten. Die dort validierten Lösungen wurden anschließend in Jira in konkrete User Stories überführt. <br><br>
    Jira wurde agil in einer Roadmap als zentrales Pojektmanagement-Tool verwendet, in dem Aufgaben und identifizierte UX-Pain-Points in strukturierte Tickets/User Stories überführt und priorisiert wurden.`,
    'implementation-text': `Problem-Priorisierung mit Fokus auf Quickwins unter Verwendung existierender UI-Elemente. Site Selection, GIS Content Scheduler und Device Setup jeweils mit Scribbles, Wireframes und Mockups.`,
    'achievements-list': [
      `Priorisierung von 3 kritischen Problemen und deren Lösungsfindung`,
      `Fehlnutzung von Funktionen wurden erkannt und dokumentiert`,
      `Identifizierung von wiederkehrenden Problemen`,
      `Identifizierung von sich überschneidenden Pain Points aus Umfrage und Interviews`
    ],
    'goals-list': [
      `Verbesserung der Nutzerzufriedenheit`,
      `Effizienzsteigerung des Dashboards`,
      `Etablierung nutzerzentrierter Softwareentwicklung`
    ]
  },
  {
    id: `employee-dashboard-touchscreen`,
    title: `Mitarbeiter Dashboard Touchscreen Design`,
    'thumbnail-class': `thumbnail-pic-08`,
    'short-desc-mobile': `Touchscreen-Design für das Mitarbeiter Dashboard`,
    'short-desc-tablet': `Touchscreen-Design für das Mitarbeiter Dashboard m3connect`,
    'short-desc-desktop': `Touchscreen-Design für das Mitarbeiter Dashboard m3connect`,
    tags: [`Konzeption`, `Design`, `Touchscreen`, `Dashboard`, `UX`, `UI`],
    'section-order': [`final-design`, `tools`, `background`, `topic`],
    'final-design-media': [
      { src: './lib/images/m3c-ui-design-ma-dashboard/ma-dashboard-kiosk-final.png', caption: '', lightbox: true },
      { src: './lib/images/m3c-ui-design-ma-dashboard/MADB-Mainscreen-dark.jpg', caption: '', lightbox: true }
    ],
    'tools-media': [{ icon: `xd` }],
    'tools-class': `d-flex flex-row align-items-center flex-wrap mb-5`,
    'background-text': `Das Mitarbeiter Dashboard wurde als Touchscreen-Anwendung konzipiert.`,
    'background-media': [{ src: `./lib/images/m3c-ui-design-ma-dashboard/how-it-started.png`, className: `border shadow` }],
    'topic-text': `Touchscreen-Dashboard, UI-Design`
  },
  {
    id: `smart-search-bar`,
    'background-media': [
      `./lib/images/ssb-collapseBody/horizon-start.png`,
      `./lib/images/ssb-collapseBody/horizon-mobilansicht.png`
    ],
    title: `Smart Search Bar`,
    'thumbnail-class': `thumbnail-pic-01`,
    'short-desc-mobile': `Intelligente Suche mit Autocomplete für VEDA Horizon`,
    'short-desc-tablet': `Intelligente Suche mit Autocomplete für die VEDA Horizon Plattform`,
    'short-desc-desktop': `Intelligente Suche mit Autocomplete für die VEDA Horizon Plattform`,
    tags: [`Konzeption`, `Suchfunktion`, `Design`, `Entwicklung`, `UI`, `UX`, `Intuitiv`],
    'section-order': [`tools`, `prototype`, `background`, `organisation`, `duration`, `target-group`, `team`, `design-process`, `achievements`, `goals`],
    'tools-media': [{ icon: `xd` }, { icon: `msteams` }, { icon: `jira` }, { icon: `invision` }],
    'tools-class': `d-flex flex-row align-items-center flex-wrap mb-5`,
    'prototype-media': [{ link: `https://xd.adobe.com/view/3a9ec774-8a20-46ba-af22-6236ec996dbf-6fcd/?fullscreen`, label: `Smart Search Bar – [Suchfunktion]` }],
    'background-text': `VEDA GmbH bietet HR-Software und Services für das Personalmanagement in Unternehmen an. VEDA Horizon ist eine firmeninterne Social Media Plattform. Alle Mitarbeiter eines Unternehmens sind dadurch vernetzt und können miteinander effizienter auf Herausforderungen reagieren. VEDA Horizon ist modular, sodass neue, digitale Services als Plug-Ins jederzeit integriert werden können. Die Suchfunktion in Horizon war nicht funktional und sollte neu konzipiert und designed werden. Das Design sollte durch die Mac OS Spotlight-Suche inspiriert werden und den Nutzern die Möglichkeit bieten zu Suchbegriffen assoziative Vorschläge aus vorgegebenen Kategorien anzuzeigen.`,
    'organisation-text': `Die Kommunikation fand sowohl vor Ort als auch über MS Teams statt. Das Projekt wurde über JIRA verwaltet.`,
    'duration-text': `Die Projektdauer betrug sechs Monate und die Ausarbeitung verlief parallel zum Projekt – Digitales Verbandbuch.`,
    'target-group-text': `Bestandskunden als auch Neukunden. Research war nicht gewünscht.`,
    'team-text': `Bestehend aus Werkstudenten und Projektbetreuung. Projektleiterin(Energiewirtschaft), 5x Programmierer(Informatik und Elektrotechnik) und mir – UX-Designer(Media and Communications for Digital Business). Betreut durch je einen Lead UX-Designer und Product Owner.`,
    'design-process-text': `
      <h6 class="text-center mt-5">Ideation & Wireflow</h6>
      <a href="./lib/images/ssb-collapseBody/ssb-design1.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Konzeptionsansatz für die Suchfunktion; description: .ssb-desc1; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design1.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc1"><p>Ideenentwurf mittels <a href="https://www.invisionapp.com/freehand">InVision Freehand</a>. Danach Austausch und Feedback mit dem Team.</p></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design2.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Sketching and iterating Wire Flow; description: .ssb-desc2; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design2.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc2"><p></p></div>
      <h6 class="text-center mt-5">Positionierung der Suchleiste | Iteration</h6>
      <a href="./lib/images/ssb-collapseBody/ssb-design3.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc3; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design3.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc3"><p><i>Variante A</i></p></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design4.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc4; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design4.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc4"><p><i>Variante B</i></p></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design5.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc5; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design5.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc5"><p><i>Variante C</i></p><p>Diese und die Variante B waren meine Favoriten, da die Anforderung lautete, dass die Suchfunktion von jeder beliebigen Unterseite aus aufgerufen werden sollte; und durch eine mitscrollende Navigation mit der omnipräsenten Suchleiste wäre das eine optimale Lösung. Allerdings entschied sich die Projektbetreuung für die Variante A, eine Suchleiste auf der Startseite.</p></div>
      <h6 class="text-center mt-5">Autocomplete | Iteration</h6>
      <a href="./lib/images/ssb-collapseBody/ssb-design6.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc6; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design6.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc6"></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design7.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc7; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design7.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc7"></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design8.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc8; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design8.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc8"></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design9.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc9; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design9.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc9"></div>
      <h6 class="text-center mt-5">Anatomie der UI-Elemente & Informationen für Entwickler</h6>
      <a href="./lib/images/ssb-collapseBody/ssb-design10.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc10; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design10.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc10"></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design11.png" class="glightbox" data-gallery="smart-search-bar" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc11; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design11.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc11"></div>
      <h6 class="text-center mt-5">Smart Search Bar MVP Demo</h6>
      <a href="./lib/video/clips/ssb-prototype-demo2.mp4" class="glightbox" data-gallery="smart-search-bar">
        <img src="./lib/video/thumbs/ssb-prototype-demo2-thumb.png" alt="image" class="d-block w-100 shadow mb-3 rounded-lg">
      </a>
    `,
    'achievements-list': [
      `Erarbeitung des UI-Konzepts in Form von gezielten Fragestellungen, Skizzen und Mindmap`,
      `Anfertigung von ersten Wireframes mit Annotationen in Adobe XD`,
      `Berücksichtung des VEDA Corporate Designs`,
      `Erstellung eines VEDA Design Systems in Adobe XD`,
      `Präsentation, Feedback und Verbesserungsvorschläge im Team`,
      `Entwicklung eines interaktiven HiFi Prototypen in Adobe XD`,
      `Berücksichtigung eines intuitiven Workflows im Sinne des Benutzerfreundlichkeit`,
      `Durchdenken von Interaktionsszenarien`,
      `Integrierung von Animationen und Mikrointeraktionen`,
      `Reduzierung auf das notwendigst Wesentliche (KISS)`,
      `Anfertigen einer Task-Flow Karte aller möglichen Horizon-Aktionen zum Zwecke der Hilfestellung für die Entwickler`
    ],
    'goals-list': [
      `Redesign der Suchfunktion`,
      `Klickbarer High-Fidelity Prototyp der Suchfunktion mit Darstellung von unterschiedlichem Nutzungskontext`,
      `Vier Interaktionsszenarien basierend auf Nutzer-Rolle im System`,
      `Benutzerfreundliches und minimales User-Interface`
    ]
  },
  {
    id: `digital-verbandbuch`,
    'background-media': [
      `./lib/images/ssb-collapseBody/horizon-start.png`,
      `./lib/images/ssb-collapseBody/horizon-mobilansicht.png`
    ],
    title: `Digitales Verbandbuch`,
    'thumbnail-class': `thumbnail-pic-02`,
    'short-desc-mobile': `Digitale Unfallmeldung für VEDA Horizon`,
    'short-desc-tablet': `Digitale Unfallmeldung und Verwaltung als Plug-In für VEDA Horizon`,
    'short-desc-desktop': `Digitale Unfallmeldung und Verwaltung als Plug-In für VEDA Horizon`,
    tags: [`interdisziplinäres Team-Projekt`, `digitale Transformation`, `Konzeption`, `UI`, `UX`, `Wireframes`],
    'section-order': [`tools`, `prototype`, `background`, `organisation`, `duration`, `target-group`, `team`, `design-process`, `achievements`, `goals`],
    'tools-media': [{ icon: `xd` }, { icon: `msteams` }, { icon: `jira` }],
    'tools-class': `d-flex flex-row align-items-center flex-wrap mb-5`,
    'prototype-media': [{ link: `https://xd.adobe.com/view/2eefff67-d748-4561-baaa-2eba661db3e9-7bbc/?fullscreen`, label: `Digitales Verbandbuch – [Plug-In]` }],
    'background-text': `VEDA GmbH bietet HR-Software und Services für das Personalmanagement in Unternehmen an. VEDA Horizon ist eine firmeninterne Social Media Plattform. Alle Mitarbeiter eines Unternehmens sind dadurch vernetzt und können miteinander effizienter auf Herausforderungen reagieren. VEDA Horizon ist modular, sodass neue, digitale Services als Plug-Ins jederzeit integriert werden können. Das digitale Verbandbuch ist ein solches Plug-In und wurde durch einen Kunden in Auftrag gegeben. Es sollte die Möglichkeit entstehen Unfallmeldungen innerhalb des Unternehmens digital über VEDA Horizon abzuwickeln.`,
    'organisation-text': `Das Projekt wurde über JIRA verwaltet. Die virtuelle Kommunikation fand über MS Teams statt.`,
    'duration-text': `Die Projektdauer betrug sechs Monate.`,
    'target-group-text': `Bestandskunden als auch Neukunden. Research war nicht gewünscht.`,
    'team-text': `Bestehend aus Werkstudenten und Projektbetreuung. Projektleiterin(Energiewirtschaft), 5x Programmierer(Informatik und Elektrotechnik) und mir – UX-Designer(Media and Communications for Digital Business). Betreut durch je einen Lead UX-Designer und Product Owner.`,
    'design-process-text': `
      <h6 class="text-center mt-5">Ideation</h6>
      <a href="./lib/images/dvb-collapseBody/dvb-design1.png" class="glightbox" data-gallery="digital-verbandbuch" data-glightbox="title:UX-Huddle Session Verbandbuch; description: .dvb-desc1; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design1.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc1"><p>Review der Verbandbuch-Skizzen mit dem Team.</p></div>
      <a href="./lib/images/dvb-collapseBody/dvb-design2.png" class="glightbox" data-gallery="digital-verbandbuch" data-glightbox="title:Verbandbuch-Skizzen; description: .dvb-desc2; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design2.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc2"><p>Gesammelte Skizzen dienen als Inspiration, werden analysiert und beim Designprozess berücksichtigt.</p></div>
      <a href="./lib/images/dvb-collapseBody/dvb-design3.png" class="glightbox" data-gallery="digital-verbandbuch" data-glightbox="title:Verbandbuch Interaktiver Prototyp; description: .dvb-desc3; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design3.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc3"></div>
      <a href="./lib/images/dvb-collapseBody/dvb-design4.png" class="glightbox" data-gallery="digital-verbandbuch" data-glightbox="title:Verbandbuch Interaktiver Prototyp; description: .dvb-desc4; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design4.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc4"></div>
      <a href="./lib/images/dvb-collapseBody/dvb-design5.png" class="glightbox" data-gallery="digital-verbandbuch" data-glightbox="title:Verbandbuch Interaktiver Prototyp; description: .dvb-desc5; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design5.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc5"></div>
      <a href="./lib/images/dvb-collapseBody/dvb-design6.png" class="glightbox" data-gallery="digital-verbandbuch" data-glightbox="title:Verbandbuch Interaktiver Prototyp; description: .dvb-desc6; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design6.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc6"></div>
    `,
    'achievements-list': [
      `Erarbeitung des UI-Konzepts in Form von gezielten Fragestellungen, Skizzen und Mindmap`,
      `Anfertigung von Low-Fidelity-Mockups in Adobe XD`,
      `Berücksichtung des VEDA Corporate Designs`,
      `Erstellung eines VEDA Design Systems in Adobe XD`,
      `Präsentation, Feedback und Verbesserungsvorschläge im Team`,
      `Entwicklung eines interaktiven Hifi Prototypen in Adobe XD`,
      `Berücksichtigung eines intuitiven Workflows im Sinne des Benutzerfreundlichkeit`,
      `Durchdenken von Interaktionsszenarien`,
      `Integrierung von Animationen und Mikrointeraktionen`
    ],
    'goals-list': [
      `Klickbarer High-Fidelity Prototyp des digitalen Verbandbuchs mit Darstellung von unterschiedlichem Nutzungskontext`,
      `Zwei Interaktionsszenarien basierend auf Nutzer-Rolle im System`,
      `Redesign der Sidebar`,
      `Benutzerfreundliches und minimales User-Interface`
    ]
  },
  {
    id: `Proj03`,
    designProcessMediaHtml: `
        <a href="./lib/images/slider/slider-sprachzwirbel-s7.jpg" class="glightbox" data-gallery="proj03">
          <img data-src="./lib/images/slider/slider-sprachzwirbel-s7.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-sprachzwirbel-s1.jpg" class="glightbox" data-gallery="proj03">
          <img data-src="./lib/images/slider/slider-sprachzwirbel-s1.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-sprachzwirbel-s2.jpg" class="glightbox" data-gallery="proj03">
          <img data-src="./lib/images/slider/slider-sprachzwirbel-s2.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-sprachzwirbel-s3.jpg" class="glightbox" data-gallery="proj03">
          <img data-src="./lib/images/slider/slider-sprachzwirbel-s3.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-sprachzwirbel-s4.jpg" class="glightbox" data-gallery="proj03">
          <img data-src="./lib/images/slider/slider-sprachzwirbel-s4.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-sprachzwirbel-iphone-hoch-lightdark-animated.gif" class="glightbox" data-gallery="proj03">
          <img data-src="./lib/images/slider/slider-sprachzwirbel-iphone-hoch-lightdark-animated.gif" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-sprachzwirbel-s5.jpg" class="glightbox" data-gallery="proj03">
          <img data-src="./lib/images/slider/slider-sprachzwirbel-s5.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-sprachzwirbel-s6.jpg" class="glightbox" data-gallery="proj03">
          <img data-src="./lib/images/slider/slider-sprachzwirbel-s6.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <div class="ext-web-prototype-wrapper d-md-none">
          <section class="project-detail">
            <h3>Website</h3>
            <div class="project-detail-body"><a href="https://ux-paul-grossmann.github.io/sprachzwirbel" target="_blank" title="Sprachzwirbel-App">Sprachzwirbel <i class="fas fa-external-link-alt"></i></a></div>
          </section>
        </div>
        <div class="outer-iframe-prototype-wrap d-none d-md-block">
          <div class="iframe-prototype-wrapper my-5 d-flex justify-content-center">
            <div class="shadow-lg marvel-device iphone8 black"><div class="top-bar"></div><div class="sleep"></div><div class="volume"></div><div class="camera"></div><div class="sensor"></div><div class="speaker"></div><div class="screen"><iframe width="375" height="667" class="lazy" src="about:blank" data-src="https://ux-paul-grossmann.github.io/sprachzwirbel/" frameborder="0" allowfullscreen></iframe></div><div class="home"></div><div class="bottom-bar"></div></div>
          </div>
          <div class="color-choose-wrap d-flex justify-content-center mb-2"><div class="btn-group btn-group-sm" role="group" id="color-choose-device"><button type="button" class="btn download-section-color select-black">Schwarz</button><button type="button" class="btn download-section-color select-silver">Silber</button><button type="button" class="btn download-section-color select-gold">Gold</button></div></div>
          <div class="d-flex justify-content-center hint-wrap mb-5"><span class="text-muted" style="font-size: 60%;">Wählen Sie eine Geräte-Farbe</span></div>
        </div>
        <div class="d-none d-md-block">
          <section class="project-detail">
            <h3>Website</h3>
            <div class="project-detail-body"><a href="https://ux-paul-grossmann.github.io/sprachzwirbel/" target="_blank">Sprachzwirbel - [WebApp] <i class="fas fa-external-link-alt"></i></a></div>
          </section>
        </div>
      `,
    title: `Sprachzwirbel`,
    thumbnailClass: `thumbnail-pic-03`,
    shortDesc: {
      mobile: `App zum Lernen rhetorischer Stilmittel`,
      tablet: `Eine App zum Lernen und Nachschlagen rhetorischer Stilmittel`,
      desktop: `Eine App zum Lernen und Nachschlagen rhetorischer Stilmittel`
    },
    tags: [`Konzeption`, `App`, `Design`, `UI`, `UX`, `Zielgruppe`, `Adaptive`],
    verwendeTools: [`vscode`, `bootstrap-4`, `html-5`, `css-3`, `javascript`, `jquery`],
    prototypeLink: `https://ux-paul-grossmann.github.io/sprachzwirbel/`,
    prototypeText: `Sprachzwirbel - [WebApp]`,
    finalDesign: [],
    background: `Das Studienmodul Software-Ergonomie behandelt Themen wie Mensch-Maschine-Interaktion und alles rund um die menschliche Wahrnehmung und Informationsverarbeitung sowie Analyse und Erstellung von benutzerfreundlicher User Interfaces. Die Lehrveranstaltung war in einen theoretischen und anschließenden, praktischen Abschnitt aufgeteilt.`,
    goalText: `Aufgabe war es, eine interaktive App zu designen, welche den zuvor vermittelten Lehrstoff wiederspiegelt. Dabei lag der Fokus nicht auf einer aufwändigen und fertigen Anwendung, sondern auf ein originelles und vor allem klickbares User-Interface.`,
    duration: `Die Projektdauer betrug ein viertel Semester und sollte in Einzelarbeit durchgeführt werden.`,
    targetGroup: `Als primäre Zielgruppe wählte ich Studenten, die ein Kommunikationsfach studieren. Für die sekundäre Zielgruppe kommen all jene, die sich für Rhetorik und geistige Selbstentwicklung interessieren.`,
    designProcessHtml: ``, // Carousel handled separately in renderer
    achievements: [
      `Adaptives Design - Small Device -> Desktop`,
      `Umschaltbarkeit von Farbthemen im Sinne des Nutzerkontexts`,
      `Minimal UI`,
      `Dezenter und gezielter Einsatz von Farben`,
      `Ansprechende UX`,
      `Intuitive Bedienung`,
      `Spielraum für Funktionserweiterungen`
    ],
    goals: [] // Not a separate list for this project
  },
  {
    id: `Proj04`,
    designProcessMediaHtml: `
        <a href="./lib/images/slider/slider-ip-s1a.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s1a.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-ip-s1.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s1.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-ip-s2.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s2.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-ip-s3.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s3.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-ip-s4.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s4.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-ip-s5.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s5.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-ip-s5A.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s5A.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-ip-s5B.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s5B.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-ip-s6.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s6.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-ip-s6A.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s6A.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-ip-s6B.jpg" class="glightbox" data-gallery="proj04">
          <img data-src="./lib/images/slider/slider-ip-s6B.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
      `,
    title: `Industrie 4.0 RWTH Aachen`,
    thumbnailClass: `thumbnail-pic-04`,
    shortDesc: {
      mobile: `Assessment-Plattform am FIR der RWTH Aachen`,
      tablet: `Assessment-Plattform zur digitalen Transformation am FIR der RWTH Aachen`,
      desktop: `Assessment-Plattform zur digitalen Transformation am FIR der RWTH Aachen`
    },
    tags: [`interdisziplinäres Team-Projekt`, `digitale Transformation`, `Konzeption`, `UI`, `Zielgruppe`, `Wireframes`],
    verwendeTools: [`axure`, `photoshop-cc`, `vscode`, `html-5`, `css-3`, `angular`, `typescript`, `javascript`, `jquery`, `jira`, `github-octocat`],
    prototypeLink: `./lib/prototype/ip40/dashboard.html`,
    prototypeText: `Interaktiver Prototyp Assessment Plattform - [WebApp]`,
    finalDesign: [],
    background: `Interdisziplinäres Projekt am FIR e. V. an der RWTH Aachen. Der Auftraggeber ist im Bereich der Analyse und Einschätzung von Möglichkeiten der digitalen Transformation von Unternehmen. Dabei werden Kundeninterviews durch Assessment-Mitarbeiter vor Ort durchgeführt. Der Workflow der Assessment-Mitarbeiter, des teilnehmenden Auftraggebers war ineffizient und umständlich und dieses galt es durch das interdisziplinäre Projekt zu verbessern. Im Zeichen des Industrie 4.0-Gedanken sollten Arbeitsprozesse digitalisiert und durch die Entwicklung einer nutzerzentrierten Assessment-Plattform als Web-App verbessert werden. Die App sollte alternativ, eine intuitive Bedienung mittels Tastaturkürzeln anbieten, sowie ein User Interface, das sich durch effiziente Usability auszeichnet.`,
    organisation: `Das Projekt wurde unter Zuhilfenahme von JIRA und GitHub verwaltet. Die virtuelle Kommunikation und Datenaustausch fand über Slack statt.`,
    duration: `Die Projektdauer betrug ein Wintersemester.`,
    targetGroup: `Assessment Mitarbeiter, die bereits eingearbeitet sind. Neu-Eingestellte Mitarbeiter.`,
    team: `Zusammenarbeit von MCD- und Informatikstudenten. MCD-Studenten: 3x (UI/UX-Team) und 6x Informatik-Studenten(Back-End-Team),(Graphics-Team) sowie 1x Projektleiter des FIR.`,
    designProcessHtml: ``, // Use carousel from index.html
    achievements: [
      `Erarbeitung des UI-Konzepts im Sinne einer intuitiven UX`,
      `Anfertigung von ersten Wireframes mit Annotationen`,
      `Diskussion, Brainstorming und Hilfestellung innerhalb des Teams`,
      `Weiterentwicklung zu Mockups`,
      `Entwicklung eines ersten, klickbaren Prototyps des Assessment-UI(in Axure RP)`,
      `Recherche nach gängigen Hotkey-Zuweisungen`,
      `Durchdenken von Interaktionsszenarien`,
      `Konzeption eines kontext-sensitiven Assisstenten(Context-Aware-Hintbox)`,
      `Einarbeitung in Angular-Framework`
    ],
    goals: [
      `Intuitive Interaktion mittels Tastatur als Erweiterung der Maus`,
      `Benutzerfreundliches Interface und Filterfunktion für Fragenkataloge`,
      `Kommentarfunktion in einer separaten Dialogbox (als Pop-up), die in jedem Komponent einheitlich genutzt werden kann`,
      `kontextsensitive Assistent-Funktion`
    ]
  },
  {
    id: `Proj05`,
    designProcessMediaHtml: `
        <a href="./lib/images/slider/slider-senseering-sA.jpg" class="glightbox" data-gallery="proj05">
          <img data-src="./lib/images/slider/slider-senseering-sA.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-senseering-sB.jpg" class="glightbox" data-gallery="proj05">
          <img data-src="./lib/images/slider/slider-senseering-sB.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-senseering-sC.jpg" class="glightbox" data-gallery="proj05">
          <img data-src="./lib/images/slider/slider-senseering-sC.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-senseering-sD.jpg" class="glightbox" data-gallery="proj05">
          <img data-src="./lib/images/slider/slider-senseering-sD.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-senseering-sE.jpg" class="glightbox" data-gallery="proj05">
          <img data-src="./lib/images/slider/slider-senseering-sE.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-senseering-sF.jpg" class="glightbox" data-gallery="proj05">
          <img data-src="./lib/images/slider/slider-senseering-sF.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
      `,
    title: `Senseering am WZL RWTH Aachen`,
    thumbnailClass: `thumbnail-pic-05`,
    shortDesc: {
      mobile: `Datenvisualisierung für Industrie 4.0 am WZL`,
      tablet: `Datenvisualisierung und Sensorik für Industrie 4.0 am WZL der RWTH Aachen`,
      desktop: `Datenvisualisierung und Sensorik für Industrie 4.0 am WZL der RWTH Aachen`
    },
    tags: [`Konzeption`, `Design`, `Interaktion`, `Industrie 4.0`, `UI`, `Datenvisualisierung`],
    verwendeTools: [`illustrator`, `photoshop-cc`, `vscode`],
    prototypeLink: null,
    prototypeText: null,
    finalDesign: [],
    background: `Ein Start-Up innerhalb der Schleif- und Umformtechnik am WZL der RWTH Aachen will mit Hilfe von innovativen Sensoren verschiedene Parameter messen und gewonnene Informationen auf einer Webapplikation als Service zur Verfügung stellen.`,
    topic: `Datenvisualisierung, Big-Data, Datenanalyse`,
    organisation: `Das Projekt wurde zwischenzeitlich durch Google Kanbanboard verwaltet.`,
    duration: `Die Projektdauer betrug ein Jahr.`,
    team: `Das Team bestand aus Mitgliedern aus den Bereichen: Maschinenbau, Data-Science, Informatik und Mediengestaltung`,
    designProcessHtml: ``,
    achievements: [
      `Ausarbeitung des Konzept, Design und Beginn der Entwicklung einer funktionierenden UI-Schnittstelle.`
    ],
    goals: []
  },
  {
    id: `Proj06`,
    designProcessMediaHtml: `
        <a href="./lib/images/slider/slider-fh-aachen-mobile-design-1.jpg" class="glightbox" data-gallery="proj06">
          <img data-src="./lib/images/slider/slider-fh-aachen-mobile-design-1.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-fh-aachen-mobile-design-2.jpg" class="glightbox" data-gallery="proj06">
          <img data-src="./lib/images/slider/slider-fh-aachen-mobile-design-2.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <a href="./lib/images/slider/slider-fh-aachen-mobile-design-3.jpg" class="glightbox" data-gallery="proj06">
          <img data-src="./lib/images/slider/slider-fh-aachen-mobile-design-3.jpg" class="my-3 lazyload d-block w-100 rounded-lg" alt="">
        </a>
        <div class="ext-web-prototype-wrapper d-md-none">
          <a href="./lib/images/fhac-collapseBody/fhacxdscrn.png"><img data-src="./lib/images/fhac-collapseBody/fhacxdscrn.png" class="lazyload d-block w-100 px-0 mx-0" alt="FH Aachen Mobile Redesign - Adobe XD"></a>
          <section class="project-detail">
            <h3>Website</h3>
            <div class="project-detail-body"><a href="https://xd.adobe.com/embed/71bccdfd-e05a-4268-5009-0697868d0bbc-078d/" target="_blank">Klickbarer Prototyp_FH-AC-Mobile-320x640 <i class="fas fa-external-link-alt"></i></a></div>
          </section>
        </div>
        <div class="outer-iframe-prototype-wrap d-none d-md-block">
          <div class="iframe-prototype-wrapper my-5 d-flex justify-content-center">
            <div class="shadow-lg marvel-device iphone5s black"><div class="top-bar"></div><div class="sleep"></div><div class="volume"></div><div class="camera"></div><div class="sensor"></div><div class="speaker"></div><div class="screen"><iframe width="320" height="568" class="lazy" src="about:blank" data-src="https://xd.adobe.com/embed/71bccdfd-e05a-4268-5009-0697868d0bbc-078d/" frameborder="0" allowfullscreen></iframe></div><div class="home"></div><div class="bottom-bar"></div></div>
          </div>
          <div class="color-choose-wrap d-flex justify-content-center mb-2"><div class="btn-group btn-group-sm" role="group"><button type="button" class="btn download-section-color select-black">Schwarz</button><button type="button" class="btn download-section-color select-silver">Silber</button><button type="button" class="btn download-section-color select-gold">Gold</button></div></div>
          <div class="d-flex justify-content-center hint-wrap mb-5"><span class="text-muted" style="font-size: 60%;">Wählen Sie eine Geräte-Farbe</span></div>
        </div>
      `,
    title: `FH Aachen Mobile Redesign`,
    thumbnailClass: `thumbnail-pic-06`,
    shortDesc: {
      mobile: `Mobile Redesign des MCD-Studiengangs`,
      tablet: `Mobile-first Redesign des MCD-Studiengangs nach FH Aachen Corporate Design`,
      desktop: `Mobile-first Redesign des MCD-Studiengangs nach FH Aachen Corporate Design`
    },
    tags: [`Konzeption`, `Redesign`, `FH Aachen`, `Mobile-Ready`, `UX`, `UI`, `Corporate Design`, `Mockup`, `Illustration`],
    verwendeTools: [`illustrator`, `xd`],
    prototypeLink: `https://xd.adobe.com/embed/71bccdfd-e05a-4268-5009-0697868d0bbc-078d/`,
    prototypeText: `Klickbarer Prototyp_FH-AC-Mobile-320x640`,
    finalDesign: [],
    background: `Im Rahmen des Praktikums des Studienmoduls Grundlagen des Design, zum Thema - Web, bestand die Herausforderung darin, den mobilen Webauftritt des MCD-Studiengangs umzugestalten. Die Wahl der Umsetzungstools war jedem selbst überlassen.`,
    goalDetails: `Redesign nach Briefingparametern: Startseite (Navi geschlossen/offen), Studiengang oder andere Unterseite, Format 320x480px variable Höhe, Farben und Schrift laut Styleguide der FH-Aachen.`,
    duration: `Die Projektdauer betrug zwei Wochen und wurde in Einzelarbeit realisiert.`,
    implementation: `Design in Illustrator CC und interaktiver Prototyp in Adobe XD.`,
    designProcessHtml: ``,
    achievements: [],
    goals: []
  }
];
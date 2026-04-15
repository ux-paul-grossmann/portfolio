// projects-data.js – Complete project data for portfolio cards
const projectsData = [
  {
    id: 'Proj01',
    title: 'Smart Search Bar',
    thumbnailClass: 'thumbnail-pic-01',
    shortDesc: {
      mobile: 'Intelligente Suche mit Autocomplete für VEDA Horizon',
      tablet: 'Intelligente Suche mit Autocomplete für die VEDA Horizon Plattform',
      desktop: 'Intelligente Suche mit Autocomplete für die VEDA Horizon Plattform'
    },
    tags: ['Konzeption', 'Suchfunktion', 'Design', 'Entwicklung', 'UI', 'UX', 'Intuitiv'],
    designedWithIcons: ['sketching', 'xd', 'msteams', 'jira', 'invision'],
    prototypeLink: 'https://xd.adobe.com/view/3a9ec774-8a20-46ba-af22-6236ec996dbf-6fcd/?fullscreen',
    prototypeText: 'Smart Search Bar – [Suchfunktion]',
    background: 'VEDA GmbH bietet HR-Software und Services für das Personalmanagement in Unternehmen an. VEDA Horizon ist eine firmeninterne Social Media Plattform. Alle Mitarbeiter eines Unternehmens sind dadurch vernetzt und können miteinander effizienter auf Herausforderungen reagieren. VEDA Horizon ist modular, sodass neue, digitale Services als Plug-Ins jederzeit integriert werden können. Die Suchfunktion in Horizon war nicht funktional und sollte neu konzipiert und designed werden. Das Design sollte durch die Mac OS Spotlight-Suche inspiriert werden und den Nutzern die Möglichkeit bieten zu Suchbegriffen assoziative Vorschläge aus vorgegebenen Kategorien anzuzeigen.',
    organisation: 'Die Kommunikation fand sowohl vor Ort als auch über MS Teams statt. Das Projekt wurde über JIRA verwaltet.',
    duration: 'Die Projektdauer betrug sechs Monate und die Ausarbeitung verlief parallel zum Projekt – Digitales Verbandbuch.',
    targetGroup: 'Bestandskunden als auch Neukunden. Research war nicht gewünscht.',
    team: 'Bestehend aus Werkstudenten und Projektbetreuung. Projektleiterin(Energiewirtschaft), 5x Programmierer(Informatik und Elektrotechnik) und mir – UX-Designer(Media and Communications for Digital Business). Betreut durch je einen Lead UX-Designer und Product Owner.',
    designProcessHtml: `
      <h6 class="text-center mt-5">Ideation & Wireflow</h6>
      <a href="./lib/images/ssb-collapseBody/ssb-design1.png" class="glightbox" data-glightbox="title: Konzeptionsansatz für die Suchfunktion; description: .ssb-desc1; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design1.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc1"><p>Ideenentwurf mittels <a href="https://www.invisionapp.com/freehand">InVision Freehand</a>. Danach Austausch und Feedback mit dem Team.</p></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design2.png" class="glightbox" data-glightbox="title: Sketching and iterating Wire Flow; description: .ssb-desc2; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design2.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc2"><p></p></div>
      <h6 class="text-center mt-5">Positionierung der Suchleiste | Iteration</h6>
      <a href="./lib/images/ssb-collapseBody/ssb-design3.png" class="glightbox" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc3; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design3.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc3"><p><i>Variante A</i></p></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design4.png" class="glightbox" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc4; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design4.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc4"><p><i>Variante B</i></p></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design5.png" class="glightbox" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc5; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design5.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc5"><p><i>Variante C</i></p><p>Diese und die Variante B waren meine Favoriten, da die Anforderung lautete, dass die Suchfunktion von jeder beliebigen Unterseite aus aufgerufen werden sollte; und durch eine mitscrollende Navigation mit der omnipräsenten Suchleiste wäre das eine optimale Lösung. Allerdings entschied sich die Projektbetreuung für die Variante A, eine Suchleiste auf der Startseite.</p></div>
      <h6 class="text-center mt-5">Autocomplete | Iteration</h6>
      <a href="./lib/images/ssb-collapseBody/ssb-design6.png" class="glightbox" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc6; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design6.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc6"></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design7.png" class="glightbox" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc7; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design7.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc7"></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design8.png" class="glightbox" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc8; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design8.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc8"></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design9.png" class="glightbox" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc9; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design9.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc9"></div>
      <h6 class="text-center mt-5">Anatomie der UI-Elemente & Informationen für Entwickler</h6>
      <a href="./lib/images/ssb-collapseBody/ssb-design10.png" class="glightbox" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc10; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design10.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc10"></div>
      <a href="./lib/images/ssb-collapseBody/ssb-design11.png" class="glightbox" data-glightbox="title: Positionierung der Suchleiste; description: .ssb-desc11; descPosition: bottom;">
        <img data-src="./lib/images/ssb-collapseBody/ssb-design11.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc ssb-desc11"></div>
      <h6 class="text-center mt-5">Smart Search Bar MVP Demo</h6>
      <a href="./lib/video/clips/ssb-prototype-demo2.mp4" class="glightbox">
        <img src="./lib/video/thumbs/ssb-prototype-demo2-thumb.png" alt="image" class="d-block w-100 shadow mb-3 rounded-lg">
      </a>
    `,
    achievements: [
      'Erarbeitung des UI-Konzepts in Form von gezielten Fragestellungen, Skizzen und Mindmap',
      'Anfertigung von ersten Wireframes mit Annotationen in Adobe XD',
      'Berücksichtung des VEDA Corporate Designs',
      'Erstellung eines VEDA Design Systems in Adobe XD',
      'Präsentation, Feedback und Verbesserungsvorschläge im Team',
      'Entwicklung eines interaktiven HiFi Prototypen in Adobe XD',
      'Berücksichtigung eines intuitiven Workflows im Sinne des Benutzerfreundlichkeit',
      'Durchdenken von Interaktionsszenarien',
      'Integrierung von Animationen und Mikrointeraktionen',
      'Reduzierung auf das notwendigst Wesentliche (KISS)',
      'Anfertigen einer Task-Flow Karte aller möglichen Horizon-Aktionen zum Zwecke der Hilfestellung für die Entwickler'
    ],
    goals: [
      'Redesign der Suchfunktion',
      'Klickbarer High-Fidelity Prototyp der Suchfunktion mit Darstellung von unterschiedlichem Nutzungskontext',
      'Vier Interaktionsszenarien basierend auf Nutzer-Rolle im System',
      'Benutzerfreundliches und minimales User-Interface'
    ]
  },
  {
    id: 'Proj02',
    title: 'Digitales Verbandbuch',
    thumbnailClass: 'thumbnail-pic-02',
    shortDesc: {
      mobile: 'Digitale Unfallmeldung für VEDA Horizon',
      tablet: 'Digitale Unfallmeldung und Verwaltung als Plug-In für VEDA Horizon',
      desktop: 'Digitale Unfallmeldung und Verwaltung als Plug-In für VEDA Horizon'
    },
    tags: ['interdisziplinäres Team-Projekt', 'digitale Transformation', 'Konzeption', 'UI', 'UX', 'Wireframes'],
    designedWithIcons: ['sketching', 'xd', 'msteams', 'jira'],
    prototypeLink: 'https://xd.adobe.com/view/2eefff67-d748-4561-baaa-2eba661db3e9-7bbc/?fullscreen',
    prototypeText: 'Digitales Verbandbuch – [Plug-In]',
    background: 'VEDA GmbH bietet HR-Software und Services für das Personalmanagement in Unternehmen an. VEDA Horizon ist eine firmeninterne Social Media Plattform. Alle Mitarbeiter eines Unternehmens sind dadurch vernetzt und können miteinander effizienter auf Herausforderungen reagieren. VEDA Horizon ist modular, sodass neue, digitale Services als Plug-Ins jederzeit integriert werden können. Das digitale Verbandbuch ist ein solches Plug-In und wurde durch einen Kunden in Auftrag gegeben. Es sollte die Möglichkeit entstehen Unfallmeldungen innerhalb des Unternehmens digital über VEDA Horizon abzuwickeln.',
    organisation: 'Das Projekt wurde über JIRA verwaltet. Die virtuelle Kommunikation fand über MS Teams statt.',
    duration: 'Die Projektdauer betrug sechs Monate.',
    targetGroup: 'Bestandskunden als auch Neukunden. Research war nicht gewünscht.',
    team: 'Bestehend aus Werkstudenten und Projektbetreuung. Projektleiterin(Energiewirtschaft), 5x Programmierer(Informatik und Elektrotechnik) und mir – UX-Designer(Media and Communications for Digital Business). Betreut durch je einen Lead UX-Designer und Product Owner.',
    designProcessHtml: `
      <h6 class="text-center mt-5">Ideation</h6>
      <a href="./lib/images/dvb-collapseBody/dvb-design1.png" class="glightbox" data-glightbox="title:UX-Huddle Session Verbandbuch; description: .dvb-desc1; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design1.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc1"><p>Review der Verbandbuch-Skizzen mit dem Team.</p></div>
      <a href="./lib/images/dvb-collapseBody/dvb-design2.png" class="glightbox" data-glightbox="title:Verbandbuch-Skizzen; description: .dvb-desc2; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design2.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc2"><p>Gesammelte Skizzen dienen als Inspiration, werden analysiert und beim Designprozess berücksichtigt.</p></div>
      <a href="./lib/images/dvb-collapseBody/dvb-design3.png" class="glightbox" data-glightbox="title:Verbandbuch Interaktiver Prototyp; description: .dvb-desc3; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design3.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc3"></div>
      <a href="./lib/images/dvb-collapseBody/dvb-design4.png" class="glightbox" data-glightbox="title:Verbandbuch Interaktiver Prototyp; description: .dvb-desc4; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design4.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc4"></div>
      <a href="./lib/images/dvb-collapseBody/dvb-design5.png" class="glightbox" data-glightbox="title:Verbandbuch Interaktiver Prototyp; description: .dvb-desc5; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design5.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc5"></div>
      <a href="./lib/images/dvb-collapseBody/dvb-design6.png" class="glightbox" data-glightbox="title:Verbandbuch Interaktiver Prototyp; description: .dvb-desc6; descPosition: bottom;">
        <img data-src="./lib/images/dvb-collapseBody/dvb-design6.png" class="my-3 lazyload mb-2 d-block w-100 rounded-lg border shadow">
      </a>
      <div class="glightbox-desc dvb-desc6"></div>
    `,
    achievements: [
      'Erarbeitung des UI-Konzepts in Form von gezielten Fragestellungen, Skizzen und Mindmap',
      'Anfertigung von Low-Fidelity-Mockups in Adobe XD',
      'Berücksichtung des VEDA Corporate Designs',
      'Erstellung eines VEDA Design Systems in Adobe XD',
      'Präsentation, Feedback und Verbesserungsvorschläge im Team',
      'Entwicklung eines interaktiven Hifi Prototypen in Adobe XD',
      'Berücksichtigung eines intuitiven Workflows im Sinne des Benutzerfreundlichkeit',
      'Durchdenken von Interaktionsszenarien',
      'Integrierung von Animationen und Mikrointeraktionen'
    ],
    goals: [
      'Klickbarer High-Fidelity Prototyp des digitalen Verbandbuchs mit Darstellung von unterschiedlichem Nutzungskontext',
      'Zwei Interaktionsszenarien basierend auf Nutzer-Rolle im System',
      'Redesign der Sidebar',
      'Benutzerfreundliches und minimales User-Interface'
    ]
  },
  {
    id: 'Proj03',
    title: 'Sprachzwirbel',
    thumbnailClass: 'thumbnail-pic-03',
    shortDesc: {
      mobile: 'App zum Lernen rhetorischer Stilmittel',
      tablet: 'Eine App zum Lernen und Nachschlagen rhetorischer Stilmittel',
      desktop: 'Eine App zum Lernen und Nachschlagen rhetorischer Stilmittel'
    },
    tags: ['Konzeption', 'App', 'Design', 'UI', 'UX', 'Zielgruppe', 'Adaptive'],
    designedWithIcons: ['sketching', 'vscode', 'bootstrap-4', 'html-5', 'css-3', 'javascript', 'jquery'],
    prototypeLink: 'https://ux-paul-grossmann.github.io/sprachzwirbel/',
    prototypeText: 'Sprachzwirbel - [WebApp]',
    background: 'Das Studienmodul Software-Ergonomie behandelt Themen wie Mensch-Maschine-Interaktion und alles rund um die menschliche Wahrnehmung und Informationsverarbeitung sowie Analyse und Erstellung von benutzerfreundlicher User Interfaces. Die Lehrveranstaltung war in einen theoretischen und anschließenden, praktischen Abschnitt aufgeteilt.',
    goalText: 'Aufgabe war es, eine interaktive App zu designen, welche den zuvor vermittelten Lehrstoff wiederspiegelt. Dabei lag der Fokus nicht auf einer aufwändigen und fertigen Anwendung, sondern auf ein originelles und vor allem klickbares User-Interface.',
    duration: 'Die Projektdauer betrug ein viertel Semester und sollte in Einzelarbeit durchgeführt werden.',
    targetGroup: 'Als primäre Zielgruppe wählte ich Studenten, die ein Kommunikationsfach studieren. Für die sekundäre Zielgruppe kommen all jene, die sich für Rhetorik und geistige Selbstentwicklung interessieren.',
    designProcessHtml: '', // Carousel handled separately in renderer
    achievements: [
      'Adaptives Design - Small Device -> Desktop',
      'Umschaltbarkeit von Farbthemen im Sinne des Nutzerkontexts',
      'Minimal UI',
      'Dezenter und gezielter Einsatz von Farben',
      'Ansprechende UX',
      'Intuitive Bedienung',
      'Spielraum für Funktionserweiterungen'
    ],
    goals: [] // Not a separate list for this project
  },
  {
    id: 'Proj04',
    title: 'Industrie 4.0 RWTH Aachen',
    thumbnailClass: 'thumbnail-pic-04',
    shortDesc: {
      mobile: 'Assessment-Plattform am FIR der RWTH Aachen',
      tablet: 'Assessment-Plattform zur digitalen Transformation am FIR der RWTH Aachen',
      desktop: 'Assessment-Plattform zur digitalen Transformation am FIR der RWTH Aachen'
    },
    tags: ['interdisziplinäres Team-Projekt', 'digitale Transformation', 'Konzeption', 'UI', 'Zielgruppe', 'Wireframes'],
    designedWithIcons: ['sketching', 'axure', 'photoshop-cc', 'vscode', 'html-5', 'css-3', 'angular', 'typescript', 'javascript', 'jquery', 'jira', 'github-octocat'],
    prototypeLink: 'https://ux-paul-grossmann.github.io/portfolio/prototypes/proto-ip40/',
    prototypeText: 'Interaktiver Prototyp Assessment Plattform - [WebApp]',
    background: 'Interdisziplinäres Projekt am FIR e. V. an der RWTH Aachen. Der Auftraggeber ist im Bereich der Analyse und Einschätzung von Möglichkeiten der digitalen Transformation von Unternehmen. Dabei werden Kundeninterviews durch Assessment-Mitarbeiter vor Ort durchgeführt. Der Workflow der Assessment-Mitarbeiter, des teilnehmenden Auftraggebers war ineffizient und umständlich und dieses galt es durch das interdisziplinäre Projekt zu verbessern. Im Zeichen des Industrie 4.0-Gedanken sollten Arbeitsprozesse digitalisiert und durch die Entwicklung einer nutzerzentrierten Assessment-Plattform als Web-App verbessert werden. Die App sollte alternativ, eine intuitive Bedienung mittels Tastaturkürzeln anbieten, sowie ein User Interface, das sich durch effiziente Usability auszeichnet.',
    organisation: 'Das Projekt wurde unter Zuhilfenahme von JIRA und GitHub verwaltet. Die virtuelle Kommunikation und Datenaustausch fand über Slack statt.',
    duration: 'Die Projektdauer betrug ein Wintersemester.',
    targetGroup: 'Assessment Mitarbeiter, die bereits eingearbeitet sind. Neu-Eingestellte Mitarbeiter.',
    team: 'Zusammenarbeit von MCD- und Informatikstudenten. MCD-Studenten: 3x (UI/UX-Team) und 6x Informatik-Studenten(Back-End-Team),(Graphics-Team) sowie 1x Projektleiter des FIR.',
    designProcessHtml: '', // Use carousel from index.html
    achievements: [
      'Erarbeitung des UI-Konzepts im Sinne einer intuitiven UX',
      'Anfertigung von ersten Wireframes mit Annotationen',
      'Diskussion, Brainstorming und Hilfestellung innerhalb des Teams',
      'Weiterentwicklung zu Mockups',
      'Entwicklung eines ersten, klickbaren Prototyps des Assessment-UI(in Axure RP)',
      'Recherche nach gängigen Hotkey-Zuweisungen',
      'Durchdenken von Interaktionsszenarien',
      'Konzeption eines kontext-sensitiven Assisstenten(Context-Aware-Hintbox)',
      'Einarbeitung in Angular-Framework'
    ],
    goals: [
      'Intuitive Interaktion mittels Tastatur als Erweiterung der Maus',
      'Benutzerfreundliches Interface und Filterfunktion für Fragenkataloge',
      'Kommentarfunktion in einer separaten Dialogbox (als Pop-up), die in jedem Komponent einheitlich genutzt werden kann',
      'kontextsensitive Assistent-Funktion'
    ]
  },
  {
    id: 'Proj05',
    title: 'Senseering am WZL RWTH Aachen',
    thumbnailClass: 'thumbnail-pic-05',
    shortDesc: {
      mobile: 'Datenvisualisierung für Industrie 4.0 am WZL',
      tablet: 'Datenvisualisierung und Sensorik für Industrie 4.0 am WZL der RWTH Aachen',
      desktop: 'Datenvisualisierung und Sensorik für Industrie 4.0 am WZL der RWTH Aachen'
    },
    tags: ['Konzeption', 'Design', 'Interaktion', 'Industrie 4.0', 'UI', 'Datenvisualisierung'],
    designedWithIcons: ['sketching', 'illustrator', 'photoshop-cc', 'vscode'],
    prototypeLink: null,
    prototypeText: null,
    background: 'Ein Start-Up innerhalb der Schleif- und Umformtechnik am WZL der RWTH Aachen will mit Hilfe von innovativen Sensoren verschiedene Parameter messen und gewonnene Informationen auf einer Webapplikation als Service zur Verfügung stellen.',
    topic: 'Datenvisualisierung, Big-Data, Datenanalyse',
    organisation: 'Das Projekt wurde zwischenzeitlich durch Google Kanbanboard verwaltet.',
    duration: 'Die Projektdauer betrug ein Jahr.',
    team: 'Das Team bestand aus Mitgliedern aus den Bereichen: Maschinenbau, Data-Science, Informatik und Mediengestaltung',
    achievements: [
      'Ausarbeitung des Konzept, Design und Beginn der Entwicklung einer funktionierenden UI-Schnittstelle.'
    ],
    goals: []
  },
  {
    id: 'Proj06',
    title: 'FH Aachen Mobile Redesign',
    thumbnailClass: 'thumbnail-pic-06',
    shortDesc: {
      mobile: 'Mobile Redesign des MCD-Studiengangs',
      tablet: 'Mobile-first Redesign des MCD-Studiengangs nach FH Aachen Corporate Design',
      desktop: 'Mobile-first Redesign des MCD-Studiengangs nach FH Aachen Corporate Design'
    },
    tags: ['Konzeption', 'Redesign', 'FH Aachen', 'Mobile-Ready', 'UX', 'UI', 'Corporate Design', 'Mockup', 'Illustration'],
    designedWithIcons: ['sketching', 'illustrator', 'xd'],
    prototypeLink: 'https://xd.adobe.com/embed/71bccdfd-e05a-4268-5009-0697868d0bbc-078d/',
    prototypeText: 'Klickbarer Prototyp_FH-AC-Mobile-320x640',
    background: 'Im Rahmen des Praktikums des Studienmoduls Grundlagen des Design, zum Thema - Web, bestand die Herausforderung darin, den mobilen Webauftritt des MCD-Studiengangs umzugestalten. Die Wahl der Umsetzungstools war jedem selbst überlassen.',
    goalDetails: 'Redesign nach Briefingparametern: Startseite (Navi geschlossen/offen), Studiengang oder andere Unterseite, Format 320x480px variable Höhe, Farben und Schrift laut Styleguide der FH-Aachen.',
    duration: 'Die Projektdauer betrug zwei Wochen und wurde in Einzelarbeit realisiert.',
    implementation: 'Design in Illustrator CC und interaktiver Prototyp in Adobe XD.',
    achievements: [],
    goals: []
  }
];
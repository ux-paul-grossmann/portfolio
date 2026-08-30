# Arbeitsregeln (gilt für jede Session, jeden Branch)

Kleinstmögliche Diffs. Bei Zweifel: nicht anfassen, sondern nachfragen.

1. **Plan zuerst, Code danach.** Vor Änderungen kurz auflisten, welche Dateien
   betroffen sind und was genau passiert. Bei größeren Änderungen auf Bestätigung
   warten — bei trivialen 1-Zeilen-Fixes nicht nötig.
2. **Nur die genannten Dateien/Komponenten anfassen.** Andere Sections, andere
   Dateien, globale CSS-Klassen: tabu, außer explizit erwähnt.
3. **Keine Refactors ohne Auftrag.** Kein Umbenennen, kein "Aufräumen", kein
   Umsortieren, keine Formatierungs-Änderungen an nicht erwähntem Code — auch
   wenn er unsauber wirkt. Auffälligkeiten kurz erwähnen, nicht selbst ändern.
4. **Keine neuen Dependencies** ohne Rückfrage.
5. **Bestehende Texte (Deutsch) nicht umschreiben/"verbessern"** — nur
   strukturell/technisch ändern, wenn nicht explizit um Text-Überarbeitung gebeten.
6. **Ein Feature/Fix pro Antwort.** Keine Bonus-Änderungen "während ich eh drin war".
7. **Keine Dateien löschen/umbenennen** ohne explizite Ansage.
8. Nach jeder Änderung: kurz zusammenfassen, welche Dateien geändert wurden und warum.
9. Bei zu vager Aufgabe: 1–2 kurze Rückfragen stellen statt in mehrere Richtungen zu raten.

### Definition of Done
- [ ] Nur die angefragte Änderung wurde gemacht
- [ ] Keine unangeforderten Dateien im Diff
- [ ] Bestehender Code/Content unverändert, wo nicht explizit gefordert
- [ ] Kurze Zusammenfassung der Änderung gegeben

### Ordnerstruktur (wichtig)
Es gibt nur **einen** aktiven Projektordner (`portfolio`). Experimente laufen
über Git-Branches (siehe unten), nicht über kopierte Ordner. Falls du auf
weitere `portfolio*`-Ordner stößt: nicht anfassen, das sind Altlasten, die
manuell aufgeräumt werden.

---

# Repo & Tooling

**Statische One-Page-Site** (Portfolio): `index.html` + `style.css` + `lib/` + `dist/`.
Es gibt KEIN `package.json`, KEIN Build, kein Test-/Lint-Setup. Verifikation = Seite im
Browser öffnen (CDN-Abhängigkeiten: jQuery 3.3.1, Bootstrap 4.3.1, GLightbox, slick,
vanilla-lazyload, motion → Internet nötig).

Syntax-Smoke-Test für die lib/js-Dateien (passt bei allen vier aktuell):
```bash
node -e "const fs=require('fs');for(const f of ['lib/js/helpers.js','lib/js/animations.js','lib/js/render-projects.js','lib/js/projects-data.js']){new Function(fs.readFileSync(f,'utf8'));console.log('OK',f)}"
```

- `dist/` = vendorisierte Libs (lazysizes, scrollToTop, bootstrap-swipe-carousel, devices.min.css, …) → nicht editieren.
- `backup-03-05-2026-0233/` = gitignorierte Altlast → nicht anfassen. `lib/images/*.zip` = unbenutzte Asset-Sammlung.

# JS-Architektur

- **Ladereihenfolge** in `index.html` (unten): jQuery → Bootstrap → `dist/js/lazysizes.min.js` → `lib/js/projects-data.js` → `lib/js/render-projects.js` → `bootstrap-swipe-carousel` → vanilla-lazyload → GLightbox (CDN) → `lib/js/helpers.js` (zuletzt).
- `lib/js/animations.js` liegt im `<head>` mit `defer` → läuft VOR jQuery → sein Code MUSS in `$(document).ready(...)` stehen.
- `projects-data.js` = Daten (`projectsData`), enthält HTML-Strings mit deutschen Texten → nicht umschreiben (Regel 5). `render-projects.js` rendert die Karten in `#projekte`.
- `helpers.js` erzeugt beim Laden: `var glightbox` (GLightbox), `lazyLoadInstance` (vanilla-lazyload), Theme-Switch, Jahreszahl im Footer.

# GLightbox – Regeln (hat viel Zeit gekostet)

- **Nur EINE Instanz**: `helpers.js` (`var glightbox`). `animations.js` erzeugt eine ZWEITE Instanz mit demselben Selektor `.glightbox` → nicht als Vorbild nehmen. Nach DOM-Änderungen immer `window.glightbox.reload()` aufrufen, **niemals** `new GLightbox()` im Render-Code.
- **Galerie je Karte**: jedes `<a class="glightbox">` braucht ein separates `data-gallery="projXX"` (lowercase-ID). Ein `gallery:`-Key *innerhalb* von `data-glightbox` wird von GLightbox IGNORIERT.
- Auf Nutzerwunsch sind alle Slider/Carousels entfernt – Projektbilder sind einzelne GLightbox-Anker in `render-projects.js`. Keine Carousels mehr ergänzen.
- Bildunterschriften: externe Elemente `.glightbox-desc` werden über `data-glightbox="description: .ssb-desc1; ..."` referenziert (Muster in `projects-data.js`).

# Lazy Loading – zwei Systeme, nicht verwechseln

- **Bilder**: `class="lazyload"` + `data-src` → **lazysizes** (`dist/js/lazysizes.min.js`, nur `<img>`).
- **iframes**: `class="lazy"` + `data-src` + **zusätzlich `src="about:blank"`** → **vanilla-lazyload** (Instanz `lazyLoadInstance` in helpers.js, `elements_selector: ".lazy"`). Ohne `src="about:blank"` lädt der iframe nicht.
- Nach jedem DOM-Insert: `lazyLoadInstance.update()` (passiert bei Collapse-Öffnung in `animations.js`).

# Themes

- 4 Blöcke in `lib/themes/themes.css`: `:root` (Default hell), `.dark`, `.lightPlus`, `.material`.
- Umschaltung über `<body>`-Klasse, gesteuert in `helpers.js`, persistiert in `localStorage["theme"]`.
- Farben NUR als CSS-Variablen je Theme-Block definieren, nie hart kodieren. Hell-/Dunkel-Unterschiede in die Variablen legen (Muster: `--content-img-box-shadow: 0 4px 16px rgba(0,0,0,0.08)` hell vs. `0 4px 16px rgba(0,0,0,0.35)` dunkel).
- style.css konsumiert Variablen mit Fallback: `var(--content-img-box-shadow, 0 4px 16px rgba(0,0,0,0.08))` (u.a. auf `#projekte .card-body img`, `#projekte .glightbox img`).

# Git & Session-Start

- Experimente laufen über **Branches**, nie über kopierte Ordner. Branches: `master` / `material-theme` (aktuell, gleicher Tip), `morphing-cards` und `flanking-cards` (alternative Nav-Varianten mit eigenen JS-Dateien und index.html-Load-Orders → deren Code nicht ohne expliziten Auftrag übernehmen).
- **AGENTS.md ist getrackt** → niemals per `git checkout HEAD -- AGENTS.md` oder `git restore` zurücksetzen.
- **Uncommitted Arbeit geht bei `git restore`/`git checkout` verloren** → vor Branch-Wechsel committen.
- Session-Start: `git status` → `git log --oneline -5` → Browser-Check (`python3 -m http.server 8000` → http://localhost:8000).
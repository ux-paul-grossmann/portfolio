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

Syntax-Smoke-Test für die lib/js-Dateien:
```bash
node -e "const fs=require('fs');for(const f of ['lib/js/helpers.js','lib/js/animations.js','lib/js/render-projects.js','lib/js/projects-data.js','lib/js/project-viewer.js','lib/js/project-navigation.js']){try{new Function(fs.readFileSync(f,'utf8'));console.log('OK',f)}catch(e){console.log('FAIL',f,e.message)}}"
```

- `dist/` = vendorisierte Libs (lazysizes, scrollToTop, bootstrap-swipe-carousel, devices.min.css, …) → nicht editieren.
- `backup-03-05-2026-0233/` = gitignorierte Altlast → nicht anfassen. `lib/images/*.zip` = unbenutzte Asset-Sammlung.

# JS-Architektur

- **Early Theme** im `<head>` (`index.html:16`): `matchMedia('(prefers-color-scheme: dark)')` + `localStorage["theme"]` (nur `light`/`dark`, Legacy `material`/`lightPlus`/`:root` wird entfernt) → setzt `html.dark`/`body.dark` vor Render, vermeidet Flash.
- **Ladereihenfolge** in `index.html` (unten): jQuery → Bootstrap → `dist/js/lazysizes.min.js` → `lib/js/projects-data.js` → `dist/js/bootstrap-swipe-carousel.min.js` → `dist/js/scrollToTop.js` → slick/vanilla-lazyload/transformicon/zooming → GLightbox (CDN) → `lib/js/project-viewer.js` (defer) → `lib/js/helpers.js` (zuletzt, Toggle + `lazyLoadInstance` + GLightbox-Instanz).
- `lib/js/animations.js` liegt im `<head>` mit `defer` → läuft VOR jQuery → sein Code MUSS in `$(document).ready(...)` stehen. Rendert Kontext-Notizen (`.kontext-wrap`) und Scroll-Trigger für `#projekte .cluster`.
- `projects-data.js` = Daten (`projectsData`), enthält HTML-Strings mit deutschen Texten → nicht umschreiben (Regel 5). `render-projects.js` + `project-viewer.js` + `project-navigation.js` rendern die Karten in `#projekte` (Viewer: 3-Card + bottom strip auf `flanking-cards`).
- `helpers.js` erzeugt beim Laden: `var glightbox` (GLightbox), `lazyLoadInstance` (vanilla-lazyload, `elements_selector: ".lazy"`), Theme-Switch (top-right), Jahreszahl im Footer.

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

- Aktuell **bluish-teal M3** in `lib/themes/themes.css`: `:root` (light `rgb(244 250 250)`) + `.dark` (dark `rgb(14 20 21)`) – `bluish-teal` aus Theme Builder (`--md-sys-color-primary: rgb(0 105 110)`). Legacy `.material` (`#6750A4`) + `.lightPlus` bleiben als ungenutzte Alt-Blöcke, nicht verwenden.
- Umschaltung über `html.dark` + `body.dark`, gesteuert in `helpers.js` + Early-Script, persistiert in `localStorage["theme"]` (nur `light`/`dark`). System-Default via `prefers-color-scheme`, folgt `matchMedia('change')` nur wenn kein expliziter User-Wert.
- Toggle **top-right** `button#theme-toggle` (`index.html:70`, `position:fixed; top:10px; right:10px; z-index:1101`, icon `fa-moon`/`fa-sun`, kein Label), nicht mehr bottom `theme-panel-container`.
- Farben NUR als CSS-Variablen je Theme-Block definieren, nie hart kodieren. Notizen: `--note-text-color: #1d1c1b` fix (lesbar auf allen Pastell-Notizen, auch im Dark Mode).
- style.css konsumiert Variablen mit Fallback.

# Git & Session-Start

- Experimente laufen über **Branches**, nie über kopierte Ordner. Branches: `master` = **live** (GitHub Pages + Default-Branch `origin/HEAD -> origin/master`, API-verifiziert), `flanking-cards`/`material-theme`/`morphing-cards` = Experimente. `flanking-cards` hat Extra-Ordner `prototypes/proto-ip40` (Duplikat von `lib/prototype/ip40`, 404-Fix) – existiert nicht auf `master`. Live Pages-Branch wird **nur** via Nightly Audit (`GET /pages` + live `curl`) verifiziert, nicht geraten.
- **AGENTS.md ist getrackt** → nicht ignorieren. Änderungen an `AGENTS.md` werden gepusht und gelten auf allen 3 Macs.
- **Uncommitted Arbeit geht bei `git restore`/`git checkout` verloren** → vor Branch-Wechsel committen.
- Session-Start: `git fetch --all` → `git checkout master` → `git pull` → `git status` → `git log --oneline -5` → Browser-Check (`python3 -m http.server 8000` → http://localhost:8000). Vor Sleeping: `git status` clean → `git push`.

# Nightly Audit 23:00 (verifiziert)

Wird **nicht geraten**, sondern verifiziert via GitHub Action (läuft auch wenn alle Macs schlafen). Definition hier, Ausführung in `.github/workflows/nightly-audit.yml`.

- **Wann:** täglich `21:00 UTC` (=23:00 MESZ, Winter 22:00 UTC → 1h Drift) + manueller `workflow_dispatch`.
- **Was verifiziert:**
  - `GET /repos/ux-paul-grossmann/portfolio/pages` → `source.branch`
  - `git ls-remote --heads origin` → `master`/`flanking-cards` Tips
  - `curl https://ux-paul-grossmann.github.io/portfolio/` → enthält `Kompetenzen &amp; Methoden` + `button#theme-toggle`
- **Wie:** `actions/checkout`, `gh api ... --jq .source.branch` mit `GITHUB_TOKEN` (auto, kostenlos, public repo = unlimitiert Minuten, Logs public), `git ls-remote`, `curl | grep`. Bei Drift: `AUDIT.md` commit oder Issue. Kein lokaler PAT nötig.

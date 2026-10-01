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

### Übernommene Regeln (Chrome-Extensions)

10. **Commits jederzeit erlaubt, Push nur mit Go.** Committet werden darf jederzeit; Push weiter nur mit explizitem Go des Users.
11. **Commits:** Nachrichten auf Englisch mit Präfix `feat/fix/chore/style`; Renames nur im Code, nie in der Nachricht erwähnen.
12. **Antworten und Rückfragen immer Englisch.** Kommunikation mit dem User auf Englisch, auch bei deutscher Nachricht oder deutschem Handover-Kontext. Deutsch nur wenn explizit aufgefordert, bis zur Stop-Phrase „jetzt wieder in englisch" (case-insensitive). UI-Texte der Seite bleiben Deutsch.
13. **Jargon immer erklären.** Technische Begriffe (Status-Codes, Fehlermeldungen, Tool-Namen) beim ersten Auftreten in einfachen Worten erklären; nichts als bekannt voraussetzen.
14. **Fehler müssen zur Lösung führen.** Jeder Fehler nennt was passiert ist und den exakten nächsten Schritt; nie eine Sackgasse.
15. **Keine Abkürzungen in Antworten.**
16. **Re-Read-Pflicht.** „X erneut lesen" heißt die Datei gegen Git-Historie (`log`, `diff`, `status`) plus HANDOVER.md abgleichen — Änderungen von allen melden, nie nur gegen eigenes Session-Gedächtnis vergleichen.
17. **Handover-Stand aktuell halten.** Zu Session-Beginn Stand gegen `git status` und `log` prüfen und bei Abweichung sofort richtigstellen; vor jedem Push Stand, fertige und offene Punkte aktualisieren.
Private Regeln (Session Helper Operator, Projekt-Tags) stehen nur in der ignorierten HANDOVER.md.

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

Syntax-Smoke-Test für die lib/js-Dateien (nur Dateien auf dem aktuellen Branch):
```bash
node -e "const fs=require('fs');for(const f of ['lib/js/helpers.js','lib/js/animations.js','lib/js/render-projects.js','lib/js/projects-data.js']){try{new Function(fs.readFileSync(f,'utf8'));console.log('OK',f)}catch(e){console.log('FAIL',f,e.message)}}"
```
Auf den Experiment-Branches `flanking-cards`/`morphing-cards` zusätzlich `lib/js/project-viewer.js` und `lib/js/project-navigation.js` einfügen.

- `dist/` = vendorisierte Libs (lazysizes, scrollToTop, bootstrap-swipe-carousel, devices.min.css, …) → nicht editieren.
- `backup-03-05-2026-0233/` = gitignorierte Altlast → nicht anfassen. `lib/images/*.zip` = unbenutzte Asset-Sammlung.

# JS-Architektur

- **Early Theme** im `<head>` (`index.html:16`): `matchMedia('(prefers-color-scheme: dark)')` + `localStorage["theme"]` (nur `light`/`dark`, Legacy `material`/`lightPlus`/`:root` wird entfernt) → setzt `html.dark`/`body.dark` vor Render, vermeidet Flash.
- **Ladereihenfolge** in `index.html` (unten): jQuery → Bootstrap → `dist/js/lazysizes.min.js` → `lib/js/projects-data.js` → `dist/js/bootstrap-swipe-carousel.min.js` → `dist/js/scrollToTop.js` → slick/vanilla-lazyload/transformicon/zooming → GLightbox (CDN) → `lib/js/helpers.js` (zuletzt, Toggle + `lazyLoadInstance` + GLightbox-Instanz).
- `lib/js/animations.js` liegt im `<head>` mit `defer` → läuft VOR jQuery → sein Code MUSS in `$(document).ready(...)` stehen. Rendert Kontext-Notizen (`.kontext-wrap`) und Scroll-Trigger für `#projekte .cluster`.
- `projects-data.js` = Daten (`projectsData`), enthält HTML-Strings mit deutschen Texten → nicht umschreiben (Regel 5). `render-projects.js` rendert die Karten in `#projekte`. Auf Experiment-Branches `flanking-cards`/`morphing-cards`: zusätzlich `project-viewer.js` + `project-navigation.js` (Viewer: 3-Card + bottom strip).
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

- Experimente laufen über **Branches**, nie über kopierte Ordner. Branches: `master` = **live** (GitHub Pages + Default-Branch `origin/HEAD -> origin/master`, API-verifiziert), `flanking-cards`/`morphing-cards` = Experimente (beide `origin/*` verifiziert via `git ls-remote`; `material-theme` gelöscht). Live Pages-Branch wird **nur** via Nightly Audit (`GET /pages` + live `curl`) verifiziert, nicht geraten.
- **AGENTS.md ist getrackt** → nicht ignorieren. Änderungen an `AGENTS.md` werden gepusht und gelten auf allen 3 Macs.
- **Uncommitted Arbeit geht bei `git restore`/`git checkout` verloren** → vor Branch-Wechsel committen.
- Session-Start: `git fetch --all` → `git checkout master` → `git pull` → `git status` → `git log --oneline -5` → Browser-Check (`python3 -m http.server 8000` → http://localhost:8000). Vor Sleeping: `git status` clean → `git push`.
- **Multi-Branch Sync:** Betrifft ein Fix mehrere Branches (z. B. `AGENTS.md`, `themes.css`), auf allen fälligen Branches ausführen/syncen (sonst Drift) – dabei **vor jedem Wechsel ankündigen** (`Wechsle <von> → <nach>`) und am Ende zurück in den ursprünglichen Branch wechseln + `git status` melden.

# Nightly Audit 23:00 (verifiziert)

Wird **nicht geraten**, sondern verifiziert via GitHub Action (läuft auch wenn alle Macs schlafen). Definition hier, Ausführung in `.github/workflows/nightly-audit.yml`.

- **Wann:** täglich `21:00 UTC` (=23:00 MESZ, Winter 22:00 UTC → 1h Drift) + manueller `workflow_dispatch`.
- **Was verifiziert:**
  - `GET /repos/ux-paul-grossmann/portfolio/pages` → `source.branch`
  - `git ls-remote --heads origin` → `master`/`flanking-cards` Tips
  - `curl https://ux-paul-grossmann.github.io/portfolio/` → enthält `Kompetenzen &amp; Methoden` + `button#theme-toggle`
- **Wie:** `actions/checkout`, `gh api ... --jq .source.branch` mit `GITHUB_TOKEN` (auto), `git ls-remote`, `curl | grep`. Der Workflow gibt die Ergebnisse aus, aber `exit 1` erzwingt er nur bei den beiden Live-Curl-Checks (Heading + Toggle).

# Antwort-Struktur
- **Offene Punkte zuerst:** Unbekanntes steht oben, als gelöste Tatsache oder blockierende Frage, nie als Nachtrag am Ende.
- **Selbst prüfen statt fragen:** Was ich selbst prüfen kann, prüfe ich und melde das Ergebnis, statt es als Zweifel zu listen.
- **Schluss auf Vorschlag oder Aktion:** Die Nachricht endet mit dem Vorschlag oder der Aktion, kein Caveat-Anhang.
- **Kein Anhang ohne Grund:** Wenn nichts unklar ist, wird nichts angehängt.

# Beweis und Entscheidung — Gates
Jede Regel hat Auslöser, Pflicht, Nachweis. Ohne Nachweis gilt sie als verletzt. Mechanik = wo opencode erzwingt (`opencode.json` ist lokale Konfiguration, gitignoriert — pro Rechner neu anlegen).

1. **Gate Sichtprüfung** (Farb/Layout/Theme)
   Auslöser: Änderung, die visuell wirkt (`style.css`, `index.html`, `lib/js/*`).
   Pflicht: erst live zeigen, dann User-Ja abwarten, dann schreiben.
   Nachweis: Kandidat war live zu sehen; Zeile „User-Ja <Datum>".
   Mechanik: `edit` ask auf diese Dateien (siehe `opencode.json`).
2. **Gate Ein-Thema**
   Auslöser: eine Antwort.
   Pflicht: genau eine Aufgabe, kein fremdes Thema einsortieren.
   Nachweis: Antwort nennt oben die eine Aufgabe.
   Mechanik: keine, reine Disziplin.
3. **Gate Geteilte-Datei**
   Auslöser: Schreiben in versionierte Quelle.
   Pflicht: Diff zuerst, Go abwarten.
   Nachweis: Diff plus Go.
   Mechanik: `edit` ask (wie Gate 1).
4. **Gate Ausgelieferter-Stand**
   Auslöser: Behauptung „funktioniert" für `style.css`/`lib/js/*`.
   Pflicht: nach Browser Durchgang über lokalen Server prüfen.
   Nachweis: Lesung nach Reload, nicht die Annahme.
   Mechanik: keine, Nachweis Pflicht.
5. **Gate Unentschieden**
   Auslöser: offene Frage.
   Pflicht: „ich habe nicht entschieden" sagen.
   Nachweis: wörtlich im Text.
   Mechanik: keine, reine Disziplin.
6. **Gate Tool-Beweis**
   Auslöser: „erledigt/entfernt/geschrieben".
   Pflicht: zugehöriger Tool-Aufruf davor.
   Nachweis: Aufruf in derselben Antwort.
   Mechanik: keine.
7. **Gate Push**
   Auslöser: `git push`.
   Pflicht: explizites Go.
   Mechanik: `bash` ask auf `git push*` (siehe `opencode.json`).
8. **Gate Doom-Loop** (bereits vorhanden)
   opencode `doom_loop` steht per Default auf ask: derselbe Tool-Aufruf dreimal mit identischem Input löst eine Rückfrage aus. Eingebauter Rabbit-Hole Wächter, keine eigene Regel nötig.

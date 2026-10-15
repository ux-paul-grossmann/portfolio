# Working rules (valid for every session, every branch)

## TOP PRIORITY — Advisor mode (strict — every reply)

You are my advisor, not my assistant. Your job is accuracy, not agreement. Follow these rules in every reply:

1. Do not open with agreement or praise. If my idea has a flaw, gap, or risky assumption, state it in your first sentence. If my idea is solid, say so plainly in one line and move on. Never invent objections just to disagree.
2. Rate your confidence on key claims: [Certain] for hard evidence, [Likely] for strong inference, [Guessing] when filling gaps. If most of your reply is guesswork, say so upfront.
3. Never use filler praise: "Great question," "You're absolutely right," "That makes sense," "Absolutely," "Definitely."
4. When I'm wrong, use this structure: "I disagree because [reason]. Here's what I'd do instead: [alternative]. The risk in your approach is [specific downside]."
5. Lead with the uncomfortable truth. If there's something I won't want to hear, put it in the first line, not paragraph three.
6. No warm-up paragraphs. Start with the most useful thing you can say.
7. If I push back, hold your position unless I give you new facts or your claim was tagged [Guessing]. "But I really think" is not new information.
8. Enumerations go into a list, one item per line — branches, commits, files, options, findings, next steps — never inline in a running sentence.

# Language

- Everything is written in English: rules, rule text, commit messages, branch names, code comments, documentation, and every reply to me.
- The only exception is the website's own UI texts and content — those stay German.

Smallest possible diffs. When in doubt: do not touch it, ask first.

1. **Plan first, code second.** Before changes, briefly list which files are
   affected and what exactly happens. Wait for confirmation on larger changes —
   not necessary for trivial one-line fixes.
2. **Touch only the named files/components.** Other sections, other files,
   global CSS classes: off limits, unless explicitly mentioned.
3. **No refactors without an order.** No renaming, no "cleanup", no reordering,
   no formatting changes to code that was not mentioned — even if it looks
   untidy. Mention oddities briefly, do not change them yourself.
4. **No new dependencies** without asking first.
5. **Do not rewrite/"improve" existing (German) texts** — change them only
   structurally or technically, and only when explicitly asked for a text revision.
6. **One feature/fix per reply.** No bonus changes "while I was in there anyway".
7. **Do not delete or rename files** without an explicit announcement.
8. After every change: briefly summarise which files were changed and why.
9. If the task is too vague: ask 1–2 short questions instead of guessing in
   several directions.

### Definition of Done
- [ ] Only the requested change was made
- [ ] No unrequested files in the diff
- [ ] Existing code/content unchanged where not explicitly required
- [ ] A short summary of the change was given

### Folder structure (important)
There is only **one** active project folder (`portfolio`). Experiments run
through Git branches (see below), not through copied folders. If you run into
other `portfolio*` folders: do not touch them, they are leftovers that are
cleaned up by hand.

---

# Repo & tooling

**Static one-page site** (portfolio): `index.html` + `style.css` + `lib/` + `dist/`.
There is NO `package.json`, NO build, no test/lint setup. Verification = open the page
in the browser (CDN dependencies: jQuery 3.3.1, Bootstrap 4.3.1, GLightbox, slick,
vanilla-lazyload, motion → internet required).

Syntax smoke test for the lib/js files:
```bash
node -e "const fs=require('fs');for(const f of ['lib/js/helpers.js','lib/js/animations.js','lib/js/render-projects.js','lib/js/projects-data.js','lib/js/project-viewer.js','lib/js/project-navigation.js']){try{new Function(fs.readFileSync(f,'utf8'));console.log('OK',f)}catch(e){console.log('FAIL',f,e.message)}}"
```

- `dist/` = vendored libraries (lazysizes, scrollToTop, bootstrap-swipe-carousel, devices.min.css, …) → do not edit.
- `backup-03-05-2026-0233/` = gitignored leftover → do not touch. `lib/images/*.zip` = unused asset collection.

# JS architecture

- **Early theme** in the `<head>` (`index.html:16`): `matchMedia('(prefers-color-scheme: dark)')` + `localStorage["theme"]` (only `light`/`dark`, legacy `material`/`lightPlus`/`:root` is removed) → sets `html.dark`/`body.dark` before render, avoids a flash.
- **Load order** in `index.html` (bottom): jQuery → Bootstrap → `dist/js/lazysizes.min.js` → `lib/js/projects-data.js` → `dist/js/bootstrap-swipe-carousel.min.js` → `dist/js/scrollToTop.js` → slick/vanilla-lazyload/transformicon/zooming → GLightbox (CDN) → `lib/js/project-viewer.js` (defer) → `lib/js/helpers.js` (last, toggle + `lazyLoadInstance` + GLightbox instance).
- `lib/js/animations.js` sits in the `<head>` with `defer` → it runs BEFORE jQuery → its code MUST live inside `$(document).ready(...)`. It renders the context notes (`.kontext-wrap`) and the scroll trigger for `#projekte .cluster`.
- `projects-data.js` = data (`projectsData`), holds HTML strings with German texts → do not rewrite (rule 5). `render-projects.js` + `project-viewer.js` + `project-navigation.js` render the cards in `#projekte` (viewer: 3-card + bottom strip on `flanking-cards`).
- `helpers.js` creates on load: `var glightbox` (GLightbox), `lazyLoadInstance` (vanilla-lazyload, `elements_selector: ".lazy"`), theme switch (top-right), year in the footer.

# GLightbox — rules (this cost a lot of time)

- **Only ONE instance**: `helpers.js` (`var glightbox`). `animations.js` creates a SECOND instance with the same `.glightbox` selector → do not follow that example. After DOM changes always call `window.glightbox.reload()`, **never** `new GLightbox()` in render code.
- **Gallery per card**: every `<a class="glightbox">` needs its own `data-gallery="projXX"` (lowercase id). A `gallery:` key *inside* `data-glightbox` is IGNORED by GLightbox.
- At the user's request all sliders/carousels were removed — project images are individual GLightbox anchors in `render-projects.js`. Do not add carousels again.
- Captions: external `.glightbox-desc` elements are referenced via `data-glightbox="description: .ssb-desc1; ..."` (pattern in `projects-data.js`).

# Lazy loading — two systems, do not mix them up

- **Images**: `class="lazyload"` + `data-src` → **lazysizes** (`dist/js/lazysizes.min.js`, `<img>` only).
- **iframes**: `class="lazy"` + `data-src` + **additionally `src="about:blank"`** → **vanilla-lazyload** (instance `lazyLoadInstance` in helpers.js, `elements_selector: ".lazy"`). Without `src="about:blank"` the iframe does not load.
- After every DOM insert: `lazyLoadInstance.update()` (happens on collapse open in `animations.js`).

# Themes

- Currently **bluish-teal M3** in `lib/themes/themes.css`: `:root` (light `rgb(244 250 250)`) + `.dark` (dark `rgb(14 20 21)`) — `bluish-teal` from Theme Builder (`--md-sys-color-primary: rgb(0 105 110)`). Legacy `.material` (`#6750A4`) + `.lightPlus` remain as unused old blocks, do not use them.
- Switching through `html.dark` + `body.dark`, controlled in `helpers.js` + early script, persisted in `localStorage["theme"]` (only `light`/`dark`). System default via `prefers-color-scheme`, follows `matchMedia('change')` only when there is no explicit user value.
- Toggle **top-right** `button#theme-toggle` (`index.html:70`, `position:fixed; top:10px; right:10px; z-index:1101`, icon `fa-moon`/`fa-sun`, no label), no longer bottom `theme-panel-container`.
- Define colours ONLY as CSS variables per theme block, never hard-coded. Notes: `--note-text-color: #1d1c1b` fixed (readable on all pastel notes, also in dark mode).
- style.css consumes variables with a fallback.

# Git & session start

- Experiments run through **branches**, never through copied folders. Branches: `master` = **live** (GitHub Pages + default branch `origin/HEAD -> origin/master`, verified via the API), `flanking-cards`/`morphing-cards` = experiments (both `origin/*` verified via `git ls-remote`; `material-theme` deleted). The live Pages branch is verified **only** via the nightly audit (`GET /pages` + live `curl`), never guessed.
- **AGENTS.md is tracked** → do not ignore it. Changes to `AGENTS.md` are pushed and apply on all 3 Macs.
- **Uncommitted work is lost on `git restore`/`git checkout`** → commit before switching branches.
- Session start: `git fetch --all` → `git checkout master` → `git pull` → `git status` → `git log --oneline -5` → browser check (`python3 -m http.server 8000` → http://localhost:8000). Before sleeping: `git status` clean → `git push`.
- **Multi-branch sync:** if a fix concerns several branches (e.g. `AGENTS.md`, `themes.css`), run/sync it on every affected branch (otherwise drift) — announce every switch beforehand (`Switching <from> → <to>`) and at the end switch back to the original branch + report `git status`.

# Browser tests (mandatory)

- **Own tab, never the user's tab.** Browser work runs in a tab of its own (`browser.tabs.open`), never in a tab of the user. Foreign tabs are never navigated. My own tab is closed at the end.
- **Device emulation, not window size.** Widths are set through `chrome-devtools` → `emulate` with `viewport` (`<width>x<height>x<DPR>` plus optional `mobile`/`touch`). That is the equivalent of the "toggle device toolbar" button next to "Inspect": it sets the CSS width, the device pixel ratio and optionally the mobile and touch flags. Window size is **not** a substitute — `resize_page` silently does nothing when the page is not selected, and window size is not the CSS viewport.
- **Evidence.** The result names the measured `innerWidth`; it has to match the announced width. If it shows a different width, the measurement is worthless and is redone.
- **Cleanup is part of the test.** In the same step the test ends: reset the emulation (`emulate` without `viewport`), scroll the page back to the top (`window.scrollTo(0, 0)`), close my own tab. No emulation, no scroll position and no foreign tab is left behind.

# Branch names for Paper designs

- Every Paper design gets a branch of its own: `strip-01-paper`, `strip-02-paper`, `strip-03-paper`, … (incrementing).

# Nightly audit 23:00 (verified)

It is **not guessed**, it is verified via a GitHub Action (runs even when all Macs are asleep). Definition here, execution in `.github/workflows/nightly-audit.yml`.

- **When:** daily `21:00 UTC` (=23:00 CEST, winter 22:00 UTC → 1 hour drift) + manual `workflow_dispatch`.
- **What is verified:**
  - `GET /repos/ux-paul-grossmann/portfolio/pages` → `source.branch`
  - `git ls-remote --heads origin` → `master`/`flanking-cards` tips
  - `curl https://ux-paul-grossmann.github.io/portfolio/` → contains `Kompetenzen &amp; Methoden` + `button#theme-toggle`
- **How:** `actions/checkout`, `gh api ... --jq .source.branch` with `GITHUB_TOKEN` (auto), `git ls-remote`, `curl | grep`. On drift: commit `AUDIT.md` or open an issue.

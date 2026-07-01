# Session Context — Portfolio Projekte

## Project Goal
Restore and branch the Projekte section of a portfolio site for parallel experimentation with two navigation concepts.

## Branches

| Branch | Description | Status |
|---|---|---|
| `master` | Original committed version | untouched |
| `morphing-cards` | Project navigation with morphing-card transitions using `project-navigation.js` | committed |
| `flanking-cards` | Horizontal 3-card project viewer using `project-viewer.js` | committed |

## Current Branch
`flanking-cards`

## Key Files

### Shared
- `lib/js/projects-data.js` — contains `projectsData` and `projectHierarchy` (used by both nav systems)
- `lib/js/render-projects.js` — not loaded in either branch
- `lib/js/helpers.js` — initializes GLightbox (`var glightbox`), lazyLoadInstance, scroll-to-top behavior; loaded globally

### morphing-cards
- `lib/js/project-navigation.js` — the morphing-card nav JS (tracked/committed)
- `index.html` loads `<script src="./lib/js/project-navigation.js" defer>` (NOT `render-projects.js`)
- `style.css` has the morphing-card CSS (~138 lines), starting at the end of the file

### flanking-cards
- `lib/js/project-viewer.js` — the 3-card horizontal viewer JS (tracked/committed)
- `index.html` loads `<script src="./lib/js/project-viewer.js" defer>` (NOT `render-projects.js`)
- `index.html` also loads Plyr CSS/JS preemptively (for glightbox video autoplay)
- `style.css` has the viewer CSS appended at the end

## Switching Between Experiments
```bash
git checkout morphing-cards   # original morphing-card nav
git checkout flanking-cards   # 3-card horizontal viewer
```

## Git Workflow Notes
- `git restore` earlier wiped all uncommitted changes. The morphing-card CSS was recovered from conversation context. Everything else is now properly committed.
- `project-navigation.js` was previously untracked; now tracked in the `morphing-cards` commit.

---

## Session 2 — Refinements (May 31, 2026)

### What Was Done

#### 1. Smart Search Bar Content Reordering (Proj01)
- In `project-viewer.js` `buildDetail()`: for Proj01 only, the MVP demo video section, "Meine Leistung im Team" and "Erreichte Ziele" render **right after the title**, instead of at the bottom.
- The duplicate achievements/goals at the bottom are skipped for Proj01 via `p.id !== 'Proj01'` guard.

#### 2. Scrolltop Button Position Fix
- `style.css` line 2249 had an old `.scrolltop` rule with `bottom: 0; width: 100%` that overrode the updated `top: 10px; right: 10px` rule (both inside the same `@media only screen and (min-width: 576px)` query).
- Fixed by replacing the old rule with the same top-right positioning.

#### 3. Glightbox Video Autoplay
**Problem:** Video thumbnails opened the lightbox but required manual play button click.

**Root causes & fixes:**
- `autoplayVideos: true` was missing at the top level of GLightbox options in `helpers.js` (was only inside a nonexistent `config` object). **Fix:** Added `autoplayVideos: true` at the top level.
- `muted: true` was at top-level `config` but GLightbox expects it under `plyr.config` (Plyr player config). **Fix:** Moved to `plyr: { config: { muted: true, ratio: '16:9' } }`.
- `project-viewer.js` was creating a *second* GLightbox instance with the same selector, overwriting the properly configured one from `helpers.js`. **Fix:** Replaced both GLightbox constructor calls in `project-viewer.js` with `window.glightbox.reload()` to refresh the existing instance.
- **Race condition:** On first video click, Plyr.js (the video player library) hadn't loaded yet from CDN, so by the time the slide animation completed, no player existed for `slidePlayerPlay` to call `play()` on. **Fix:** Preloaded Plyr CSS (`<link>`) and JS (`<script>`) in `index.html` before `helpers.js` runs, so `injectAssets()` finds them in the DOM and calls the Plyr callback immediately.

#### 4. Center Card Max-Width Constrained to Container (Desktop)
- `.pv-row` now uses `justify-content: center` so the three cards stay balanced.
- At ≥992px: `.pv-active` has `max-width: 960px` (matching Bootstrap container).
- At ≥1200px: `.pv-active` has `max-width: 1140px`.
- Flanking cards remain at `flex: 0 0 15%` — they sit outside the container area on wide screens.
- On screens where the available space is already ≤ container width, the max-width has no effect.

#### 5. Viewer Architecture (Earlier Session, Reconfirmed)
- Three cards unified height via `align-items: stretch` on `.pv-row` — no yoyo on content swap.
- Mobile (≤991px): flanking cards hidden, sticky horizontal project strip with scroll-snap thumbnails.
- Image slider carousel negative margins overridden inside `.pv-detail-wrap`.
- `lazyLoadInstance.update()` called after each render to trigger iframe lazy loading.
- Direct `innerHTML` replacement for all slots (no animation transitions).
- GLightbox `reload()` called instead of creating new instances.
- Scroll-to-top at `top: 10px; right: 10px`, shrink-wrapped hitbox.

### Known Issues / Open Items
- None currently reported.

### Next Session Start
1. Read this file.
2. Check `git status` and `git log --oneline -5` for current branch state.
3. Verify the viewer renders correctly by checking `index.html` in a browser.
4. If any new feature or fix is requested, review the relevant JS/CSS files above.

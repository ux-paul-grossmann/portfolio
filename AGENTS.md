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
`flanking-cards` (was switched from `morphing-cards` at end of session)

## Key Files

### Shared
- `lib/js/projects-data.js` — contains `projectsData` and `projectHierarchy` (used by both nav systems)
- `lib/js/render-projects.js` — has `renderAllProjects` commented out; not loaded in either branch

### morphing-cards
- `lib/js/project-navigation.js` — the morphing-card nav JS (tracked/committed)
- `index.html` loads `<script src="./lib/js/project-navigation.js" defer>` (NOT `render-projects.js`)
- `style.css` has the morphing-card CSS (~138 lines), starting at the end of the file

### flanking-cards
- `lib/js/project-viewer.js` — the 3-card horizontal viewer JS (tracked/committed)
- `index.html` loads `<script src="./lib/js/project-viewer.js" defer>` (NOT `render-projects.js`)
- `style.css` has the viewer CSS appended at the end

## Switching Between Experiments
```bash
git checkout morphing-cards   # original morphing-card nav
git checkout flanking-cards   # 3-card horizontal viewer
```

## Git Workflow Notes
- `git restore` earlier wiped all uncommitted changes. The morphing-card CSS was recovered from conversation context. Everything else is now properly committed.
- `project-navigation.js` was previously untracked; now tracked in the `morphing-cards` commit.

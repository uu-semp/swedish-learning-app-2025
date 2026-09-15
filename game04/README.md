
# Game 04 · Ett år i Uppsala 🇸🇪

A calendar-based Swedish learning game: the player moves through a year in Uppsala,
practising weekdays, months, dates, seasons and weather through mixed question types
(multiple choice, click-the-days, drag-to-order, calendar picks).

This is the team's second design iteration and intentionally replaces the earlier
clock/time-telling prototype.

## 🚀 Tech Stack

* **Framework**: React 19 + TypeScript
* **Build tool**: Vite 6
* **Styling**: Tailwind CSS v4

The site as a whole still has to be a static, buildless deployment (see the repo's root
[README](../README.md)) — this game just uses a build step *during development* and
commits its compiled output, so the shared menu can load `game04/index.html` exactly as
it always has.

## 📂 Folder Structure

```
game04/
├── index.html          # BUILT output — loaded directly by the site menu's iframe
├── assets/              # BUILT output — JS/CSS/images, do not hand-edit
├── README.md            # this file (kept across builds)
└── _source/              # actual source code — edit here
    ├── package.json
    ├── vite.config.ts
    ├── index.html         # Vite HTML template
    └── src/
        ├── main.tsx
        ├── App.tsx        # all game screens/logic live here
        ├── index.css
        └── assets/seasons/  # season placeholder photos
```

`index.html` and `assets/` at the top of `game04/` are **generated** — every `npm run
build` inside `_source/` wipes and regenerates them. Don't edit them directly.

## 🏁 Developing

```bash
cd game04/_source
npm install
npm run dev        # Vite dev server with hot reload, standalone (not inside the site menu)
```

## 📦 Building / deploying your changes

```bash
cd game04/_source
npm run build       # vite build, then copies dist/ up into game04/
```

After that, `game04/index.html` is up to date and you can verify it the same way the
site menu does: serve the *repo root* (`python3 -m http.server 8000` per the root
README) and open the game from the home screen, rather than opening `game04/index.html`
directly — some things (like the shared save API below) only work when it's loaded that
way.

## 💾 Progress saving

Uses the shared `window.save` API ([../scripts/SAVE.MD](../scripts/SAVE.MD)), keyed as
`"game04"`. Completing a full year records a win and 100% completion via
`save.stats.incrementWin` / `save.stats.setCompletion`.

This game doesn't use the shared `window.vocabulary`/`words.csv` system — its Swedish
content (weekdays, months, seasons, weather phrases) is self-contained in `App.tsx`,
scoped to Basic Swedish 1 level.

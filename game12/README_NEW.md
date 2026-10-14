# Game 12 – Hitta rätt hus

(This readme is temporarily created by AI)

*"Find the right house"* is one of the mini-games in the shared Swedish learning app. The player reads a Swedish sentence (e.g. `"Jag bor på Ringgatan 4."` – "I live at Ringgatan 4") and must click the house on a street map that matches the address. Each sentence uses vocabulary from the streets of Uppsala.

The game follows a **Model–View–Controller (MVC)** structure and is built with plain HTML/CSS/JavaScript, using [Vue 3](https://vuejs.org/) (loaded via an import map) for the reactive game screen.

## Getting started

This game is a static website and part of the main app in the repository root. To run it locally, serve the repository root and open the game:

```bash
# from the repository root
python3 -m http.server 8000
```

Then open <http://localhost:8000/index.html>.

`index.html` only redirects to `view/menu/index.html`, since the shared project menu links directly to `game12/index.html`.

## How the game works

1. **Menu** (`view/menu/`) – the player picks a difficulty:
   - **1 – Adresser och nummer**: find the house matching a street address.
   - **2 – Riktningar**: find the house relative to a landmark ("to the left of the cathedral").
   - **3 – Färdsätt**: same as 2, but the sentence describes how the player travels ("I bike to...").
2. **Game** (`view/game/`) – the player answers a round of 10 questions by clicking houses on a generated street board. Clickable words in the prompt can be translated individually, and a hint button shows the full English sentence. Using either counts as a hint.
3. **Repetition** – questions answered incorrectly (or answered with a hint) are re-queued until they are answered correctly without help.
4. **End screen** (`view/end_screen/`) – completion screen with options to play again or return to the menu.
5. **Progress** (`view/progress/`) – shows which stages are completed, saved through the shared `scripts/save.js` API under the key `game12`.

## Project structure

```
game12/
├── index.html                  # Redirect to the menu (shared project menu entry point)
├── controller/
│   └── game_controller.js      # Ties the views to the model; wraps game state in a Vue reactive object
├── model/
│   └── services/
│       ├── game_manager.js     # Game state machine: rounds, answer checking, hints, repetition, saving progress
│       ├── question_generator.js  # Builds Swedish/English question prompts (difficulty 1–3)
│       └── board_generator.js  # Generates the street board (T-crossing or horizontal road) with house numbers
├── view/                       # One folder per screen, each with .html + .css + .js
│   ├── menu/                   # Difficulty selection with speech-bubble animation
│   ├── game/                   # Vue app: board, clickable words, progress bar, hint, feedback
│   ├── progress/               # Stage completion overview (reads from scripts/save.js)
│   └── end_screen/             # "Bra jobbat!" screen after finishing a round
└── images/                     # Art assets used by the views
    ├── Difficulty 1/           # Roads/crossroads
    ├── Difficulty 2/           # Uppsala landmark sprites (cathedral, castle, concert hall)
    ├── Difficulty 3/           # Vehicles (car, bike, school bus)
    └── Licenses/               # Attribution/license files for the assets
```

### Data flow (MVC)

```
view/game/game_view.js          controller/game_controller.js      model/services/
─────────────────────           ──────────────────────────         ─────────────────
GameController(difficulty) ───► Initialize(difficulty) ────────► board_generator + question_generator + game_manager
      │                                │
      │        reactive game ◄─────────┘
      ▼
renders board/questions,          SelectHouse(), toggleTranslation(),
watches is_finished               UseHint(), StopGame()
```

- The **model** holds no knowledge of the DOM. `game_manager.js` owns the single `game` state object, and `board_generator.js` / `question_generator.js` build the content for each round.
- The **controller** exposes the model as a Vue `reactive()` object plus a handful of actions (`NextRound`, `CheckAnswer`, `UseHint`, `StopGame`).
- The **views** only read from the reactive `game` object and call controller actions; navigation between screens happens with plain links and URL parameters (e.g. `game.html?difficulty=1`).

### External dependencies

- **Vue 3** is loaded from a CDN through an `importmap` in `view/game/game.html` (the only screen that uses Vue).
- **Shared scripts** (`../../../scripts/`) provide saving (`save.js`, exposed as `window.save`) and the shared vocabulary (`vocabulary_await.js`), so all games in the app store progress and words the same way.
- Street names, house-number ranges, landmarks, directions, and transport phrases are defined in `game_manager.js` / `question_generator.js`; shared vocabulary is fetched via `get_vocab()`.

## Implementation status

- **Difficulty 1** is fully playable end to end.
- **Difficulties 2 and 3** are present in the menu and in the generator stubs, but are not yet wired up (see the commented-out number ranges in `game_manager.js` and the TODO-style notes in `question_generator.js`).

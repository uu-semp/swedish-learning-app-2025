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

## Exercise types

Every question is a `Question` object (see the interface at the top of `_source/src/App.tsx`).
Its `type` field decides which component renders it and how the answer is checked.

| `type` | Component | What the player does | Correct when |
| --- | --- | --- | --- |
| `weekday-mc`, `month-mc`, `grammar-mc` | `MCQuestion` | Picks one option (e.g. "Vilken dag kommer efter onsdag?") | Chosen option equals `answer` |
| `season-mc` | `SeasonMCQuestion` | Sees a season photo and picks the season | Chosen option equals `answer` |
| `weather-mc` | `WeatherMCQuestion` | Sees a weather photo and picks the matching phrase | Chosen option equals `answer` |
| `weekday-click` | `WeekdayClickQuestion` | Reads a sentence and clicks the weekdays it refers to | Selected set equals `correctDays` |
| `weekday-order`, `month-order` | `OrderQuestion` | Clicks words into the correct sequence | Every position matches `correct` |
| `date-calendar` | `DateCalendarQuestion` | Clicks the spoken date (e.g. "den sextonde april") on a calendar | Clicked day equals `targetDate` |

Two modes use these types:

* **Play** (`Spela`): 12 months x 3 questions. Each month draws 3 random questions from `QUESTIONS` + `EXTRA_QUESTIONS` for that month.
* **Practice** (`Öva`): four topics (weekdays, months & dates, seasons, weather) with five fixed questions each, from `PRACTICE_QUESTIONS`.

## Requirements status

**Summary: 14 of 21 requirements are DONE, 7 are NOT DONE.**

### Player requirements

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| REQ-PLAYER1 | As a player, I want to identify weekdays so that I can practice the names of the days of the week. | **DONE** | Multiple choice, click-the-days and order questions, in both Play and Practice. |
| REQ-PLAYER2 | As a player, I want to identify months so that I can practice the names of the months. | **DONE** | Before/after multiple choice and month ordering. |
| REQ-PLAYER3 | As a player, I want to identify seasons so that I can practice the names of the seasons. | **DONE** | `season-mc` shows a season photo. Seasons also appear as month-to-season questions and "which season fits this weather" questions. |
| REQ-PLAYER4 | As a player, I want to identify dates on a calendar so that I can practice using weekdays, months, and dates. | **DONE** | `date-calendar` asks the player to click a spoken date on a month grid. Limitation: only three dates (2nd, 16th, 25th) and the calendar is fixed to 2025. |
| REQ-PLAYER5 | As a player, I want to identify weather phrases so that I can practice vocabulary related to weather. | **DONE** | `weather-mc` pairs photos with phrases (snöar, regnar, soligt, mulet, molnigt, blåser, åskar/blixtrar). `grammar-mc` tests sentence form ("Det är soligt." vs "Det soligt."). |
| REQ-PLAYER6 | As a player, I want to receive feedback on my answers so that I can learn whether my answers are correct. | **DONE** | Feedback bar shows "Rätt!" or "Fel svar." plus the correct answer. Options, days and calendar cells are coloured green/red; missed days are yellow. |
| REQ-PLAYER7 | As a player, I want the game to provide different exercises related to the calendar so that I can practice the vocabulary in different ways. | **DONE** | Six exercise formats across Play and Practice (see Exercise types). |
| REQ-PLAYER8 | As a player, I want incorrect answers to be repeated in later exercises so that I can practice words I have difficulty remembering without being punished for mistakes. | **NOT DONE** | A wrong answer only skips the point and the game moves on. Missed questions are not tracked or re-queued. (The "not punished" part is met: there are no lives or penalties.) |
| REQ-PLAYER9 | As a player, I want the difficulty of the exercises to increase as I improve so that I can continue learning at an appropriate level. | **NOT DONE** | Questions are drawn randomly per month and Practice uses a fixed set. Nothing measures progress or changes difficulty. |
| REQ-PLAYER10 | As a player, I want to be able to enter Swedish special characters such as å, ä, and ö so that I can correctly spell Swedish words even when my keyboard does not contain these characters. | **NOT DONE** | The game has no typed input, so there is no å/ä/ö entry (no on-screen special-character buttons). |
| REQ-PLAYER11 | As a player, I want the game to accept only correct Swedish spelling where spelling is part of the exercise so that I can learn to write Swedish correctly. | **NOT DONE** | Spelling is never typed or checked; the player only picks from correctly spelled options. Revisit together with REQ-PLAYER10. |

### Teacher requirements

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| REQ-TEACHER1 | As a teacher, I want the game to include relevant vocabulary from the teaching resources for Basic Swedish 1 so that the game supports the course learning objectives. | **DONE** | Content is scoped to Basic Swedish 1 topics. Not yet checked word by word against the teaching resources; a teacher should review it. |
| REQ-TEACHER2 | As a teacher, I want the game to use correct Swedish words and spelling so that students practice accurate Swedish. | **DONE** | Question bank was read through for spelling and grammar and no errors were found. Not yet verified by a teacher. |
| REQ-TEACHER3 | As a teacher, I want the game to cover vocabulary related to weather, seasons, and calendars so that students can practice the topics included in the game. | **DONE** | Weather, seasons and calendar vocabulary are covered, with hover translations for key words. |
| REQ-TEACHER4 | As a teacher, I want the difficulty of the exercises to be adjustable or progressive so that students can continue learning as their Swedish improves. | **NOT DONE** | No difficulty setting and no progression (same gap as REQ-PLAYER9). |
| REQ-TEACHER5 | As a teacher, I want students to receive feedback and repeat difficult vocabulary so that the game supports continued learning and vocabulary retention. | **NOT DONE** | Feedback exists, but difficult vocabulary is not repeated (same gap as REQ-PLAYER8). In Practice the player can only retry a whole topic manually. |

### Developer requirements

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| REQ-DEV1 | As a developer, I want the requirements for each exercise to be clearly defined so that I can implement the intended functionality correctly. | **DONE** | Each exercise type and its correctness rule is defined in the Exercise types table. |
| REQ-DEV2 | As a developer, I want the game content to be structured so that vocabulary and exercises can be updated when the teaching resources change. | **DONE** | Content is plain data arrays (`WEEKDAYS`, `MONTHS_FULL`, `QUESTIONS`, `EXTRA_QUESTIONS`, `PRACTICE_QUESTIONS`, `TRANSLATIONS`). Limitations: it lives inside `App.tsx`, some questions are duplicated between `QUESTIONS` and `PRACTICE_QUESTIONS`, and hover translations are added by hand. |
| REQ-DEV3 | As a developer, I want the project to include a README file describing the project and how to develop and maintain it so that future developers can understand and continue the project. | **DONE** | This README covers description, tech stack, folder structure, development, build/deploy and progress saving. |
| REQ-DEV4 | As a developer, I want the project to include appropriate copyright and attribution information so that the sources and ownership of the game content and other materials are clear. | **DONE** | The photos in `_source/src/assets/seasons/` have a recorded source, author or licence, and there is a attribution notice. |
| REQ-DEV5 | As a developer, I want the game to have a consistent structure for its exercises so that new exercises and content can be added efficiently. | **DONE** | All questions share one `Question` model and one `FeedbackBar`. Limitation: a new exercise type means editing three places (`GameScreen`, `renderPracticeQuestion`, and the answer handlers in `App` and `PracticeScreen`). |

### Not done: suggested next steps (in order of impact)

| Priority | Requirements | What to do |
| --- | --- | --- |
| 1 | REQ-PLAYER8, REQ-TEACHER5 | Keep a list of missed questions during a run and re-insert them later (e.g. a final review round) without reducing the score. |
| 2 | REQ-DEV4 | Record the source and licence of every image and add an attribution section. |
| 3 | REQ-PLAYER9, REQ-TEACHER4 | Add a simple progression (easy to hard tiers unlocked by accuracy) or a teacher-selectable level. |
| 4 | REQ-PLAYER10, REQ-PLAYER11 | Add a typed-answer exercise with å/ä/ö buttons and exact-spelling checking. |
| 5 | REQ-TEACHER1, REQ-TEACHER2 | Have a teacher review the vocabulary against the course material (marked DONE above, but unverified). |

## Ideas for the next group (from user testing)

These ideas came out of our user testing. They are not implemented yet. The "Where to start" column points at the code that would need to change.

| Idea | Why it helps | Where to start | Related requirements |
| --- | --- | --- | --- |
| More random and different questions | Each month currently draws only 3 questions from a small bank, so repeat plays feel the same. More question templates and more randomisation would keep replays fresh. | Add more entries to `QUESTIONS` / `EXTRA_QUESTIONS`, or generate more questions from templates like the ones already in `EXTRA_QUESTIONS`. `randomizeDateQuestion` only picks from three dates (2nd, 16th, 25th), so widen that list. | REQ-PLAYER7 |
| Adding years | The calendar question is fixed to 2025 and the game never asks about years. Years would let players practise saying and reading full dates. | `getMonthCalendar` and `DateCalendarQuestion` hardcode 2025. Make the year a parameter on the `Question` and add a question type for full dates. | REQ-PLAYER4 |
| Adding difficulty levels | Players who find the game too easy or too hard have no way to adjust it. Levels could be chosen on the home screen or unlocked by accuracy. | Add a `level` field to the `Question` interface, tag existing questions, and filter in `createGameQuestions` and `PRACTICE_QUESTIONS`. | REQ-PLAYER9, REQ-TEACHER4 |
| More random words | Vocabulary is limited to weekdays, months, seasons and a handful of weather phrases. More words would give more variety and cover more of the course. | Extend `TRANSLATIONS` and the question bank. Some words (e.g. varmt, kallt) are already in `TRANSLATIONS` but rarely used in questions. Check any new words against the Basic Swedish 1 teaching resources. | REQ-TEACHER1, REQ-DEV2 |

Notes for whoever picks these up:

* Adding levels and tracking missed questions (REQ-PLAYER8) both need per-question data, so it makes sense to design them together.
* New words and questions should be reviewed by a teacher before release (REQ-TEACHER1, REQ-TEACHER2).


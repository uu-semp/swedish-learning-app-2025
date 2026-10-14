# Game 06 – Tick-Tock Time (*Klockkul*)

An interactive web-based mini-game designed to help learners master telling time in Swedish. Part of the Uppsala University Swedish Learning App (Chapter 1.10 – *Time to play!*).

---

## Overview

Telling time in Swedish involves unique phrasing, particularly around the half-hour (e.g., *fem i halv*, *halv*, *fem över halv*). **Tick-Tock Time** reinforces these concepts through three progressive game modes combining visual clock reading, hands-on clock manipulation, and phrase building.

---

## Game Modes

- ** Easy (Lätt):** Read the analog clock and select the matching Swedish time phrase from multiple-choice options.
- ** Intermediate (Mellan – Set the Clock):** Read a Swedish phrase (e.g., *"Klockan är kvart över tre"*) and drag the analog clock hands (or use arrow keys) to set the matching time. Hands automatically snap to 5-minute intervals.
- ** Advanced (Svår – Word Blocks):** A fast-paced 30-second timed challenge where players assemble Swedish time expressions by arranging clickable word tiles into slots.

---

## Key Features

- **Dynamic Question Generator:** Procedurally generates natural Swedish time expressions for 5-minute increments across 12-hour cycles.
- **Train on Failed Questions:** Option to replay and practice only the questions answered incorrectly during a session. Does not work on intermediate due to bug.
- **Progress & Mastery Tracking:** Persists attempt counts, wrong answers, and question mastery via the `Save API`.
- **Accessible & Responsive:** Full keyboard navigation support (use "shift" and arrow keys for clock hands), and touch support.
- **Instant Feedback & Scoring:** Real-time feedback on answers with a final score summary and replay options.

---

## D2 User Stories and Completion Status

The following list includes all ten user stories from **D2 - Group 5, section 4 (User requirements)**, including the developer and teacher stories. Status reflects the current implementation as reviewed on 2026-10-14. **Completed** means the requested feature is implemented; **Open (partial)** means some functionality exists but work remains; **Open** means the requested functionality is missing. These statuses are based on source inspection, not full browser or client acceptance testing.

| ID | User story from D2 | Status | Implementation / remaining work |
| --- | --- | --- | --- |
| USER1 | The user shall only be given one correct alternative in multiple-choice questions, to avoid confusion. | **Completed** | Easy mode generates one correct Swedish time phrase and three distinct incorrect alternatives. |
| USER2 | The user shall have a set time limit for answering Advanced questions, to add difficulty and incentive. | **Open (partial)** | Advanced has a 30-second timer per question and timeout feedback. Submission still needs a deadline check so an answer cannot be accepted after expiry but before the timer callback runs. |
| USER3 | The user shall be able to drag a clock's minute and hour hands to display the time of a question in Swedish. | **Completed** | Intermediate displays a Swedish time phrase and lets the player drag both hands, then checks the selected time. Keyboard controls are also available. |
| USER4 | The user shall recognise Swedish words and/or phrases to improve reading comprehension. | **Completed** | Easy asks players to recognise the correct phrase; Intermediate asks them to read a phrase and set the clock; Advanced uses Swedish word blocks. |
| USER5 | The user shall see a clockface and write the correct time phrase without premade options, to practise writing times. | **Open** | The available modes use multiple-choice answers, clock hands, or premade word blocks. The hidden text-input markup is not an available free-text game mode. |
| USER6 | The user shall be able to replay previously incorrect questions with slight modifications, to target difficult subjects. | **Open (partial)** | Easy and Advanced offer **Train on failed questions**, generating related time questions. Intermediate has no working failed-question practice route. Practice queue deduplication and consistent question identities also need work; see [BUGS.md](BUGS.md). |
| DEV1 | The future developer shall have a clear, up-to-date README with instructions for setting up, running, and extending the game. | **Open (partial)** | This README describes the modes, features, structure, and D2 status. Explicit setup/run instructions and guidance for adding questions or levels are still missing. |
| DEV2 | The future developer shall have a clearly structured codebase with relevant comments and documentation, to understand the implementation without reverse engineering it. | **Completed** | Controllers, clock components, question generation/loading, progress utilities, and styles are separated into files with responsibility and function comments. The structure is documented below. |
| TEACH1 | The game should offer different difficulty levels so students with different Swedish proficiency and learning abilities can practise at an appropriate level. | **Completed** | Easy, Intermediate, and Advanced are available from the level-selection screen, with different exercise types. |
| TEACH2 | The game should have simple, intuitive rules so students can quickly understand how to play with minimal teacher explanation. | **Completed** | Level descriptions explain each exercise, and the clock and word-block modes provide on-screen control instructions. Whether students need further explanation should be confirmed through teacher/student feedback. |

---

## Project Structure

```
game06/
├── index.html              # Main HTML markup and view containers
├── index.js                # Core controller: view switching, Easy & Advanced modes
├── clock_mode.js           # Controller for Intermediate (Set the Clock) mode
├── components/
│   ├── clock.html / .js    # Analog clock display component
│   └── setting-clock.js    # Interactive draggable clock component
├── utils/
│   ├── clock_questions.js  # Swedish time phrase generation and time verification
│   ├── progress_utils.js   # Session management and progress tracking
│   └── question_utils.js   # Question dataset loader and normalization
└── styles/                 # Modular CSS stylesheets (intro, level, game, summary)
```

---


- **Storage:** The Save API.

- **Bugs:** The Train on Failed Questions Feature doesn't work on the intermediate level.

- **General Tips:** If you're using Chrome, ctr+r doesn't always work to refresh the code. Use Edge or the built in browser in vscode instead. 
Start with refactor the current code and make it more modular.

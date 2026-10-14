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
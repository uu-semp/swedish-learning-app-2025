# Game 15: Var bor jag?

A game for practising Swedish cardinal numbers, ordinal numbers, and number spelling.

## Run locally

From the repository root, run:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000/game15/index.html.

## How to play

- **Level 1:** Match a Swedish number word to a house number by clicking the correct house.
- **Level 2:** Identify a house using its position along the street.
- **Level 3:** Write the indicated house number in Swedish without including the street name.

House numbers are shuffled before each new question. Incorrect answers allow another attempt and provide an option to reveal the answer. Each level requires ten correct answers.

Progress and score are saved locally in the browser.

## D2 user stories and status

Checked boxes indicate completed stories. Unchecked boxes indicate stories that remain open, including partially implemented stories.

### Learner stories

- [x] **REQ-USER1:** The learner needs to be able to match words for numbers in Swedish to house numbers shown as digits so they can understand the connection between numbers and numerical values.

- [x] **REQ-USER2:** The learner needs to be able to identify houses using Swedish ordinal numbers so they can practice understanding positions such as “the fourth house”.

- [x] **REQ-USER3:** The learner needs clear instructions and visuals about where to start counting houses from and which side of the street to observe so they can interpret the questions about ordinal numbers correctly.

- [x] **REQ-USER4:** The learner needs to be able to spell the house number without repeating the street name at level 3 of the game so they can more efficiently learn the numbers in Swedish.

- [x] **REQ-USER5:** The learner needs to be able to continue playing without losing lives after entering incorrect answers so they can learn from their mistakes.

- [x] **REQ-USER6:** The learner needs the option to show the correct answer after answering incorrectly so they can learn the number word in Swedish when they don’t know it.  

- [x] **REQ-USER7:** The learner needs house numbers to change randomly so they can practice recognizing the numbers instead of memorizing the locations on the map.

- [x] **REQ-USER8:** The learner needs a map with readable and interpretable street names, house numbers, and distinguishable houses so they can correctly identify the house in question when playing.

- [x] **REQ-USER9:** The learner needs a clear message when they complete a level so they know that the level is finished.

- [x] **REQ-USER10:** The learner needs the buttons to have clear labels so they understand what each button does.

- [ ] **REQ-USER11:** The learner needs a short description of what each level covers before starting so they understand which skill they will practice.  
  **Remaining:** Add descriptions to the level selection menu.

- [x] **REQ-USER12:** The learner needs a consistent layout across levels so they can focus on the exercises without having to learn a new interface.

- [x] **REQ-USER13:** The learner needs the game instructions and in-game text to update to English when the main menu language toggle is selected so they can understand how to play without prior Swedish knowledge.

- [x] **REQ-USER14:** The learner needs all difficulty levels to be unlocked and clearly explained from the start so they can independently choose a level that matches their current skills instead of being locked out of harder content.  

- [ ] **REQ-USER15 - Future requirement:** The learner needs the option to hear Swedish numbers read aloud so they can practice pronouncing the written numbers.  
  **Remaining:** Audio playback is not implemented.

### Developer stories

- [x] **REQ-ADMIN1:** The developer of the code needs documented and well-structured code which facilitates updates.  

- [x] **REQ-ADMIN2:** The developer needs the project to have a README file that describes how the game works and the steps involved in its installation and use so that other developers who come along can read it and work on it.

- [x] **REQ-ADMIN3:** The developer needs to use a specific type of tech stack which is approved by the Admin. In this case HTML, CSS and JavaScript.

- [x] **REQ-ADMIN4:** The developer needs to ensure that the final product can be delivered as a GitHub page.  

### Client stories

- [ ] **REQ-CLIENT1:** The client needs learners to be able to recognize and understand Swedish cardinal and ordinal numbers after completing the module.  
  **Remaining:** The exercises are implemented, but the learning outcome still needs validation.

- [ ] **REQ-CLIENT2:** The client needs the game to have all the Swedish numbers-related vocabulary included in the material that corresponds to the intended course content that students will have the chance to practice.  
  **Remaining:** Verify the available vocabulary against the course material.

## Main files

- `level.js`: Questions, answer checking, feedback, and level progression.
- `setUpLevels.js`: Data loading and house-number randomization.
- `level.html` and `index.css`: Game interface and styling.
- `welcomeComponent.js`: Level selection and progress summary.
- `localStorage.js`: Progress storage through the shared save API.
- `assets/game15_vocab.json`: House and vocabulary data.

## Asset credits

- **Map:** Gustav Molin. Released under CC0 1.0.
- **Kevin:** Ali Abedrabbo. Licensed under CC BY-NC-SA 4.0.

See `assets/map.license` and `assets/kevin.license` for details.
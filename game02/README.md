# Game 02 - What Am I?

This document provides a technical overview of the What Am I? game, explaining the structure and functionality of the code. The menu offers three word categories (Furniture, Clothes and Food) and four game modes: Picture, Spelling, Listening and Dialect.

## File Structure

The game is composed of three main files. The stylesheet and the script are split into smaller files that the main files pull in:

* `index.html`: The main HTML file that defines the structure of the game's user interface. It loads the shared `../style.css` (the fixed 800 x 600 game frame), jQuery and `../scripts/save.js`, and starts `index.js` as an ES module.
* `index.css`: The stylesheet that controls the visual presentation of the game. It has no rules of its own and only imports the five files in `css/`:
    * `css/base.css`: The page background, the game frame and the layout shared by all screens.
    * `css/cards.css`: The game board and the memory cards.
    * `css/buttons.css`: The buttons, the game controls, the stats and the progress bar.
    * `css/screens.css`: The menu screen and the end screen.
    * `css/modal.css`: The hint modal.
* `index.js`: The JavaScript file that contains the game's logic and functionality. It wires the game together and uses four modules in `js/`:
    * `js/game-data.js`: Loads the words of the chosen category and builds the game board.
    * `js/cards.js`: Picks random pairs, prepares the cards and draws them on the board. It is imported by `game-data.js`.
    * `js/timer.js`: The game clock.
    * `js/hints.js`: The hint modal.

## How the Code Works

### `index.html`

The HTML file is structured into three main sections, each representing a different screen of the game:

* **Menu Screen (`#menu-screen`):** This is the initial screen the user sees. It contains:
    * A row of category buttons: Furniture, Clothes and Food. The selected category is highlighted and Furniture is selected from the start. The selected category decides which words the game uses. The Clothes button uses the vocabulary category `clothing`.
    * The game mode buttons Picture, Spelling, Listening and Dialect. The selected mode is highlighted. Spelling is not built yet: it starts the same picture board as Picture, with a different heading, although its info text describes typing the word.
    * An info box that shows how the selected mode works.
    * The "Start Game" button.
    * A row of dialect buttons: Standard Swedish, Malmö, Gothenburg and Finnish-Swedish. The row is only shown while Dialect is selected. Malmö, Gothenburg and Finnish-Swedish are greyed out and cannot be selected when the chosen category has no recordings for them. The categories that have such recordings are listed in `dialect_categories` in `index.js` (so far only Furniture). Standard Swedish can always be selected. The dialect choice is not used yet: all dialects play the same recordings as Listening.
* **Game Screen (`#game-screen`):** This screen is displayed when the game starts. It contains:
    * A progress bar along the top (`#progress-bar`) that reads "x / 8 pairs".
    * A heading (`#game-title`) that follows the selected mode.
    * The game board (`#game-board`) with 16 cards in a 4 x 4 grid. The 16 numbered cards in the HTML are placeholders that are replaced when a game starts.
    * The hint modal (`#hint-modal`).
    * On the right: the displays for the number of moves and the elapsed time (`#game-stats`) and, below them, the "Help" and "Quit" buttons (`#game-controls`). Help is directly above Quit.
* **End Screen (`#end-screen`):** This screen is shown when the user wins the game. It displays the congratulations header, the total number of moves, the time taken and the total number of wins. It has two buttons: "Play Again" and "Go to main menu". Quitting a game does not show this screen.

### `index.css`

`index.css` has no rules of its own. It imports five files from `css/`, which style the different elements of the game to create an engaging and user-friendly interface. Key styling aspects include:

* `css/base.css`: The page background, the look of the game frame and the centred text and padding of the three screens. The size of the frame (800 x 600) comes from the shared `../style.css`.
* `css/cards.css`: The game board uses a grid layout with 4 columns of 100px. The memory cards are styled to have a front and a back face, with a flip animation when the `.flipped` class is added. Matched cards (`.matched`) cannot be clicked. Their fade-out is done by jQuery in `index.js`.
* `css/buttons.css`: Buttons have hover and active states to provide visual feedback to the user. Help and Quit have their own colours. The game screen has a fixed height, so it fills the frame, and the progress bar, the controls (a flexbox column) and the stats are positioned absolutely inside it. The fill of the progress bar grows with a short transition.
* `css/screens.css`: The menu uses a flexbox layout: the mode buttons are stacked in a column next to the info box, and the dialect buttons sit in a row. The category buttons sit in a row between the heading and the mode buttons. The selected mode button and the selected dialect button get a pink background and a dark outline, and the selected category button gets the same. Greyed-out (disabled) dialect buttons get a grey background and grey text and do not move up when hovered.
* `css/modal.css`: The hint modal is an overlay that covers the game screen, with a dimmed background and a centred box.

### `index.js`

This file contains the core logic of the game, which is built using jQuery. It is an ES module that wires together the modules in `js/`:

* `js/game-data.js`:
    * **`initDb()`:** This function starts the download of the shared word list when the page loads, while the user reads the menu. It only starts one download, and every later call waits for that same one.
    * **`loadPairs(numPairs, category)`:** This function waits for the word list, takes the vocabulary category given by `category` ("furniture", "clothing" or "food") from `scripts/vocabulary_await.js`, keeps only the words that have a picture and picks `numPairs` of them at random. Each pair holds the Swedish and English word, the picture and the recording. The pairs are tagged with the category. If the category does not exist, the function logs an error to the console and returns an empty list.
    * **`buildGrid(pairs, mode)`:** This function creates the cards with `prepareGridItems()` and draws them with `renderGrid()`.
* `js/cards.js`:
    * **`getRandomPairs(data, numPairs)`:** This function shuffles a copy of the list and returns the first `numPairs` items.
    * **`prepareGridItems(pairs, mode)`:** This function creates two cards for every pair: a word card (type `description`, the Swedish word as text) and either a picture card (type `image`, Picture and Spelling modes) or a sound card (type `sound`, Listening and Dialect modes). The two cards of a pair share the same id. All cards are shuffled.
    * **`renderGrid(cards)`:** This function clears the board and draws the cards. The id of a card is written to its `data-pair-id` attribute, which is how matches are found. The front of a card says "What Am I?". The back shows the word, the picture or a speaker icon.
* `js/timer.js`:
    * **`startTimer(onTick)`, `stopTimer()`, `resetTimer(onReset)`, `getElapsedTime()`:** These functions manage the game's clock, which the module keeps in its own variables. `startTimer` calls `onTick` with the elapsed seconds once every second, and `index.js` passes a callback that writes "Time: Ns" into `#elapsed-time`. `stopTimer` stops the clock. `resetTimer` stops the clock, sets the time to 0 and calls `onReset`. `getElapsedTime()` returns the elapsed seconds.
* `js/hints.js`:
    * **`initHints(getCurrentPairs)`:** This function binds the Help button and the hint modal. For every flipped word card the modal shows the Swedish word and its English translation, like "word → translation". If no word card is flipped, the modal says so. The modal closes with the x or by clicking outside the box.

#### Key Variables:

* `team_name`: A constant that stores the team name ("game02"), used for saving game statistics.
* `corrects_needed`: The number of correct pairs the user needs to find to win the game (8).
* `numPairs`: The number of pairs on the game board (8, which makes 16 cards).
* `mode_titles`: The heading above the board for each game mode.
* `dialect_categories`: The categories that have recordings for the dialects. It only holds "furniture" so far. The dialect buttons Malmö, Gothenburg and Finnish-Swedish are greyed out for every other category. A category is added to the list when its dialect recordings exist.
* `corrects` and `misses`: The number of pairs found and the number of failed attempts in the current game.
* `wins`: The total number of wins. It is loaded from local storage when the page loads.
* `flippedCards`: An array that stores the cards that are currently flipped over.
* `allowFlipBack`: Set to `true` after two cards did not match, while they stay face up. The next click on a card turns them back.
* `isChecking`: `true` while two flipped cards are being checked (0.5 seconds for a mismatch, 1 second for a match). Clicks on cards are ignored during that time.
* `currentPairs`: The pairs of the last loaded game. `initHints` reads them through `getCurrentPairs` to find the English word.
* `misses_max`: Declared but not used. The check that would end the game after too many misses is commented out in `notMatch()`, so the game cannot be lost and the "Game Over!" text in `updateEndScreen()` is never shown.

#### Core Functions:

These functions are defined in `index.js`:

* **`showScreen(screenId)`:** This function controls which of the three game screens is currently visible to the user.
* **`mapCards(mode, category)`:** This function loads the cards for a game. It calls `loadPairs(numPairs, category)`, stores the pairs in `currentPairs` and calls `buildGrid(currentPairs, mode)` to draw the cards on the game board. Errors are logged to the console.
* **`resetFlipState()`:** This function turns the flipped cards face down again and clears `flippedCards` and `allowFlipBack`.
* **`updateProgress()`:** This function sets the width of the progress bar and its text ("x / 8 pairs") from `corrects`.
* **`resetGame()`:** This function resets the game state, including the number of correct matches and misses, the progress bar, the moves counter, the flipped cards and the timer.
* **`updateEndScreen()`:** This function fills in the end screen: the header, the number of moves (`corrects + misses`) and the time taken.
* **`foundMatch()`:** This function counts a found pair. It increments `corrects`, updates the progress bar and the moves counter and clears the flipped cards. When `corrects` reaches `corrects_needed`, it also runs the win steps described in the Game Flow.
* **`notMatch()`:** This function counts a failed attempt. It increments `misses` and updates the moves counter.
* **`clickCard()`:** This is the event handler for when a user clicks on a card. It ignores clicks on matched cards and clicks that arrive while a pair is being checked. If two cards that did not match are face up (`allowFlipBack`), the click turns them face down again and does nothing else. Otherwise it flips the card (a sound card also plays its recording). When two cards are flipped, it compares their `data-pair-id`. A match is marked `matched` at once, and after 1 second the two cards fade out and `foundMatch()` runs. A mismatch runs `notMatch()` after 0.5 seconds and leaves both cards face up.
* **Button handlers:**
    * "Start Game" reads the selected mode and the selected category, sets the heading from `mode_titles` and shows "Loading..." on the button while `mapCards(mode, category)` runs. Then it calls `resetGame()` (so every game starts from zero), shows the game screen and starts the timer.
    * "Quit" stops the timer, resets the game and shows the menu screen.
    * "Play Again" triggers a click on "Start Game", so a new game starts at once in the same category and mode, with new cards.
    * "Go to main menu" resets the game and shows the menu screen.
    * The category buttons mark the clicked category as selected. If the category is not in `dialect_categories`, they also grey out (disable) the dialect buttons Malmö, Gothenburg and Finnish-Swedish and select Standard Swedish instead, so that a greyed-out dialect is never selected. If the category is in `dialect_categories`, the dialect buttons are enabled again.
    * The mode buttons mark the clicked mode as selected, show its text in the info box and show the dialect buttons only for Dialect. The dialect buttons only mark the clicked dialect as selected.
    * The cards are created when a game starts, so their click handler (`clickCard()`) is attached to `document` (event delegation).

#### Game Flow:

1.  The game starts on the menu screen. The word list starts downloading in the background.
2.  The user picks a word category (Furniture is selected from the start) and a game mode. The info box shows how that mode works.
3.  When the user clicks "Start Game", `mapCards()` loads 8 random pairs of the chosen category and draws the 16 cards on the board. The button says "Loading..." until the cards are ready.
4.  The game is reset, the `game-screen` is shown with the heading for the selected mode, and the timer starts.
5.  The user clicks on cards to flip them. The `clickCard()` function handles the logic for checking for matches. A sound card plays its recording when it is flipped, and the "Help" button shows the English word for every flipped word card.
6.  If two cards match, they are marked as matched at once, so they cannot be clicked. After 1 second they fade out, the `corrects` count is incremented and the progress bar grows.
7.  If they don't match, both cards stay face up. After 0.5 seconds the `misses` count is incremented. The next click on a card turns the two cards face down again.
8.  The game is won when the user finds all 8 pairs. The timer stops, the end screen is filled in, the win count is incremented and saved to local storage with `save.stats.incrementWin(team_name)` (from `../scripts/save.js`), and after 0.6 seconds the `end-screen` is displayed with the game's results.
9.  If the user clicks "Quit" during a game, the timer stops, the game is reset and the menu screen is shown. Nothing is counted and there is no end screen.
10. On the end screen, "Play Again" starts a new game at once in the same category and mode with new cards. "Go to main menu" resets the game and shows the menu, so the user can choose another category or mode.

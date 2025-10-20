# Team 01 - Furniture Memory Game

This document provides a technical overview of the Furniture Memory Game, explaining the structure and functionality of the code.

## File Structure

The game is composed of three main files:

* `index.html`: The main HTML file that defines the structure of the game's user interface.
* `index.css`: The stylesheet that controls the visual presentation of the game.
* `index.js`: The JavaScript file that contains the game's logic and functionality.

## How the Code Works

### `index.html`

The HTML file is structured into three main sections, each representing a different screen of the game:

* **Menu Screen (`#menu-screen`):** This is the initial screen the user sees. It contains instructions on how to play and a "Start Game" button.
* **Game Screen (`#game-screen`):** This screen is displayed when the game starts. It contains the game board, a hint button, a quit button, and displays for the number of moves and elapsed time.
* **End Screen (`#end-screen`):** This screen is shown when the game ends. It displays whether the user won or lost, the total number of moves, the time taken, and the total number of wins. It also has a "Play Again" button.

### `index.css`

The CSS file styles the different elements of the game to create an engaging and user-friendly interface. Key styling aspects include:

* The game uses a flexbox layout for the main screens and a grid layout for the game board.
* The memory cards are styled to have a front and a back face, with a flip animation when a card is clicked. Matched cards are faded out.
* Buttons have hover and active states to provide visual feedback to the user.

### `index.js`

This file contains the core logic of the game, which is built using jQuery.

#### Key Variables:

* `team_name`: A constant that stores the team name, used for saving game statistics.
* `corrects_needed`: The number of correct pairs the user needs to find to win the game.
* `flippedCards`: An array that stores the cards that are currently flipped over.
* `startTime` and `timerInterval`: Variables to manage the game's timer.

#### Core Functions:

* **`showScreen(screenId)`:** This function controls which of the three game screens is currently visible to the user.
* **`startTimer()`, `stopTimer()`, `resetTimer()`, `updateTimerDisplay()`:** These functions manage the game's timer, starting, stopping, and resetting it as needed, and updating the time displayed on the screen.
* **`resetGame()`:** This function resets the game state, including the number of correct matches and misses, the moves counter, and the timer.
* **`clickCard()`:** This is the event handler for when a user clicks on a card. It manages the logic for flipping cards, checking for matches, and updating the game state accordingly.
* **`mapCards()`:** This function is responsible for fetching the vocabulary data, filtering for furniture items, randomly selecting a set of pairs, and then rendering the cards on the game board.
* **Hint Functionality:** The code includes an event handler for the hint button that, when clicked, displays a modal with a hint for any flipped text cards.

#### Game Flow:

1.  The game starts on the menu screen.
2.  When the user clicks "Start Game", the `game-screen` is shown, and the timer starts.
3.  The `mapCards()` function populates the game board with cards.
4.  The user clicks on cards to flip them. The `clickCard()` function handles the logic for checking for matches.
5.  If two cards match, they are marked as matched and fade out. The `corrects` count is incremented.
6.  If they don't match, they are flipped back over after a short delay. The `misses` count is incremented.
7.  The game ends when the user finds all the pairs or clicks the "Quit" button.
8.  The `end-screen` is displayed with the game's results.
9.  The user's win count is saved to local storage and displayed.
10. The user can choose to play again, which resets the game and takes them back to the menu screen.
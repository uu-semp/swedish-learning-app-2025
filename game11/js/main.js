//This file is the entry point for the game. It initializes the game state and sets up the UI.
import { initGameState } from "./state.js";
import { displayShelf, displayShoppingList, displayCopyright} from "./ui.js";

//The game state is stored in this variable and is exposed to the global window object for access from other scripts.
let gameState = {};


/**
 * Initializes the game state and displays the game UI.
 */
function startGame() {
  // Wait until the vocabulary data has finished loading.
  window.vocabulary.when_ready(function() {
    console.log("main.js is running");
    // Initialize the game state.
    gameState = initGameState();

    // Display the shelf, shopping list, and copyright information.
    window.__game11GameState = gameState;
    displayShelf(gameState.shelf, gameState.mode);
    displayShoppingList(gameState.shoppingList, gameState.mode);
    displayCopyright(gameState.shelf, gameState.mode);
  });
  
  // Looks redundant assignment to window.__game11GameState. 
  // TODO: remove this and ensure that it do not cause problem.
  window.__game11GameState = gameState;

  // Notify other scripts that the game is ready.
  window.dispatchEvent(new CustomEvent('game11:ready', { detail: { gameState } }));
};

//TODO: find out what this is for and remove it if not needed.
$(startGame);

// Make the startGame function available globally.
window.startGame = startGame;

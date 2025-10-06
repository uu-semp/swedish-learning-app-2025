import { initGameState } from "./state.js";
import { displayShelf, displayShoppingList } from "./ui.js";

let gameState = {};

$(function() {
  window.vocabulary.when_ready(function() {
    console.log("main.js is running");
    gameState = initGameState();
    // Expose for index.html's initWords bridge
    window.__team11GameState = gameState;

    console.log(gameState.shelf);
    displayShelf(gameState.shelf);
    displayShoppingList(gameState.shoppingList);
  });
  // main.js (recap)
window.__team11GameState = gameState;
window.dispatchEvent(new CustomEvent('team11:ready', { detail: { gameState } }));

});

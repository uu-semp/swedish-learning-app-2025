import { initGameState } from "./state.js";
import { displayShelf, displayShoppingList } from "./ui.js";

let gameState = {};

$(function() {
  window.vocabulary.when_ready(function() {
    console.log("main.js is running");
    gameState = initGameState();
    console.log(gameState.shelf);
    displayShelf(gameState.shelf);
    displayShoppingList(gameState.shoppingList);
  });
});
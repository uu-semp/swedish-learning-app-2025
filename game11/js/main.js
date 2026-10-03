import { initGameState } from "./state.js";
import { displayShelf, displayShoppingList, displayCopyright} from "./ui.js";

let gameState = {};
function startGame() {
  window.vocabulary.when_ready(function() {
    console.log("main.js is running");
    gameState = initGameState();
    // Expose for index.html's initWords bridge
    window.__game11GameState = gameState;

    // Preload shelf images so they are cached before rendering
    if (gameState.mode !== 2) gameState.shelf.forEach(item => { new Image().src = "../" + item.img; });

    console.log(gameState.shelf);
    displayShelf(gameState.shelf, gameState.mode);
    displayShoppingList(gameState.shoppingList, gameState.mode);
    displayCopyright(gameState.shelf, gameState.mode);
  });
  
  window.__game11GameState = gameState;
  window.dispatchEvent(new CustomEvent('game11:ready', { detail: { gameState } }));
};

$(startGame);

window.startGame = startGame;

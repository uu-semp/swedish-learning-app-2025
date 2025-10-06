import { generateShelf, generateShoppingList } from "./gameLogic.js";
import { getItems } from "./data.js"

// initialize a new game state
function initGameState() {
  vocabulary = getItems()

  const shoppingList = generateShoppingList(vocabulary);
  const shelf = generateShelf(shoppingList, vocabulary);

    return {
        shoppingList,
        shelf,
        currentIndex: 0, 
        correctFirstTry: [],
        mistakes: {},
        finished: false
    };
}

function getGameState(state) {
    return {
        shoppingList: state.shoppingList,
        shelf: state.shelf,
        currentWord: state.shoppingList[state.currentIndex],
        progress: state.correctFirstTry.length, 
        finished: state.finished,

    };

}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Could not save state", e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);

    // Basic validation
    if (!Array.isArray(state.shoppingList) || !Array.isArray(state.shelf)) {
      throw new Error("Corrupted state");
    }
    return state;
  } catch (e) {
    console.warn("Invalid saved state discarded", e);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export { initGameState, getGameState, saveState, loadState };

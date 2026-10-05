// This file contains the game state management logic 
// It provides functions to initialize, retrieve, save, and load the game state.
import { generateShelf, generateShoppingList } from "./gameLogic.js";
import { getItems } from "./data.js";
import {
  loadSpacedRepetitionMemory,
  initializeSpacedRepetition,
  getWordsDueToday
} from "./spacedRepetitionLogic.js";

const STORAGE_KEY = "game_state";
const SR_ENABLED_KEY = "sr_enabled";
const SR_CONSENT_KEY = "sr_consent";

/**
 * Initializes the game state using the vocabulary.
 * Loads a saved state if available; otherwise, creates a new game state.
 *
 * @returns {Object} The initialized game state.
 */
function initGameState() {
  const savedState = loadState();
  if (savedState) {
    return savedState;
  } else {
    const vocab = getItems(); // <-- important: do NOT overwrite window.vocabulary

    // Build lists
    let shoppingList;

    if (isSpacedRepetitionEnabled()) {
      let memory = loadSpacedRepetitionMemory();

      // Initialize the Spaced Repetition memory if it does not exist
      if (Object.keys(memory).length === 0) {
        memory = initializeSpacedRepetition();
      }

      // Pull the words that are due for review today
      const dueWords = getWordsDueToday();

      // If there are no words due today, there is nothing to play
      if (dueWords.length === 0) {
        return null;
      }

      // The game uses a maximum of 10 items per round
      shoppingList = dueWords.slice(0, 10);
    } else {
      // Build the normal shopping list
      shoppingList = generateShoppingList(vocab);
    }

    const shelf = generateShelf(shoppingList, vocab);

    const state = {
      shoppingList: shoppingList, // items to be found
      shelf: shelf, // shuffled shelf items (shoppingList + distractors)
      currentIndex: 0, // index of the current item in shoppingList
      correctFirstTry: [], // bools per solved item (true if first try)
      pickedIds: [],
      mistakes: {},        // { [targetId]: numberOfMistakes }
      finished: false, // true if all items have been solved
      mode: 1, //The mode of the game
    };
    saveState(state); 
    return state;
  }
}

/**
 * Creates a simplified snapshot of the game state for the UI and other consumers.
 *
 * @param {Object} state - The current game state.
 * @returns {Object} A simplified game state containing the shopping list, shelf, current item, progress, finished status, and game mode.
 */
function getGameState(state) {
  return {
    shoppingList: state.shoppingList,
    shelf: state.shelf,
    currentWord: state.shoppingList?.[state.currentIndex] || null,
    progress: state.correctFirstTry.length,
    finished: !!state.finished,
    mode: state.mode,
  };
}

/**
 * Saves the current game state using save.js
 *
 * @param {Object} state - The game state.
 */
function saveState(state) {
  save.set("game11", STORAGE_KEY, state);
}

/**
 * Loads a previously saved state using save.js. Returns null if none/invalid.
 *
 * @returns {Object|null} The loaded game state or null if no valid state is found.
 */
function loadState() {
  const state = save.get("game11", STORAGE_KEY);
  
  if (!state) return null;

  // Minimal validation
  if (!Array.isArray(state.shoppingList) || !Array.isArray(state.shelf)) {
    console.warn("[state] Invalid saved state discarded");
    save.set("game11", STORAGE_KEY, null); // Overwrite corrupted data
    return null;
  }
  return state;
}

function isSpacedRepetitionEnabled() {
  return save.get("game11", SR_ENABLED_KEY) === true;
}

function enableSpacedRepetition() {
  save.set("game11", SR_ENABLED_KEY, true);
}

function disableSpacedRepetition() {
  save.set("game11", SR_ENABLED_KEY, false);
}

function hasSpacedRepetitionConsent() {
  return save.get("game11", SR_CONSENT_KEY) === true;
}

function giveSpacedRepetitionConsent() {
  save.set("game11", SR_CONSENT_KEY, true);
}

function deleteSpacedRepetitionMemory() {
  save.set("game11", SR_ENABLED_KEY, false);
  save.set("game11", SR_CONSENT_KEY, false);
  save.set("game11", "sr_memory", null); // Completely clear the statistics
}

export {
  initGameState,
  getGameState,
  saveState,
  loadState,
  isSpacedRepetitionEnabled,
  enableSpacedRepetition,
  disableSpacedRepetition,
  hasSpacedRepetitionConsent,
  giveSpacedRepetitionConsent,
  deleteSpacedRepetitionMemory
};
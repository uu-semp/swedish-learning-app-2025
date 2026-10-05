// This file contains the game state management logic 
// It provides functions to initialize, retrieve, save, and load the game state.
import { generateShelf, generateShoppingList } from "./gameLogic.js";
import { getItems } from "./data.js";
import {
  loadSpacedRepetitionMemory,
  initializeSpacedRepetition,
  getWordsDueToday
} from "./spacedRepetitionLogic.js";

// The local storage key 
const STORAGE_KEY = "game11_game_state";
const SR_ENABLED_KEY = "game11_spaced_repetition_enabled";
const SR_CONSENT_KEY = "game11_spaced_repetition_consent";



/**
 * Initializes the game state using the  vocabulary.
 * Loads a saved state if available; otherwise, creates a new game state.
 *
 * @returns {Object} The initialized game state.
 */
function initGameState() {
  // Pull all items (each item has at least: { id, sv, en, img, ... })
  // Check if there's a saved state in localStorage, in this case refresh will not reset the game state
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
      mistakes: {},        // { [targetId]: numberOfMistakes }
      finished: false, // true if all items have been solved
      mode: 1, //The mode of the game
    };
    saveState(state); // Optional: persist initial state (safe no-op if storage blocked)
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
 * Saves the current game state to local storage.
 *
 * @param {Object} state - The  game state.
 */
function saveState(state) {
  try {
    const payload = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, payload);
  } catch (e) {
    console.warn("[state] Could not save state:", e);
  }
}



/**
 * Loads a previously saved state from local storage. Returns null if none/invalid.
 *
 * @returns {Object|null} The loaded game state or null if no valid state is found.
 */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const state = JSON.parse(raw);

    // Minimal validation
    if (!Array.isArray(state.shoppingList) || !Array.isArray(state.shelf)) {
      throw new Error("Corrupted state");
    }
    return state;
  } catch (e) {
    console.warn("[state] Invalid saved state discarded:", e);
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
    return null;
  }
}

function isSpacedRepetitionEnabled() {
  return localStorage.getItem(SR_ENABLED_KEY) === "true";
}

function enableSpacedRepetition() {
  localStorage.setItem(SR_ENABLED_KEY, "true");
}

function disableSpacedRepetition() {
  localStorage.setItem(SR_ENABLED_KEY, "false");
}

function hasSpacedRepetitionConsent() {
  return localStorage.getItem(SR_CONSENT_KEY) === "true";
}

function giveSpacedRepetitionConsent() {
  localStorage.setItem(SR_CONSENT_KEY, "true");
}

function deleteSpacedRepetitionMemory() {
  localStorage.removeItem(SR_ENABLED_KEY);
  localStorage.removeItem(SR_CONSENT_KEY);
  localStorage.removeItem("game11_spaced_repetition"); 
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
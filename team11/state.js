// state.js
// =================================================
// Team 11 – Game state helpers
// =================================================

import { generateShelf, generateShoppingList } from "./gamelogic.js";
import { getItems } from "./data.js";

// Keep a local storage key in this module (don't rely on other files)
const STORAGE_KEY = "team11_game_state";

/**
 * Build a fresh game state from the current vocabulary.
 * - Does NOT mutate window.vocabulary
 * - shoppingList: 10 items (default in gamelogic)
 * - shelf: shoppingList + distractors, shuffled
 */
function initGameState() {
  // Pull all items (each item has at least: { id, sv, en, img, ... })
  const vocab = getItems(); // <-- important: do NOT overwrite window.vocabulary

  // Build lists
  const shoppingList = generateShoppingList(vocab);      // 10 items by default
  const shelf = generateShelf(shoppingList, vocab);      // 10 + distractors

  const state = {
    shoppingList,
    shelf,
    currentIndex: 0,
    correctFirstTry: [], // bools per solved item (true if first try)
    mistakes: {},        // { [targetId]: numberOfMistakes }
    finished: false
  };

  // Optional: persist initial state (safe no-op if storage blocked)
  saveState(state);
  return state;
}

/**
 * A trimmed snapshot for UI/consumers.
 */
function getGameState(state) {
  return {
    shoppingList: state.shoppingList,
    shelf: state.shelf,
    currentWord: state.shoppingList?.[state.currentIndex] || null,
    progress: state.correctFirstTry.length,
    finished: !!state.finished,
  };
}

/**
 * Persist the state safely.
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
 * Load a previously saved state. Returns null if none/invalid.
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
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    return null;
  }
}

export { initGameState, getGameState, saveState, loadState };

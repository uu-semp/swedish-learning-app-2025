import {
  get,
  incrementWin,
  set,
  setCompletion,
} from "./backend_interface/save.js";
import { safe_get } from "./read.js";
import * as Types from "./storage_type.js";
import { TEAM, CATEGORIES, WORDS, WIN_BARRIER } from "./store_config.js";

/**
 *
 * @param {Number} percentage
 * @returns {Number} 0 if success else fail
 */
export function local_set_volume(percentage) {
  if (percentage > 100 || percentage < 0) {
    console.error("Volume is outside range");
    return 1;
  }
  /** @type {Types.Team8Storage} */
  let data = safe_get();

  data.volume = percentage;

  set(TEAM, data);
  return 0;
}

/**
 *
 * @param {String[]} categories
 * @returns {Number} 0 if success else fail
 */
export function local_set_categories(categories) {
  if (
    categories.length > Object.keys(CATEGORIES).length ||
    !categories.every((item) => Object.values(CATEGORIES).includes(item))
  ) {
    console.error("Categories are invalid");
    return 1;
  }
  /** @type {Types.Team8Storage} */
  let data = safe_get();

  data.category = categories;

  set(TEAM, data);
  return 0;
}

/**
 * Guesses must contain valid ids
 * @param {Types.Guess[]} guesses
 */
export function local_set_guesses(guesses) {
  /** @type {Types.Team8Storage} */
  let data = safe_get();
  data.guesses = guesses;
  set(TEAM, data);
}

export function local_wipe_guesses() {
  local_set_guesses([]);
}

/**
 * Saves state of sound effect to local storage.
 * @param {boolean} enabled
 */
export function local_set_sound_effects(enabled) {
  let data = safe_get();
  data.sound_effects_enabled = enabled;
  set(TEAM, data);
}

/**
 * Receives guesses and then updates the progress in covers, wins and completion
 * @param {Types.Guess[]} guesses
 */
export function local_update_progress(guesses) {
  let data = safe_get();

  let covers = 0;
  guesses.forEach((guess) => {
    if (guess.guessed_correct) {
      if (!data.id_covered[guess.id]) {
        covers++;
      }
      data.id_covered[guess.id] = true;
    }
  });

  data.covers += covers;
  set(TEAM, data);

  // Uses calculated information about covers to update completion and wins
  setCompletion(TEAM, data.covers / WORDS);

  const CORRECT_GUESSES = guesses.filter(
    (guess) => guess.guessed_correct
  ).length;
  if (CORRECT_GUESSES > WIN_BARRIER * guesses.length) {
    incrementWin(TEAM);
  }
}

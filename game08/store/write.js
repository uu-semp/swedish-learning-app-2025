import {
  get,
  incrementWin,
  set,
  setCompletion,
} from "./backend_interface/save.js";
import { safe_get } from "./read.js";
import * as Types from "./storage_type.js";
import { GAME, CATEGORIES, WORDS, WIN_BARRIER } from "./store_config.js";

/**
 *
 * @param {Number} percentage
 * @returns {Number} 0 if success else fail
 */
export function local_set_volume(percentage) {
  if (typeof percentage != "number") {
    console.error("Trying to set volume to ", typeof percentage);
  }
  if (percentage > 100 || percentage < 0) {
    console.error("Volume is outside range");
    return 1;
  }
  /** @type {Types.Game08Storage} */
  let data = safe_get();

  data.volume = percentage;

  set(GAME, data);
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
  /** @type {Types.Game08Storage} */
  let data = safe_get();

  data.category = categories;

  set(GAME, data);
  return 0;
}

/**
 * Guesses must contain valid ids
 * @param {Types.Guess[]} guesses
 */
export function local_set_guesses(guesses) {
  /** @type {Types.Game08Storage} */
  let data = safe_get();
  data.guesses = guesses;
  set(GAME, data);
}

export function local_wipe_guesses() {
  local_set_guesses([]);
}

/**
 * Saves state of sound effect to local storage.
 * @param {boolean} enabled
 */
export function local_set_sound_effects(enabled) {
  if (typeof enabled != "boolean") {
    console.error("Trying to set volume to ", typeof enabled);
  }
  let data = safe_get();
  data.sound_effects_enabled = enabled;
  set(GAME, data);
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
  set(GAME, data);

  // Uses calculated information about covers to update completion and wins
  // Store in percentage
  setCompletion(GAME, (data.covers / WORDS) * 100);

  const CORRECT_GUESSES = guesses.filter(
    (guess) => guess.guessed_correct
  ).length;
  if (CORRECT_GUESSES > WIN_BARRIER * guesses.length) {
    incrementWin(GAME);
  }
}

/**
 *
 * @param {Boolean} new_persistence
 */
export function local_set_persistent_notice(new_persistence) {
  let data = safe_get();

  data.persistent_notice = new_persistence;
  set(GAME, data);
}

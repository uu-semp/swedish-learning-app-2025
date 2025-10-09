import { get, set } from "./backend_interface/save.js";
import * as Types from "./storage_type.js";
import { TEAM, CATEGORIES } from "./store_config.js";

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
  let data = get(TEAM);

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
  let data = get(TEAM);

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
  let data = get(TEAM);
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
  let data = get(TEAM);
  data.sound_effects_enabled = enabled;
  set(TEAM, data);
}

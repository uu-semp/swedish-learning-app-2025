import { get, set } from "./backend_interface/save.js";
import * as Types from "./storage_type.js";
import * as DB from "../../scripts/alternative_backend/database_type.js";
import { TEAM, CATEGORIES, DEFAULT } from "./store_config.js";
import {
  local_set_categories,
  local_set_sound_effects,
  local_set_volume,
} from "./write.js";
import {
  loaddb,
  get_category,
  get_random,
  get_vocab,
} from "../../scripts/alternative_backend/vocabulary_await.js";

init();

function init() {
  let data = get(TEAM);
  if (data == undefined) {
    set(TEAM, DEFAULT);
  } else {
    Object.keys(DEFAULT).forEach((item) => {
      if (data[item] === undefined) {
        data[item] = DEFAULT[item];
      }
    });
    set(TEAM, data);
  }
}
function safe_get() {
  let data = get(TEAM);
  if (data == null) {
    console.log("wiped");
    set(TEAM, DEFAULT);
    return DEFAULT;
  }
  return data;
}

let loaded_before = false;

export async function init_db(reload = false) {
  if (!loaded_before || reload) {
    loaded_before = true;
    await loaddb();
  }
}

/**
 *
 * @returns {Number}
 */
export function local_get_volume() {
  /** @type {Types.Team8Storage} */
  let data = safe_get(TEAM);
  if (data.volume === undefined) {
    local_set_volume(DEFAULT.volume);
    return DEFAULT.volume;
  }
  return data.volume;
}

/**
 *
 * @returns {String[] | null}
 */
export function local_get_categories() {
  /** @type {Types.Team8Storage} */
  let data = safe_get(TEAM);

  if (data.category === undefined) {
    local_set_categories(DEFAULT.category);
    return DEFAULT.category;
  }

  return data.category;
}

/**
 * Retrieves the state of sound effect from local storage.
 * @returns {Boolean}
 */
export function local_get_sound_effects() {
  let data = safe_get(TEAM);
  if (data.sound_effects_enabled == undefined) {
    local_set_sound_effects(DEFAULT.sound_effects_enabled);
    return DEFAULT.sound_effects_enabled;
  }

  return data.sound_effects_enabled;
}

/**
 *
 * @returns {Types.Guess[]} guesses
 */
export function local_get_guesses() {
  /** @type {Types.Team8Storage} */
  let data = safe_get(TEAM);
  return data.guesses;
}

/**
 * @typedef CleanGuesses
 * @property {Boolean} guessed_correct
 * @property {DB.VocabEntry} vocab
 */

/**
 *
 * @returns {CleanGuesses[]}
 */
export function local_get_guesses_with_vocab() {
  return local_get_guesses().map((guess) => {
    return {
      guessed_correct: guess.guessed_correct,
      vocab: get_vocab(guess.id),
    };
  });
}

/** DB METHODS */

/**
 *
 * @param {String[]} categories
 */
export function db_get_categories(categories) {
  /** @type {String[]} */
  return categories.map((category) => get_category(category)).flat();
}

/**
 *
 * @param {String[]} ids
 * @returns {String[]} list of urls
 */
export function db_get_images_of_ids(ids) {
  return ids.map((id) => {
    const V = get_vocab(id);
    return V ? V.img : null;
  });
}

/**
 *
 * @param {String[]} ids
 * @returns {String[]} list of urls
 */
export function db_get_audio_of_ids(ids) {
  return ids.map((id) => {
    const V = get_vocab(id);
    return V ? V.audio : null;
  });
}

/**
 *
 * @param {String[]} ids
 * @returns {DB.VocabEntry[]}
 */
export function db_get_vocabs(ids) {
  return ids.map((id) => get_vocab(id));
}

/** Utility */

/**
 * This method only manipulates ids
 * @param {String[]} ids
 * @param {Number} n
 * @return {String[]} n ids taken randomly from ids
 */
export function get_n_random_words(ids, n) {
  const result = [];
  if (ids.length < n) {
    console.error("Not enough words in: ", ids);
    return [];
  }
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * ids.length);
    result.push(ids[randomIndex]);
    ids.splice(randomIndex, 1);
  }
  return result;
}

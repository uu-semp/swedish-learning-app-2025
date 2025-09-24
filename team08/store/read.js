import { get } from "./alternative_backend/save.js";
import * as Types from "./storage_type.js";
import * as DB from "./alternative_backend/database_type.js";
import { get_vocab, loaddb } from "./alternative_backend/vocabulary_await.js";

/** @type {DB.Database} */
let db = null;

export async function init_db() {
  db = await loaddb();
}

/**
 *
 * @returns {Number | null}
 */
export function local_get_volume() {
  /** @type {Types.Team8Storage} */
  let data = get("team8");
  if (data.volume === undefined) {
    return null;
  }
  return data.volume;
}

/**
 *
 * @returns {String[] | null}
 */
export function local_get_categories() {
  /** @type {Types.Team8Storage} */
  let data = get("team8");

  if (data.category === undefined) {
    return null;
  }

  return get("team8").category;
}

/**
 *
 * @param {string[]} categories
 */
export function db_get_categories(categories) {
  /** @type {String[]} */
  return categories.map((category) => db.categories[category]).flat();
}

/**
 *
 * @param {string[]} ids
 * @param {Number} n
 * @return {string[]} n ids taken randomly from ids
 */
export function db_get_n_random_words(ids, n) {
  const result = [];
  if (result.length < n) {
    console.error("Not enough words");
    return [];
  }
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * ids.length);
    result.push(ids[randomIndex]);
    ids.splice(randomIndex, 1);
  }
  return result;
}

/**
 *
 * @param {String[]} ids
 * @returns {String[]} list of urls
 */
export function db_get_images_of_ids(ids) {
  return ids.map((id) => {
    return get_vocab(db, id).img;
  });
}

/**
 *
 * @param {String[]} ids
 * @returns {String[]} list of urls
 */
export function db_get_audio_of_ids(ids) {
  return ids.map((id) => {
    return get_vocab(db, id).audio;
  });
}

/**
 *
 * @param {String[]} ids
 * @returns {DB.VocabEntry[]}
 */
export function db_get_vocabs(ids) {
  return ids.map((id) => get_vocab(db, id));
}

/**
 * Retrieves the state of sound effect from local storage.
 * @returns {boolean}
 */
 export function local_get_sound_effects() {
  let data = get("team8");

  return data.sound_effects_enabled || false 
}

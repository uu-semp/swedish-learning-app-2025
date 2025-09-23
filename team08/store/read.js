import { get } from "./alternative_backend/save.js";
import * as Types from "./storage_type.js";
import * as DB from "./alternative_backend/database_type.js";
import { get_vocab, loaddb } from "./alternative_backend/vocabulary_await.js";
import { TEAM, CATEGORIES } from "./store_config.js";

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
  let data = get(TEAM);
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
  let data = get(TEAM);

  if (data.category === undefined) {
    return null;
  }

  return get(TEAM).category;
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
  if (ids.length < n) {
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
 * @returns {Types.Guess[]} guesses
 */
export function local_get_guesses() {
  /** @type {Types.Team8Storage} */
  let data = get(TEAM);
  return data.guesses;
}

/**
 * @typedef CleanGuesses
 * @property {String} guessed_correct
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
      vocab: get_vocab(db, guess.id),
    };
  });
}

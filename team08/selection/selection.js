import {
  db_get_categories,
  db_get_n_random_words,
  db_get_vocabs,
  init_db,
  local_get_categories,
  local_get_guesses,
} from "../store/read.js";
import { local_set_guesses } from "../store/write.js";
import * as Types from "../store/storage_type.js";
import * as DB from "../store/alternative_backend/database_type.js";

/**
 * @typedef WordSelect
 * @property {DB.VocabEntry} correct_word
 * @property {DB.VocabEntry[]} wrong_words
 *
 */

await init_db();

/** @type {Types.Guess[]} */
let guesses = [];

let words = db_get_categories(local_get_categories());

/**
 *
 * @returns {WordSelect}
 */
export function get_next_word_and_images() {
  /**
   * @type {DB.Vocabulary[]}
   */
  const WORDS = db_get_vocabs(db_get_n_random_words(words, 3));
  return {
    correct_word: WORDS[0],
    wrong_words: WORDS.slice(1, 3),
  };
}

/**
 * @param {Types.Guess} guess
 */
export function update_selection(guess) {
  guesses.push(guess);
  if (guess.guessed_correct) {
    words = words.filter((id) => id != guess.id);
  }
}

export function finish_game() {
  local_set_guesses(guesses);
}

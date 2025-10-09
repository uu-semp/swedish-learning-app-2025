import {
  db_get_categories,
  db_get_vocabs,
  get_n_random_words,
  init_db,
  local_get_categories,
} from "../store/read.js";
import { local_set_guesses, local_wipe_guesses } from "../store/write.js";
import * as Types from "../store/storage_type.js";
import { get } from "../store/backend_interface/save.js";
import { TEAM } from "../store/store_config.js";

/**
 * @typedef {Object} FrontVocab
 * @property {string} en - English word (e.g., "sweater").
 * @property {string} sv - Swedish translation.
 * @property {string} img - Copyright or license information for the image.
 * @property {string} audio - URL or path to audio pronunciation (may be empty).
 * @property {string} id - URL or path to audio pronunciation (may be empty).
 */

/**
 * @typedef WordSelect
 * @property {Number} correct_index
 * @property {FrontVocab} words
 *
 */

await init_db();

/** @type {Types.Guess[]} */
let guesses;

let words;

reset_selection();

export function reset_selection() {
  local_wipe_guesses();
  guesses = [];
  words = db_get_categories(local_get_categories());
}

/**
 *
 * @returns {WordSelect}
 */
export function get_next_words() {
  const IDS = get_n_random_words(words, 3);
  const WORDS = db_get_vocabs(IDS);

  const RESULT = [];
  for (let i = 0; i < 3; i++) {
    /** @type {FrontVocab} */
    const ITEM = {
      en: WORDS[i].en,
      sv: WORDS[i].sv,
      img: WORDS[i].img,
      audio: WORDS[i].audio,
      id: IDS[i],
    };
    RESULT.push(ITEM);
  }
  return {
    correct_index: Math.floor(Math.random() * IDS.length),
    words: RESULT,
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

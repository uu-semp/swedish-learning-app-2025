import {
  FETCH_EXTERNAL,
  EXTERNAL_URL,
  INTERNAL_URL,
} from "./database_config.js";
import * as DB from "./database_type.js"
// ==============================================
// Owned by the Data Team and Game08
// ==============================================

/**
 * @typedef {Object.<string, DB.VocabEntry>} VocabMap
 * A map where keys are strings and values are VocabEntry objects.
 */

/**
 * @typedef {Object.<string, string[]>} CategoryMap
 * A map where keys are categories and values are a list of ids.
 */

/**
 * @typedef {string[]} IdList
 * A list of vocab IDs
 */

// Currently there are some problems with these typings because of how the database is structured.
/**
 * @typedef {Object} RowItem
 * @property {string} Article - The grammatical article (e.g., "ett" or "en").
 * @property {string} Audio_url - URL or path to audio pronunciation (may be empty).
 * @property {string} Audio__is_plural - checkbox for if the audio contains a plural of the word
 * @property {string} Category - Category of the item (e.g., "furniture").
 * @property {string} Subcategory - Subcategory of the item (e.g., "hats" from category clothing). (may be empty)
 * @property {string} English - English word (e.g., "window").
 * @property {string} ID - Unique identifier for the entry.
 * @property {string} Image_copyright_info - Copyright or license information for the image.
 * @property {string} Image_url - URL or path to the image.
 * @property {string} Image_is_plural - checkbox for if the image contains a plural of the word
 * @property {string} Literal - Literal translation (can be empty).
 * @property {string} Swedish - Swedish word (e.g., "fönster").
 * @property {string} Swedish_plural - Swedish plural form (may be empty).
 * @property {string} Game02
 * @property {string} Game03
 * @property {string} Team03
 * @property {string} Game04
 * @property {string} Game05
 * @property {string} Game06
 * @property {string} Game07
 * @property {string} Game08
 * @property {string} Game09
 * @property {string} Game10
 * @property {string} Game11
 * @property {string} Team12
 * @property {string} Game12
 * @property {string} Game13
 * @property {string} Game14
 * @property {string} Game15
 */

/**
 * @typedef {Object} Database
 * @property {RowItem[]} rows
 * @property {VocabMap} vocab
 * @property {IdList} game
 * @property {number} vocabLength
 * @property {CategoryMap} categories
 */

/** @type {Database} */
let db;

async function fetch_sheets() {
  const SRC = FETCH_EXTERNAL
    ? EXTERNAL_URL
    : new URL(INTERNAL_URL, import.meta.url);
  const RESP = await fetch(SRC);
  // Without this a 404 body gets handed to the CSV parser and silently
  // becomes an empty database.
  if (!RESP.ok) {
    throw new Error(`Vocabulary: HTTP ${RESP.status} fetching ${SRC}`);
  }
  return await RESP.text();
}

/**
 * @param {number} [game_id=-1] The game number, if game-specific data should be loaded
 */
export async function loaddb(game_id = -1) {
  // Fetching a parser
  const papa_promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  // Fetching sheets
  const text = await fetch_sheets();
  await papa_promise;

  console.log("Data: All data received");

  // Parsing sheets
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const rows = parsed.data;

  const numericGameId = Number(game_id);
  const game_column = Number.isInteger(numericGameId) && numericGameId > 0
    ? `Game${String(numericGameId).padStart(2, "0")}`
    : null;

  // Creating two alternative access patterns based on rows
  const idToMeta = {};
  const gameIds = [];
  const catToIds = {};

  for (const row of rows) {
    const id = row["ID"]?.trim();
    if (!id) continue;

    // Metadata
    const meta = { en: row["English"], sv: row["Swedish"] };
    if (row["Article"]?.trim()) meta.article = row["Article"];
    if (row["Literal"]?.trim()) meta.literal = row["Literal"];
    if (row["Image_url"]?.trim()) meta.img = row["Image_url"];
    if (row["Image_copyright_info"]?.trim())
      meta.img_copyright = row["Image_copyright_info"];
    if (row["Audio_url"]?.trim()) meta.audio = row["Audio_url"];
    
    // Category
    const cat = row["Category"]?.trim();
    if (cat) {
      if (!catToIds[cat]) catToIds[cat] = [];
      catToIds[cat].push(id);
    }

    if(row["Subcategory"]?.trim()){ 
      meta.subCat = row["Subcategory"];
    }

    if(row["Image_is_plural"]?.trim() && row["Image_url"]?.trim()){ 
      meta.img_is_plural = row["Image_is_plural"];
    }
    
    if(row["Audio_is_plural"]?.trim() && row["Audio_url"]?.trim()){ 
      meta.audio_is_plural = row["Audio_is_plural"];
    }

    // Game data
    if (game_column && row[game_column]?.trim()) {
      meta.game = row[game_column].trim();
      gameIds.push(id);
    }


    idToMeta[id] = meta;
  }

  db = {
    vocab: idToMeta,
    categories: catToIds,
    rows: rows,
    game: gameIds,
    vocabLength: Object.keys(idToMeta).length,
  };
}

/**
 *
 * @param {string} id
 * @returns {DB.VocabEntry | null}
 */
export function get_vocab(id) {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }

  if (id in db.vocab) {
    return db.vocab[id];
  }

  return null;
}

/**
 * Returns a list of vocabulary IDs belonging to the given category.
 * @param {string} category
 * @returns {string[] | null}
 */
export function get_category(category) {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }
  if (category in db.categories) {
    return db.categories[category];
  }

  return null;
}

const STORAGE_PREFIX = "vocab_progress:";

function loadMastered(gameId) {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_PREFIX + gameId) || "[]"));
  } catch (e) {
    return new Set();
  }
}

export function mark_correct(gameId, wordId) {
  const mastered = loadMastered(gameId);
  mastered.add(wordId);
  localStorage.setItem(STORAGE_PREFIX + gameId, JSON.stringify([...mastered]));
}

export function reset_progress(gameId) {
  localStorage.removeItem(STORAGE_PREFIX + gameId);
}

/**
 * Counts eligible IDs for a game's progress pool.
 * @param {string} gameId Progress key.
 * @param {string[]} [candidateIds] Optional subset to count.
 * @returns {number}
 */
export function remaining_count(gameId, candidateIds) {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return 0;
  }

  const mastered = loadMastered(gameId);
  const pool = Array.isArray(candidateIds)
    ? [...new Set(candidateIds)]
    : Object.keys(db.vocab);
  return pool.filter(id => !mastered.has(id)).length;
}

/**
 * Selects a random eligible ID from a progress pool.
 * Candidate IDs may be application-specific stable IDs, not just vocabulary IDs.
 * @param {string} gameId Progress key.
 * @param {string[]} [candidateIds] Optional subset to choose from.
 * @returns {string | null}
 */
export function get_random_id(gameId, candidateIds) {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }

  const pool = Array.isArray(candidateIds)
    ? [...new Set(candidateIds)]
    : Object.keys(db.vocab);
  const mastered = loadMastered(gameId);
  const eligible = pool.filter(id => !mastered.has(id));
  if (eligible.length === 0) return null;

  return eligible[Math.floor(Math.random() * eligible.length)];
}


/**
 * @description Returns a random vocabulary item. See `get_vocab()`
 * @param {string} [gameId] Progress key used to exclude mastered vocabulary.
 * @param {string[]} [candidateIds] Optional IDs to choose from.
 * @returns {DB.VocabEntry | null}
 */
export function get_random(gameId, candidateIds) {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }

  const availableIds = Array.isArray(candidateIds)
    ? candidateIds.filter(id => Object.hasOwn(db.vocab, id))
    : Object.keys(db.vocab);
  let id = null;
  if (gameId) {
    id = get_random_id(gameId, availableIds);
  } else if (availableIds.length > 0) {
    id = availableIds[Math.floor(Math.random() * availableIds.length)];
  }
  if (id === null) return null;

  return { ...db.vocab[id], id };
}

export function deprecated_load_game_data(game_id) {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }

  const numericGameId = Number(game_id);
  const game_column = Number.isInteger(numericGameId) && numericGameId > 0
    ? `Game${String(numericGameId).padStart(2, "0")}`
    : null;

  const gameIds = [];

  for (const row of db.rows) {
    const id = row["ID"]?.trim();
    if (!id) continue;

    delete db.vocab[id].game;

    // Game data
    if (game_column && row[game_column]?.trim()) {
      db.vocab[id].game = row[game_column].trim();
      gameIds.push(id);
    }
  }

  db.game = gameIds;
}

/**
 * Returns a list of IDs which have game specific data attached to them
 * @returns {IdList}
 */
export function vocab_with_game_data() {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }

  return db.game;
}

export function test() {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }
  console.log(db.rows[0].Article != null);
  console.log(db.rows[0].Audio_url != null);
  console.log(db.rows[0].Category != null);
  console.log(db.rows[0].English != null);
  console.log(db.rows[0].Swedish != null);
  console.log(db.rows[0].Swedish_plural != null);
  console.log(db.rows[0].Game02 != null);
  console.log(db.rows[0].Game03 != null);
  console.log(db.rows[0].Team03 != null);
  console.log(db.rows[0].Game04 != null);
  console.log(db.rows[0].Game05 != null);
  console.log(db.rows[0].Game06 != null);
  console.log(db.rows[0].Game07 != null);
  console.log(db.rows[0].Game08 != null);
  console.log(db.rows[0].Game09 != null);
  console.log(db.rows[0].Game10 != null);
  console.log(db.rows[0].Game11 != null);
  console.log(db.rows[0].Team12 != null);
  console.log(db.rows[0].Game12 != null);
  console.log(db.rows[0].Game13 != null);
  console.log(db.rows[0].Game14 != null);
  console.log(db.rows[0].Game15 != null);

  let result = true;

  db.rows.forEach((el) => {
    result =
      result &&
      !(
        el.Article == null ||
        el.Audio_url == null ||
        el.Category == null ||
        el.English == null ||
        el.Swedish == null ||
        el.Swedish_plural == null ||
        el.Game02 == null ||
        el.Game03 == null ||
        el.Team03 == null ||
        el.Game04 == null ||
        el.Game05 == null ||
        el.Game06 == null ||
        el.Game07 == null ||
        el.Game08 == null ||
        el.Game09 == null ||
        el.Game10 == null ||
        el.Game11 == null ||
        el.Team12 == null ||
        el.Game12 == null ||
        el.Game13 == null ||
        el.Game14 == null ||
        el.Game15 == null
      );
  });

  console.log(result);

  result = true;
  console.log(db.vocabLength == db.rows.length);

  // This fails because vocab key is not always initiated, better to set as zero?
  Object.keys(db.vocab).forEach((key) => {
    result =
      result &&
      db.vocab[key].en != null &&
      db.vocab[key].sv != null &&
      db.vocab[key].article != null;
  });

  console.log(result);
}

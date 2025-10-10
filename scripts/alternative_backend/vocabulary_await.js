import * as DB from "./database_type.js";
import {
  FETCH_EXTERNAL,
  EXTERNAL_URL,
  INTERNAL_URL,
} from "./database_config.js";
// ==============================================
// Owned by the Data Team and Team08
// ==============================================

/**
 * @typedef {Object.<string, VocabEntry>} VocabMap
 * A map where keys are strings and values are VocabEntry objects.
 */

/**
 * @typedef {Object.<string, string[]>} CategoryMap
 * A map where keys are categories and values are a list of ids.
 */

// Currently there are some problems with these typings because of how the database is structured.
/**
 * @typedef {Object} RowItem
 * @property {string} Article - The grammatical article (e.g., "ett" or "en").
 * @property {string} Audio_url - URL or path to audio pronunciation (may be empty).
 * @property {string} Category - Category of the item (e.g., "furniture").
 * @property {string} English - English word (e.g., "window").
 * @property {string} ID - Unique identifier for the entry.
 * @property {string} Image_copyright_info - Copyright or license information for the image.
 * @property {string} Image_url - URL or path to the image.
 * @property {string} Literal - Literal translation (can be empty).
 * @property {string} Swedish - Swedish word (e.g., "fönster").
 * @property {string} Swedish_plural - Swedish plural form (may be empty).
 * @property {string} Team01
 * @property {string} Team02
 * @property {string} Team03
 * @property {string} Team04
 * @property {string} Team05
 * @property {string} Team06
 * @property {string} Team07
 * @property {string} Team08
 * @property {string} Team09
 * @property {string} Team10
 * @property {string} Team11
 * @property {string} Team12
 * @property {string} Team13
 * @property {string} Team14
 * @property {string} Team15
 * @property {string} Team16
 */

/**
 * @typedef {Object} Database
 * @property {RowItem[]} rows
 * @property {VocabMap} vocab
 * @property {number} vocabLength
 * @property {CategoryMap} categories
 * @property {number} categoryLength
 */

/** @type {Database} */
let db;

async function fetch_sheets() {
  const RESP = await fetch(FETCH_EXTERNAL ? EXTERNAL_URL : INTERNAL_URL);
  return await RESP.text();
}

/**
 *
 */
export async function loaddb() {
  // Fetching a parser
  const papa_promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  await papa_promise;

  // Fetching sheets
  const text = await fetch_sheets();

  console.log("Data: All data received");

  // Parsing sheets
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const rows = parsed.data;

  // Creating two alternative access patterns based on rows
  const idToMeta = {};
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
    idToMeta[id] = meta;

    // Category
    const cat = row["Category"]?.trim();
    if (cat) {
      if (!catToIds[cat]) catToIds[cat] = [];
      catToIds[cat].push(id);
    }
  }

  db = {
    vocab: idToMeta,
    categories: catToIds,
    rows: rows,
    vocabLength: Object.keys(idToMeta).length,
    categoryLength: Object.keys(catToIds).length,
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

/**
 * @description Returns a random vocabulary item. See `get_vocab()`
 * @returns {DB.VocabEntry}
 */
export function get_random() {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }
  const ids = Object.keys(db.vocab);
  const randomIndex = Math.floor(Math.random() * db.vocabLength);
  return db.vocab[ids[randomIndex]];
}

export function fetch_team_data(TEAM) {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }
  db.rows.forEach((row) => {
    db.vocab[row.ID][TEAM] = row[TEAM];
  });
}

/** TESTS */

export function test() {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }

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
        el.Team01 == null ||
        el.Team02 == null ||
        el.Team03 == null ||
        el.Team04 == null ||
        el.Team05 == null ||
        el.Team06 == null ||
        el.Team07 == null ||
        el.Team08 == null ||
        el.Team09 == null ||
        el.Team10 == null ||
        el.Team11 == null ||
        el.Team12 == null ||
        el.Team13 == null ||
        el.Team14 == null ||
        el.Team15 == null ||
        el.Team16 == null
      );
  });

  console.log("Check that all fields are non-empty: ", result);

  console.log(
    "checking that vocab and rows length is the same",
    db.vocabLength == db.rows.length
  );

  result = true;
  // This fails because vocab key is not always initiated, better to set as zero?
  Object.keys(db.vocab).forEach((key) => {
    result =
      result &&
      db.vocab[key].en != null &&
      db.vocab[key].sv != null &&
      db.vocab[key].article != null;
  });

  console.log(
    "Check that english and swedish and article are always defined: ",
    result
  );

  fetch_team_data("Team04");
  let tests = ["623a056b", "2c6d3f66", "47662d57"];
  result = true;
  tests.forEach((test) => {
    result = result && db.vocab[test].Team04 != null;
  });
  console.log("Fetching team data test: ", result);

  result = true;
  Object.keys(db.vocab).forEach((key) => {
    result = db.vocab[key].Team04 != undefined && result;
  });
  console.log("TEAM04 rows are null now: ", result);
  result = true;
  Object.keys(db.vocab).forEach((key) => {
    result = db.vocab[key].Team05 == undefined && result;
  });
  console.log("Team05 rows are still undefined: ", result);
}

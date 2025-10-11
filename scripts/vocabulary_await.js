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

/**
 * @typedef {Object.<string[]>} IdList
 * A list of vocab IDs
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
 * @property {IdList} team
 * @property {number} vocabLength
 * @property {CategoryMap} categories
 */

/** @type {DB.Database} */
let db;

async function fetch_sheets() {
  const RESP = await fetch(FETCH_EXTERNAL ? EXTERNAL_URL : INTERNAL_URL);
  return await RESP.text();
}

/**
 * @param {int} team_id The number of your team, if team specific data should be loaded
 */
export async function loaddb(team_id = -1) {
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

  // Stringify incase this get a number
  const team_id_str = String(team_id).padStart(2, "0");
  const team_column = `Team${team_id_str}`;

  // Creating two alternative access patterns based on rows
  const idToMeta = {};
  const teamIds = {};
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

    // Team data
    if (team_column && row[team_column]) {
      meta.team = row[team_column].trim();
      teamIds.push(id);
    };
  }

  db = {
    vocab: idToMeta,
    categories: catToIds,
    rows: rows,
    team: teamIds,
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

export function deprecated_load_team_data(team_id) {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }

  // Stringify incase this get a number
  const team_id_str = String(team_id).padStart(2, "0");
  const team_column = `Team${team_id_str}`;

  const teamIds = [];

  for (const row of db.rows) {
    const id = row["ID"]?.trim();
    if (!id) continue;

    // Team data
    if (team_column && row[team_column]) {
      db.vocab[id].team = row[team_column].trim();
      teamIds.push(id);
    };
  }

  db.team = teamIds;
}

/**
 * Returns a list of IDs which have team specific data attached to them
 * @returns {IdList}
 */
export function vocab_with_team_data() {
  if (db == undefined) {
    console.error("Database has not been loaded");
    return null;
  }

  return db.team;
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
  console.log(db.rows[0].Team01 != null);
  console.log(db.rows[0].Team02 != null);
  console.log(db.rows[0].Team03 != null);
  console.log(db.rows[0].Team04 != null);
  console.log(db.rows[0].Team05 != null);
  console.log(db.rows[0].Team06 != null);
  console.log(db.rows[0].Team07 != null);
  console.log(db.rows[0].Team08 != null);
  console.log(db.rows[0].Team09 != null);
  console.log(db.rows[0].Team10 != null);
  console.log(db.rows[0].Team11 != null);
  console.log(db.rows[0].Team12 != null);
  console.log(db.rows[0].Team13 != null);
  console.log(db.rows[0].Team14 != null);
  console.log(db.rows[0].Team15 != null);
  console.log(db.rows[0].Team16 != null);

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

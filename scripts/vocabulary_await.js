// ==============================================
// Owned by the Data Team
// ==============================================

const FETCH_EXTERNAL = false;

/**
 * @typedef {Object} VocabEntry
 * @property {string} en - English word (e.g., "sweater").
 * @property {string} sv - Swedish translation.
 * @property {string} article - Swedish article ("en" or "ett").
 */

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
 * @property {string} Swedish_Plural - Swedish plural form (may be empty).
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

export async function fetch_sheets() {
  const sheetId = "1de16iRzmgSqWvTTxiNvQYM79sWJBwFJN0Up3Y0allDg";
  const external_url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

  const resp = await fetch(FETCH_EXTERNAL ? external_url : "../words.csv");
  return await resp.text();
}

/**
 *
 * @returns { Promise<Database>}
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
    if (row["Image-url"]?.trim()) meta.img = row["Image-url"];
    if (row["Audio-url"]?.trim()) meta.audio = row["Audio-url"];
    idToMeta[id] = meta;

    // Category
    const cat = row["Category"]?.trim();
    if (cat) {
      if (!catToIds[cat]) catToIds[cat] = [];
      catToIds[cat].push(id);
    }
  }

  return {
    vocab: idToMeta,
    categories: catToIds,
    rows: rows,
    vocabLength: Object.keys(idToMeta).length,
    categoriesLength: Object.keys(catToIds).length,
  };
}

/**
 *
 * @param {Database} db
 * @param {string} id
 * @returns {string | null}
 */
export function get_vocab(db, id) {
  if (id in db.vocab) {
    return db.vocab[id];
  }

  return null;
}

/**
 * Returns a list of vocabulary IDs belonging to the given category.
 * @param {Database} db
 * @param {string} category
 * @returns {string | null}
 */
export function get_category(db, category) {
  if (category in db.categories) {
    return db.categories[category];
  }

  return null;
}

/**
 * @description Returns a random vocabulary item. See `get_vocab()`
 * @param {Database} db
 * @returns {string}
 */
export function get_random(db) {
  const ids = Object.keys(db.vocab);
  const randomIndex = Math.floor(Math.random() * vocabLength);
  return db.vocab[ids[randomIndex]];
}

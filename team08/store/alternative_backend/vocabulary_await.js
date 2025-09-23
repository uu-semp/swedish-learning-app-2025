import * as DB from "./database_type.js";
// ==============================================
// Owned by the Data Team
// ==============================================

const FETCH_EXTERNAL = true;

export async function fetch_sheets() {
  const sheetId = "1de16iRzmgSqWvTTxiNvQYM79sWJBwFJN0Up3Y0allDg";
  const external_url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

  const resp = await fetch(
    FETCH_EXTERNAL ? external_url : "../../../words.csv"
  );
  return await resp.text();
}

/**
 *
 * @returns { Promise<DB.Database>}
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
 * @param {DB.Database} db
 * @param {string} id
 * @returns {DB.VocabEntry | null}
 */
export function get_vocab(db, id) {
  if (id in db.vocab) {
    return db.vocab[id];
  }

  return null;
}

/**
 * Returns a list of vocabulary IDs belonging to the given category.
 * @param {DB.Database} db
 * @param {string} category
 * @returns {string[] | null}
 */
export function get_category(db, category) {
  if (category in db.categories) {
    return db.categories[category];
  }

  return null;
}

/**
 * @description Returns a random vocabulary item. See `get_vocab()`
 * @param {DB.Database} db
 * @returns {DB.VocabEntry}
 */
export function get_random(db) {
  const ids = Object.keys(db.vocab);
  const randomIndex = Math.floor(Math.random() * db.vocabLength);
  return db.vocab[ids[randomIndex]];
}

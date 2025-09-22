// ==============================================
// Owned by the Data Team
// ==============================================

/**
 * @typedef {Object} VocabItem
 * @property {string} en - English word (e.g., "sweater").
 * @property {string} sv - Swedish translation (e.g., "tröja").
 * @property {string} article - Swedish article ("en" or "ett").
 */

/**
 * @typedef {Object} RowItem
 * @property {string} Article - The grammatical article ("ett" or "en").
 * @property {string} AudioUrl - URL to audio pronunciation (may be empty).
 * @property {string} Category - Category of the word (e.g., "furniture").
 * @property {string} English - English word (e.g., "window").
 * @property {string} ID - Unique identifier for the entry.
 * @property {string} ImageUrl - Path or URL to the image (e.g., "/team08/assets/images/image1.png").
 * @property {string} Literal - Literal translation (can be empty).
 * @property {string} Swedish - Swedish word (e.g., "fönster").
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
 * @property {string} Team17
 */

/**
 * @typedef {Object} Database
 * @property {VocabItem[]} vocab - Array of basic vocabulary entries.
 * @property {RowItem[]} rows - Array of detailed entries with metadata.
 * @property {string[]} category - List of category names.
 */

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
  const sheetId = "1de16iRzmgSqWvTTxiNvQYM79sWJBwFJN0Up3Y0allDg";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

  const resp = await fetch(url);
  const text = await resp.text();

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
  };
}

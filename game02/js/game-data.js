// ==============================================
// Owned by Game 02 — vocabulary loading
// ==============================================

"use strict";

import {
  loaddb,
  get_category,
  get_vocab,
} from "../../scripts/vocabulary_await.js";
import { getRandomPairs, prepareGridItems, renderGrid } from "./cards.js";

// Dialect recordings are named <prefix><english word>.mp3 inside their dialect folder
const dialect_prefixes = { malmo: "s_", gothenburg: "g_", "finnish-swedish": "f_" };
// Words a dialect has no recording for yet (remove a word when its recording is added)
const dialect_missing = {
  malmo: ["floor"],
  gothenburg: ["bookshelf", "carpet", "refrigerator", "wall", "wardrobe", "window"],
  "finnish-swedish": ["stove"],
};

let dbLoading = null;

// Starts the download the first time, then lets every caller wait for that same download
export function initDb() {
  if (!dbLoading) {
    dbLoading = loaddb();
  }
  return dbLoading;
}

export async function loadPairs(numPairs, category, dialect = "standard") {
  await initDb();

  // Get all vocabulary IDs belonging to the chosen category ("furniture", "clothing" or "food")
  const ids = get_category(category);

  if (!ids) {
    console.error(`No ${category} category found in database`);
    return [];
  }

  // Convert to the format expected by getRandomPairs
  const data = ids
    .map((id) => {
      const vocab = get_vocab(id);
      if (vocab && vocab.img) {
        let audio_url = vocab.audio;
        if (dialect !== "standard") {
          // "game02/" is needed because clickCard puts "../" in front of the path
          audio_url = `game02/assets/audio/dialects/${dialect}/${dialect_prefixes[dialect]}${vocab.en}.mp3`;
        }
        return {
          id: id,
          english: vocab.en,
          article: vocab.article || "",
          swedish: vocab.sv,
          swedish_plural: "", // Not available in new API
          literal: vocab.literal || "",
          category: category,
          image_url: vocab.img,
          audio_url: audio_url,
        };
      }
      return null;
    })
    .filter((item) => item !== null)
    // Leave out the words this dialect has no recording for
    .filter((item) => dialect === "standard" || !dialect_missing[dialect].includes(item.english));

  return getRandomPairs(data, numPairs);
}

export function buildGrid(pairs, mode) {
  const cards = prepareGridItems(pairs, mode);
  renderGrid(cards);
}

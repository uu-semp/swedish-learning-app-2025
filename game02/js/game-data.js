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

let dbLoading = null;

// Starts the download the first time, then lets every caller wait for that same download
export function initDb() {
  if (!dbLoading) {
    dbLoading = loaddb();
  }
  return dbLoading;
}

export async function loadFurniturePairs(numPairs) {
  await initDb();

  // Get all vocabulary IDs belonging to the category `furniture`
  const furnitureIds = get_category("furniture");

  if (!furnitureIds) {
    console.error("No furniture category found in database");
    return [];
  }

  // Convert to the format expected by getRandomPairs
  const furnitureData = furnitureIds
    .map((id) => {
      const vocab = get_vocab(id);
      if (vocab && vocab.img) {
        return {
          id: id,
          english: vocab.en,
          article: vocab.article || "",
          swedish: vocab.sv,
          swedish_plural: "", // Not available in new API
          literal: vocab.literal || "",
          category: "furniture",
          image_url: vocab.img,
          audio_url: vocab.audio,
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  return getRandomPairs(furnitureData, numPairs);
}

export function buildGrid(pairs, mode) {
  const cards = prepareGridItems(pairs, mode);
  renderGrid(cards);
}

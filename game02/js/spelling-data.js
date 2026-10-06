// ==============================================
// Owned by Game 02 — spelling game vocabulary
// ==============================================

"use strict";

import { get_category, get_vocab } from "../../scripts/vocabulary_await.js";
import { initDb } from "./game-data.js";
import { getRandomPairs } from "./cards.js";

// Change (or extend) this to widen the pool later
const SPELLING_CATEGORY = "furniture";

// Vocab image paths are relative to the repo root, our pages are in game02/
function imagePath(img) {
  return img.startsWith("assets/") ? "../" + img : img;
}

/**
 * Picks `count` random words for a spelling round: furniture entries that
 * have an image showing a single object.
 * @returns {Promise<Array<{id: *, sv: string, article: string, img: string}>>}
 */
export async function loadSpellingWords(count = 8) {
  await initDb();

  const ids = get_category(SPELLING_CATEGORY);
  if (!ids) {
    console.error(`No ${SPELLING_CATEGORY} category found in database`);
    return [];
  }

  const pool = ids
    .map((id) => ({ id, vocab: get_vocab(id) }))
    .filter(
      ({ vocab }) =>
        vocab &&
        vocab.sv &&
        vocab.img &&
        String(vocab.img_is_plural ?? "").toUpperCase() !== "TRUE"
    )
    .map(({ id, vocab }) => ({
      id,
      sv: vocab.sv,
      article: vocab.article || "",
      img: imagePath(vocab.img),
    }));

  return getRandomPairs(pool, count);
}

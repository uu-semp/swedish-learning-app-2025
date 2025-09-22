import { loaddb } from "../scripts/vocabulary_await.js";
// ==============================================
// Owned by Team 08
// ==============================================

async function get_vocabulary_word() {
  const db = await loaddb();
  const randomIndex = Math.floor(Math.random() * db.rows.length);
  return db.rows[randomIndex].Swedish;
}

document.querySelector("#display-vocab").textContent =
  await get_vocabulary_word();

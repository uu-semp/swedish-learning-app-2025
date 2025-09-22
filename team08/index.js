import { loaddb } from "../scripts/vocabulary_await.js";
// ==============================================
// Owned by Team 08
// ==============================================
const db = await loaddb();

function get_vocabulary_word() {
  const randomIndex = Math.floor(Math.random() * db.rows.length);
  return db.rows[randomIndex].Swedish;
}

document.querySelector("#display-vocab").textContent = get_vocabulary_word();

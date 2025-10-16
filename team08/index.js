// ==============================================
// Owned by Team 08
// ==============================================

import "./options/settings.js";
import { local_get_persistent_notice } from "./store/read.js";
import { local_set_persistent_notice } from "./store/write.js";

const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", () => {
  // Navigate to main game page
  window.location.href = "./select.html";
});

/** Handling tutorial */

const tutorialBtn = document.querySelector(".welcome__tutorial-btn");
/** @type {HTMLDialogElement | null} */
const tutorial_modal = document.getElementById("tutorial-modal");

const close_tutorial_modal = document.getElementById("close-tutorial");

tutorialBtn.addEventListener("click", () => {
  tutorial_modal?.showModal();
});

close_tutorial_modal.addEventListener("click", () => {
  tutorial_modal?.close();
});

tutorial_modal?.addEventListener("click", (e) => {
  if (e.target === tutorial_modal) {
    tutorial_modal.close();
  }
});

const persistentPopup = document.querySelector("#persistent-popup");
const proceedBtn = document.querySelector("#persistent-popup button");
if (local_get_persistent_notice()) {
  persistentPopup.style.display = "none";
}

proceedBtn.addEventListener("click", () => {
  local_set_persistent_notice(true);
  persistentPopup.style.display = "none";
});

// ==============================================
// Owned by Team 08
// ==============================================

import "./options/settings.js";

const startBtn = document.getElementById("start-btn");
const tutorialBtn = document.querySelector(".welcome__tutorial-btn");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    // Navigate to main game page
    window.location.href = "./select.html";
  });
}

if (tutorialBtn) {
  tutorialBtn.addEventListener("click", () => {
    // TODO Navigate to tutorial page
    window.location.href = "./end-screen/index.html";
  });
}

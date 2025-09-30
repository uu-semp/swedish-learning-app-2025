// ==============================================
// Owned by Team 08
// ==============================================

import "./options/settings.js";

const init = () => {
  const startBtn = document.getElementById("start-btn");
  const tutorialBtn = document.querySelector(".welcome__tutorial-btn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      // Navigate to main game page
      window.location.href = "./index.html";
    });
  }

  if (tutorialBtn) {
    tutorialBtn.addEventListener("click", () => {
      // Navigate to tutorial page
      window.location.href = "./index.html";
    });
  }
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);

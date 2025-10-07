// ==============================================
// Owned by Team 08
// ==============================================

import "./options/settings.js";
import { init_db } from "./store/read.js";

const init = async () => {
  await init_db();

  const startBtn = document.getElementById("start-btn");
  const tutorialBtn = document.querySelector(".welcome__tutorial-btn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      // Navigate to main game page
<<<<<<< HEAD
      window.location.href = "./main_game/main_game_component.html";
=======
      window.location.href = "./select.html";
>>>>>>> main
    });
  }

  if (tutorialBtn) {
    tutorialBtn.addEventListener("click", () => {
      // TODO Navigate to tutorial page
      window.location.href = "./end-screen/index.html";
    });
  }
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);

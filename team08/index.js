import "./settings.js";
import { loaddb } from "./store/alternative_backend/vocabulary_await.js";
// ==============================================
// Owned by Team 08
// ==============================================

"use strict";

const init = () => {
  const startBtn = document.getElementById('start-btn');
  const tutorialBtn = document.querySelector('.welcome__tutorial-btn');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // Navigate to main game page
      window.location.href = './game.html';
    });
  }

  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', () => {
      // Navigate to tutorial page
      window.location.href = './tutorial.html';
    });
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
// Welcome page JS for Team 08 — ES module, no jQuery
"use strict";

const init = () => {
  const startBtn = document.getElementById('start-btn');
  const tutorialBox = document.querySelector('.welcome__tutorial-box');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // navigate to Team 08 root (adjust if your main page is elsewhere)
      window.location.href = './index.html';
    });
  }

  if (tutorialBox) {
    tutorialBox.addEventListener('click', () => {
      // placeholder action for tutorial page — update target as needed
      window.location.href = '../index.html';
    });

    tutorialBox.setAttribute('tabindex', '0');
    tutorialBox.setAttribute('role', 'button');
  }

  const display = document.getElementById('display-vocab');
  if (display && window.vocabulary && typeof window.vocabulary.get_random === 'function') {
    display.textContent = JSON.stringify(window.vocabulary.get_random());
  }
};

const whenVocabularyReady = () => {
  if (window.vocabulary && typeof window.vocabulary.when_ready === 'function') {
    window.vocabulary.when_ready(init);
  } else {
    // fallback if vocabulary not provided
    document.addEventListener('DOMContentLoaded', init);
  }
};

whenVocabularyReady();

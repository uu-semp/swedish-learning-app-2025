// ==============================================
// Owned by Team 05
// ==============================================

"use strict";

$(function () {
  window.vocabulary.when_ready(function () {

    // --- Step 1: Load data using the vocabulary API ---
    async function loadVocabulary() {
      // Get all vocabulary IDs belonging to the "furniture" category.
      const furnitureIds = window.vocabulary.get_category("furniture");

      // Map the IDs to the data structure our game needs.
      // The async function automatically returns this data as a promise.
      return furnitureIds.map(id => {
        const vocab = window.vocabulary.get_vocab(id);
        return {
          english: vocab.en,
          swedish: vocab.sv,
          image: vocab.img
        };
      });
    }

    // --- Step 2: Globals ---
    let allWords = [];
    let currentLevel = 0;
    const WORDS_PER_LEVEL = 4;
    const connections = {}; // stores imageId -> word

    // --- Step 3: Build a level ---

    function createLevel(words) {
      const imageContainer = document.getElementById("image-container");
      const wordContainer = document.getElementById("word-container");
      const levelText = document.getElementById("level-text");
      const message = document.getElementById("message");

      imageContainer.innerHTML = "";
      wordContainer.innerHTML = "";
      message.textContent = "";
      levelText.textContent = `Level ${currentLevel + 1}/9`;

      // --- Create image boxes (in order, unchanged) ---
      words.forEach((item, index) => {
        const img = document.createElement("img");
        img.src = "/" + item.image;
        img.classList.add("item");
        img.dataset.answer = item.swedish;
        img.dataset.index = index;
        imageContainer.appendChild(img);
      });

      // --- Shuffle word boxes visually ---
      const shuffled = [...words].sort(() => Math.random() - 0.5);

      shuffled.forEach(item => {
        const word = document.createElement("div");
        word.textContent = item.swedish;
        word.classList.add("word");

        // find original index for matching logic
        const originalIndex = words.findIndex(w => w.swedish === item.swedish);
        word.dataset.word = item.swedish;
        word.dataset.index = originalIndex;

        wordContainer.appendChild(word);
      });

      setupMatching();
    }


    // --- Step 4: Setup Matching Logic ---
    function setupMatching() {
      const items = document.querySelectorAll(".item");
      const words = document.querySelectorAll(".word");
      let selectedImage = null;
      const lines = {}; // store the drawn lines

      items.forEach(img => {
        img.addEventListener("click", () => {
          selectedImage = img;
          img.classList.add("selected");
          items.forEach(other => {
            if (other !== img) other.classList.remove("selected");
          });
        });
      });

      words.forEach(word => {
        word.addEventListener("click", () => {
          if (selectedImage) {
            const imgIndex = selectedImage.dataset.index;

            // remove old line for this image
            if (lines[imgIndex]) {
              lines[imgIndex].remove();
              delete lines[imgIndex];
            }

            // store connection
            connections[imgIndex] = word.dataset.word;

            // draw a new arrow
            const line = new LeaderLine(
              LeaderLine.pointAnchor(selectedImage, { x: "100%", y: "50%" }),
              LeaderLine.pointAnchor(word, { x: "0%", y: "50%" }),
              { color: "#333", size: 2, path: "straight" }
            );

            lines[imgIndex] = line;
            selectedImage.classList.remove("selected");
            selectedImage = null;
          }
        });
      });

      // store the lines globally for reset
      window.currentLines = lines;
    }

    // --- Step 5: Check answers ---
    // --- Step 5: Check answers ---
    function checkAnswers(levelWords) {
      const message = document.getElementById("message");
      let correct = 0;
      const mistakes = [];

      levelWords.forEach((item, i) => {
        const chosen = connections[i];
        if (chosen === item.swedish) correct++;
        else mistakes.push(`${item.english} → should be "${item.swedish}"`);
      });

      if (correct === levelWords.length) {
        // Check if the level just completed is Level 3 (currentLevel is 0-indexed)
        if (currentLevel === 2) {
          message.textContent = "✅ Well done! Redirecting to the medium levels...";

          setTimeout(() => {
            window.location.href = '../medium';
          }, 2000);

        } else {
          message.textContent = "✅ All correct! Loading next level...";
          currentLevel++;
          setTimeout(nextLevel, 2000);
        }
      } else {
        message.innerHTML = `❌ Some are incorrect:<br>${mistakes.join("<br>")}`;
      }
    }

    // --- Step 6: Next level logic ---
    function nextLevel() {
      const start = currentLevel * WORDS_PER_LEVEL;
      const end = start + WORDS_PER_LEVEL;
      const levelWords = allWords.slice(start, end);

      // No more words = game over
      if (levelWords.length === 0) {
        document.getElementById("message").textContent = "🎉 You finished all levels!";
        document.getElementById("submit-btn").disabled = true;
        document.getElementById("reset-btn").disabled = true;
        return;
      }

      // Clear old lines
      if (window.currentLines) {
        Object.values(window.currentLines).forEach(line => line.remove());
        window.currentLines = {};
      }

      for (const key in connections) delete connections[key];

      // Create the level
      createLevel(levelWords);
    }

    /**
     * Selects hard game level depending on level URL parameter
     */
    function selectLevel() {
      const urlParams = new URLSearchParams(window.location.search);
      const levelFromUrl = urlParams.get('level');
      const parsedLevel = parseInt(levelFromUrl, 10);

      // Check if the parsed level is a number and is within the valid range (7-9)
      if (!isNaN(parsedLevel) && parsedLevel >= 1 && parsedLevel <= 3) {
        currentLevel = parsedLevel - 1;
      }
    }

    // --- Step 7: Button events ---
    document.getElementById("submit-btn").addEventListener("click", () => {
      const start = currentLevel * WORDS_PER_LEVEL;
      const end = start + WORDS_PER_LEVEL;
      const levelWords = allWords.slice(start, end);
      checkAnswers(levelWords);
    });

    document.getElementById("reset-btn").addEventListener("click", () => {
      const start = currentLevel * WORDS_PER_LEVEL;
      const end = start + WORDS_PER_LEVEL;
      const levelWords = allWords.slice(start, end);

      // Clear arrows first
      if (window.currentLines) {
        Object.values(window.currentLines).forEach(line => line.remove());
        window.currentLines = {};
      }

      // Clear connections and recreate the level
      for (const key in connections) delete connections[key];
      createLevel(levelWords);
    });

    // --- Step 8: Initialize ---
    loadVocabulary().then(vocab => {
      selectLevel()
      allWords = vocab;
      nextLevel();
    });
  });
});

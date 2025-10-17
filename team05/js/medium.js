// ==============================================
// Owned by Team 05 — Red Room (Medium Levels 4–6)
// ==============================================

"use strict";

$(function() {
  const SAVE_KEY = "team05";

  // --- Global Game State ---
  const GameState = {
    levels: [], // Holds the vocabulary items for levels 4, 5, and 6.
    items: [], // Items for the current level.
    currentItemIndex: 0,
    currentLevelNumber: 4,
  };

  // --- UI Helper Functions ---
  const showElement = (selector) => $(selector).removeClass("hidden");
  const hideElement = (selector) => $(selector).addClass("hidden");
  const showScreen = (selector) => {
    ["#medium-screen", "#win-screen", "#intro-modal"].forEach(hideElement);
    showElement(selector);
  };

  // --- Utility Functions ---
  /**
   * Shuffles an array using the Fisher-Yates algorithm.
   * @param {Array} array The array to shuffle.
   * @returns {Array} A new array with shuffled items.
   */
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Splits an array into smaller chunks of a specified size.
   * @param {Array} array The array to chunk.
   * @param {number} chunkSize The size of each chunk.
   * @returns {Array<Array>} An array of chunks.
   */
  function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Normalizes a Swedish string for answer checking by trimming, lowercasing,
   * and removing articles ("en" or "ett").
   * @param {string} str The string to normalize.
   * @returns {string} The normalized string.
   */
  function normalizeSwedish(str) {
    return (str || "").trim().toLowerCase().replace(/^(en|ett)\s+/, "");
  }

  // --- Vocabulary and Level Building ---
  /**
   * Loads and formats furniture items from the global vocabulary script.
   */
  function loadFurnitureItems() {
    const ids = (window.vocabulary.get_category && window.vocabulary.get_category("furniture")) || [];
    const items = [];
    for (const id of ids) {
      const vocab = window.vocabulary.get_vocab(id) || {};
      items.push({
        id,
        en: vocab.en || "",
        sv: vocab.sv || "",
        sv_pl: vocab.sv_pl || "",
        img: "/" + vocab.img || "",
        article: vocab.article || "",
      });
    }
    return items.filter(item => item.en || item.img);
  }

  /**
   * Groups shuffled vocabulary items into three levels (4, 5, 6).
   */
  function buildGameLevels(allItems, itemsPerLevel = 5) {
    const usableItems = allItems.filter(item => item.sv);
    const shuffledItems = shuffleArray(usableItems);
    // Take the first 3 chunks for levels 4, 5, and 6.
    return chunkArray(shuffledItems, itemsPerLevel).slice(0, 3);
  }

  // --- Core Game Logic ---
  /**
   * Sets up and displays a specific level.
   * @param {number} level - The level number (4, 5, or 6).
   */
  function startLevel(level) {
    GameState.currentLevelNumber = level;
    GameState.items = GameState.levels[level - 4] || []; // level 4 is index 0
    GameState.currentItemIndex = 0;

    $("#medium-level-number").text(level);
    renderCurrentWord();
    showScreen("#medium-screen");
  }

  /**
   * Displays the current word's image and clears the input field.
   */
  function renderCurrentWord() {
    if (GameState.currentItemIndex >= GameState.items.length) return;

    const currentItem = GameState.items[GameState.currentItemIndex];
    $("#medium-feedback").text("");
    $("#medium-progress").text(`${GameState.currentItemIndex + 1}/${GameState.items.length}`);

    const $imageWrap = $("#medium-image-wrap").empty();
    const altText = currentItem.en || "Swedish vocabulary object";

    if (currentItem.img) {
      const $img = $("<img>").attr("alt", altText).attr("src", currentItem.img);
      $imageWrap.append($img);
    } else {
      console.warn("No image URL provided for this item.");
    }

    $("#medium-english").text(currentItem.en || "");
    $("#medium-answer").val("").focus();
  }

  /**
   * Checks the user's answer against the correct Swedish words.
   */
  function checkUserAnswer() {
    const currentItem = GameState.items[GameState.currentItemIndex];
    if (!currentItem) return;

    const userAnswer = normalizeSwedish($("#medium-answer").val());
    if (!userAnswer) {
      $("#medium-feedback").text("Please type an answer.");
      return;
    }

    const correctAnswers = [normalizeSwedish(currentItem.sv), normalizeSwedish(currentItem.sv_pl)];
    if (correctAnswers.includes(userAnswer)) {
      $("#medium-feedback").text("✅ Correct!");
      GameState.currentItemIndex++;

      if (GameState.currentItemIndex >= GameState.items.length) {
        setTimeout(() => handleLevelCompletion(GameState.currentLevelNumber), 500);
      } else {
        setTimeout(renderCurrentWord, 500);
      }
    } else {
      $("#medium-feedback").text("❌ Try again");
    }
  }

  /**
   * Handles the win screen and saves progress after a level is completed.
   * @param {number} level - The completed level number.
   */
  function handleLevelCompletion(level) {
    const newWins = level; // This is the highest level completed (4, 5, or 6)
    const newCompletion = Math.round((newWins / 9) * 100);
    const currentStats = save.stats.get(SAVE_KEY);

    // Only update if current progress is better than saved progress
    if (!currentStats || newWins > currentStats.wins) {
      save.stats.set(SAVE_KEY, newWins, newCompletion);
    }

    $('#win-title').text(`You completed Level ${level}/9!`);

    if (level === 6) {
      $('#win-next').text('Continue to Hard Levels').off('click').on('click', () => {
        window.location.href = '../hard';
      });
    } else {
      const nextLevel = level + 1;
      $('#win-next').text('Next Level').off('click').on('click', () => {
        startLevel(nextLevel);
      });
    }
    showScreen("#win-screen");
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    $('#medium-back').on('click', () => {
      window.location.href = '../main_menu/levels_medium.html';
    });

    $('#win-menu').on('click', () => {
      window.location.href = '../main_menu/levels_medium.html';
    });

    $('#medium-check').on('click', () => checkUserAnswer());

    $(document).on('keydown', (event) => {
      if (event.key === 'Enter' && $('#medium-screen').is(':visible') && $('#medium-answer').is(':focus')) {
        event.preventDefault();
        $('#medium-check').trigger('click');
      }
    });

    $('#btn-level-instruction').on('click', () => showElement('#intro-modal'));
    $('#close-intro').on('click', () => hideElement('#intro-modal'));
  }

  // --- Game Initialization ---
  function initializeGame() {
    GameState.levels = buildGameLevels(loadFurnitureItems(), 5);

    const urlParams = new URLSearchParams(window.location.search);
    const levelParam = parseInt(urlParams.get('level'), 10);
    const startingLevel = [4, 5, 6].includes(levelParam) ? levelParam : 4;

    startLevel(startingLevel);
  }

  setupEventListeners();
  if (window.vocabulary && typeof window.vocabulary.when_ready === "function") {
    window.vocabulary.when_ready(initializeGame);
  } else {
    setTimeout(initializeGame, 200); // Fallback
  }
});

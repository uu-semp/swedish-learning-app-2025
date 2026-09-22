// ==============================================
// Owned by Game 07
// Endless mode with lives
// ==============================================

"use strict";

// How many lives the player starts with when lives are enabled.
const STARTING_LIVES = 3;

// How long each round lasts when the timer is enabled.
const TIMER_SECONDS = 10;

// Reads the player's saved preferences from the index page (defaults: no
// timer, lives on — matching the original game behaviour).
function get_settings() {
  const defaults = { timerEnabled: false, livesEnabled: true };
  const saved = JSON.parse(localStorage.getItem("game_settings") || "null");
  return Object.assign({}, defaults, saved || {});
}

// Builds the full list of vocab ids for a category (or all combined for "mixed")
function get_full_pool(category) {
  if (category == "mixed") {
    const clothing = window.vocabulary.get_category("clothing");
    const food = window.vocabulary.get_category("food");
    const furniture = window.vocabulary.get_category("furniture");
    return [].concat(clothing, food, furniture);
  }
  return window.vocabulary.get_category(category);
}

// Called once when a new game begins
function game_start(category, timerEnabled, livesEnabled) {
  const fullIds = get_full_pool(category);
  const settings = get_settings();

  // Prefer explicitly passed arguments if defined, otherwise fall back to saved settings
  const useTimer = timerEnabled !== undefined ? timerEnabled : settings.timerEnabled;
  const useLives = livesEnabled !== undefined ? livesEnabled : settings.livesEnabled;

  const state = {
    category: category,
    fullIds: fullIds,
    ids: fullIds.slice(),
    timerEnabled: useTimer,
    livesEnabled: useLives,
    lives: STARTING_LIVES,
    round: 0,
    total: 0,
    history: [],
    currentRoundWords: null,
  };

  generate_round(state);
  localStorage.setItem("game_state", JSON.stringify(state));
}

// Picks 4 words for one round, mutating state in place.
// Refills the pool from fullIds whenever it gets too small to pick 4 unique words.
function generate_round(state) {
  if (state.ids.length < 4) {
    state.ids = state.fullIds.slice();
  }

  const correct_answer = Math.floor(Math.random() * 4) + 1;
  const roundWords = [];

  for (let j = 0; j < 4; j++) {
    const rand = Math.floor(Math.random() * state.ids.length);
    const generated_word = window.vocabulary.get_vocab(state.ids[rand]);

    generated_word["answer"] = (j == correct_answer - 1);

    roundWords.push(generated_word);
    state.ids.splice(rand, 1);
  }

  state.currentRoundWords = roundWords;
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("categorybox")) {
    window.vocabulary.when_ready(function () {
      document.getElementById("loader").style.display = "none";
      document.querySelector(".categorybox").style.display = "block";
    });
  }

  if (
    document.getElementById("img-1") &&
    document.getElementById("img-2") &&
    document.getElementById("img-3") &&
    document.getElementById("img-4")
  ) {
    // Vocabulary may still be loading; wait for it before starting, since
    // generating a fresh round (e.g. right after Try Again) needs
    // window.vocabulary to be ready.
    window.vocabulary.when_ready(startGame);
  } else {
    console.error("Game images missing");
  }
});

function startGame() {
  gameplay();
}

function gameplay() {
  const imageElements = [
    document.getElementById("img-1"),
    document.getElementById("img-2"),
    document.getElementById("img-3"),
    document.getElementById("img-4"),
  ];

  const finishedBtn = document.getElementById("finished-button");

  if (finishedBtn) {
    finishedBtn.addEventListener("click", () => {
      // Save current progress before leaving
      saveState();
      // Redirect to the results page
      window.location.href = "results-page.html";
    });
  }

  const nextBtn = document.getElementById("next-button");
  const soundIcon = document.getElementById("sound-icon");
  const audio = document.getElementById("word-audio");
  const audioSrc = document.getElementById("audio-src");
  // Optional: add an element with this id in your HTML to show remaining lives
  const livesDisplay = document.getElementById("lives-display");
  // Optional: add an element with this id in your HTML to show the countdown
  const timerDisplay = document.getElementById("timer-display");

  let state = JSON.parse(localStorage.getItem("game_state") || "null");
  if (!state) {
    console.error("No game state");
    return;
  }

  function saveState() {
    localStorage.setItem("game_state", JSON.stringify(state));
  }

  // If there's no round loaded yet (e.g. results-page.html just reset the
  // state via Try Again / Try Missed Words), generate the first one now —
  // this page is guaranteed to have window.vocabulary ready.
  if (!state.currentRoundWords) {
    generate_round(state);
    saveState();
  }

  let correctImage = null;
  let selectionLock = false; // Lock selection if user has clicked image
  let timerInterval = null;

  function updateLivesDisplay() {
    if (!livesDisplay) return;
    livesDisplay.textContent = state.livesEnabled
      ? "♥".repeat(Math.max(state.lives, 0))
      : "∞";
  }

  function clearTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    clearTimer();

    if (!state.timerEnabled) {
      if (timerDisplay) timerDisplay.textContent = "";
      return;
    }

    let secondsLeft = TIMER_SECONDS;
    if (timerDisplay) timerDisplay.textContent = secondsLeft + "s";

    timerInterval = setInterval(() => {
      secondsLeft--;
      if (timerDisplay) timerDisplay.textContent = secondsLeft + "s";

      if (secondsLeft <= 0) {
        clearTimer();
        revealAnswer(null); // ran out of time — treat like a miss, nothing clicked
      }
    }, 1000);
  }

  function markCorrectAnswer(image) {
    image.classList.add("correct");
  }

  function markIncorrectAnswer(image) {
    image.classList.add("incorrect");
  }

  function clearSelection() {
    document.getElementById("instruction").textContent =
      "Match the image to the sound";
    imageElements.forEach((image) => {
      image.classList.remove("correct", "incorrect");
    });
    selectionLock = false;
  }

  function updateNextButtonText(text) {
    nextBtn.textContent = text;
  }

  function startNewRound() {
    clearSelection();
    updateLivesDisplay();

    state.currentRoundWords.forEach((word, index) => {
      const image = imageElements[index];
        image.src = "../" + word.img;
        image.title = word.en || "Hint unavailable";

      if (word.answer) {
        correctImage = image;
      }
    });

    // Always "Next" now — the game only stops when lives run out (if enabled)
    updateNextButtonText("Next");
    startTimer();
  }

  function revealAnswer(clickedImage) {
    // If locked, do nothing
    if (selectionLock) {
      return;
    }
    selectionLock = true;
    clearTimer();

    const wordSet = state.currentRoundWords;
    const correctAnswer = wordSet.find((word) => word.answer === true);
    const wrongThisRound = [];
    const timedOut = clickedImage === null;

    imageElements.forEach((image, index) => {
      const word = wordSet[index];

      if (image === correctImage) {
        markCorrectAnswer(image);
      }

      if (!timedOut && image === clickedImage && image === correctImage) {
        document.getElementById("instruction").textContent =
          "Correct answer! The correct answer was: " + correctAnswer.sv;
        state.total += 1;
      } else if (!timedOut && image === clickedImage && image !== correctImage) {
        document.getElementById("instruction").textContent =
          "Wrong answer! The correct answer was: " + correctAnswer.sv;
        markIncorrectAnswer(image);
        wrongThisRound.push(word);
        if (state.livesEnabled) state.lives -= 1;
      }
    });

    if (timedOut) {
      document.getElementById("instruction").textContent =
        "Time's up! The correct answer was: " + correctAnswer.sv;
      wrongThisRound.push(correctAnswer);
      if (state.livesEnabled) state.lives -= 1;
    }

    state.history.push({ round: state.round + 1, wrong: wrongThisRound });
    updateLivesDisplay();

    if (state.livesEnabled && state.lives <= 0) {
      updateNextButtonText("See results");
    }

    saveState();
  }

  imageElements.forEach((image) => {
    image.addEventListener("click", () => {
      revealAnswer(image);
    });
  });

  nextBtn.addEventListener("click", () => {
    if (!selectionLock) {
      return;
    }

    if (state.lives <= 0) {
      // Game over — go show results
      window.location.href = "results-page.html";
      return;
    }

    state.round++;
    generate_round(state);
    saveState();
    startNewRound();
  });

  soundIcon.addEventListener("click", () => {
    // TODO: Does not work yet, there is no sound played when clicking
    const correctAnswer = state.currentRoundWords.find(
      (word) => word.answer === true
    );
    audioSrc.src = "../" + correctAnswer.audio;
    audio.load();
    audio.play();
  });

  // First round
  startNewRound();
}
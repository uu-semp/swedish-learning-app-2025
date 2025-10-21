import {
  get_next_words,
  update_selection,
  finish_game,
} from "../selection/selection.js";
import { local_get_volume, local_get_sound_effects } from "../store/read.js";

let totalRounds = 10;
let currentRound = 1;
let score = 0;
let currentData = null;
let selectedIndex = null;
let firstAttempt = true;

function loadRound() {
  currentData = get_next_words();
  selectedIndex = null;
  firstAttempt = true;

  document.getElementById(
    "round"
  ).textContent = `Round ${currentRound} / ${totalRounds}`;

  document.getElementById("feedback").innerHTML = "";
  document.getElementById("confirmBtn").disabled = true;
  document.getElementById("nextBtn").style.display = "none";
  const tryAgain = document.getElementById("tryAgainBtn");

  if (tryAgain) tryAgain.style.display = "none";
  document.getElementById("confirmBtn").style.display = "inline-block";

  // set audio
  document.getElementById("audioPlayer").src =
    "../../" + currentData.words[currentData.correct_index].audio;

  // Auto-play the audio for the new round
  const audio = document.getElementById("audioPlayer");
  audio.volume = local_get_volume() / 100;
  audio.play().catch(() => {
    console.log("Autoplay blocked, user interaction required.");
  });

  // Play Audio button
  document.getElementById("playAudio").onclick = () => {
    audio.volume = local_get_volume() / 100;
    audio.play();
  };

  // Add copyright
  update_licenses(currentData.words);

  // render images
  let container = document.getElementById("imageOptions");
  container.innerHTML = "";
  currentData.words.forEach((w, i) => {
    let card = document.createElement("div");
    card.className = "image-card";
    card.dataset.index = i;

    //makes it focusable
    card.tabIndex = 0;

    card.setAttribute("role", "button");
    card.setAttribute("aria-label", w.en); // name read by screen readers

    card.innerHTML = `<img src="${"../../" + w.img}" alt="${w.en}">`;

    card.addEventListener("click", () => {
      document
        .querySelectorAll(".image-card")
        .forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedIndex = i;
      document.getElementById("confirmBtn").disabled = false;
    });
    container.appendChild(card);
  });
  enableKeyboardNavigation();
}

// Confirm Choice
document.getElementById("confirmBtn").addEventListener("click", () => {
  const confirmBtn = document.getElementById("confirmBtn");
  const nextBtn = document.getElementById("nextBtn");
  const feedbackEl = document.getElementById("feedback");
  const correctIndex = currentData.correct_index;
  const chosen = currentData.words[selectedIndex];
  const isCorrect = selectedIndex === correctIndex;

  if (firstAttempt)
    update_selection({ id: chosen.id, guessed_correct: isCorrect }); // store result

  // Disable clicking while evaluating
  document.querySelectorAll(".image-card").forEach((card) => {
    card.style.pointerEvents = "none";
  });

  if (local_get_sound_effects()) {
    const fx = new Audio(
      isCorrect
        ? "../../assets/team08/soundEffects/right.mp3"
        : "../../assets/team08/soundEffects/wrong.mp3"
    );
    fx.volume = local_get_volume() / 100;
    fx.play();
  }

  // Disable all image clicks after confirmation
  document.querySelectorAll(".image-card").forEach((card) => {
    card.style.pointerEvents = "none"; // Prevent further clicking
    //visually dim incorrect ones
    card.style.opacity = "0.5";
    // Remove highlight selection effect (optional)
    card.classList.remove("selected");

    // Make unfocusable via keyboard
    card.tabIndex = -1;

    // Remove keyboard focus highlight (if currently focused)
    card.blur();

    // Disable click response by overriding handler
    card.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
  });

  if (isCorrect) {
    // Correct Answer
    if (firstAttempt) score++;

    const correctCard = document.querySelector(
      `.image-card[data-index='${correctIndex}']`
    );
    correctCard.style.borderColor = "green";
    correctCard.style.background = "#e6ffe6";

    feedbackEl.innerHTML = `<span style="color:green;"><i class="fas fa-check-circle"></i> Correct!</span>`;
    confirmBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
  } else {
    // Wrong Answer
    const wrongCard = document.querySelector(
      `.image-card[data-index='${selectedIndex}']`
    );
    wrongCard.style.borderColor = "red";
    wrongCard.style.background = "#ffe6e6";

    const correctWord = currentData.words[correctIndex].en;
    const hintLetter = correctWord.charAt(0).toUpperCase();
    feedbackEl.innerHTML = `<span style="color:red;"><i class="fas fa-times-circle"></i> Wrong!</span> You chose <b>${chosen.en}</b>. Hint: starts with <b>${hintLetter}</b>...`;
    feedbackEl.style.marginTop = "2rem";
    confirmBtn.style.display = "none";

    // Create or show Try Again button
    let tryAgainBtn = document.getElementById("tryAgainBtn");
    if (!tryAgainBtn) {
      tryAgainBtn = document.createElement("button");
      tryAgainBtn.id = "tryAgainBtn";
      tryAgainBtn.className = "btn";
      tryAgainBtn.innerHTML = `<i class="fas fa-redo"></i> Try Again`;
      // insert right after confirm button
      confirmBtn.parentNode.insertBefore(tryAgainBtn, confirmBtn.nextSibling);
    }
    tryAgainBtn.style.display = "inline-block";

    // Only first attempt counts
    firstAttempt = false;

    // Allow retry: re-enable clicking on images
    document.querySelectorAll(".image-card").forEach((card) => {
      card.style.pointerEvents = "auto";
      card.style.cursor = "pointer";
    });

    // Handle Try Again click
    tryAgainBtn.onclick = () => {
      feedbackEl.innerHTML = "";
      tryAgainBtn.style.display = "none";
      confirmBtn.style.display = "inline-block";
      confirmBtn.disabled = true;

      //  Reset all card visuals completely
      document.querySelectorAll(".image-card").forEach((card) => {
        card.classList.remove("selected");
        card.style.opacity = "1";
        card.style.border = "0.5px solid #000000";
        card.style.borderRadius = "8px";
        card.style.background = "white";
        card.style.pointerEvents = "auto";
        card.style.cursor = "pointer";
      });
      selectedIndex = null;

      //  Rebind click events for fresh selection
      document.querySelectorAll(".image-card").forEach((card) => {
        card.onclick = () => {
          // Clear all other selections
          document.querySelectorAll(".image-card").forEach((c) => {
            c.classList.remove("selected");
            c.style.borderColor = "transparent";
            c.style.background = "white";
          });

          // Highlight the newly selected card
          card.classList.add("selected");
          card.style.borderColor = "#4a90e2";
          card.style.background = "#e6f0ff";

          selectedIndex = parseInt(card.dataset.index);
          confirmBtn.disabled = false;
        };
      });
    };
  }
});

// Next Round
document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentRound < totalRounds) {
    currentRound++;
    firstAttempt = true;
    loadRound();
  } else {
    finish_game();
    window.location.href = "../end-screen/index.html";
    document.getElementById("round").style.display = "none";
    document.getElementById("playAudio").style.display = "none";
    document.getElementById("imageOptions").style.display = "none";
    document.getElementById("confirmBtn").style.display = "none";
    document.getElementById("feedback").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("endScreen").style.display = "block";
    document.getElementById(
      "finalScore"
    ).textContent = `Your Score: ${score} / ${totalRounds}`;
  }
});

// Restart
document.getElementById("restartBtn").addEventListener("click", () => {
  currentRound = 1;
  score = 0;
  firstAttempt = true;
  document.getElementById("round").style.display = "block";
  document.getElementById("playAudio").style.display = "inline-block";
  document.getElementById("imageOptions").style.display = "flex";
  document.getElementById("confirmBtn").style.display = "inline-block";
  document.getElementById("feedback").style.display = "block";
  document.getElementById("endScreen").style.display = "none";
  loadRound();
});

window.addEventListener("beforeunload", () => {
  const audio = document.getElementById("audioPlayer");
  if (audio) audio.pause();
});

// ===== Keyboard Nav =====
// Enable Keyboard keys for buttons
document.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "x")
    document.getElementById("playAudio").click(); // play audio
  if (
    e.key === "c" &&
    document.getElementById("confirmBtn").style.display === "inline-block" &&
    !document.getElementById("confirmBtn").disabled
  )
    document.getElementById("confirmBtn").click(); //press confirm
  if (
    e.key === "v" &&
    document.getElementById("tryAgainBtn").style.display === "inline-block" &&
    !document.getElementById("tryAgainBtn").disabled
  )
    document.getElementById("tryAgainBtn").click(); //press Retry
  if (
    e.key === "n" &&
    document.getElementById("nextBtn").style.display === "inline-block"
  )
    document.getElementById("nextBtn").click(); // go next
  if (e.key === "s") document.getElementById("settingsBtn").click(); // Open Settings
});

let keyboardNavListener = null;

function enableKeyboardNavigation() {
  const cards = Array.from(document.querySelectorAll(".image-card"));

  // Make sure each card can actually receive focus
  cards.forEach((c) => {
    c.tabIndex = 0;
  });

  let currentFocus = -1;

  // Remove any previous listener
  if (keyboardNavListener) {
    document.removeEventListener("keydown", keyboardNavListener);
  }

  keyboardNavListener = (e) => {
    if (!cards.length) return;

    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();

      // remove visual from old
      if (currentFocus >= 0 && cards[currentFocus]) {
        cards[currentFocus].classList.remove("keyboard-focus");
      }

      // initialize focus if none yet
      if (currentFocus === -1) {
        currentFocus = 0;
      } else if (e.key === "ArrowRight") {
        currentFocus = (currentFocus + 1) % cards.length;
      } else if (e.key === "ArrowLeft") {
        currentFocus = (currentFocus - 1 + cards.length) % cards.length;
      }

      //  move focus
      const card = cards[currentFocus];
      card.focus();
      card.classList.add("keyboard-focus");
    }

    //  Select with Enter or Space
    if (
      (e.key === "Enter" || e.key === " ") &&
      document.activeElement.classList.contains("image-card")
    ) {
      e.preventDefault();
      document.activeElement.click();
    }
  };

  document.addEventListener("keydown", keyboardNavListener);
}

// CopyRight Info
/** @type {HTMLElement} */
const copyright_modal = document.getElementById("copyright");
/** @type {HTMLElement} */
const copyright_modal_exit = document.getElementById("close-copyright");

const copyrightBtn = document.getElementById("copyrightBtn");
copyrightBtn.addEventListener("click", () => {
  copyright_modal.style.display = "block";
});

copyright_modal_exit.addEventListener("click", () => {
  copyright_modal.style.display = "none";
});

const IMAGE_1 = document.getElementById("image1");
const IMAGE_2 = document.getElementById("image2");
const IMAGE_3 = document.getElementById("image3");
const IMAGES = [IMAGE_1, IMAGE_2, IMAGE_3];

/**
 *
 * @param {import("../selection/selection.js").FrontVocab[]} words
 */
function update_licenses(words) {
  for (let i = 0; i < IMAGES.length; i++) {
    IMAGES[i].innerHTML = words[i].img_copyright || "None";
  }
}

// Start first round
loadRound();

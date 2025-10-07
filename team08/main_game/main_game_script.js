import { get_next_words, update_selection, finish_game } from "../selection/selection.js";

let totalRounds = 5;
let currentRound = 1;
let score = 0;
let currentData = null;
let selectedIndex = null;
let firstAttempt = true;

function loadRound() {
  currentData = get_next_words();
  selectedIndex = null;
  firstAttempt = true;

  document.getElementById("round").textContent = `Round ${currentRound} / ${totalRounds}`;
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("confirmBtn").disabled = true;
  document.getElementById("nextBtn").style.display = "none";
  const tryAgain = document.getElementById("tryAgainBtn");

  if (tryAgain) tryAgain.style.display = "none";
  document.getElementById("confirmBtn").style.display = "inline-block";

  // set audio
  document.getElementById("audioPlayer").src = "/" + currentData.words[currentData.correct_index].audio;

  // Auto-play the audio for the new round
  const audio = document.getElementById("audioPlayer");
  audio.play().catch(() => {
    console.log("Autoplay blocked, user interaction required.");
  });

  // Play Audio button
  document.getElementById("playAudio").onclick = () => audio.play();

  // render images
  let container = document.getElementById("imageOptions");
  container.innerHTML = "";
  currentData.words.forEach((w, i) => {
    let card = document.createElement("div");
    card.className = "image-card";
    card.dataset.index = i;
    card.innerHTML = `<img src="${"/" + w.img}" alt="${w.en}">`;
    // <div class="image-label">${w.en}</div>
    card.addEventListener("click", () => {
      document.querySelectorAll(".image-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedIndex = i;
      document.getElementById("confirmBtn").disabled = false;
    });
    container.appendChild(card);
  });
}

// Confirm Choice
document.getElementById("confirmBtn").addEventListener("click", () => {
  const confirmBtn = document.getElementById("confirmBtn");
  const nextBtn = document.getElementById("nextBtn");
  const feedbackEl = document.getElementById("feedback");
  const correctIndex = currentData.correct_index;
  const chosen = currentData.words[selectedIndex];
  const isCorrect = (selectedIndex === correctIndex);

  update_selection({ id: chosen.id, guessed_correct: isCorrect }); // store result

  // Disable clicking while evaluating
  document.querySelectorAll(".image-card").forEach(card => {
    card.style.pointerEvents = "none";
  });

  if (effectsEnabled) {
    const fx = new Audio(isCorrect ? "soundEffects/right.mp3" : "soundEffects/wrong.mp3");
    fx.volume = volumeControl.value;
    fx.play();
  }

  if (isCorrect) {
    // Correct Answer
    if (firstAttempt) score++;

    const correctCard = document.querySelector(`.image-card[data-index='${correctIndex}']`);
    correctCard.style.borderColor = "green";
    correctCard.style.background = "#e6ffe6";

    feedbackEl.innerHTML = `<span style="color:green;"><i class="fas fa-check-circle"></i> Correct!</span>`;
    confirmBtn.style.display = "none";
    nextBtn.style.display = "inline-block";

  } else {
    // Wrong Answer
    const wrongCard = document.querySelector(`.image-card[data-index='${selectedIndex}']`);
    wrongCard.style.borderColor = "red";
    wrongCard.style.background = "#ffe6e6";

    const correctWord = currentData.words[correctIndex].en;
    const hintLetter = correctWord.charAt(0).toUpperCase();
    feedbackEl.innerHTML =
      `<span style="color:red;"><i class="fas fa-times-circle"></i> Wrong!</span> You chose <b>${chosen.en}</b>. Hint: starts with <b>${hintLetter}</b>...`;

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
    document.querySelectorAll(".image-card").forEach(card => {
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
      document.querySelectorAll(".image-card").forEach(card => {
        card.classList.remove("selected");
        card.style.borderColor = "transparent";
        card.style.background = "white";
        card.style.opacity = "1";
        card.style.pointerEvents = "auto";
        card.style.cursor = "pointer";
      });
      selectedIndex = null;

      //  Rebind click events for fresh selection
      document.querySelectorAll(".image-card").forEach(card => {
        card.onclick = () => {
          // Clear all other selections
          document.querySelectorAll(".image-card").forEach(c => {
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
    document.getElementById("round").style.display = "none";
    document.getElementById("playAudio").style.display = "none";
    document.getElementById("imageOptions").style.display = "none";
    document.getElementById("confirmBtn").style.display = "none";
    document.getElementById("feedback").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("endScreen").style.display = "block";
    document.getElementById("finalScore").textContent = `Your Score: ${score} / ${totalRounds}`;
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

// ===== SOUND SETTINGS MODAL =====
const soundModal = document.getElementById("soundModal");
const settingsBtn = document.getElementById("settingsBtn");
const closeModal = document.getElementById("closeModal");
const volumeControl = document.getElementById("volumeControl");
const toggleEffects = document.getElementById("toggleEffects");
const audioPlayer = document.getElementById("audioPlayer");

let effectsEnabled = true;

// Open modal
settingsBtn.addEventListener("click", () => {
  soundModal.style.display = "block";
});

// Close modal
closeModal.addEventListener("click", () => {
  soundModal.style.display = "none";
});

// Close when clicking outside modal
window.addEventListener("click", (event) => {
  if (event.target === soundModal) soundModal.style.display = "none";
});

// Volume control
volumeControl.addEventListener("input", () => {
  audioPlayer.volume = volumeControl.value;
});

// Toggle sound effects
toggleEffects.addEventListener("click", () => {
  effectsEnabled = !effectsEnabled;
  toggleEffects.innerHTML = effectsEnabled
    ? `<i class="fas fa-music"></i> ON`
    : `<i class="fas fa-music-slash"></i> OFF`;
});

window.addEventListener("beforeunload", () => {
  const audio = document.getElementById("audioPlayer");
  if (audio) audio.pause();
});

// Start first round
loadRound();

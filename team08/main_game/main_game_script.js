import { get_next_words, update_selection, finish_game } from "../selection/selection.js";

let totalRounds = 5;
let currentRound = 1;
let score = 0;
let currentData = null;
let selectedIndex = null;

function loadRound() {
  currentData = get_next_words();

  selectedIndex = null;

  document.getElementById("round").textContent = `Round ${currentRound} / ${totalRounds}`;
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("confirmBtn").disabled = true;
  document.getElementById("nextBtn").style.display = "none";


  // set audio
  document.getElementById("audioPlayer").src = "/" + currentData.words[currentData.correct_index].audio;

  // Auto-play the audio for the new round
  const audio = document.getElementById("audioPlayer");
  audio.play().catch(() => {
  
    // Some browsers block autoplay; user can still press the button
   console.log("Autoplay blocked, user interaction required.");
  });

  // Play Audio
  document.getElementById("playAudio").addEventListener("click", () => {
    document.getElementById("audioPlayer").play();
  });

  // render images
  let container = document.getElementById("imageOptions");
  container.innerHTML = "";
  currentData.words.forEach((w, i) => {
    let card = document.createElement("div");
    card.className = "image-card";
    card.dataset.index = i;
    card.innerHTML = `<img src="${"/" + w.img}" alt="${+w.en}"> <div class="image-label">${w.en}</div>`;

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
  let correctIndex = currentData.correct_index;
  let chosen = currentData.words[selectedIndex];
  let isCorrect = (selectedIndex === correctIndex);
  update_selection({ id: chosen.id, guessed_correct: isCorrect }); // store result

  if (effectsEnabled) {
    const fx = new Audio(isCorrect ? "soundEffects/right.mp3" : "soundEffects/wrong.mp3");
    fx.volume = volumeControl.value;
    fx.play();
  }


  // Disable all image clicks after confirmation
  document.querySelectorAll(".image-card").forEach(card => {
    card.style.pointerEvents = "none"; // Prevent further clicking
    // Optional: visually dim incorrect ones
    if (parseInt(card.dataset.index) !== correctIndex) {
      card.style.opacity = "0.6";
    }
  });

  if (isCorrect) {
    score++;
    document.getElementById("feedback").innerHTML = `<span style="color:green;"><i class="fas fa-smile fa-bounce"></i> Correct!</span>`;

    // Keep selected card highlighted
    document.querySelector(`.image-card[data-index='${selectedIndex}']`).style.borderColor = "green";
    document.querySelector(`.image-card[data-index='${selectedIndex}']`).style.background = "#e6ffe6";

  } else {
    let correctWord = currentData.words[correctIndex].en;
    document.getElementById("feedback").innerHTML =
      `<span style="color:red;"><i class="fas fa-times-circle fa-shake"></i> Wrong! Correct answer: ${correctWord}</span>`;

    // Highlight wrong choice in red
    const wrongCard = document.querySelector(`.image-card[data-index='${selectedIndex}']`);
    wrongCard.style.borderColor = "red";
    wrongCard.style.background = "#ffe6e6";

    // Highlight correct answer in green
    const correctCard = document.querySelector(`.image-card[data-index='${correctIndex}']`);
    correctCard.style.borderColor = "green";
  }

  document.getElementById("confirmBtn").disabled = true;
  document.getElementById("nextBtn").style.display = "inline-block";
});

// Next Round
document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentRound < totalRounds) {
    currentRound++;
    let userInteracted = false;

    // Allow autoplay only after user clicks or interacts once
    window.addEventListener("click", () => {
      if (!userInteracted) {
        userInteracted = true;
        const audio = document.getElementById("audioPlayer");
        if (audio.src) {
          audio.play().catch(() => console.log("Autoplay still blocked."));
        }
      }
    }, { once: true });
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


// Start first round
loadRound();

import {
  get_next_words,
  update_selection,
  finish_game,
} from "../selection/selection.js";

const BUTTON_CONFIRM = document.querySelector("#confirm-btn");
const IMG_ONE = document.querySelector("#img-1");
const IMG_TWO = document.querySelector("#img-2");
const IMG_THREE = document.querySelector("#img-3");
const BUTTON_AUDIO = document.querySelector("#audio");
const AUDIO_ONE = document.createElement("audio");
const NEXT_BUTTON = document.querySelector("#next-btn");
let selectedOption = null;
let turns = 10;

/**
 * @type {import("../selection/selection.js").FrontVocab[]}
 */
let current_words = [];
let correct = null;

document.querySelectorAll(".option-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const buttonElement = event.currentTarget;
    selectedOption = buttonElement.dataset.option;

    document.querySelectorAll(".option-btn").forEach((btn) => {
      btn.classList.remove("selected");
      btn.style.borderColor = "var(--color-primary)";
    });
    event.target.classList.add("selected");
    buttonElement.style.borderColor = "var(--color-hover)";

    console.log(`Option ${selectedOption} selected`);
  });
});

BUTTON_CONFIRM.addEventListener("click", () => {
  if (selectedOption != null) {
    buttonUpdateSelection(selectedOption);
  } else {
    alert("Please choose an image before you continue");
  }
});

BUTTON_AUDIO.addEventListener("click", () => {
  const AUDIO = new Audio("/" + current_words[correct].audio); //replace this when audio files are avaliable
  //play audio here
  //audio.play(); //this is the code to play the audio, but it doesn't work for me on my mac, so I commented it out for yo
  AUDIO.play();

  // AUDIO_ONE.play().catch((error) => {
  //     console.error("Error playing audio:", error);
  //     alert("Could not play audio");
  // });
  //replace this when audio files are avaliable
  console.log("Would have played " + current_words[correct].audio);
});

NEXT_BUTTON.addEventListener("click", () => {
  const RESULT_TEXT = document.querySelector(
    ".result-text[style*='display: block;']"
  );
  const SELECTED_BUTTON = document.querySelector(
    ".option-btn[style*='var(--color-correct)'], .option-btn[style*='var(--color-incorrect)']"
  );

  if (RESULT_TEXT) RESULT_TEXT.style.display = "none";
  if (NEXT_BUTTON) NEXT_BUTTON.style.display = "none";
  if (SELECTED_BUTTON)
    SELECTED_BUTTON.style.borderColor = "var(--color-primary)";

  document.querySelectorAll(".option-btn").forEach((button) => {
    button.disabled = false;
  });
  BUTTON_CONFIRM.disabled = false;

  game_update();
});

/**
 *
 * @param {Number} assigned
 */
function buttonUpdateSelection(assigned) {
  update_selection({
    id: current_words[assigned].id,
    guessed_correct: correct == assigned,
  });
  const RESULT_TEXT = document.querySelector(`#result-${parseInt(assigned)}`);
  const SELECTED_BUTTON = document.querySelector(
    `#button${parseInt(assigned)}`
  );
  const NEXT_BUTTON = document.querySelector("#next-btn");

  if (correct == assigned) {
    RESULT_TEXT.textContent = "Correct!";
    RESULT_TEXT.style.color = "var(--color-correct)";
    SELECTED_BUTTON.style.borderColor = "var(--color-correct)";
  } else {
    RESULT_TEXT.innerHTML = `Incorrect!<br> The correct word was: ${current_words[correct].en}`;
    RESULT_TEXT.style.color = "var(--color-incorrect)";
    SELECTED_BUTTON.style.borderColor = "var(--color-incorrect)";
  }

  RESULT_TEXT.style.display = "block";
  NEXT_BUTTON.style.display = "block";

  document.querySelectorAll(".option-btn").forEach((button) => {
    button.disabled = true;
  });
  BUTTON_CONFIRM.disabled = true;

  // Reset selection and update game
  selectedOption = null;
}

function game_update() {
  if (turns == 0) {
    finish_game();
    return;
  }

  console.log(turns);
  const DATA = get_next_words();
  current_words = DATA.words;
  correct = DATA.correct_index;
  IMG_ONE.src = "/"+current_words[0].img;
  IMG_TWO.src = "/"+current_words[1].img;
  IMG_THREE.src ="/"+current_words[2].img;
  turns = turns - 1;
}

game_update();

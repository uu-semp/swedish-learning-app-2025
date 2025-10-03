import { get_next_words, update_selection, finish_game } from "../selection/selection.js";

const DISPLAY_CORRECT = document.querySelector("#display_correct");
const DISPLAY_GUESSES = document.querySelector("#display_guesses");
const BUTTON_ONE = document.querySelector("#button1");
const BUTTON_TWO = document.querySelector("#button2");
const BUTTON_THREE = document.querySelector("#button3");
const BUTTON_CONFIRM = document.querySelector("#confirm");
const IMG_ONE = document.createElement("img")
const IMG_TWO = document.createElement("img")
const IMG_THREE = document.createElement("img")
const BUTTON_AUDIO = document.querySelector("#audio")
const AUDIO_ONE = document.createElement("audio")
let option = null
let turns = 10;

/**
 * @type {import("../selection/selection.js").FrontVocab[]}
 */
let current_words = [];

let correct = null;

BUTTON_ONE.addEventListener("click", () => {
  option = 0;
});

BUTTON_TWO.addEventListener("click", () => {
  option = 1;
});

BUTTON_THREE.addEventListener("click", () => {
  option = 2;
});

BUTTON_CONFIRM.addEventListener("click", () => {
    if (option != null){
        button_update_selection(option)
    } else {
        alert("Please choose an image before you continue")
    }
});

BUTTON_AUDIO.addEventListener("click", () => {
    AUDIO_ONE.play().catch(error => {
        console.error("Error playing audio:", error);
        alert("Could not play audio");
    });
    console.log("Would have played " + current_words[correct].audio)
});

/**
 *
 * @param {Number} assigned
 */
function button_update_selection(assigned) {
  update_selection({
    id: current_words[assigned].id,
    guessed_correct: correct == assigned,
  });
  alert(correct == assigned);
  option = null
  game_update();
}

function game_update() {
  if (turns == 0) {
    finish_game();
    return;
  }
//   AUDIO_ONE.src = current_words[correct].audio;
//   BUTTON_AUDIO.appendChild(AUDIO_ONE);
  console.log(turns);
  const DATA = get_next_words();
  current_words = DATA.words;
  correct = DATA.correct_index;
  BUTTON_ONE.textContent = current_words[0].en;
  IMG_ONE.src = "../../" + current_words[0].img;
  BUTTON_ONE.appendChild(IMG_ONE)
  BUTTON_TWO.textContent = current_words[1].en;
  IMG_TWO.src = "../../" + current_words[1].img;
  BUTTON_TWO.appendChild(IMG_TWO)
  BUTTON_THREE.textContent = current_words[2].en;
  IMG_THREE.src = "../../" + current_words[2].img;
  BUTTON_THREE.appendChild(IMG_THREE)
  DISPLAY_CORRECT.textContent = current_words[correct].sv;
  turns = turns - 1;
}

game_update();

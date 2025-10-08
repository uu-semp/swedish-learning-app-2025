import { local_get_guesses_with_vocab } from "../store/read.js";
import { local_set_categories } from "../store/write.js";
import { get_next_words, update_selection, finish_game } from "./selection.js";

local_set_categories(["food"]);

const DISPLAY_CORRECT = document.querySelector("#display_correct");
const DISPLAY_GUESSES = document.querySelector("#display_guesses");
const BUTTON_ONE = document.querySelector("#button1");
const BUTTON_TWO = document.querySelector("#button2");
const BUTTON_THREE = document.querySelector("#button3");
let turns = 10;

/**
 * @type {import("./selection.js").FrontVocab[]}
 */
let current_words = [];

let correct = null;

BUTTON_ONE.addEventListener("click", () => {
  button_update_selection(0);
});

BUTTON_TWO.addEventListener("click", () => {
  button_update_selection(1);
});

BUTTON_THREE.addEventListener("click", () => {
  button_update_selection(2);
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
  game_update();
}

function game_update() {
  if (turns == 0) {
    finish_game();
    DISPLAY_CORRECT.remove();
    DISPLAY_GUESSES.innerHTML = "";
    let guesses = local_get_guesses_with_vocab();
    guesses.forEach((guess) => {
      const NODE = document.createElement("p");
      NODE.textContent = guess.vocab.en + " " + guess.guessed_correct;
      DISPLAY_GUESSES.appendChild(NODE);
    });
    return;
  }
  console.log(turns);
  const DATA = get_next_words();
  current_words = DATA.words;
  correct = DATA.correct_index;
  BUTTON_ONE.textContent = current_words[0].en;
  BUTTON_TWO.textContent = current_words[1].en;
  BUTTON_THREE.textContent = current_words[2].en;
  DISPLAY_CORRECT.textContent = current_words[correct].sv;
  turns = turns - 1;
}

game_update();

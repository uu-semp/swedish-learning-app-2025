import {
  get_next_word_and_images,
  update_selection,
  finish_game,
} from "./selection.js";
// <p id="display_correct">

// </p>
// <div id="display_guesses">

// </div>

const DISPLAY_CORRECT = document.querySelector("#display_correct");
const DISPLAY_GUESSES = document.querySelector("#display_guesses");
const BUTTON_ONE = document.querySelector("#button1");
const BUTTON_TWO = document.querySelector("#button2");
const BUTTON_THREE = document.querySelector("#button3");

let correct = null;
let assigned_one = null;
let assigned_two = null;
let assigned_three = null;

BUTTON_ONE.addEventListener("click", () => {
  update_selection({
    id: assigned_one,
    guessed_correct: assigned_one == correct,
  });
  const next_word = get_next_word_and_images();
  DISPLAY_CORRECT.textContent = next_word.correct_word.Swedish;
  BUTTON_ONE;
});

BUTTON_TWO.addEventListener("click", () => {
  update_selection({
    id: assigned_two,
    guessed_correct: assigned_two == correct,
  });
  const next_word = get_next_word_and_images();
  DISPLAY_CORRECT.textContent = next_word.correct_word.Swedish;
  BUTTON_ONE;
});

BUTTON_THREE.addEventListener("click", () => {
  update_selection({
    id: assigned_one,
    guessed_correct: assigned_three == correct,
  });
  const next_word = get_next_word_and_images();
  DISPLAY_CORRECT.textContent = next_word.correct_word.Swedish;
  BUTTON_ONE;
});

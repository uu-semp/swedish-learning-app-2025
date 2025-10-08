import { local_get_guesses } from "../store/read.js";
import { local_set_categories } from "../store/write.js";
import {
  get_next_words,
  update_selection,
  finish_game,
  reset_selection,
} from "./selection.js";
local_set_categories(["food", "clothing", "furniture"]);

function testFields() {
  let allDefined = true;
  let guesses = [];

  for (let i = 0; i < 10; i++) {
    const selection = get_next_words();
    const randomGuess = Math.floor(Math.random() * 3);

    // console.log(selection);
    selection.words.forEach((word) => {
      if (
        word.en === undefined ||
        word.sv === undefined ||
        word.img === undefined ||
        word.audio === undefined ||
        word.id === undefined
      ) {
        allDefined = false;
      }
    });
    guesses.push({
      id: selection.words[randomGuess].id,
      guessed_correct: selection.correct_index == randomGuess,
    });

    update_selection(guesses[i]);
  }

  finish_game();
  //   console.log("All fields defined:", allDefined);
  const saved_guesses = local_get_guesses();
  let correct_saves = true;
  for (let i = 0; i < guesses.length; i++) {
    if (
      saved_guesses[i].guessed_correct !== guesses[i].guessed_correct ||
      saved_guesses[i].id !== guesses[i].id
    ) {
      correct_saves = false;
    }
  }
  //   console.log("Correct saves: ", correct_saves);
  return allDefined && correct_saves;
}

let result = true;
for (let i = 0; i < 100; i++) {
  result = result && testFields();
  reset_selection();
}
console.log("All tests passed: ", result);

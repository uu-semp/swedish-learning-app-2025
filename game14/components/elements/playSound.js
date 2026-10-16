import { getPreloadedAudio } from "./gameData.js";

// Shared sound player for all levels in game 14.
// Keeps track of the current sound so two words never play at the same time.
let currentAudio = null;

export function playSound(word) {
  if (!word || !word.audio) return;

  if (currentAudio) currentAudio.pause();

  // Use the sound loaded at startup if there is one, and play it from the start.
  // Otherwise load it now. The path in the database starts from the project root,
  // so "../" takes us there from game14/index.html
  currentAudio = getPreloadedAudio(word) || new Audio("../" + word.audio);
  currentAudio.currentTime = 0;
  currentAudio.play();
}
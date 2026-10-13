// Shared sound player for all levels in game 14.
// Keeps track of the current sound so two words never play at the same time.
let currentAudio = null;

export function playSound(word) {
  if (!word || !word.audio) return;

  if (currentAudio) currentAudio.pause();

  // The path in the database starts from the project root,
  // so "../" takes us there from game14/index.html
  currentAudio = new Audio("../" + word.audio);
  currentAudio.play();
}
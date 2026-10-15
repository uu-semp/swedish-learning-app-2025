import { loaddb, get_category, get_vocab } from "../../../scripts/vocabulary_await.js";

// Shared data for all levels in game 14.
// Everything is loaded once when the game starts, so the levels open quickly.
let dataPromise = null;   // The loading in progress (or already done)
const audioCache = {};    // Preloaded sounds, e.g. audioCache["nose"]

export function loadGameData() {
  // Only load once, everyone after that gets the same result
  if (!dataPromise) {
    dataPromise = loadEverything().catch((error) => {
      dataPromise = null; // Let the next call try again
      throw error;
    });
  }
  return dataPromise;
}

async function loadEverything() {
  // Load the SVG of Pelle and the words at the same time
  const [pelleSvg, bodyParts] = await Promise.all([loadPelleSvg(), loadBodyParts()]);
  preloadAudio(bodyParts);
  return { pelleSvg, bodyParts };
}

// Load the SVG as text so it becomes part of the page,
// which makes every body part clickable
async function loadPelleSvg() {
  const response = await fetch("./components/assets/pellecharacterbody.svg");
  return await response.text();
}

// Load the body part words from the shared vocabulary database
async function loadBodyParts() {
  await loaddb();
  return get_category("body-part").map((id) => get_vocab(id));
}

// Start downloading the sounds so they play right away when clicked.
// The path in the database starts from the project root,
// so "../" takes us there from game14/index.html
function preloadAudio(words) {
  for (const word of words) {
    if (!word || !word.audio) continue;
    const audio = new Audio("../" + word.audio);
    audio.preload = "auto";
    audioCache[word.en] = audio;
  }
}

// Returns the preloaded sound for a word, or null if there is none
export function getPreloadedAudio(word) {
  return audioCache[word.en] || null;
}

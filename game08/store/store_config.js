import * as Types from "./storage_type.js";

// Change this to your game name
export const GAME = "game08";

// Total number of words in game
// This value should be updated dynamically!
export const WORDS = 164;

// Win barrier, more than this percentage of correct guesses counts as win
export const WIN_BARRIER = 0.8;

// Change this to include more categories
export const CATEGORIES = {
  FOOD: "food",
  CLOTHING: "clothing",
  FURNITURE: "furniture",
};

/** @type {Types.Game08Storage} */
export const DEFAULT = {
  volume: 50,
  sound_effects_enabled: false,
  guesses: [],
  category: [],
  id_covered: {},
  covers: 0,
  persistent_notice: true,
};

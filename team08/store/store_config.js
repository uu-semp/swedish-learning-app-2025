import * as Types from "./storage_type.js";

// Change this to your team name
export const TEAM = "team08";

// Change this to include more categories
export const CATEGORIES = {
  FOOD: "food",
  CLOTHING: "clothing",
  FURNITURE: "furniture",
};

/** @type {Types.Team8Storage} */
export const DEFAULT = {
  volume: 50,
  sound_effects_enabled: false,
  guesses: [],
  category: [],
};

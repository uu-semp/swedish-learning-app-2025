/**
 * Which clothing from the shared word list is used in each level.
 *
 * Every word-list entry whose Category is CLOTHING_CATEGORY is a clothing
 * item. Its Subcategory is its body position on Pelle, and it must match the
 * data-accept value of a dropzone in game.html (hats, shirts, pants, feet,
 * accessories).
 *
 * To add clothes, add rows to the word list; no code change is needed.
 * To change what a level contains, edit LEVEL_SUBCATEGORIES below. The order
 * is the order of the wardrobe shelves and of the words in the instruction.
 */
export const CLOTHING_CATEGORY = "clothing";

export const LEVEL_SUBCATEGORIES = {
  1: ["hats", "shirts", "pants"],
  2: ["hats", "shirts", "pants", "feet"],
  3: ["hats", "shirts", "pants", "feet", "accessories"],
};

/**
 * The colours each level uses (keys of COLORS in clothing_catalog.js).
 * Every round picks random colours from its level's list.
 */
export const LEVEL_COLORS = {
  1: ["red", "blue", "yellow", "green", "black", "white"],
  2: [
    "red",
    "blue",
    "yellow",
    "green",
    "black",
    "white",
    "orange",
    "pink",
    "purple",
    "brown",
  ],
  3: [
    "red",
    "blue",
    "yellow",
    "green",
    "black",
    "white",
    "orange",
    "pink",
    "purple",
    "brown",
  ],
};

/** The level in the page URL (game.html?level=2), defaulting to 1. */
export function currentLevel() {
  const level = Number(
    new URLSearchParams(window.location.search).get("level"),
  );
  return level in LEVEL_SUBCATEGORIES ? level : 1;
}

/** The subcategories used in the given level. */
export function subcategoriesForLevel(level) {
  return LEVEL_SUBCATEGORIES[level] ?? LEVEL_SUBCATEGORIES[1];
}

/** The colours used in the given level. */
export function colorsForLevel(level) {
  return LEVEL_COLORS[level] ?? LEVEL_COLORS[1];
}

export const MAX_LEVEL = Math.max(
  ...Object.keys(LEVEL_SUBCATEGORIES).map(Number),
);

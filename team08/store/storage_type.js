/**
 * @typedef Guess
 * @property {String} id
 * @property {Boolean} guessed_correct
 */

/**
 * @typedef Team8Storage
 * @property {Number} volume
 * @property {String[]} category
 * @property {Guess[]} guesses
 * @property {Boolean} sound_effects_enabled
 * @property {Object} id_covered - All keys are ids of the vocabulary and all values are either true or false. If undefined, it is false.
 * @property {Number} covers - Number of words covered by user
 * @property {Boolean} persistent_notice - If true, the notice will be shown on every page load
 */

export const Types = {};

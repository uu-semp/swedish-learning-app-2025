/**
 * @typedef {Object} VocabEntry
 * @property {string} en - English word (e.g., "sweater").
 * @property {string} sv - Swedish translation.
 * @property {string} article - Swedish article ("en" or "ett").
 * @property {string} sv_plural - plural version of the specific word
 * @property {string} subCat - subcategory of word
 * @property {string} img - image url.
 * @property {string} img_copyright - Copyright or license information for the image.
 * @property {"TRUE"|"FALSE"} img_is_plural - If image contains multiple of object
 * @property {string} audio - URL or path to audio pronunciation.
 * @property {"TRUE"|"FALSE"} audio_is_plural - If audio describes multiple of object
 * @property {string} game - Specific data for this game, if loaded.
 */

/**
 * Needed to allow other files to include this and the discover the type above.
 */
export const TYPE = {};

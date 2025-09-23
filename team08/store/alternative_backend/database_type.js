/**
 * @typedef {Object} VocabEntry
 * @property {string} en - English word (e.g., "sweater").
 * @property {string} sv - Swedish translation.
 * @property {string} article - Swedish article ("en" or "ett").
 * @property {string} img - Copyright or license information for the image.
 * @property {string} img_copyright - URL or path to the image.
 * @property {string} audio - URL or path to audio pronunciation (may be empty).
 */

/**
 * @typedef {Object.<string, VocabEntry>} VocabMap
 * A map where keys are strings and values are VocabEntry objects.
 */

/**
 * @typedef {Object.<string, string[]>} CategoryMap
 * A map where keys are categories and values are a list of ids.
 */

// Currently there are some problems with these typings because of how the database is structured.
/**
 * @typedef {Object} RowItem
 * @property {string} Article - The grammatical article (e.g., "ett" or "en").
 * @property {string} Audio_url - URL or path to audio pronunciation (may be empty).
 * @property {string} Category - Category of the item (e.g., "furniture").
 * @property {string} English - English word (e.g., "window").
 * @property {string} ID - Unique identifier for the entry.
 * @property {string} Image_copyright_info - Copyright or license information for the image.
 * @property {string} Image_url - URL or path to the image.
 * @property {string} Literal - Literal translation (can be empty).
 * @property {string} Swedish - Swedish word (e.g., "fönster").
 * @property {string} Swedish_plural - Swedish plural form (may be empty).
 * @property {string} Team01
 * @property {string} Team02
 * @property {string} Team03
 * @property {string} Team04
 * @property {string} Team05
 * @property {string} Team06
 * @property {string} Team07
 * @property {string} Team08
 * @property {string} Team09
 * @property {string} Team10
 * @property {string} Team11
 * @property {string} Team13
 * @property {string} Team14
 * @property {string} Team15
 * @property {string} Team16
 */

/**
 * @typedef {Object} Database
 * @property {RowItem[]} rows
 * @property {VocabMap} vocab
 * @property {number} vocabLength
 * @property {CategoryMap} categories
 * @property {number} categoryLength
 */

export const DB = {};

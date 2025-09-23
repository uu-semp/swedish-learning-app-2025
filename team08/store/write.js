import { get, set } from "./alternative_backend/save.js";
import * as Types from "./storage_type.js";
import { TEAM, CATEGORIES } from "./store_config.js";

/**
 *
 * @param {Number} percentage
 * @returns {Number} 0 if success else fail
 */
export function local_set_volume(percentage) {
  if (percentage <= 100 && percentage >= 0) {
    console.error("Volume is outside range");
    return 1;
  }
  /** @type {Types.Team8Storage} */
  let data = get(TEAM);

  data.volume = percentage;

  set(TEAM, data);
}

/**
 *
 * @param {String[]} categories
 * @returns {Number} 0 if success else fail
 */
export function local_set_categories(categories) {
  if (
    categories.length > 3 ||
    !categories.every((item) =>
      ["food", "clothing", "furniture"].includes(item)
    )
  ) {
    console.error("Categories are invalid");
    return 1;
  }
  /** @type {Types.Team8Storage} */
  let data = get(TEAM);

  data.category = categories;

  set(TEAM, data);
}

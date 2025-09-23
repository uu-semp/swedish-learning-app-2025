import { get, set } from "./alternative_backend/save.js";
import * as Types from "./storage_type.js";

export const CATEGORIES = {
  FOOD: "food",
  CLOTHING: "clothing",
  FURNITURE: "furniture",
};

/**
 *
 * @param {Number} percentage
 * @returns {Number} 0 if success else fail
 */
export function set_volume(percentage) {
  if (percentage <= 100 && percentage >= 0) {
    console.error("Volume is outside range");
    return 1;
  }
  /** @type {Types.Team8Storage} */
  let data = get("team8");

  data.volume = percentage;

  set("team8", data);
}

/**
 *
 * @param {String[]} categories
 * @returns {Number} 0 if success else fail
 */
export function set_categories(categories) {
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
  let data = get("team8");

  data.category = categories;
}

import { get } from "./alternative_backend/save.js";
import * as Types from "./storage_type.js";

/**
 *
 * @returns {Number | null}
 */
export function get_volume() {
  /** @type {Types.Team8Storage} */
  let data = get("team8");
  if (data.volume === undefined) {
    return null;
  }
  return data.volume;
}

/**
 *
 * @returns {String[] | null}
 */
export function get_categories() {
  /** @type {Types.Team8Storage} */
  let data = get("team8");

  if (data.category === undefined) {
    return null;
  }

  return get("team8").category;
}

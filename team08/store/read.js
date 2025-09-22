import { get } from "./alternative_backend/save.js";
import * as Types from "./storage_type.js";

/**
 *
 * @returns {Number}
 */
export function get_volume() {
  /** @type {Types.Team8Storage} */
  let data = get("team8");

  return data.volume;
}

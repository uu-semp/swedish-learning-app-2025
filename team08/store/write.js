import { get, set } from "./alternative_backend/save.js";
import * as Types from "./storage_type.js";

/**
 *
 * @param {Number} percentage
 */
export function set_volume(percentage) {
  /** @type {Types.Team8Storage} */
  let data = get("team8");

  data.volume = percentage;

  set("team8", data);
}

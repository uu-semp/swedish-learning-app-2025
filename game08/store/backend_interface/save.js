/**
 *
 * @param {string} game_name
 * @returns {Object}
 */
export function get(game_name) {
  return window.save.get(game_name);
}

/**
 *
 * @param {string} game_name
 * @param {Object} data
 */
export function set(game_name, data) {
  window.save.set(game_name, data);
}

/**
 *
 * @param {string} game_name
 */
export function clear(game_name) {
  window.save.clear(game_name);
}

/**
 *
 * @param {string} game_name
 * @param {number} wins
 * @param {number} completion
 * @returns {boolean}
 */
export function setStats(game_name, wins, completion) {
  return window.save.stats.set(game_name, wins, completion);
}

/**
 *
 * @param {string} game_name
 * @returns {Object}
 */
export function getStats(game_name) {
  return window.save.stats.get(game_name);
}

/**
 *
 * @param {string} game_name
 * @returns {boolean}
 */
export function incrementWin(game_name) {
  return window.save.stats.incrementWin(game_name);
}

/**
 *
 * @param {string} game_name
 * @param {number} completion
 * @returns {boolean}
 */
export function setCompletion(game_name, completion) {
  return window.save.stats.setCompletion(game_name, completion);
}

/**
 *
 * @param {string} game_name
 * @returns {boolean}
 */
export function clearStats(game_name) {
  return window.save.stats.clear(game_name);
}

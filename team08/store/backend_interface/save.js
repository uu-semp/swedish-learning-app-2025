/**
 *
 * @param {string} team_name
 * @returns {Object}
 */
export function get(team_name) {
  return window.save.get(team_name);
}

/**
 *
 * @param {string} team_name
 * @param {Object} data
 */
export function set(team_name, data) {
  window.save.set(team_name, data);
}

/**
 *
 * @param {string} team_name
 */
export function clear(team_name) {
  window.save.clear(team_name);
}

/**
 *
 * @param {string} team_name
 * @param {number} wins
 * @param {number} completion
 * @returns {boolean}
 */
export function setStats(team_name, wins, completion) {
  return window.save.stats.set(team_name, wins, completion);
}

/**
 *
 * @param {string} team_name
 * @returns {Object}
 */
export function getStats(team_name) {
  return window.save.stats.get(team_name);
}

/**
 *
 * @param {string} team_name
 * @returns {boolean}
 */
export function incrementWin(team_name) {
  return window.save.stats.incrementWin(team_name);
}

/**
 *
 * @param {string} team_name
 * @param {number} completion
 * @returns {boolean}
 */
export function setCompletion(team_name, completion) {
  return window.save.stats.setCompletion(team_name, completion);
}

/**
 *
 * @param {string} team_name
 * @returns {boolean}
 */
export function clearStats(team_name) {
  return window.save.stats.clear(team_name);
}

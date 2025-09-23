// ==============================================
// Owned by the Menu team
// ==============================================

window.save = {
<<<<<<< HEAD
  get(team_name) {
    const json = localStorage.getItem(team_name);
    return json ? JSON.parse(json) : {}; // return empty object if not set
  },

  set(team_name, data) {
    localStorage.setItem(team_name, JSON.stringify(data));
  },

  clear(team_name) {
    localStorage.removeItem(team_name);
  },
};

/**
 *
 * @param {string} team_name
 * @returns {Object}
 */
export function get(team_name) {
  const json = localStorage.getItem(team_name);
  return json ? JSON.parse(json) : {}; // return empty object if not set
}

/**
 *
 * @param {string} team_name
 * @param {Object} data
 */
export function set(team_name, data) {
  localStorage.setItem(team_name, JSON.stringify(data));
}

/**
 *
 * @param {string} team_name
 */
export function clear(team_name) {
  localStorage.removeItem(team_name);
}
=======
    get(team_name, key = null) {
        try {
            const json = localStorage.getItem(team_name);
            const data = json ? JSON.parse(json) : {};
            return key ? data[key] : data;
        } catch (error) {
            console.warn(`Save API: Failed to get data for ${team_name}:`, error);
            return key ? null : {};
        }
    },

    set(team_name, key_or_data, value = null) {
        try {
            let currentData = this.get(team_name);
            if (typeof key_or_data === "object" && value === null) {
                currentData = {...currentData, ...key_or_data };
            } else {
                currentData[key_or_data] = value;
            }
            localStorage.setItem(team_name, JSON.stringify(currentData));
            return true;
        } catch (error) {
            console.warn(`Save API: Failed to set data for ${team_name}:`, error);
            return false;
        }
    },

    clear(team_name) {
        try {
            localStorage.removeItem(team_name);
            return true;
        } catch (error) {
            console.warn(`Save API: Failed to remove data for ${team_name}:`, error);
            return false;
        }
    },
};
>>>>>>> main

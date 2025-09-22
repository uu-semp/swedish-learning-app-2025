// ==============================================
// Owned by the Menu team
// ==============================================

window.save = {
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
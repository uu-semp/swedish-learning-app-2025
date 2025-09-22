// ==============================================
// Owned by the Menu group
// ==============================================

window.save = {
    get(group_name, key = null) {
        try {
            const json = localStorage.getItem(group_name);
            const data = json ? JSON.parse(json) : {};
            return key ? data[key] : data;
        } catch (error) {
            console.warn(`Save API: Failed to get data for ${group_name}:`, error);
            return key ? null : {};
        }
    },

    set(group_name, key_or_data, value = null) {
        try {
            let currentData = this.get(group_name);
            if (typeof key_or_data === "object" && value === null) {
                currentData = {...currentData, ...key_or_data };
            } else {
                currentData[key_or_data] = value;
            }
            localStorage.setItem(group_name, JSON.stringify(currentData));
            return true;
        } catch (error) {
            console.warn(`Save API: Failed to set data for ${group_name}:`, error);
            return false;
        }
    },

    clear(group_name) {
        try {
            localStorage.removeItem(group_name);
            return true;
        } catch (error) {
            console.warn(`Save API: Failed to remove data for ${group_name}:`, error);
            return false;
        }
    },
};
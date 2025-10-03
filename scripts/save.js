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

    stats: {
        set(team_name, wins, completion) {
            if (typeof wins !== 'number' || typeof completion !== 'number') {
                console.error('Stats API: wins and completion must be numbers');
                return false;
            }

            return window.save.set(team_name, 'stats', {
                wins: Math.max(0, Math.floor(wins)),
                completion: Math.max(0, Math.min(100, Math.floor(completion)))
            });
        },

        get(team_name) {
            const stats = window.save.get(team_name, 'stats');
            return stats || { wins: 0, completion: 0 };
        },

        incrementWin(team_name) {
            const current = this.get(team_name);
            return this.set(team_name, current.wins + 1, current.completion);
        },

        setCompletion(team_name, completion) {
            const current = this.get(team_name);
            let clamped_completion = Math.max(0, Math.min(100, Math.floor(completion)))
            return this.set(team_name, current.wins, clamped_completion);
        },

        clear(team_name) {
            return this.set(team_name, 0, 0);
        }
    }
};
// ==============================================
// Owned by the Menu team
// ==============================================

window.save = {
    get(game_name, key = null) {
        try {
            const json = localStorage.getItem(game_name);
            const data = json ? JSON.parse(json) : {};
            return key ? data[key] : data;
        } catch (error) {
            console.warn(`Save API: Failed to get data for ${game_name}:`, error);
            return key ? null : {};
        }
    },

    set(game_name, key_or_data, value = null) {
        try {
            let currentData = this.get(game_name);
            if (typeof key_or_data === "object" && value === null) {
                currentData = {...currentData, ...key_or_data };
            } else {
                currentData[key_or_data] = value;
            }
            localStorage.setItem(game_name, JSON.stringify(currentData));
            return true;
        } catch (error) {
            console.warn(`Save API: Failed to set data for ${game_name}:`, error);
            return false;
        }
    },

    clear(game_name) {
        try {
            localStorage.removeItem(game_name);
            return true;
        } catch (error) {
            console.warn(`Save API: Failed to remove data for ${game_name}:`, error);
            return false;
        }
    },

    stats: {
        set(game_name, wins, completion) {
            if (typeof wins !== 'number' || typeof completion !== 'number') {
                console.error('Stats API: wins and completion must be numbers');
                return false;
            }

            return window.save.set(game_name, 'stats', {
                wins: Math.max(0, Math.floor(wins)),
                completion: Math.max(0, Math.min(100, Math.floor(completion)))
            });
        },

        get(game_name) {
            const stats = window.save.get(game_name, 'stats');
            return stats || { wins: 0, completion: 0 };
        },

        incrementWin(game_name) {
            const current = this.get(game_name);
            return this.set(game_name, current.wins + 1, current.completion);
        },

        setCompletion(game_name, completion) {
            const current = this.get(game_name);
            let clamped_completion = Math.max(0, Math.min(100, Math.floor(completion)))
            return this.set(game_name, current.wins, clamped_completion);
        },

        clear(game_name) {
            return this.set(game_name, 0, 0);
        }
    }
};
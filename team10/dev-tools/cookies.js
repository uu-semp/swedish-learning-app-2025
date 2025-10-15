/**
 * ==================================================
 * Owned by Team 10
 * 
 * Cookie and Progress Management Script
 * ==================================================
 */

/**
 * Sets a cookie in the browser.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} days - The number of days until the cookie expires.
 */
export function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Gets a cookie from the browser.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The cookie value or null if not found.
 */
export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Saves the user's game progress to a cookie.
 * The progress object is converted to a JSON string for storage.
 * @param {{currentLevel: number, levelScores: object}} progressData - The user's progress object.
 */
export function saveProgress(progressData) {
    const progressString = JSON.stringify(progressData);
    setCookie('eatAndLearnProgress', progressString, 365); // Save for one year
}

/**
 * Loads the user's game progress from the cookie.
 * If no progress is found, it returns a default object for a new player.
 * @returns {{currentLevel: number, levelScores: object}} The user's progress object.
 */
export function loadProgress() {
    const progressString = getCookie('eatAndLearnProgress');
    if (progressString) {
        return JSON.parse(progressString);
    } else {
        // Default object for a new player
        return {
            game_completed: false,
            currentLevel: 1,
            levelScores: {
                1: 0,
                2: 0,
                3: 0
            }
        };
    }
}

/**
 * Resets all game progress and deletes the cookie.
 */
export function resetProgress() {
    setCookie('eatAndLearnProgress', '', -1); // Set expiry to a past date to delete
} 
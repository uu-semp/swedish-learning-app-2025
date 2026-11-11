import { getItems } from "../data.js";

const SR_STORAGE_KEY = "sr_memory";

// Interval in days for each level: Level 0 = 1 day, Level 1 = 2 days, etc.
const SR_INTERVALS = [1, 2, 4, 7, 14, 30, 60, 90, 180];

/**
 * Generates the date in YYYY-MM-DD format respecting the local timezone.
 */
function getLocalISODate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function loadSpacedRepetitionMemory() {
    const memory = save.get("game11", SR_STORAGE_KEY);
    return memory || {};
}

function saveSpacedRepetitionMemory(memory) {
    save.set("game11", SR_STORAGE_KEY, memory);
}

/**
 * Initializes the Spaced Repetition memory.
 *
 * The first half of the words is scheduled for today,
 * the second half for tomorrow.
 */
function initializeSpacedRepetition() {
    const words = getItems();

    if (!words.length) {
        console.warn("[SR] No vocabulary available.");
        return {};
    }

    const memory = {};

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayString = getLocalISODate(today);
    const tomorrowString = getLocalISODate(tomorrow);

    const half = Math.ceil(words.length / 2);

    words.forEach((word, index) => {
        const gameId = getGameId(word);
        memory[gameId] = {
            errorsCurrent: 0,
            errorsTotal: 0,
            level: 0,
            nextReview: index < half
                ? todayString
                : tomorrowString
        };
    });

    saveSpacedRepetitionMemory(memory);

    return memory;
}

/**
 * Returns all vocabulary words that are due for review today.
 */
function getWordsDueToday() {
    const memory = loadSpacedRepetitionMemory();
    const words = getItems();

    const today = getLocalISODate(new Date());

    return words.filter(word => {
        const gameId = getGameId(word); 
        const wordMemory = memory[gameId];

        if (!wordMemory) {
            return false;
        }

        return wordMemory.nextReview <= today;
    });
}

/**
 * Updates the word's level and calculates the next review date.
 */
function updateSpacedRepetitionWord(wordId, mistakes) {
    const memory = loadSpacedRepetitionMemory();
    const wordMemory = memory[wordId];

    if (!wordMemory) {
        return;
    }

    wordMemory.errorsTotal += mistakes;

    const maxLevel = SR_INTERVALS.length - 1;

    // Progress on success, total reset on any mistake
    if (mistakes === 0) {
        wordMemory.level = Math.min((wordMemory.level || 0) + 1, maxLevel);
    } else {
        wordMemory.level = 0;
    }

    // Calculate next review date based on the new level
    const intervalInDays = SR_INTERVALS[wordMemory.level];
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalInDays);
    
    wordMemory.nextReview = getLocalISODate(nextDate);
    wordMemory.errorsCurrent = 0; // Reset session errors

    saveSpacedRepetitionMemory(memory);
}

function getGameId(word) {
    if (word.img) {
        return word.img.split('/').pop().split('.')[0].toLowerCase();
    }
    return String(word.id).toLowerCase();
}

export {
    loadSpacedRepetitionMemory,
    saveSpacedRepetitionMemory,
    initializeSpacedRepetition,
    getWordsDueToday,
    updateSpacedRepetitionWord
};
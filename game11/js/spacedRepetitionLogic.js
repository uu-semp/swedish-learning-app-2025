import { getItems } from "./data.js";

const SR_STORAGE_KEY = "game11_spaced_repetition";



/**
 * Loads the Spaced Repetition memory from localStorage.
 */
function loadSpacedRepetitionMemory() {
    try {
        const raw = localStorage.getItem(SR_STORAGE_KEY);

        if (!raw) {
            return {};
        }

        const memory = JSON.parse(raw);

        if (
            typeof memory !== "object" ||
            memory === null ||
            Array.isArray(memory)
        ) {
            throw new Error("Invalid Spaced Repetition memory");
        }

        return memory;
    } catch (error) {
        console.warn("[SR] Invalid memory discarded:", error);
        localStorage.removeItem(SR_STORAGE_KEY);
        return {};
    }
}

/**
 * Saves the Spaced Repetition memory to localStorage.
 */
function saveSpacedRepetitionMemory(memory) {
    try {
        localStorage.setItem(
            SR_STORAGE_KEY,
            JSON.stringify(memory)
        );
    } catch (error) {
        console.warn("[SR] Could not save memory:", error);
    }
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

    const todayString = today.toISOString().slice(0, 10);
    const tomorrowString = tomorrow.toISOString().slice(0, 10);

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

    const today = new Date().toISOString().slice(0, 10);

    return words.filter(word => {
        const gameId = getGameId(word); 
        const wordMemory = memory[gameId];

        if (!wordMemory) {
            return false;
        }

        return wordMemory.nextReview <= today;
    });
}

function updateSpacedRepetitionWord(wordId, mistakes) {
    const memory = loadSpacedRepetitionMemory();
    const wordMemory = memory[wordId];

    if (!wordMemory) {
        return;
    }

    wordMemory.errorsCurrent = mistakes;
    wordMemory.errorsTotal += mistakes;

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
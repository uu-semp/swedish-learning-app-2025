import { LEVEL_SUBCATEGORIES, subcategoriesForLevel } from "../level_configuration.js";
import {
    buildVariants, catalogItemFor, chooseVariants,
    fillPictureStore, pictureKeysForChoice, picturesForChoice,
} from "./garment_variants.js";
import { deletePicturesExcept } from "./wardrobe_cache.js";
import { getClothingWords, refreshClothingWords, savedClothingWords } from "./word_list_cache.js";

/**
 * Builds the wardrobe (the coloured garments) for each round, fast and in
 * new random colours every time.
 *
 * Rendering coloured garments is slow, so the colours of a round are
 * chosen in advance (a "plan") and its pictures are rendered in the
 * background while the player is busy with the round before:
 *
 * - The menu (prepareWardrobes) downloads the word list once per game
 *   start (word_list_cache.js) and plans the first round of every level.
 * - A level page (loadWardrobe) uses the plan made for it, or makes one
 *   on the spot. Once the round is showing, prepareUpcoming plans the
 *   next round of this level and the first round of the next level.
 * - Plans live in sessionStorage, pictures in IndexedDB
 *   (wardrobe_cache.js), so both survive the reload between rounds.
 *   Pictures that no plan needs any more are deleted.
 *
 * Colours come from LEVEL_COLORS in categories.js.
 */

const LEVELS = Object.keys(LEVEL_SUBCATEGORIES).map(Number);

// Waits until the browser is idle, so background rendering doesn't make
// the page stutter while the player is dragging clothes.
function idle() {
    return new Promise((resolve) => {
        if (typeof requestIdleCallback === "function") requestIdleCallback(() => resolve(), { timeout: 500 });
        else setTimeout(resolve, 0);
    });
}

/** The word-list rows that belong in a level's wardrobe (and have art). */
function wordsForLevel(level, words, { warn = false } = {}) {
    const subcategories = subcategoriesForLevel(level);
    const withoutArt = [];
    const result = words.filter((word) => {
        const subcategory = word.subCat?.trim().toLowerCase();
        if (!subcategory) {
            if (warn) console.warn(`Clothing entry ${word.id} (${word.sv}) has no Subcategory, so it has no place on Pelle.`);
            return false;
        }
        if (!subcategories.includes(subcategory)) return false;
        if (!catalogItemFor(word)) {
            withoutArt.push(word.sv);
            return false;
        }
        return true;
    });
    if (warn && withoutArt.length > 0) {
        console.info(`No masking art yet, so not in the wardrobe: ${withoutArt.join(", ")}`);
    }
    return result;
}

// ---- Plans: the colours and patterns of one round, per word id --------

const planKey = (level) => `game13.plan.${level}`;

function newPlan(level, words) {
    return Object.fromEntries(
        wordsForLevel(level, words).map((word) => [word.id, chooseVariants(word, level)])
    );
}

function readPlan(level) {
    try {
        return JSON.parse(sessionStorage.getItem(planKey(level)));
    } catch {
        return null;
    }
}

function savePlan(level, plan) {
    try {
        sessionStorage.setItem(planKey(level), JSON.stringify(plan));
    } catch {
        // no sessionStorage: the next round just renders its own pictures
    }
}

function takePlan(level) {
    const plan = readPlan(level);
    try { sessionStorage.removeItem(planKey(level)); } catch { /* ignore */ }
    return plan;
}

// The plan of the round currently on screen (its pictures must be kept).
let currentPlan = null;

function pictureJobs(plan, words) {
    const byId = new Map(words.map((w) => [w.id, w]));
    return Object.entries(plan).flatMap(([id, choice]) =>
        byId.has(id) ? picturesForChoice(byId.get(id), choice) : []);
}

function pictureKeys(plan, words) {
    const byId = new Map(words.map((w) => [w.id, w]));
    return Object.entries(plan).flatMap(([id, choice]) =>
        byId.has(id) ? pictureKeysForChoice(byId.get(id), choice) : []);
}

/** Deletes stored pictures that neither the current round nor a plan needs. */
async function deleteUnusedPictures(words) {
    const keep = new Set();
    for (const plan of [currentPlan, ...LEVELS.map(readPlan)]) {
        if (plan) pictureKeys(plan, words).forEach((key) => keep.add(key));
    }
    await deletePicturesExcept(keep);
}

/** Makes (if needed) and renders the plan for a level's next round. */
async function preparePlan(level, words) {
    let plan = readPlan(level);
    if (!plan) {
        plan = newPlan(level, words);
        savePlan(level, plan);
    }
    await fillPictureStore(pictureJobs(plan, words), idle);
}

// ---- Used by the pages ---------------------------------------------------

/**
 * The wardrobe of one round: an array of ImgObjects, in the colours
 * planned for this round, or new random ones if there is no plan.
 */
export async function loadWardrobe(level) {
    const words = savedClothingWords() ?? await refreshClothingWords();
    const plan = takePlan(level) ?? {};
    const levelWords = wordsForLevel(level, words, { warn: true });

    currentPlan = Object.fromEntries(levelWords.map((word) =>
        [word.id, plan[word.id] ?? chooseVariants(word, level)]));

    const builds = levelWords.map((word) => buildVariants(
        word.id, word, word.subCat.trim().toLowerCase(), level, currentPlan[word.id]));
    return (await Promise.all(builds)).flat();
}

/**
 * Game page, once a round is showing: plans and renders the next round of
 * this level, then the first round of the next level, in the background.
 */
export async function prepareUpcoming(level) {
    const words = savedClothingWords();
    if (!words) return;
    for (const next of [level, level + 1].filter((l) => LEVELS.includes(l))) {
        await preparePlan(next, words);
    }
    await deleteUnusedPictures(words);
}

/** Level introduction page: get this level's first round ready. */
export async function prepareWardrobe(level) {
    const words = await getClothingWords();
    await preparePlan(level, words);
}

/**
 * Called when the game starts (menu): refreshes the word list, then plans
 * and renders the first round of every level, level 1 first.
 */
export async function prepareWardrobes() {
    let words;
    try {
        words = await refreshClothingWords();
    } catch (err) {
        console.warn("Could not download the word list, using the saved copy:", err.message);
        words = savedClothingWords();
        if (!words) return;
    }
    for (const level of LEVELS) await preparePlan(level, words);
    await deleteUnusedPictures(words);
}

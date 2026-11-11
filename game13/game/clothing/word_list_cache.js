import { CLOTHING_CATEGORY } from "../level_configuration.js";

/**
 * Keeps the clothing rows of the shared word list in the browser
 * (localStorage), so levels and rounds don't download the whole Google
 * Sheet every time a page loads.
 *
 * The game menu (index.html) calls refreshClothingWords() every time the
 * game is started, so rows added to or removed from the sheet show up or
 * disappear on the next start (REQ-DEVELOPER-5.2). Level pages only read
 * the saved copy with getClothingWords(), and download the sheet only if
 * there is no saved copy yet.
 */

const STORAGE_KEY = "game13.clothingWords.v1";

let refreshing = null;

/** The saved clothing rows, or null if there are none. */
export function savedClothingWords() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved?.words) ? saved.words : null;
    } catch {
        return null; // storage blocked or corrupt: treat as empty
    }
}

/** Downloads the word list, saves its clothing rows and returns them. */
export function refreshClothingWords() {
    refreshing ??= downloadClothingWords()
        .then((words) => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), words }));
            } catch (err) {
                console.warn("Could not save the word list in the browser:", err.message);
            }
            return words;
        })
        .finally(() => { refreshing = null; });
    return refreshing;
}

/** The saved clothing rows, downloading them first if there are none. */
export async function getClothingWords() {
    return savedClothingWords() ?? refreshClothingWords();
}

/**
 * Loads the shared word list with the common loader (scripts/), and keeps
 * only what Game 13 needs from each clothing row.
 */
async function downloadClothingWords() {
    const vocabulary = await import("../../../scripts/vocabulary_await.js");
    await vocabulary.loaddb();

    const ids = vocabulary.get_category(CLOTHING_CATEGORY) ?? [];
    return ids
        .map((id) => {
            const vocab = vocabulary.get_vocab(id);
            if (!vocab) return null;
            return {
                id,
                en: vocab.en ?? "",
                sv: vocab.sv ?? "",
                article: vocab.article ?? "",
                subCat: vocab.subCat ?? "",
            };
        })
        .filter(Boolean);
}

import { COLORS, PATTERNS, ITEMS } from "./clothing_catalog.js";
import { renderGarmentCanvas, cropToContent } from "./garment_renderer.js";
import { ImgObject } from "./imgObject.js";

/**
 * Turns word-list clothing into coloured, patterned wardrobe items.
 *
 * Every word that has masking art in clothing_catalog.js is rendered in
 * a few different colours (and patterns, from PATTERNS_FROM_LEVEL), so
 * the player has to read the colour and pattern words, not only the
 * garment word. Each variant becomes an ImgObject with an id like
 * "02451775|blue|striped" and a Swedish description like
 * "blå randig blus", so the outfit generator and the confirm check work
 * on variants without changes.
 */

// How many differently coloured copies of each garment go on the shelf.
export const VARIANTS_PER_GARMENT = 2;

// Level 1 uses plain colours only; patterns start at this level.
export const PATTERNS_FROM_LEVEL = 2;

const itemByWord = new Map(ITEMS.map((item) => [item.wordList, item]));

const PATTERN_ENGLISH = {
    plain: "",
    striped: "striped",
    checkered: "checkered",
    dotted: "dotted",
    floral: "floral",
};

/** The catalogue garment for a word-list entry, or undefined if it has no art. */
export function catalogItemFor(vocab) {
    return itemByWord.get(vocab.en?.trim().toLowerCase());
}

// "en" / "ett" for singular words, "plural" for pairs and plural-only
// words (jeans, glasögon), which have no article in the word list.
function grammaticalForm(item, vocab) {
    if (item.pair) return "plural";
    const article = vocab.article?.trim();
    return article === "en" || article === "ett" ? article : "plural";
}

function shuffled(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function pickPattern(item, level) {
    if (!item.patternable || level < PATTERNS_FROM_LEVEL) return "plain";
    const keys = Object.keys(PATTERNS);
    return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Renders the variants of one word-list garment.
 * Resolves to an array of ImgObjects (empty if the art fails to load).
 */
export async function buildVariants(id, vocab, subcategory, level) {
    const item = catalogItemFor(vocab);
    if (!item) return [];

    const form = grammaticalForm(item, vocab);
    const noun = item.pair ? item.sv : vocab.sv;
    const colors = shuffled(Object.keys(COLORS)).slice(0, VARIANTS_PER_GARMENT);
    const variants = [];

    for (const color of colors) {
        const pattern = pickPattern(item, level);
        try {
            const canvas = await renderGarmentCanvas(item, { color, pattern });
            const swedish = [COLORS[color].sv[form], PATTERNS[pattern].sv?.[form], noun]
                .filter(Boolean).join(" ");
            const english = [color, PATTERN_ENGLISH[pattern], vocab.en]
                .filter(Boolean).join(" ");

            variants.push(new ImgObject(
                `${id}|${color}|${pattern}`,
                canvas.toDataURL(),
                swedish,
                subcategory,
                english,
                form === "plural" ? "" : form,
                cropToContent(canvas).toDataURL(),
                item.layer
            ));
        } catch (err) {
            console.warn(`Could not render ${item.key} (${vocab.sv}): ${err.message}`);
            return [];
        }
    }
    return variants;
}

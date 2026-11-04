import { COLORS, PATTERNS, ITEMS } from "./clothing_catalog.js";
import { renderGarmentCanvas } from "./garment_renderer.js";
import { ImgObject } from "./imgObject.js";
import { getStoredPicture, storePicture, storedPictureKeys } from "./wardrobe_cache.js";
import { colorsForLevel } from "../level_configuration.js";

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

// Bump this when garment art, colours or rendering change, so pictures
// stored in players' browsers are rendered again.
const PICTURE_VERSION = 1;

// Space kept around a garment when it is cropped out of Pelle's canvas.
const CROP_PADDING = 8;

function pictureKey(item, color, pattern) {
    return `${PICTURE_VERSION}|${item.key}|${color}|${pattern}`;
}

function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not encode image")), "image/png");
    });
}

// Where a garment sits on Pelle's canvas: its visible pixels plus padding.
// This depends only on the garment's mask and lines, not on the colour,
// so it is worked out once per garment.
const boxes = new Map();

function contentBox(canvas) {
    const { width, height } = canvas;
    const data = canvas.getContext("2d").getImageData(0, 0, width, height).data;
    let minX = width, minY = height, maxX = -1, maxY = -1;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (data[(y * width + x) * 4 + 3] > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    if (maxX < 0) return { x: 0, y: 0, w: width, h: height, width, height };
    const x = Math.max(0, minX - CROP_PADDING);
    const y = Math.max(0, minY - CROP_PADDING);
    return {
        x, y,
        w: Math.min(width - 1, maxX + CROP_PADDING) - x + 1,
        h: Math.min(height - 1, maxY + CROP_PADDING) - y + 1,
        width, height,
    };
}

/**
 * Renders one garment in one colour and pattern, cropped to the garment.
 * Resolves to { thumb: PNG Blob, box: position on Pelle's canvas }.
 */
async function renderPicture(item, color, pattern) {
    const canvas = await renderGarmentCanvas(item, { color, pattern });
    if (!boxes.has(item.key)) boxes.set(item.key, contentBox(canvas));
    const box = boxes.get(item.key);

    const crop = document.createElement("canvas");
    crop.width = box.w;
    crop.height = box.h;
    crop.getContext("2d").drawImage(canvas, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
    return { thumb: await canvasToBlob(crop), box };
}

/** A garment picture from the browser's store, rendered and stored if missing. */
async function pictureFor(item, color, pattern) {
    const key = pictureKey(item, color, pattern);
    const stored = await getStoredPicture(key);
    if (stored) return stored;
    const picture = await renderPicture(item, color, pattern);
    storePicture(key, picture); // no need to wait
    return picture;
}

/**
 * Picks random colours (from the level's colour list) and patterns for
 * one word-list garment: [{ color, pattern }, ...], one per variant.
 */
export function chooseVariants(vocab, level) {
    const item = catalogItemFor(vocab);
    if (!item) return [];
    return shuffled(colorsForLevel(level))
        .slice(0, VARIANTS_PER_GARMENT)
        .map((color) => ({ color, pattern: pickPattern(item, level) }));
}

/** The pictures a choice needs, as [item, color, pattern] triples. */
export function picturesForChoice(vocab, choice) {
    const item = catalogItemFor(vocab);
    return item ? choice.map(({ color, pattern }) => [item, color, pattern]) : [];
}

/** The store key of each picture a choice needs. */
export function pictureKeysForChoice(vocab, choice) {
    return picturesForChoice(vocab, choice).map(([item, color, pattern]) => pictureKey(item, color, pattern));
}

/**
 * Builds the variants of one word-list garment in the given colours and
 * patterns (see chooseVariants). Pictures already stored in the browser
 * are reused; missing ones are rendered and stored.
 * Resolves to an array of ImgObjects (empty if the art fails to load).
 */
export async function buildVariants(id, vocab, subcategory, level, choice = chooseVariants(vocab, level)) {
    const item = catalogItemFor(vocab);
    if (!item) return [];

    const form = grammaticalForm(item, vocab);
    const noun = item.pair ? item.sv : vocab.sv;
    const variants = [];

    for (const { color, pattern } of choice) {
        try {
            const { thumb, box } = await pictureFor(item, color, pattern);
            const swedish = [COLORS[color].sv[form], PATTERNS[pattern].sv?.[form], noun]
                .filter(Boolean).join(" ");
            const english = [color, PATTERN_ENGLISH[pattern], vocab.en]
                .filter(Boolean).join(" ");
            const url = URL.createObjectURL(thumb);

            variants.push(new ImgObject(
                `${id}|${color}|${pattern}`,
                url,
                swedish,
                subcategory,
                english,
                form === "plural" ? "" : form,
                url,
                item.layer,
                box
            ));
        } catch (err) {
            console.warn(`Could not render ${item.key} (${vocab.sv}): ${err.message}`);
            return [];
        }
    }
    return variants;
}

/**
 * Renders, one at a time while the browser is idle, the given pictures
 * ([item, color, pattern] triples, see picturesForChoice) that aren't
 * stored yet.
 */
export async function fillPictureStore(jobs, isIdle) {
    const stored = await storedPictureKeys();
    for (const [item, color, pattern] of jobs) {
        const key = pictureKey(item, color, pattern);
        if (stored.has(key)) continue;
        stored.add(key); // skip duplicates in jobs
        await isIdle();
        try {
            await storePicture(key, await renderPicture(item, color, pattern));
        } catch {
            // missing art: buildVariants already warns about it
        }
    }
}

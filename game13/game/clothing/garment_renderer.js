import { COLORS, PATTERNS } from "./clothing_catalog.js";

/**
 * Builds a coloured, patterned garment image from its line art and mask.
 *
 * Every garment file is exported on the same canvas as Pelle, so the
 * result can be stacked directly on top of him without any positioning.
 *
 * Layers, bottom to top:
 *   1. base colour          (whole canvas)
 *   2. pattern shape.png    (tiled, recoloured)
 *   3. pattern fixed.png    (tiled, drawn as is, e.g. flower centres)
 *   4. shade.png            (optional, multiplied, folds and shadows)
 *   -> everything above is cut to mask.png
 *   5. line.png             (outlines and parts that never change colour)
 */

const imageCache = new Map();
const garmentCache = new Map();

// Loads an image once. Optional images resolve to null if missing.
function loadImage(src, optional = false) {
    if (!src) return Promise.resolve(null);
    if (!imageCache.has(src)) {
        imageCache.set(src, new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => optional
                ? resolve(null)
                : reject(new Error(`Could not load ${src}`));
            img.src = src;
        }));
    }
    return imageCache.get(src);
}

function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]) {
    return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function mix(hex, otherHex, amount) {
    const a = hexToRgb(hex);
    const b = hexToRgb(otherHex);
    return rgbToHex(a.map((v, i) => v + (b[i] - v) * amount));
}

function isVeryLight(hex) {
    const [r, g, b] = hexToRgb(hex);
    return 0.299 * r + 0.587 * g + 0.114 * b > 230;
}

// Turns "colour" / "light" / "white" from the pattern table into a hex code.
// White has no lighter shade, so it goes slightly grey instead.
function resolveShade(role, colorHex) {
    if (role === "colour") return colorHex;
    if (role === "light") {
        return isVeryLight(colorHex) ? mix(colorHex, "#000000", 0.12) : mix(colorHex, "#ffffff", 0.55);
    }
    if (role === "white") {
        return isVeryLight(colorHex) ? "#e4e4e4" : "#ffffff";
    }
    return colorHex;
}

// Returns a copy of the tile with every visible pixel set to one colour.
function tintTile(tile, hex) {
    const c = document.createElement("canvas");
    c.width = tile.naturalWidth;
    c.height = tile.naturalHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(tile, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, c.width, c.height);
    return c;
}

function fillWithTile(ctx, tile, scale) {
    const pattern = ctx.createPattern(tile, "repeat");
    pattern.setTransform(new DOMMatrix().scale(scale));
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Renders one garment and returns a canvas the size of Pelle's canvas.
 *
 * item:    { key, line, mask, shade?, patternable }
 * options: { color: key in COLORS, pattern: key in PATTERNS, patternScale }
 */
export async function renderGarmentCanvas(item, { color, pattern = "plain", patternScale = 1 }) {
    const colorHex = COLORS[color].hex;
    const patternDef = PATTERNS[item.patternable ? pattern : "plain"];

    const [line, mask, shade, shapeTile, fixedTile] = await Promise.all([
        loadImage(item.line),
        loadImage(item.mask),
        loadImage(item.shade, true),
        loadImage(patternDef.shape),
        loadImage(patternDef.fixed, true),
    ]);

    const canvas = document.createElement("canvas");
    canvas.width = line.naturalWidth;
    canvas.height = line.naturalHeight;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = resolveShade(patternDef.base, colorHex);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (shapeTile) fillWithTile(ctx, tintTile(shapeTile, resolveShade(patternDef.pattern, colorHex)), patternScale);
    if (fixedTile) fillWithTile(ctx, fixedTile, patternScale);

    if (shade) {
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(shade, 0, 0);
    }

    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(mask, 0, 0);

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(line, 0, 0);

    return canvas;
}

/** Same as renderGarmentCanvas, but returns a cached image URL for <img src>. */
export async function renderGarment(item, options) {
    const patternKey = item.patternable ? options.pattern ?? "plain" : "plain";
    const key = `${item.key}|${options.color}|${patternKey}|${options.patternScale ?? 1}`;
    if (!garmentCache.has(key)) {
        garmentCache.set(key, renderGarmentCanvas(item, options).then((c) => c.toDataURL()));
    }
    return garmentCache.get(key);
}

/**
 * Crops a canvas to its visible pixels (plus padding), for wardrobe
 * thumbnails. Full-canvas garments are mostly empty space otherwise.
 */
export function cropToContent(canvas, padding = 8) {
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
    if (maxX < 0) return canvas; // nothing visible

    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(width - 1, maxX + padding);
    maxY = Math.min(height - 1, maxY + padding);

    const out = document.createElement("canvas");
    out.width = maxX - minX + 1;
    out.height = maxY - minY + 1;
    out.getContext("2d").drawImage(canvas, minX, minY, out.width, out.height, 0, 0, out.width, out.height);
    return out;
}

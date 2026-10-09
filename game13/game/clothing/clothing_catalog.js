/**
 * Colours and patterns that garments can be rendered in.
 *
 * Every garment has exactly one named colour (the word used in the
 * Swedish sentence). Patterns use a lighter shade of that colour, which
 * is calculated in garment_renderer.js, so only the named colours are
 * defined here.
 */
export const COLORS = {
    red:    { hex: "#d9443f", sv: { en: "röd",    ett: "rött",   plural: "röda" } },
    orange: { hex: "#f08a2c", sv: { en: "orange", ett: "orange", plural: "orange" } },
    yellow: { hex: "#f2c94c", sv: { en: "gul",    ett: "gult",   plural: "gula" } },
    green:  { hex: "#5aa95a", sv: { en: "grön",   ett: "grönt",  plural: "gröna" } },
    blue:   { hex: "#4a78c9", sv: { en: "blå",    ett: "blått",  plural: "blå" } },
    purple: { hex: "#9a6cc9", sv: { en: "lila",   ett: "lila",   plural: "lila" } },
    pink:   { hex: "#f29bb5", sv: { en: "rosa",   ett: "rosa",   plural: "rosa" } },
    brown:  { hex: "#8b5a3c", sv: { en: "brun",   ett: "brunt",  plural: "bruna" } },
    black:  { hex: "#2b2b2b", sv: { en: "svart",  ett: "svart",  plural: "svarta" } },
    white:  { hex: "#fafafa", sv: { en: "vit",    ett: "vitt",   plural: "vita" } },
};

/**
 * base / pattern say what fills the garment and the pattern shapes:
 *   "colour" = the named colour, "light" = a lighter shade of it,
 *   "white"  = white (light grey when the named colour is white).
 * fixed: the pattern has a fixed.png drawn on top without recolouring.
 */
const PATTERN_DIR = "../assets/game13/patterns";

export const PATTERNS = {
    plain:     { base: "colour", sv: null },
    striped:   { base: "light",  pattern: "colour", shape: `${PATTERN_DIR}/striped.png`,
                 sv: { en: "randig", ett: "randigt", plural: "randiga" } },
    checkered: { base: "light",  pattern: "colour", shape: `${PATTERN_DIR}/checkered.png`,
                 sv: { en: "rutig", ett: "rutigt", plural: "rutiga" } },
    dotted:    { base: "colour", pattern: "light",  shape: `${PATTERN_DIR}/dotted.png`,
                 sv: { en: "prickig", ett: "prickigt", plural: "prickiga" } },
    floral:    { base: "white",  pattern: "colour", shape: `${PATTERN_DIR}/floral.png`,
                 fixed: `${PATTERN_DIR}/floral_fixed.png`,
                 sv: { en: "blommig", ett: "blommigt", plural: "blommiga" } },
};

/**
 * Slots on Pelle, in the order they appear in the wardrobe. Only one
 * item per slot can be worn at a time.
 */
export const SLOTS = [
    { key: "head",          sv: "huvud" },
    { key: "eyes",          sv: "ögon" },
    { key: "ears",          sv: "öron" },
    { key: "neck",          sv: "hals" },
    { key: "top",           sv: "överdel" },
    { key: "topAccessory",  sv: "slips" },
    { key: "bottoms",       sv: "underdel" },
    { key: "belt",          sv: "bälte" },
    { key: "onePiece",      sv: "helkropp" },
    { key: "hands",         sv: "händer" },
    { key: "feet",          sv: "fötter" },
];

/**
 * Every garment. Files live in assets/game13/clothes/<key>/ as
 * line.png, mask.png and optionally shade.png (set extra.shade), all exported on
 * Pelle's canvas.
 *
 * layer: drawing order on Pelle (higher is on top).
 *   0 Pelle, 10–70 clothing, 90 Pelle's hand, 100 hand accessories
 *   Shoes (22) sit above bottoms (20) so jeans look tucked into boots.
 * patternable: false means colour only (no patterns).
 */
const CLOTHES_DIR = "../assets/game13/clothes";

/**
 * extra.wordList: the item's English name in the shared word list, when it
 *   differs from key (the game finds garments by that name).
 * extra.pair: the word list has the singular ("stövel"), but the picture is
 *   a pair, so the game uses sv (plural) and plural adjectives instead.
 * extra.shade: true once a shade.png has been exported for the garment
 *   (otherwise it is not requested, to avoid 404 errors in the console).
 */
function garment(key, sv, slot, layer, patternable, extra = {}) {
    return {
        key, sv, slot, layer, patternable,
        wordList: extra.wordList ?? key,
        pair: extra.pair ?? false,
        line:  `${CLOTHES_DIR}/${key}/line.png`,
        mask:  `${CLOTHES_DIR}/${key}/mask.png`,
        shade: extra.shade ? `${CLOTHES_DIR}/${key}/shade.png` : null,
    };
}

export const ITEMS = [
    garment("beanie",     "mössa",        "head",         70, true),
    garment("cap",        "keps",         "head",         70, true),
    garment("hat",        "hatt",         "head",         70, true),

    garment("glasses",    "glasögon",     "eyes",         60, false),
    garment("sunglasses", "solglasögon",  "eyes",         60, false),

    garment("earrings",   "örhängen",     "ears",         60, false, { pair: true }),

    garment("scarf",      "halsduk",      "neck",         60, true),
    garment("necklace",   "halsband",     "neck",         60, false),

    garment("sweater",    "tröja",        "top",          30, true),
    garment("jacket",     "jacka",        "top",          30, true),
    garment("shirt",      "skjorta",      "top",          30, true),
    garment("blouse",     "blus",         "top",          30, true),
    garment("cardigan",   "kofta",        "top",          30, true),
    garment("hoodie",     "hoodie",       "top",          30, true),
    garment("blazer",     "kavaj",        "top",          30, true),

    garment("tie",        "slips",        "topAccessory", 50, true),

    garment("trousers",   "byxor",        "bottoms",      20, true,  { wordList: "pants" }),
    garment("jeans",      "jeans",        "bottoms",      20, false),
    garment("skirt",      "kjol",         "bottoms",      20, true),
    garment("shorts",     "shorts",       "bottoms",      20, true),
    garment("tights",     "strumpbyxor",  "bottoms",      20, true,  { wordList: "pantyhose" }),
    garment("leggings",   "leggings",     "bottoms",      20, true),

    garment("belt",       "bälte",        "belt",         25, false),

    garment("dress",      "klänning",     "onePiece",     40, true),
    garment("coat",       "kappa",        "onePiece",     40, true),
    garment("suit",       "kostym",       "onePiece",     40, true),

    garment("gloves",     "handskar",     "hands",       100, true,  { pair: true }),
    garment("mittens",    "vantar",       "hands",       100, true,  { pair: true }),
    garment("bracelet",   "armband",      "hands",       100, false),
    garment("ring",       "ring",         "hands",       100, false),

    garment("sandals",    "sandaler",     "feet",         22, false, { pair: true }),
    garment("boots",      "stövlar",      "feet",         22, false, { pair: true }),
    garment("socks",      "strumpor",     "feet",         10, true,  { pair: true }),
];

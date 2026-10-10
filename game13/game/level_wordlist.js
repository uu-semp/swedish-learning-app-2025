import { CLOTHING_CATEGORY, LEVEL_SUBCATEGORIES } from "./clothing/categories.js";
import { COLORS, PATTERNS } from "./clothing/clothing_catalog.js";
import { catalogItemFor, PATTERNS_FROM_LEVEL } from "./clothing/garment_variants.js";

/**
 * Word lists for the level introduction page.
 *
 * "New words" are the words a level adds: the garments (with art) on the
 * shelves that are new in this level, the colours in level 1 and the
 * patterns in PATTERNS_FROM_LEVEL. "You should already know" is every
 * word that earlier levels added.
 */

const PATTERN_ENGLISH = { striped: "striped", checkered: "checkered", dotted: "dotted", floral: "floral" };

// Garment words (with art) whose shelf is in the given subcategories.
function garmentWords(subcategories) {
    const ids = window.vocabulary.get_category(CLOTHING_CATEGORY) ?? [];
    const words = [];
    for (const id of ids) {
        const vocab = window.vocabulary.get_vocab(id);
        const subcategory = vocab?.subCat?.trim().toLowerCase();
        const item = vocab && catalogItemFor(vocab);
        if (!item || !subcategories.includes(subcategory)) continue;

        // Pairs are shown in the plural, as in the game ("stövlar")
        const article = item.pair ? "" : (vocab.article?.trim() ?? "");
        const swedish = item.pair ? item.sv : vocab.sv;
        words.push({ sv: article ? `${article} ${swedish}` : swedish, en: vocab.en });
    }
    return words.sort((a, b) => a.en.localeCompare(b.en));
}

/** The words that the given level adds, grouped as [{ heading, words }]. */
function wordsAddedIn(level) {
    const previous = LEVEL_SUBCATEGORIES[level - 1] ?? [];
    const newSubcategories = LEVEL_SUBCATEGORIES[level].filter((s) => !previous.includes(s));
    const groups = [{ heading: "Kläder", words: garmentWords(newSubcategories) }];

    if (level === 1) {
        groups.push({
            heading: "Färger",
            words: Object.entries(COLORS).map(([en, c]) => ({ sv: c.sv.en, en })),
        });
    }
    if (level === PATTERNS_FROM_LEVEL) {
        groups.push({
            heading: "Mönster",
            words: Object.entries(PATTERNS)
                .filter(([, p]) => p.sv)
                .map(([key, p]) => ({ sv: p.sv.en, en: PATTERN_ENGLISH[key] })),
        });
    }
    return groups.filter((g) => g.words.length > 0);
}

function renderGroups(container, groups, emptyText) {
    container.replaceChildren();
    if (groups.length === 0) {
        const p = document.createElement("p");
        p.className = "wordlist-empty";
        p.textContent = emptyText;
        container.appendChild(p);
        return;
    }
    for (const group of groups) {
        const heading = document.createElement("h3");
        heading.textContent = group.heading;
        const list = document.createElement("ul");
        for (const word of group.words) {
            const li = document.createElement("li");
            const sv = document.createElement("strong");
            sv.textContent = word.sv;
            li.append(sv, ` – ${word.en}`);
            list.appendChild(li);
        }
        container.append(heading, list);
    }
}

/** Fills the two word list boxes for the given level. */
export function showLevelWordlists(level, knownBox, newBox) {
    if (!(level in LEVEL_SUBCATEGORIES)) return;
    window.vocabulary.when_ready(() => {
        const known = [];
        for (let earlier = 1; earlier < level; earlier++) {
            known.push(...wordsAddedIn(earlier));
        }
        renderGroups(knownBox, mergeGroups(known), "Nothing yet, this is the first level!");
        renderGroups(newBox, wordsAddedIn(level), "No new words in this level.");
    });
}

// Joins groups with the same heading ("Kläder" from level 1 and 2).
function mergeGroups(groups) {
    const merged = new Map();
    for (const g of groups) {
        merged.set(g.heading, [...(merged.get(g.heading) ?? []), ...g.words]);
    }
    return [...merged].map(([heading, words]) => ({ heading, words }));
}

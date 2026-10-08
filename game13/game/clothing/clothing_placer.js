import { buildVariants, catalogItemFor } from "./garment_variants.js";
import { CLOTHING_CATEGORY, subcategoriesForLevel } from "./categories.js";
import { createHtmlObjects } from "../ui/clothing_ui.js";
import { injectHtmlObjects } from "../ui/wardrobe_ui.js";

/**
 * Loads the clothing for a level from the shared word list and puts it in
 * the wardrobe.
 *
 * An entry ends up in the wardrobe when
 *   1. its Category is "clothing",
 *   2. its Subcategory (body position) is used in this level, and
 *   3. it has masking art in clothing_catalog.js (matched by its English
 *      name), which is rendered in a few colours and patterns.
 * Entries without art yet are skipped, so the old word-list pictures and
 * the new drawings are never mixed.
 * The word list is fetched every time the game starts, so entries added to
 * or removed from it show up or disappear on the next start.
 */
export function loadClothes(level) {
    const subcategories = subcategoriesForLevel(level);

    window.vocabulary.when_ready(async () => {
        const ids = window.vocabulary.get_category(CLOTHING_CATEGORY) ?? [];
        const builds = [];
        const withoutArt = [];

        for (const id of ids) {
            const vocab = window.vocabulary.get_vocab(id);
            if (!vocab) continue;

            const subcategory = vocab.subCat?.trim().toLowerCase();
            if (!subcategory) {
                console.warn(`Clothing entry ${id} (${vocab.sv}) has no Subcategory, so it has no place on Pelle.`);
                continue;
            }
            if (!subcategories.includes(subcategory)) continue;
            if (!catalogItemFor(vocab)) {
                withoutArt.push(vocab.sv);
                continue;
            }

            builds.push(buildVariants(id, vocab, subcategory, level));
        }
        if (withoutArt.length > 0) {
            console.info(`No masking art yet, so not in the wardrobe: ${withoutArt.join(", ")}`);
        }

        const items = (await Promise.all(builds)).flat();

        // Body positions in this level that actually have clothes.
        const activeSubcategories = subcategories.filter((sub) =>
            items.some((item) => item.getCategory() === sub)
        );

        window.clothingGenerator?.setItems(items, activeSubcategories);

        const htmlObjects = createHtmlObjects(items);
        injectHtmlObjects(htmlObjects, activeSubcategories);
    });
}

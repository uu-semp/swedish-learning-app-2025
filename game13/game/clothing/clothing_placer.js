import { subcategoriesForLevel } from "../level_configuration.js";
import { loadWardrobe } from "./wardrobe_builder.js";
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
 *
 * Every round gets new random colours. The word list and the rendered
 * garment pictures are kept in the browser (see wardrobe_builder.js); the
 * menu refreshes the word list every time the game starts, so entries
 * added to or removed from it show up or disappear on the next start.
 */
export async function loadClothes(level) {
    const subcategories = subcategoriesForLevel(level);
    const items = await loadWardrobe(level);

    // Body positions in this level that actually have clothes.
    const activeSubcategories = subcategories.filter((sub) =>
        items.some((item) => item.getCategory() === sub)
    );

    window.clothingGenerator?.setItems(items, activeSubcategories);

    const htmlObjects = createHtmlObjects(items);
    injectHtmlObjects(htmlObjects, activeSubcategories);
}

import { ImgObject } from "./imgObject.js";
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
 *   3. its Image_url points to an image that actually loads.
 * The word list is fetched every time the game starts, so entries added to
 * or removed from it show up or disappear on the next start.
 */
export function loadClothes(level) {
    const subcategories = subcategoriesForLevel(level);

    window.vocabulary.when_ready(async () => {
        const ids = window.vocabulary.get_category(CLOTHING_CATEGORY) ?? [];
        const candidates = [];

        for (const id of ids) {
            const vocab = window.vocabulary.get_vocab(id);
            if (!vocab) continue;

            const subcategory = vocab.subCat?.trim().toLowerCase();
            if (!subcategory) {
                console.warn(`Clothing entry ${id} (${vocab.sv}) has no Subcategory, so it has no place on Pelle.`);
                continue;
            }
            if (!subcategories.includes(subcategory)) continue;
            if (!vocab.img) {
                console.warn(`Clothing entry ${id} (${vocab.sv}) has no Image_url.`);
                continue;
            }

            candidates.push(new ImgObject(
                id,
                resolveImagePath(vocab.img),
                vocab.sv ?? "",
                subcategory,
                vocab.en ?? vocab.sv ?? "",
                vocab.article ?? ""
            ));
        }

        // Keep only the items whose image file exists.
        const loads = await Promise.all(candidates.map((item) => imageLoads(item.getImgPath())));
        const items = candidates.filter((item, i) => {
            if (!loads[i]) console.warn(`Missing image for ${item.getImgId()} (${item.getImgDescription()}): ${item.getImgPath()}`);
            return loads[i];
        });

        // Body positions in this level that actually have clothes.
        const activeSubcategories = subcategories.filter((sub) =>
            items.some((item) => item.getCategory() === sub)
        );

        window.clothingGenerator?.setItems(items, activeSubcategories);

        const htmlObjects = createHtmlObjects(items);
        injectHtmlObjects(htmlObjects, activeSubcategories);
    });
}

/**
 * Image_url in the word list is relative to the repository root
 * (e.g. "assets/images/clothes/cap.png"); this page lives in game13/.
 */
function resolveImagePath(url) {
    const path = url.trim();
    if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith("/") || path.startsWith("data:")) {
        return path;
    }
    return "../" + path;
}

function imageLoads(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
}

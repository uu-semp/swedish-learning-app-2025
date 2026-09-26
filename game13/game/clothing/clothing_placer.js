import { ImgObject } from "./imgObject.js";
import { createHtmlObjects } from "../ui/clothing_ui.js";
import { injectHtmlObjects } from "../ui/wardrobe_ui.js";
/**
 * Coordinates loading and displaying the clothing items used in the game.
 *
 * Loads clothing data from the vocabulary system. The clothing items are grouped by category and represented as
 * ImgObject instances before being passed to the UI components.
 */
export function loadClothes() {
    const CATEGORIES = ["hat", "shirt", "pants"];
    const imgArray = [];

    window.vocabulary.load_game_data(13);

    window.vocabulary.when_ready(() => {
        for (const cat of CATEGORIES) {
            const ids = window.vocabulary.get_category(cat);

            console.log(ids);

            for (const id of ids) {
                const rawGamePath = window.vocabulary.get_game_data(id);
                console.log(rawGamePath);

                const description = window.vocabulary.get_vocab(id) ?? {};
                const path = rawGamePath;

                imgArray.push(
                    new ImgObject(
                        id,
                        path,
                        description.sv ?? "",
                        cat,
                        description.en ?? description.sv ?? ""
                    )
                );
            }
        }

        // Give clothing data to the outfit generator
        if (
            window.clothingGenerator &&
            typeof window.clothingGenerator.setItemsFromImgObjects === "function"
        ) {
            window.clothingGenerator.setItemsFromImgObjects(imgArray);
        }

        // Let UI components handle creating/inserting HTML
        const htmlObjects = createHtmlObjects(imgArray);
        injectHtmlObjects(htmlObjects);
    });
}
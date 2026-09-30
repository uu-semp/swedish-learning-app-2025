/**
 * Inserts clothing images into the clothing menu and sets up their
 * interaction with the corresponding drop zones.
 *
 * Items never leave the menu. Clicking an item puts a copy of it on Pelle
 * and grays out the original in its place, so the list order never changes.
 * Clicking the grayed-out item, or the item on Pelle, takes it off again.
 * Picking an item for an occupied slot swaps out the item already worn.
 */
export function injectHtmlObjects(htmlObjects) {
    const menuRoot = document.getElementById("img-menu");
    if (!menuRoot) {
        console.warn("Could not find #img-menu container");
        return;
    }

    const slots = Array.from(document.querySelectorAll(".dropzone"));
    const menuImgById = new Map();

    function slotFor(img) {
        return slots.find((s) => s.dataset.accept === img.dataset.category);
    }

    // Removes the worn copy from Pelle and un-grays its menu item.
    function takeOff(wornImg) {
        menuImgById.get(wornImg.dataset.id)?.classList.remove("is-worn");
        wornImg.remove();
    }

    // Puts a copy of the menu item on Pelle, replacing anything already
    // in that slot, and grays out the menu item.
    function wear(menuImg) {
        const slot = slotFor(menuImg);
        if (!slot) {
            console.warn(`[move blocked] No dropzone configured for category "${menuImg.dataset.category}".`);
            return;
        }

        if (slot.firstElementChild) {
            takeOff(slot.firstElementChild);
        }

        const wornImg = menuImg.cloneNode();
        wornImg.addEventListener("click", () => takeOff(wornImg));
        slot.appendChild(wornImg);
        menuImg.classList.add("is-worn");
    }

    htmlObjects.forEach((img) => {
        menuImgById.set(img.dataset.id, img);

        img.addEventListener("click", () => {
            if (img.classList.contains("is-worn")) {
                takeOff(slotFor(img).firstElementChild);
            } else {
                wear(img);
            }
        });

        const item = document.createElement("div");
        item.className = "menu-item";
        item.appendChild(img);
        menuRoot.appendChild(item);
    });
}

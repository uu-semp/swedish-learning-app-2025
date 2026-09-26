/**
 * Inserts clothing images into the clothing menu and sets up their
 * interaction with the corresponding drop zones.
 *
 * Clothing items can be moved from the menu to their matching category
 * slot and back to the menu by clicking them.
 */
export function injectHtmlObjects(htmlObjects) {
    const menuRoot = document.getElementById("img-menu");
    if (!menuRoot) {
        console.warn("Could not find #img-menu container");
        return;
    }

    const slots = Array.from(document.querySelectorAll(".dropzone"));

    function wireImage(img) {
        img.addEventListener("click", () => {
            const parent = img.parentElement;
            if (!parent) return;

            if (parent.classList.contains("menu-item")) {
                // Moving from menu -> go to the matching dropzone
                const cat = img.dataset.category || "";
                const target = slots.find(
                    (s) => s.dataset.accept === cat && s.childElementCount === 0
                );

                if (target) {
                    target.appendChild(img);
                    parent.remove();
                } else {
                    const correct = slots.find((s) => s.dataset.accept === cat);
                    if (correct) {
                        correct.classList.add("slot-hint");
                        setTimeout(() => correct.classList.remove("slot-hint"), 400);
                    }
                    console.warn(`[move blocked] Category "${cat}" must go to the "${cat}" slot.`);
                }
            } else if (parent.classList.contains("dropzone")) {
                // Moving from dropzone -> back to menu
                const item = document.createElement("div");
                item.className = "menu-item";
                item.appendChild(img);
                menuRoot.appendChild(item);
            }
        });
    }

    htmlObjects.forEach((img) => {
        wireImage(img);
        const item = document.createElement("div");
        item.className = "menu-item";
        item.appendChild(img);
        menuRoot.appendChild(item);
    });
}
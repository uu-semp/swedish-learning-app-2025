/**
 * Inserts clothing images into the clothing menu and sets up their
 * interaction with the corresponding drop zones.
 *
 * Items never leave the menu. Clicking an item, or dragging it onto Pelle,
 * puts a copy of it on him and grays out the original in its place, so the
 * list order never changes. Clicking the grayed-out item, or the item on
 * Pelle, takes it off again. Picking an item for an occupied slot swaps out
 * the item already worn. The undo button (#undo-btn) steps back through
 * these changes one at a time, and the remove-all button (#clear-btn)
 * takes everything off Pelle in one (undoable) step.
 */
export function injectHtmlObjects(htmlObjects) {
    const menuRoot = document.getElementById("img-menu");
    if (!menuRoot) {
        console.warn("Could not find #img-menu container");
        return;
    }

    const slots = Array.from(document.querySelectorAll(".dropzone"));
    const pelle = document.querySelector(".cat-image");
    const menuImgById = new Map();
    const undoBtn = document.getElementById("undo-btn");
    const clearBtn = document.getElementById("clear-btn");
    const history = []; // earlier outfits, newest last

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
        wornImg.addEventListener("click", () => playerTakeOff(wornImg));
        slot.appendChild(wornImg);
        menuImg.classList.add("is-worn");
    }

    // The current outfit as { category: id of worn item, or null }.
    function snapshot() {
        return Object.fromEntries(
            slots.map((s) => [s.dataset.accept, s.firstElementChild?.dataset.id ?? null])
        );
    }

    // Dresses Pelle exactly as in an earlier snapshot.
    function restore(outfit) {
        removeAll();
        Object.values(outfit).forEach((id) => {
            if (id !== null) wear(menuImgById.get(id));
        });
    }

    // Runs a player action and remembers the outfit before it, so it can be undone.
    function recordable(action) {
        return (...args) => {
            const before = snapshot();
            action(...args);
            if (JSON.stringify(before) !== JSON.stringify(snapshot())) {
                history.push(before);
                updateButtons();
            }
        };
    }

    // Undo is only available with something to undo, remove-all only
    // while Pelle is wearing something.
    function updateButtons() {
        if (undoBtn) undoBtn.disabled = history.length === 0;
        if (clearBtn) clearBtn.disabled = slots.every((s) => !s.firstElementChild);
    }

    function undo() {
        if (history.length === 0) return;
        restore(history.pop());
        updateButtons();
    }

    // Takes off everything Pelle is wearing.
    function removeAll() {
        slots.forEach((s) => {
            if (s.firstElementChild) takeOff(s.firstElementChild);
        });
    }
    window.clearWardrobe = () => {
    removeAll();
    updateButtons();
    };

    const playerWear = recordable(wear);
    const playerTakeOff = recordable(takeOff);
    const playerRemoveAll = recordable(removeAll);

    undoBtn?.addEventListener("click", undo);
    clearBtn?.addEventListener("click", playerRemoveAll);
    updateButtons();

    htmlObjects.forEach((img) => {
        menuImgById.set(img.dataset.id, img);

        // Registered before the click handler so it can swallow the click
        // that browsers fire at the end of a drag.
        if (pelle) {
            makeDraggable(img, pelle, () => playerWear(img));
        }

        img.addEventListener("click", () => {
            if (img.classList.contains("is-worn")) {
                playerTakeOff(slotFor(img).firstElementChild);
            } else {
                playerWear(img);
            }
        });

        const item = document.createElement("div");
        item.className = "menu-item";
        item.appendChild(img);
        menuRoot.appendChild(item);
    });
}


// How far (in px) the pointer must move before a press counts as a drag
// rather than a click.
const DRAG_THRESHOLD = 6;

/**
 * Lets a menu image be dragged onto a drop target with mouse, touch or pen.
 *
 * A floating copy follows the pointer. While it is over the target, the
 * target's parent gets the "drop-target" class (used for the highlight).
 * Releasing over the target calls onDrop; releasing anywhere else cancels.
 * Grayed-out (worn) items cannot be dragged.
 *
 * On touchscreens, vertical swipes still scroll the wardrobe (CSS
 * touch-action: pan-y on .thumb); a sideways pull starts the drag.
 */
function makeDraggable(img, dropTarget, onDrop) {
    const highlightArea = dropTarget.parentElement;
    let press = null;   // where the press started, while the button is down
    let ghost = null;   // floating copy, only while actually dragging
    let justDragged = false;

    img.draggable = false; // stop the browser's own image dragging

    function isOverTarget(e) {
        const r = dropTarget.getBoundingClientRect();
        return e.clientX >= r.left && e.clientX <= r.right &&
               e.clientY >= r.top && e.clientY <= r.bottom;
    }

    function endDrag() {
        ghost?.remove();
        ghost = null;
        press = null;
        highlightArea.classList.remove("drop-target");
    }

    img.addEventListener("pointerdown", (e) => {
        if (img.classList.contains("is-worn") || e.button !== 0) return;
        const r = img.getBoundingClientRect();
        press = {
            x: e.clientX,
            y: e.clientY,
            offsetX: e.clientX - r.left,
            offsetY: e.clientY - r.top,
            width: r.width
        };
        img.setPointerCapture(e.pointerId);
    });

    img.addEventListener("pointermove", (e) => {
        if (!press) return;

        if (!ghost) {
            const moved = Math.hypot(e.clientX - press.x, e.clientY - press.y);
            if (moved < DRAG_THRESHOLD) return;
            ghost = img.cloneNode();
            ghost.classList.add("drag-ghost");
            ghost.style.width = `${press.width}px`;
            document.body.appendChild(ghost);
        }

        ghost.style.left = `${e.clientX - press.offsetX}px`;
        ghost.style.top = `${e.clientY - press.offsetY}px`;
        highlightArea.classList.toggle("drop-target", isOverTarget(e));
    });

    img.addEventListener("pointerup", (e) => {
        if (ghost) {
            if (isOverTarget(e)) onDrop();
            justDragged = true;
            setTimeout(() => { justDragged = false; }, 0);
        }
        endDrag();
    });

    // The browser took over (e.g. started scrolling): cancel quietly.
    img.addEventListener("pointercancel", endDrag);

    img.addEventListener("click", (e) => {
        if (justDragged) {
            justDragged = false;
            e.stopImmediatePropagation();
        }
    });
}

// ==============================================
// Owned by Team 14
// ==============================================

"use strict";

// ==============================================
//

class ImgObject {
    #imgId;
    #imgPath;
    #imgDescription;
    #category;

    constructor(imgId, imgPath, imgDescription, category) {
        this.#imgId = imgId;
        this.#imgPath = imgPath;
        this.#imgDescription = imgDescription;
        this.#category = category;
    }

    getImgId() { 
        return this.#imgId; 
    }
    
    getImgPath() { 
        return this.#imgPath; 
    }
    
    getImgDescription() { 
        return this.#imgDescription;
    }
    
    getCategory() { 
        return this.#category; 
    }
}

// From ChatGPT when asked how to run a function when the file is loaded.
window.addEventListener("DOMContentLoaded", () => {
    if (window.vocabulary && typeof window.vocabulary.load_team_data === "function") {
        loadClothes();
    } else {
        console.log("API Unavailable")
    }
});

function loadClothes() {
    const CATEGORIES = ["hat", "shirt", "pants"];
    const imgArray = [];

    window.vocabulary.load_team_data(14);

    window.vocabulary.when_ready(() => {
        for (const cat of CATEGORIES) {
            const ids = window.vocabulary.get_category(cat);
            console.log(ids)
            for (const id of ids) {

                const rawTeamPath = window.vocabulary.get_team_data(id);
                console.log(rawTeamPath);
                const description = window.vocabulary.get_vocab(id);
                const path = ".." + rawTeamPath;

                imgArray.push(
                    new ImgObject(id, path, description.sv, cat)
                );
            }
        }
        const htmlObjects = createHtmlObjects(imgArray);
        injectHtmlObjects(htmlObjects);
    });
}
c
// Creates a list of html img objects from array of ImgObjects
function createHtmlObjects(imgArray) {
    const htmlObjects = [];

    const createHtmlImgObject = (imgObject) => {
        const path = imgObject.getImgPath();
        const id = imgObject.getImgId();
        const cat = imgObject.getCategory();

        const htmlImgObject = document.createElement("img");
        htmlImgObject.dataset.category = cat;
        htmlImgObject.src = path;
        htmlImgObject.alt = id;
        htmlImgObject.width = 100;
        htmlImgObject.height = 100;
        htmlImgObject.className = "thumb";
        
        return htmlImgObject;
    };

    for (let i = 0; i < imgArray.length; i++) {
        htmlObjects.push(createHtmlImgObject(imgArray[i]));
    }

    return htmlObjects;
}

// Injects html objects into the scrollable right-hand menu and wires click behavior
// From ChatGPT when asking how to make it so that when an image is pressed, it goes into the correct box for its category.
function injectHtmlObjects(htmlObjects) {
    const menuRoot = document.getElementById("img-menu");
    if (!menuRoot) {
        console.warn("Could not find #img-menu container");
        return;
    }

    const slots = Array.from(document.querySelectorAll(".slot"));

    // If HTML wasn't updated, set sensible defaults in JS
    const defaultAccept = ["hat", "shirt", "pants"];
    slots.forEach((s, i) => {
        if (!s.dataset.accept) s.dataset.accept = defaultAccept[i] || "";
    });

    function wireImage(img) {
        img.addEventListener("click", () => {
            const parent = img.parentElement;
            if (!parent) return;

            if (parent.classList.contains("menu-item")) {
                // Moving from menu -> must go to the slot that accepts this category
                const cat = img.dataset.category || "";
                const target = slots.find(
                    (s) => s.dataset.accept === cat && s.childElementCount === 0
                );

                if (target) {
                    target.appendChild(img);
                    parent.remove(); // remove empty menu-item to avoid gap
                } else {
                    // No empty matching slot (either wrong category or already filled)
                    // Optional: quick visual hint on the correct slot
                    const correct = slots.find((s) => s.dataset.accept === cat);
                    if (correct) {
                        correct.classList.add("slot-hint");
                        setTimeout(() => correct.classList.remove("slot-hint"), 400);
                    }
                    // Or just log:
                    console.warn(`[move blocked] Category "${cat}" must go to the "${cat}" slot.`);
                }
            } else if (parent.classList.contains("slot")) {
                // Moving from slot -> back to menu
                const item = document.createElement("div");
                item.className = "menu-item";
                item.appendChild(img);
                menuRoot.appendChild(item);
            }
        });
    }

    // Build menu
    htmlObjects.forEach((img) => {
        wireImage(img);
        const item = document.createElement("div");
        item.className = "menu-item";
        item.appendChild(img);
        menuRoot.appendChild(item);
    });
}



// fetch description and 'right' clothes to apply
function fetchDescription() {
}

// apply clothes function
function applyClothes(id) {
  // fetch clothes from vocabulary and apply to the character
  //  document.getElementById(id).src
}

// Check clothes function
function checkClothes() {
  // fetch applied clothes and check if user applied the correct clothes
  // just check if 2 sets of clothes id are the same

  // fetch applied clothes ids 
  
  // fetch correct clothes ids from description

  // compare the 2 sets of clothes ids

  // if correct, update score
  // if wrong, give feedback



  // can also update the progress ?
}

// undress area on pelle (and the cloth is going back to the pool)
function undress(id) {
  document.getElementById(id).style.display = "none";
}

/*

Questions for Jacob:
- Descriptions list (json or text or csv)
-> understand the data format for descriptions and actual clothes applied to pelle 

Questions for everyone:
- Who is doing the descriptions database?
  Data format example:
    | -------- | ---------------- | ---------------- |
    | descr_ID | description_text | correct_clothes  | -> should be a list of clothes IDs and be linked to actual images
    | -------- | ---------------- | ---------------- |

  Alternative: 
  just have a images linked to id database and generate a random description and correct clothes algorithmically

  X thsirt and Y trousers 



*/

// ==============================================
// Owned by Team 14
// ==============================================

"use strict";

// ==============================================

// Helper function to get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}


// Swedish clothing generator - creates random outfit descriptions and checks player answers
  // Usage: clothingGenerator.generateOutfit() returns {swedish: "text", correctAnswer: {files}}
class SwedishClothingDescriptionGenerator {
  constructor() {
    this.hats = [];
    this.shirts = [];
    this.pants = [];
    this.extraCategories = {};
    this.requiredCategories = ["hat", "shirt", "pants"];
    this.descriptionPrefixes = [
      "Idag tar Pelle på sig",
      "Kläderna Pelle har valt idag är",
      "Pelle bestämde sig för att bära",
      "Den här dagen klär sig Pelle i",
      "Pelle valde följande kläder idag"
    ];
    this.isLoaded = false;
    this.loadPromise = this.loadFromCSV();
  }

  async loadFromCSV() {
    try {
  const response = await fetch("./clothing_database.csv");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const csvText = await response.text();
      const lines = csvText.split("\n");

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(",").map(part => part.trim());
        if (parts.length < 4) continue;

        const item = {
          file: parts[0],
          swedish: parts[1],
          english: parts[2],
          category: parts[3]
        };

        if (item.category === "hat") {
          this.hats.push(item);
        } else if (item.category === "shirt") {
          this.shirts.push(item);
        } else if (item.category === "pants") {
          this.pants.push(item);
        } else {
          if (!this.extraCategories[item.category]) {
            this.extraCategories[item.category] = [];
          }
          this.extraCategories[item.category].push(item);
        }
      }

      this.isLoaded = true;
      console.log("Clothing database loaded", {
        hats: this.hats.length,
        shirts: this.shirts.length,
        pants: this.pants.length
      });
    } catch (error) {
      console.error("Failed to load clothing_database.csv", error);
    }
  }

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

// From ChatGPT when I asked how to run a function at the time the file is loaded
// Runs the loadClothes function when the javascript file is loaded
window.addEventListener("DOMContentLoaded", () => {
    if (window.vocabulary && typeof window.vocabulary.load_team_data === "function") {
        loadClothes();
    } else {
        console.log("API Unavailable")
    }
});

// Loads the clothing items from the dataset into html components and inserts them into the correct spot on the html page
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

// Creates a list of html img components from an array of ImgObject:s. The following fields are especially important:
// 1. category defines where the object can be placed on Pelle (hat on his head, pants on his legs etc.)
// 2. id (the img id in the database) can be retrieved from an img object by calling:
// document.getElementById(id_of_parent_component).children[0].children[0].dataset.id (can be used to check whether correct clothing item is placed or not)
// The above line has not been tested, only given as an example from memory. Might need some fixing.
function createHtmlObjects(imgArray) {
    const htmlObjects = [];

    const createHtmlImgObject = (imgObject) => {
        const path = imgObject.getImgPath();
        const id = imgObject.getImgId();
        const cat = imgObject.getCategory();
        const description = imgObject.getImgDescription();

        const htmlImgObject = document.createElement("img");

        // add more properties, like styling, if needed
        htmlImgObject.dataset.category = cat;
        htmlImgObject.dataset.id = id;
        htmlImgObject.src = path;
        htmlImgObject.alt = description;
        htmlImgObject.width = 100;
        htmlImgObject.height = 100;
        htmlImgObject.className = "thumb"; // TODO: subject to change if you need a class for the img:s. Feel free to change the img size as well.
        
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
    const menuRoot = document.getElementById("img-menu"); // TODO: Change "img-menu" to the id of the box where the clothing menu should be placed.
    if (!menuRoot) {
        console.warn("Could not find #img-menu container");
        return;
    }

    const slots = Array.from(document.querySelectorAll(".slot"));
    /* TODO: Gets the boxes where clothing items will be placed when clicked on in the menu.
             Change "slot" to the class name that the boxes on Pelle has. Example: Pelle's boxes has class name "clothing-box", so ".slot" should be replaced by ".clothing-box". */

    function wireImage(img) {
        // Adds an event listener to each img so that it moves when clicked on
        img.addEventListener("click", () => {
            const parent = img.parentElement;
            if (!parent) return;

  // Generate outfit for game
  generateOutfit() {
    if (!this.isLoaded) {
      console.warn("Clothing data not ready yet. Call generateOutfit after loadPromise resolves.");
      return null;
    }
            if (parent.classList.contains("menu-item")) { // Checks where the img is currently located in order to know where to move
                // Moving from menu -> must go to the slot that accepts this category
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
            } else if (parent.classList.contains("slot")) { // Checks where the img is currently located in order to know where to move. TODO: Change "slot" to whatever class name the boxes on Pelle has, like done above.
                // Moving from slot -> back to menu
                const item = document.createElement("div");
                item.className = "menu-item";
                item.appendChild(img);
                menuRoot.appendChild(item);
            }
        });
    }

    // Creates containers for each img before adding them to the scrollable menu.
    htmlObjects.forEach((img) => {
        wireImage(img);
        const item = document.createElement("div");
        item.className = "menu-item";
        item.appendChild(img);
        menuRoot.appendChild(item);
    });
}

    const categoryPools = {
      hat: this.hats,
      shirt: this.shirts,
      pants: this.pants,
      ...this.extraCategories
    };

    const selectedItems = {};
    const missingCategory = this.requiredCategories.find(category => {
      const pool = categoryPools[category] ?? [];
      if (!Array.isArray(pool) || pool.length === 0) {
        console.error(`Missing clothing data for category: ${category}`);
        return true;
      }

      selectedItems[category] = getRandomItem(pool);
      return false;
    });

    if (missingCategory) {
      return null;
    }

    const prefix = getRandomItem(this.descriptionPrefixes);
    const swedishList = this.requiredCategories.map(category => selectedItems[category].swedish);
    const englishList = this.requiredCategories.map(category => selectedItems[category].english);

    const swedishText = `${prefix} ${swedishList.join(', ')}.`;
    const englishText = `Today Pelle is wearing ${englishList.join(', ')}.`;

    const assetFiles = this.requiredCategories.map(category => selectedItems[category].file);
    const byCategory = this.requiredCategories.reduce((acc, category) => {
      acc[category] = selectedItems[category].file;
      return acc;
    }, {});

    const items = this.requiredCategories.reduce((acc, category) => {
      acc[category] = selectedItems[category];
      return acc;
    }, {});

    const correctAnswer = {
      filenames: assetFiles,
      byCategory
    };

    if (byCategory.hat) correctAnswer.hatFile = byCategory.hat;
    if (byCategory.shirt) correctAnswer.shirtFile = byCategory.shirt;
    if (byCategory.pants) correctAnswer.pantsFile = byCategory.pants;

    return {
      swedish: swedishText,
      english: englishText,
      assets: assetFiles,
      correctAnswer,
      items
    };
  }
}

// Description generator class global instance
window.clothingGenerator = new SwedishClothingDescriptionGenerator(); 

// fetch description and 'right' clothes to apply
function fetchDescription() {

}

// Check clothes function
function checkClothes(correctClothesIds, appliedClothesIds) {
  // Simple comparison of two arrays of clothes IDs
  if (!Array.isArray(correctClothesIds) || !Array.isArray(appliedClothesIds)) {
    return false;
  }

  // Sort both arrays to ignore order
  const sortedCorrect = [...correctClothesIds].sort();
  const sortedApplied = [...appliedClothesIds].sort();

  // Example: sort(['RödMössa.png', 'BlåaJeans.png', 'GråOchBeigeTröja.png']) 
  // becomes ['BlåaJeans.png', 'GråOchBeigeTröja.png', 'RödMössa.png']
  // in this way we can compare arrays without caring the area of the body

  // Check if arrays match
  const isCorrect = sortedCorrect.length === sortedApplied.length && 
                   sortedCorrect.every((id, index) => id === sortedApplied[index]);

  return isCorrect;
  // can also update the progress ?
}

/*
  Alternative: 
  just have a images linked to id database and generate a random description and correct clothes algorithmically

  X thsirt and Y trousers 

*/

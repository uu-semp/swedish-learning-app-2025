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
    this.loadPromise = new Promise((resolve) => {
      this.#resolveLoad = resolve;
    });
  }

  #resolveLoad = null;

  normalizeRequiredCategory(category) {
    if (!category) return null;
    const value = category.trim().toLowerCase();
    if (this.requiredCategories.includes(value)) {
      return value;
    }

    switch (value) {
      case "head":
      case "hat":
      case "hats":
        return "hat";
      case "torso":
      case "upper":
      case "shirt":
      case "shirts":
        return "shirt";
      case "legs":
      case "lower":
      case "pant":
      case "pants":
        return "pants";
      default:
        return null;
    }
  }

  markLoaded() {
    if (!this.isLoaded) {
      this.isLoaded = true;
      if (typeof this.#resolveLoad === "function") {
        this.#resolveLoad();
        this.#resolveLoad = null;
      }
    }
  }

  resetCollections() {
    this.hats = [];
    this.shirts = [];
    this.pants = [];
    this.extraCategories = {};
    this.isLoaded = false;
  }

  addItem(item) {
    if (!item || !item.category) {
      return;
    }

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

  setItemsFromImgObjects(imgObjects = []) {
    this.resetCollections();

    imgObjects.forEach((imgObject) => {
      if (!imgObject) return;
      const category = this.normalizeRequiredCategory(imgObject.getCategory()) ?? imgObject.getCategory();
      const swedish = imgObject.getImgDescription();
      const english = typeof imgObject.getEnglishDescription === "function"
        ? (imgObject.getEnglishDescription() ?? swedish)
        : swedish;

      const item = {
        file: imgObject.getImgPath(),
        swedish,
        english,
        category,
        imgId: imgObject.getImgId()
      };

      if (!category) {
        console.warn("Uncategorized clothing item", item);
        return;
      }

      this.addItem(item);
    });

    this.markLoaded();

    console.log("Clothing items loaded from ImgObjects", {
      hats: this.hats.length,
      shirts: this.shirts.length,
      pants: this.pants.length
    });
  }
  // Generate outfit for game
  generateOutfit() {
    if (!this.isLoaded) {
      console.warn("Clothing data not ready yet. Call generateOutfit after loadPromise resolves.");
      return null;
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
    const gen = window.clothingGenerator;
    if (!gen) return;

    gen.loadPromise.then(() => {
        const outfit = gen.generateOutfit();
        if (!outfit) return; // safety

        const el = document.getElementById("instruction-text");
        if (el) el.textContent = outfit.swedish;

        window.currentOutfit = outfit;
        console.log("Current outfit")
        console.log(outfit.items);
    });
}

// Check clothes function
function checkClothes() {
    
    const outfit = window.currentOutfit;
    
    const correctHat = outfit.items.hat.imgId;
    const correctShirt = outfit.items.shirt.imgId;
    const correctPants = outfit.items.pants.imgId;
    
    const appliedHat = document.getElementById("hat-box").children[0].dataset.id;
    const appliedShirt = document.getElementById("shirt-box").children[0].dataset.id;
    const appliedPants = document.getElementById("pants-box").children[0].dataset.id;
    
    if (correctHat === appliedHat && correctShirt === appliedShirt && correctPants === appliedPants) {
        console.log("Correct!");
    } else {
        console.log("Incorrect!")
    }
}

class ImgObject {
  #imgId;
  #imgPath;
  #imgDescription;
  #imgEnglishDescription;
  #category;

  constructor(imgId, imgPath, imgDescription, category, imgEnglishDescription = null) {
    this.#imgId = imgId;
    this.#imgPath = imgPath;
    this.#imgDescription = imgDescription;
    this.#category = category;
    this.#imgEnglishDescription = imgEnglishDescription;
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

  getEnglishDescription() {
    return this.#imgEnglishDescription;
  }

    getCategory() {
        return this.#category;
    }
}

// From ChatGPT when I asked how to run a function at the time the file is loaded
// Runs the loadClothes function when the javascript file is loaded
window.addEventListener("DOMContentLoaded", () => {
    if (window.vocabulary && typeof window.vocabulary.load_team_data === "function") {
        fetchDescription();
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
                const description = window.vocabulary.get_vocab(id) ?? {};
                const path = ".." + rawTeamPath;

                imgArray.push(new ImgObject(id, path, description.sv ?? "", cat,description.en ?? description.sv ?? ""));
            }
        }

        if (window.clothingGenerator && typeof window.clothingGenerator.setItemsFromImgObjects === "function") {
          window.clothingGenerator.setItemsFromImgObjects(imgArray);
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
            checkClothes();
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


/*
  Alternative: 
  just have a images linked to id database and generate a random description and correct clothes algorithmically

  X thsirt and Y trousers 

*/

//import { ImgObject } from "./clothing/ImgObject.js";
// Helper function to get random item from array
export function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Swedish clothing generator - creates random outfit descriptions and checks player answers
//To large function, we should modularise and break it into more functions
export class SwedishClothingDescriptionGenerator {
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
// Helper function to get random item from array
export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Creates random outfit descriptions from the clothing that was loaded
 * from the word list.
 *
 * The outfit has one item for every body position (subcategory) in the
 * current level, in the level's order.
 */
export class SwedishClothingDescriptionGenerator {
  #resolveLoad = null;

  constructor() {
    this.itemsBySubcategory = {};
    this.subcategories = [];
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

  /**
   * @param {ImgObject[]} imgObjects  clothing available in this level
   * @param {string[]} subcategories  body positions to dress, in order
   */
  setItems(imgObjects, subcategories) {
    this.subcategories = [...subcategories];
    this.itemsBySubcategory = {};

    for (const imgObject of imgObjects) {
      const subcategory = imgObject.getCategory();
      const article = imgObject.getArticle?.() ?? "";
      const swedish = imgObject.getImgDescription();
      const item = {
        file: imgObject.getImgPath(),
        swedish,
        // "en mössa", "ett bälte"; plural-only words like "jeans" have no article
        swedishWithArticle: article ? `${article} ${swedish}` : swedish,
        english: imgObject.getEnglishDescription() ?? swedish,
        category: subcategory,
        imgId: imgObject.getImgId()
      };
      (this.itemsBySubcategory[subcategory] ??= []).push(item);
    }

    this.isLoaded = true;
    this.#resolveLoad?.();
    this.#resolveLoad = null;

    console.log("Clothing items loaded from the word list",
      Object.fromEntries(this.subcategories.map((s) => [s, this.itemsBySubcategory[s]?.length ?? 0])));
  }

  // Generate outfit for game
  generateOutfit() {
    if (!this.isLoaded) {
      console.warn("Clothing data not ready yet. Call generateOutfit after loadPromise resolves.");
      return null;
    }
    if (this.subcategories.length === 0) {
      console.error("No clothing available for this level.");
      return null;
    }

    const items = {};
    for (const subcategory of this.subcategories) {
      items[subcategory] = getRandomItem(this.itemsBySubcategory[subcategory]);
    }

    const chosen = this.subcategories.map((s) => items[s]);
    const prefix = getRandomItem(this.descriptionPrefixes);
    const swedishText = `${prefix} ${joinList(chosen.map((i) => i.swedishWithArticle), "och")}.`;
    const englishText = `Today Pelle is wearing ${joinList(chosen.map((i) => i.english), "and")}.`;

    const byCategory = Object.fromEntries(chosen.map((i) => [i.category, i.file]));

    return {
      swedish: swedishText,
      english: englishText,
      assets: chosen.map((i) => i.file),
      correctAnswer: { filenames: chosen.map((i) => i.file), byCategory },
      items
    };
  }
}

// ["a", "b", "c"] -> "a, b och c"
function joinList(words, and) {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} ${and} ${words[words.length - 1]}`;
}

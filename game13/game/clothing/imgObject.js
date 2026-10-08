/**
 * Represents a clothing item used in the game.
 *
 * Stores the item's vocabulary ID, image path, Swedish and English
 * descriptions, and clothing category.
 */
export class ImgObject {
  #imgId;
  #imgPath;
  #imgDescription;
  #imgEnglishDescription;
  #category;
  #article;
  #thumbPath;
  #layer;

  // category is the item's body position (the word list's Subcategory).
  // thumbPath: cropped picture for the wardrobe shelf (defaults to imgPath).
  // layer: drawing order on Pelle for masked garments (see clothing_catalog.js).
  constructor(imgId, imgPath, imgDescription, category, imgEnglishDescription = null, article = "", thumbPath = null, layer = null) {
    this.#imgId = imgId;
    this.#imgPath = imgPath;
    this.#imgDescription = imgDescription;
    this.#category = category;
    this.#imgEnglishDescription = imgEnglishDescription;
    this.#article = article;
    this.#thumbPath = thumbPath;
    this.#layer = layer;
  }

  getArticle() {
    return this.#article;
  }

  getThumbPath() {
    return this.#thumbPath ?? this.#imgPath;
  }

  getLayer() {
    return this.#layer;
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
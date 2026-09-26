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
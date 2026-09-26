/**
 * Handles the creation and interaction of clothing items in the game UI.
 *
 * Creates HTML elements from ImgObjects, inserts them into the clothing
 * menu, and handles moving clothing items between the menu and their
 * corresponding drop zones.
 */

// Creates a list of html img components from an array of ImgObject:s. The following fields are especially important:
// 1. category defines where the object can be placed on Pelle (hat on his head, pants on his legs etc.)
// 2. id (the img id in the database) can be retrieved from an img object by calling:
// document.getElementById(id_of_parent_component).children[0].children[0].dataset.id (can be used to check whether correct clothing item is placed or not)
// The above line has not been tested, only given as an example from memory. Might need some fixing.
export function createHtmlObjects(imgArray) {
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
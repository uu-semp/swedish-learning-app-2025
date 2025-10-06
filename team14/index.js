// ==============================================
// Owned by Team 14
// ==============================================

"use strict";

// ==============================================
//

const imgIds = [
  "14img001",
  "14img002",
  "14img003",
  "14img004",
  "14img005",
  "14img006",
  "14img007",
  "14img008",
  "14img009",
  "14img010",
  "14img011",
  "14img012",
  "14img013",
  "14img014",
  "14img015",
  "14img016",
  "14img017",
  "14img018",
  "14img019"
];

class ImgObject {

  #imgId;
  #imgPath;
  #imgDescription;

  constructor(imgId, imgPath, imgDescription) {
    this.#imgId = imgId;
    this.#imgPath = imgPath;
    this.#imgDescription = imgDescription;
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

}

// Loads the clothes of that are going to be used in this current round
// Tested and works as intended (imgArray is filled with the data for all images we have made this far)
function loadClothes() {

    let imgArray = [];

    window.vocabulary.load_team_data(14);

    window.vocabulary.when_ready(() => {

        for (let i = 0; i < imgIds.length; i++) {

            const currentImgPath = window.vocabulary.get_team_data(imgIds[i]);
            const currentImgDescription = window.vocabulary.get_vocab(imgIds[i]);
            let newImgObject = new ImgObject(imgIds[i], currentImgPath, currentImgDescription.sv);

            imgArray.push(newImgObject);

        }

    });

    let htmlObjects = createHtmlObjects(imgArray);

    injectHtmlObjects(htmlObjects);
}

// Creates a list of html img objects from array of ImgObjects
function createHtmlObjects(imgArray) {

    let htmlObjects = [];

    const createHtmlImgObject = (imgObject) => {
        let path = imgObject.getImgPath();
        let description = imgObject.getImgDescription();

        const htmlImgObject = document.createElement("img");

        // Set attributes
        htmlImgObject.src = path;
        htmlImgObject.alt = description;
        htmlImgObject.width = 100; // TODO: Update to intended size
        htmlImgObject.height = 100; // TODO: Update to intended size

        return htmlImgObject;
    }

    for (let i = 0; i < imgArray.length; i++) {
        htmlObjects.push(createHtmlImgObject(imgArray[i]));
    }

    return htmlObjects;

}

// Injects html objects into the spot where they are intended to be
// TODO: 1. Add styling to the div objects and make it a set size which is scrollable.
// TODO: 2. Make images clickable so they can switch place.
function injectHtmlObjects(htmlObjects) {
    const htmlImgMenu = document.createElement("div");

    for (let i = 0; i < htmlObjects.length; i++) {
        const htmlImgContainer = document.createElement("div");
        htmlImgContainer.appendChild(htmlObjects[i]);
        htmlImgMenu.appendChild(htmlImgContainer);
    }

    // TODO: Find where on the page to insert the htmlImgMenu
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

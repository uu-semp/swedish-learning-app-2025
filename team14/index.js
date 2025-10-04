// ==============================================
// Owned by Team 14
// ==============================================

"use strict";

$(function() {window.vocabulary.when_ready(function () {

  // These are only dummy functions and can be removed.
  $("#check-jquery").on("click", () => {
    alert("JavaScript and jQuery are working.");
  });

  $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

  $("#check-saving").on("click", () => {
    var data = window.save.get("team14");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team14", data);
  });

})});


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

class imgObject {

  #imgId;
  #imgPath;
  #category;

  constructor(imgId, imgPath, category) {
    this.#imgId = imgId;
    this.#imgPath = imgPath;
    this.#category = category;
  }

  getImdId() {
    return this.#imgId;
  }

  getImgPath() {
    return this.#imgPath;
  }

  getCategory() {
    return this.#category;
  }

}

// Loads the clothes of that are going to be used in this current round
function loadClothes() {

  const fetchImgArray = () => {
    let imgArray = imgObject[imgIds.length];
    for (let i = 0; i < imgIds.length; i++) {

    }
  }

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
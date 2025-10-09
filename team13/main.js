// ==============================================
// Owned by Team 13
// ==============================================


"use strict";

function irandom_range(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const gameStates = {
  menu: 0,
  inGame: 1,
};

let state = gameStates.inGame;

let correctHouseNumber_swe = "noll";
let houseArray = [];
let correctHouse = null;
let houseCount = 4
let currentSwedishText = [];
let currentEnglishText = [];
let currentPrompt = [];
let translatedIndexes = [];
let currentStreet = "Errorvägen"


$(function () {
  window.vocabulary.when_ready(function () {
    const gameStateInfo = runGameStateLogic()
    const houseInfo = gameStateInfo.houseInfo;
    currentSwedishText = gameStateInfo.swedishTextArray;
    currentEnglishText = gameStateInfo.englishTextArray;

    houseArray = houseInfo.houseArray;
    correctHouse = houseInfo.correctHouse;

    console.log("Generated houses:", houseArray);
    console.log("correct house index:", correctHouse);

    $("#check-jquery").on("click", () => {
      alert("JavaScript and jQuery are working.");
    });

    $("#check-saving").on("click", () => {
      var data = window.save.get("team13");
      data.counter = data.counter ?? 0;
      data.counter += 1;
      $("#check-saving").text(`This button has been pressed ${data.counter} times`);
      window.save.set("team13", data);
    });
  });
});



//Generates all random values used for that screen.
function generateRandom() {
  const numbers = window.vocabulary.get_category("number");
  //vocabulary is NOT guaranteed to be in order. dont assume randomNo == literal
  const randomNo = irandom_range(1, numbers.length - 1);

  const vocab = window.vocabulary.get_vocab(numbers[randomNo]);
  console.log("generateRandom:", vocab.literal);

  $("#number-english").text((vocab.en));
  $("#number-swedish").text((vocab.sv));
  $("#number-literal").text((vocab.literal));
  correctHouseNumber_swe = vocab.sv
  const result = generateRandomHouses(vocab.literal, houseCount, numbers.length - 1);

  houseArray = result.houseArray;
  correctHouse = result.correctHouse;

  currentStreet = getStreet();

  updateHouseButtons();
  renderHouseButtons();
  renderPrompt();

  return result;
}

//gameState

function runGameStateLogic() {
  const numbers = window.vocabulary.get_category("number");
  $("#gamestate").text(window.vocabulary.get_vocab(numbers[state]).en);

  switch (state) {
    case gameStates.menu:
      return menu_logic();
    case gameStates.inGame:
      return inGame_logic();
  }
}

function nextGameState() {
  const totalStates = Object.keys(gameStates).length;
  state = (state + 1) % totalStates;
  console.log("New state:", state);
  runGameStateLogic();
}

function menu_logic() {
  console.log("menu_logic");
  return {houseInfo: generateRandom()}
}

function inGame_logic() {
  var swedishTextArray = ["Jag", "bor", "på", "-street", "-int"]
  const prompt = []
  for (var i = 0; i < swedishTextArray.length; i++){
    prompt[i] = swedishTextArray[i]
  }
  currentPrompt = prompt;
  console.log("inGame_logic");
  return { 
    houseInfo : generateRandom(),
    swedishTextArray: swedishTextArray, 
    englishTextArray : ["I", "live", "on", "-street", "-int"],
  }
}

function getKeyName(states, index) {
  return Object.keys(states).find((key) => states[key] === index);
}






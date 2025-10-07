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

let houseArray = [];
let correctHouse = null;
let houseCount = 4
let currentSwedishText = [];
let currentEnglishText = [];
let currentPrompt = [];
let translatedIndexes = [];


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

function menu_logic() {
  console.log("menu_logic");
  return {houseInfo: generateRandom()}
}


function inGame_logic() {
  var swedishTextArray = ["Jag", "bor", "på", "exempelgatan", "int"]
  const prompt = []
  for (var i = 0; i < swedishTextArray.length; i++){
    prompt[i] = swedishTextArray[i]
  }
  currentPrompt = prompt;
  console.log("inGame_logic");
  return { 
    houseInfo : generateRandom(),
    swedishTextArray: swedishTextArray, 
    englishTextArray : ["I", "live", "on", "-", "int"],
  }
}
function inGame_logic_start(){}

function menu_logic_start(){}

function translateWord(wordIndex, englishText, swedishText, prompt, translatedWords){
  if (!translatedWords.includes(wordIndex)){
    translatedWords[translatedWords.length] = wordIndex
    let newWord = ""
    let englishWord = englishText[wordIndex];
    switch(englishWord){
      case ("-"): newWord = swedishText[wordIndex]; break;
      case("int"): newWord = prompt[wordIndex]; break;
      default: newWord = englishWord; break;
    }
    prompt[wordIndex] = newWord
    renderPrompt()
  }
}
function updatePrompt(wordIndex) {
  translateWord(wordIndex, currentEnglishText,currentSwedishText,currentPrompt, translatedIndexes)
  for (let i = 0; i < houseArray.length; i++) {
    const button = document.getElementById(`word-btn-${i}`);
    if (button) {
      button.textContent = `${currentPrompt[i]}`;
    }
  }
}


function generateRandom() {
  const numbers = window.vocabulary.get_category("number");
  //vocabulary is NOT guaranteed to be in order. dont assume randomNo == literal
  const randomNo = irandom_range(1, numbers.length - 1);

  const vocab = window.vocabulary.get_vocab(numbers[randomNo]);
  console.log("generateRandom:", vocab.literal);

  $("#number-english").text((vocab.en));
  $("#number-swedish").text((vocab.sv));
  $("#number-literal").text((vocab.literal));

  const result = generateRandomHouses(vocab.literal, houseCount, numbers.length - 1);

  houseArray = result.houseArray;
  correctHouse = result.correctHouse;
  updateHouseButtons();
  renderHouseButtons();
  renderPrompt();

  return result;
}
function renderPrompt(){
  const container = $("#prompt-words")
  container.empty();
  console.log("Length of currentPrompt:")
  console.log(currentPrompt.length)
  currentPrompt.forEach((promptIndex) => {
    const btn = $(`<button>${promptIndex}</button>`);
    btn.on("click", () => updatePrompt(promptIndex));
    container.append(btn);
  });
}

function renderHouseButtons() {
  const container = $("#house-buttons");
  container.empty(); // clear previous buttons

  houseArray.forEach((houseNum, index) => {
    const btn = $(`<button>House ${houseNum}</button>`);
    btn.on("click", () => clickHouse(index));
    container.append(btn);
  });
}

function generateRandomHouses(houseNumber, houseCount, highestNumber) {
  const doubleHouses = irandom_range(0, 1);
  const maxPos = Math.min(Math.floor((houseNumber - 1) / (1 + doubleHouses)), houseCount - 1);
  const minPos = Math.min(
    Math.max(Math.ceil((houseCount - 1) - (highestNumber - houseNumber) / (1 + doubleHouses)), 0),
    houseCount - 1
  );

  const relativeHousePosition = irandom_range(Math.max(0, minPos), maxPos);
  const houses = [];

  for (let i = 0; i < houseCount; i++) {
    houses.push(houseNumber - (relativeHousePosition - i) * (1 + doubleHouses));
  }

  return { houseArray: houses, correctHouse: relativeHousePosition };
}

function nextGameState() {
  const totalStates = Object.keys(gameStates).length;
  state = (state + 1) % totalStates;
  console.log("New state:", state);
  runGameStateLogic();
}

function clickHouse(num) {
  console.log("Clicked house:", num);
  console.log("House array:", houseArray);
  console.log("Correct house index:", correctHouse);

  if (num === correctHouse) {
    alert("Correct!");
  } else {
    alert("Wrong house.");
  }
}

function updateHouseButtons() {
  for (let i = 0; i < houseArray.length; i++) {
    const button = document.getElementById(`house-btn-${i}`);
    if (button) {
      button.textContent = `House ${houseArray[i]}`;
    }
  }
}

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

function getKeyName(states, index) {
  return Object.keys(states).find((key) => states[key] === index);
}

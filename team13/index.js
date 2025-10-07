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

let state = gameStates.menu;



// new function to hide the correct screen
function renderScreen() {
  const isMenu = state === gameStates.menu;
  $("#menu-screen").toggle(isMenu);
  $("#game-screen").toggle(!isMenu)
  $("#gamestate").text(isMenu ? "menu" : "InGame");

    // Not completely sure about this part but it seems to keep translation hidden for a new round
    if (isMenu) { 
    $("#english-line").addClass("hidden");
    $("#toggle-translation-btn").text("Show translation");
  }

}

// Progress config (1-10) - Progression Bar

const PROGRESS_MIN = 1;
const PROGRESS_MAX = 10;
let progress = PROGRESS_MIN;

function renderProgress() 
  {const pct = (progress / PROGRESS_MAX) * 100;
  $("#progress-count").text(progress);
  $("#progress-fill").css("width", `${pct}%`);}


function applyProgress(wasCorrect) {
  progress += wasCorrect ? 1 : -1;
  if (progress < PROGRESS_MIN) progress = PROGRESS_MIN;
  if (progress > PROGRESS_MAX) progress = PROGRESS_MAX;

  renderProgress();

  if (progress === PROGRESS_MAX) 
    {alert("Congrats! You finished 10 rounds.");
    state = gameStates.menu;
    renderScreen();
    progress = PROGRESS_MIN;  
    renderProgress();}
}



let houseArray = [];
let correctHouse = null;
let houseCount = 4

$(function () {
  window.vocabulary.when_ready(function () {

    $("#start-game-btn").on("click", () => {
      state = gameStates.inGame;
      renderScreen();
      const houseInfo = runGameStateLogic(); // Start first round
      houseArray = houseInfo.houseArray;
      correctHouse = houseInfo.correctHouse;
    });

    $("#toggle-translation-btn").on("click", function () {
      $("#english-line").toggleClass("hidden");
      const isHidden = $("#english-line").hasClass("hidden");
      $(this).text(isHidden ? "Show translation" : "Hide translation");
    });

    renderProgress();
    renderScreen();

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
  return { houseArray, correctHouse };
}

function inGame_logic() {
  console.log("inGame_logic");
  return generateRandom();
}

function generateRandom() {
  const numbers = window.vocabulary.get_category("number");
  //vocabulary is NOT guaranteed to be in order. dont assume randomNo == literal
  const randomNo = irandom_range(1, numbers.length - 1);

  const vocab = window.vocabulary.get_vocab(numbers[randomNo]);
  console.log("generateRandom:", vocab.literal);

  $("#number-english").text(`"${vocab.sv}"`);
  $("#number-swedish").text((vocab.sv));
  $("#number-literal").text((vocab.literal));

  const result = generateRandomHouses(vocab.literal, houseCount, numbers.length - 1);

  houseArray = result.houseArray;
  correctHouse = result.correctHouse;

  renderHouseButtons();

  return result;
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
  renderScreen();
  runGameStateLogic();
}

function clickHouse(num) {
  console.log("Clicked house:", num);
  console.log("House array:", houseArray);
  console.log("Correct house index:", correctHouse);

  const wasCorrect = (num === correctHouse);

  if (num === correctHouse) {
    alert("Correct!");
  } else {
    alert("Wrong house.");
  }

  applyProgress(wasCorrect);

  // start next round only if still in game
  if (state === gameStates.inGame) {
    generateRandom();
  }

}
/* Is replaced with renderhousebutton function

function updateHouseButtons() {
  for (let i = 0; i < houseArray.length; i++) {
    const button = document.getElementById(`house-btn-${i}`);
    if (button) {
      button.textContent = `House ${houseArray[i]}`;
    }
  }
}
*/

function renderHouseButtons() {
  const container = $("#house-buttons");
  container.empty(); // clear previous buttons

  houseArray.forEach((houseNum, index) => {
    const btn = $(`<button>House ${houseNum}</button>`);
    btn.on("click", () => clickHouse(index));
    container.append(btn);
  });
}


function runGameStateLogic() {

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



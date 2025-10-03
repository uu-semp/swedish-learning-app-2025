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
    menu : 0,
    inGame : 1,
  };
let state = gameStates.inGame

$(function() {
  window.vocabulary.when_ready(function () {
  // Get all vocabulary belonging to the category numbers
  
  
   runGameStateLogic()
  

  $("#check-jquery").on("click", () => {
    alert("JavaScript and jQuery are working.");
  });
  
  

  // Get all vocabulary belonging to the category `furniture`


  $("#check-saving").on("click", () => {
    var data = window.save.get("team13");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team13", data);
  });

})});
 
function menu_logic(){
  console.log("menu_logic")
  //todo: get const numbers defined once covering whole script scope. Doesnt work rn for some reason
  //I understand why now, window.vocabulary is not defined outside of when_ready
  //to fix: put all functions into when_ready
  //idk if this works
  generateRandom()
}

function inGame_logic(){
  console.log("inGame_logic")
  
  generateRandom()
}

function generateRandom() {
  const numbers = window.vocabulary.get_category("number");
  //vocabulary is NOT in order. randomNo != literal
  const randomNo = irandom_range(1,numbers.length-1)
  console.log("generateRandom: " + window.vocabulary.get_vocab(numbers[randomNo]).literal)
  // Update the display
  $("#number-english").text(
    JSON.stringify(window.vocabulary.get_vocab(numbers[randomNo]).en)
  );
  $("#number-swedish").text(
    JSON.stringify(window.vocabulary.get_vocab(numbers[randomNo]).sv)
  );
  $("#number-literal").text(
    JSON.stringify(window.vocabulary.get_vocab(numbers[randomNo]).literal)
  );
  console.log(generateRandomHouses(window.vocabulary.get_vocab(numbers[randomNo]).literal,5, numbers.length-1));

}

function generateRandomHouses(houseNumber, houseCount, highestNumber){
  const doubleHouses = irandom_range(0,1)
  const maxPos = Math.floor(houseNumber/(1+doubleHouses)-1)
  const minPos = Math.ceil(4-(highestNumber-houseNumber))
  console.log("maxPos")
  console.log(maxPos)
  console.log(houseNumber)
  const relativeHousePosition = irandom_range(0,Math.min(houseCount-1,maxPos))
  const houseArray = []

  for (let i = 0; i < houseCount-1; i++) {
    houseArray.push(houseNumber-(relativeHousePosition-i)*(1+doubleHouses))
  }
  return houseArray
}

function nextGameState() {
  const totalStates = Object.keys(gameStates).length;
  //increment gameState
  state = (state + 1) % totalStates;
  console.log(state)
  runGameStateLogic()
}

function runGameStateLogic(){
  const numbers = window.vocabulary.get_category("number");
   $("#gamestate").text(window.vocabulary.get_vocab(numbers[state]).en);
  switch(state){
    case gameStates.menu: {
        menu_logic()
    } break;
    case gameStates.inGame: {
        inGame_logic()
    } break;
  }
}
function getKeyName(states,index){
  return Object.keys(states).find(key => states[key] === index);
}
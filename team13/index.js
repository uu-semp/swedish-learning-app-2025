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
  
  let houseInfo = runGameStateLogic()
  console.log(houseInfo)
  let correctHouse = houseInfo.correctHouse
  let houseArray = houseInfo
  
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

})});
 
function menu_logic(){
  console.log("menu_logic")
  //I would like to have const numbers be a global variable which works for all functions,
  //however due to the fact that it has to be within when_ready, that can't happen
  return generateRandom()
}

function inGame_logic(){
  console.log("inGame_logic")
  
  return generateRandom()
}

function generateRandom() {
  const numbers = window.vocabulary.get_category("number");
  //vocabulary is NOT guaranteed to be in order. dont assume randomNo == literal
  const randomNo = irandom_range(1,numbers.length-1)
  console.log("generateRandom: " + window.vocabulary.get_vocab(numbers[randomNo]).literal)

  $("#number-english").text(
    JSON.stringify(window.vocabulary.get_vocab(numbers[randomNo]).en)
  );
  $("#number-swedish").text(
    JSON.stringify(window.vocabulary.get_vocab(numbers[randomNo]).sv)
  );
  $("#number-literal").text(
    JSON.stringify(window.vocabulary.get_vocab(numbers[randomNo]).literal)
  );
  return generateRandomHouses(window.vocabulary.get_vocab(numbers[randomNo]).literal,5, numbers.length-1)

}

function generateRandomHouses(houseNumber, houseCount, highestNumber){
  const doubleHouses = irandom_range(0,1)
  const maxPos = Math.min(Math.floor((houseNumber - 1) / (1 + doubleHouses)), houseCount -1)
  const minPos = Math.min(
    Math.max(Math.ceil((houseCount - 1) - (highestNumber - houseNumber) / (1 + doubleHouses)), 0),
    houseCount - 1
  );

  const relativeHousePosition = irandom_range(Math.max(0,minPos),maxPos)
  const houseArray = []
  console.log(relativeHousePosition)
  for (let i = 0; i < houseCount; i++) {
    houseArray.push(houseNumber-(relativeHousePosition-i)*(1+doubleHouses))
  }
  return {houseArray : houseArray, correctHouse : relativeHousePosition}
}

function nextGameState() {
  const totalStates = Object.keys(gameStates).length;
  //increment gameState
  state = (state + 1) % totalStates;
  console.log(state)
  runGameStateLogic()
}
function clickHouse(num) {
  alert("Clicked house: " + num);
    /*if (num == correctHouse){
      alert("Clicked correct house: " + num);
    }else{
      alert("Clicked correct house: " + num);
    }*/
    
}
function runGameStateLogic(){
  const numbers = window.vocabulary.get_category("number");
   $("#gamestate").text(window.vocabulary.get_vocab(numbers[state]).en);
  switch(state){
    case gameStates.menu: {
        return menu_logic()
    }
    case gameStates.inGame: {
        return inGame_logic()
    }
  }
}
function getKeyName(states,index){
  return Object.keys(states).find(key => states[key] === index);
}
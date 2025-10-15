// ==============================================
// Owned by Team 13
// ==============================================


"use strict";


//houses

function renderHouseButtons() {
  const container = $("#house-buttons");
  container.empty(); // clear previous buttons

  houseArray.forEach((houseNum, index) => {
    const btn = $(`<button>House ${houseNum}</button>`);
    btn.on("click", () => clickHouse(index));
    container.append(btn);
  });
}

//Generates an array of length houseCount of house numbers. The houses are in sequence,
//increasing by 1 or 2 depending on a random variable. The array will always contain houseNumber
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

//Alerts correct if correct house
function clickHouse(num) {
  if (num === correctHouse) {
    alert("Correct!");
  } else {
    alert("Wrong house.");
  }
}
function irandom_range(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
}
function updateHouseButtons() {
  for (let i = 0; i < houseArray.length; i++) {
    const button = document.getElementById(`house-btn-${i}`);
    if (button) {
      button.textContent = `House ${houseArray[i]}`;
    }
  }
}


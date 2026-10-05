// ==============================================
// Owned by Game 12
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
  const step = irandom_range(1, 2);

  const maxCorrectPosition = Math.min(
    Math.floor((houseNumber - 1) / step),
    houseCount - 1
  );

  const correctHouse = irandom_range(0, maxCorrectPosition);

  const firstHouse = houseNumber - correctHouse * step;

  const houses = [];

  for (let i = 0; i < houseCount; i++) {
    houses.push(firstHouse + i * step);
  }

  return {
    houseArray: houses,
    correctHouse: correctHouse
  };
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


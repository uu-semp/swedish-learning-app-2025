async function setUpLevel() {
  const response = await fetch("./assets/team16_vocab.json");
  const data = await response.json();

  console.log(data);

  const correct_answers = [];
  while (correct_answers.length < 10) {
    const correct_answer = Math.floor(Math.random() * 20) + 1;
    if (!correct_answers.includes(correct_answer)) {
      correct_answers.push(correct_answer);
    }
  }

  const streets = correct_answers.map((num) => getStreetInfo(num, data));
  console.log(streets);
  return streets;
}

function getStreetInfo(number, data) {
  if (number <= 7) {
    return data["Ringgatan"][number - 1];
  } else if (number <= 13) {
    return data["Skolgatan"][number - 8];
  } else {
    return data["Parkvägen"][number - 14];
  }
}


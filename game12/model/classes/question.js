export class Question {

  constructor({

    id,
    difficulty,
    targetHouseNumber,
    targetStreet,
    targetLandmark = null,
    direction = null,
    targetTransport = null,
    promptSwedish = "",
    promptEnglish = ""
  }) {

    this.id = id || `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    this.difficulty = difficulty;
    this.targetHouseNumber = targetHouseNumber;
    this.targetStreet = targetStreet;
    this.targetLandmark = targetLandmark;
    this.direction = direction;
    this.targetTransport = targetTransport;
    this.promptSwedish = promptSwedish;
    this.promptEnglish = promptEnglish;
    this.isOddSide = targetHouseNumber % 2 !== 0;
    this.hintUsed = false;
    this.isAnsweredCorrectly = false;
  }
  checkAnswer(selectedHouseNumber, selectedTransport = null) {

    const houseMatches = Number(selectedHouseNumber) === this.targetHouseNumber;
    if(this.difficulty === 3 && this.targetTransport) {

      const transportMatches = selectedTransport === this.targetTransport;
      this.isAnsweredCorrectly = houseMatches && transportMatches;
    } else {

      this.isAnsweredCorrectly = houseMatches;
    }
    return this.isAnsweredCorrectly;
  }
  useHint() {

    this.hintUsed = true;
    return this.promptEnglish;
  }
}
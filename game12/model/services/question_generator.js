
/*
We need to agree on the interface with the contoller and 
board geneator

The contoller calls GenerateQuestion(difficulty) but this
file export QuestionGenerator instead. 

Also we need to agree on the names we should use. I dont know
if you are working on updating board_generator so I wont fix it
but we need to fix these: targetHouseNumber, targetStreet, 
promptSwedish, promptEnglish

Also the controller already runs hints, attempts and repition rounds.
-Oskar
*/

/*
export class QuestionGenerator {

  constructor(vocabularyRepository = null) {

    this.currentDifficulty = 1;
    this.totalQuestionsPerRound = 10;
    this.questionQueue = [];
    this.failedQueue = [];
    this.currentQuestionIndex = 0;
    this.isRepetitionRound = false;
    this.vocab = vocabularyRepository || {

      streets: [
        "Ringgatan",
        "Sysslomansgatan",
        "Drottninggatan",
        "Kungsgatan",
        "Svartbäcksgatan"
      ],
      landmarks: [
        { nameSwedish: "Domkyrkan", id: "domkyrkan" },
        { nameSwedish: "Slottet", id: "slottet" },
        { nameSwedish: "Botaniska trädgården", id: "botaniska" },
        { nameSwedish: "Universitetshuset", id: "universitetshuset" },
        { nameSwedish: "Gamla Uppsala", id: "gamla_uppsala" },
        { nameSwedish: "Linnéträdgården", id: "linnetradgarden" },
        { nameSwedish: "Museum Gustavianum", id: "gustavianum" },
        { nameSwedish: "UKK", id: "ukk" },
        { nameSwedish: "Stadsparken", id: "stadsparken" },
        { nameSwedish: "Lennakatten", id: "lennakatten" }
      ],
      directions: [
        { swedish: "till vänster om", english: "to the left of" },
        { swedish: "till höger om", english: "to the right of" },
        { swedish: "framför", english: "in front of" },
        { swedish: "längst ner på gatan från", english: "farthest down the street from" }
      ],
      transports: [
        {
          type: "bike",
          phrases: [
            { swedish: "Jag cyklar till", english: "I bike to" },
            { swedish: "Jag tar cykeln till", english: "I take the bike to" }
          ]
        },
        {
          type: "car",
          phrases: [
            { swedish: "Jag kör bil till", english: "I drive a car to" },
            { swedish: "Jag tar bilen till", english: "I take the car to" }
          ]
        },
        {
          type: "bus",
          phrases: [
            { swedish: "Jag åker buss till", english: "I go by bus to" },
            { swedish: "Jag tar bussen till", english: "I take the bus to" }
          ]
        }
      ]
    };
  }
  startNewRound(difficulty = 1) {

    this.currentDifficulty = difficulty;
    this.questionQueue = [];
    this.failedQueue = [];
    this.currentQuestionIndex = 0;
    this.isRepetitionRound = false;
    const seenPrompts = new Set();
    let retries = 0;
    while(this.questionQueue.length < this.totalQuestionsPerRound) {

        const q = this.generateSingleQuestion(difficulty);
        if(seenPrompts.has(q.promptSwedish) && retries++ < 50) continue;
        seenPrompts.add(q.promptSwedish);
        this.questionQueue.push(q);
  }
}
  generateSingleQuestion(difficulty) {

    const street = this.getRandomElement(this.vocab.streets);
    const houseNumber = Math.floor(Math.random() * 99) + 1;
    let config = {

      difficulty,
      targetHouseNumber: houseNumber,
      targetStreet: street
    };
    if(difficulty === 1) {

      config.promptSwedish = `Jag bor på ${street} ${houseNumber}.`;
      config.promptEnglish = `I live at ${street} ${houseNumber}.`;
    } else if(difficulty === 2) {

      const landmark = this.getRandomElement(this.vocab.landmarks);
      const direction = this.getRandomElement(this.vocab.directions);
      config.targetLandmark = landmark;
      config.direction = direction;
      config.promptSwedish = `Jag bor ${direction.swedish} ${landmark.nameSwedish} ${houseNumber}.`;
      config.promptEnglish = `I live ${direction.english} ${landmark.nameSwedish} ${houseNumber}.`;
    } else if(difficulty === 3) {

      const landmark = this.getRandomElement(this.vocab.landmarks);
      const direction = this.getRandomElement(this.vocab.directions);
      const transport = this.getRandomElement(this.vocab.transports);
      const phrase = this.getRandomElement(transport.phrases);
      config.targetLandmark = landmark;
      config.direction = direction;
      config.targetTransport = transport.type;
      config.promptSwedish = `${phrase.swedish} ${street} ${houseNumber}, som ligger ${direction.swedish} ${landmark.nameSwedish}.`;
      config.promptEnglish = `${phrase.english} ${street} ${houseNumber}, which is ${direction.english} ${landmark.nameSwedish}.`;
    }
    return new Question(config);
  }
  getCurrentQuestion() {

    return this.questionQueue[this.currentQuestionIndex] || null;
  }
  submitAnswer(selectedHouseNumber, selectedTransport = null) {

    const question = this.getCurrentQuestion();
    if(!question) return {isRoundOver: true};
    const isCorrect = question.checkAnswer(selectedHouseNumber, selectedTransport);
    if(!isCorrect || question.hintUsed) {

      this.failedQueue.push(question);
    }
    this.currentQuestionIndex++;
    if(this.currentQuestionIndex >= this.questionQueue.length) {

      if(this.failedQueue.length > 0) {

        this.questionQueue = this.shuffle([this.failedQueue]);
        this.questionQueue.forEach(q => {q.hintUsed = false;});
        this.failedQueue = [];
        this.currentQuestionIndex = 0;
        this.isRepetitionRound = true;
        return {

          isCorrect,
          isRoundOver: false,
          isRepetitionRound: true,
          nextQuestion: this.getCurrentQuestion(),
          remainingCount: this.questionQueue.length
        };
      }
      return {isCorrect, isRoundOver: true, isRepetitionRound: this.isRepetitionRound};
    }
    return {

      isCorrect,
      isRoundOver: false,
      isRepetitionRound: this.isRepetitionRound,
      nextQuestion: this.getCurrentQuestion(),
      currentIndex: this.currentQuestionIndex + 1,
      totalCount: this.questionQueue.length
    };
  }
  triggerHint() {

    const question = this.getCurrentQuestion();
    return question ? question.useHint() : "";
  }
  getRandomElement(arr) {

    return arr[Math.floor(Math.random() * arr.length)];
  }
  shuffle(arr) {
  const copy = [...arr];
  for(let i = copy.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
  }   
}

*/

export function GenerateQuestion(difficulty, board) {
  let config = {
    correctNumber: null,
    correctStreet: null
  };

  if (difficulty === 1) {
    const random_index = Math.floor(Math.random() * 12)
    const all_houses = board.BuildingsHorizontal.concat(board.BuildingsVertical)

    const correct_house = all_houses[random_index]
    config.correctNumber = correct_house.houseNumber
    config.correctStreet = correct_house.street

    config.promptSwedish = `Jag bor på ${correct_house.street} ${correct_house.houseNumber}.`;
    config.promptEnglish = `I live at ${correct_house.street} ${correct_house.houseNumber}.`;

  }
   else if (difficulty === 2) {

    // make sure left/right works as intended.
    const landmark = this.getRandomElement(this.vocab.landmarks);
    const direction = this.getRandomElement(this.vocab.directions);
    config.targetLandmark = landmark;
    config.direction = direction;
    config.promptSwedish = `Jag bor ${direction.swedish} ${landmark.nameSwedish} ${houseNumber}.`;
    config.promptEnglish = `I live ${direction.english} ${landmark.nameSwedish} ${houseNumber}.`;
  }
   else if (difficulty === 3) {

    const landmark = this.getRandomElement(this.vocab.landmarks);
    const direction = this.getRandomElement(this.vocab.directions);
    const transport = this.getRandomElement(this.vocab.transports);
    const phrase = this.getRandomElement(transport.phrases);
    config.targetLandmark = landmark;
    config.direction = direction;
    config.targetTransport = transport.type;
    config.promptSwedish = `${phrase.swedish} ${street} ${houseNumber}, som ligger ${direction.swedish} ${landmark.nameSwedish}.`;
    config.promptEnglish = `${phrase.english} ${street} ${houseNumber}, which is ${direction.english} ${landmark.nameSwedish}.`;
  }

  return config;
}

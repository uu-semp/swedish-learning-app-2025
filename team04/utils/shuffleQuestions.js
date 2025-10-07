/**
 * randomly shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - array to be shuffled
 * @returns {Array} - a new shuffled array
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * shuffle questions and their options
 * @param {Array} questions - original questions array
 * @returns {Array} - shuffled questions with shuffled options
 */
export default function shuffleQuestions(questions) {
  // shuffle the questions array first
  const shuffledQuestions = shuffleArray(questions);

  // shuffle options for each question
  return shuffledQuestions.map(q => {
    const options = [q.option1, q.option2, q.option3, q.option4];
    const shuffledOptions = shuffleArray(options);
    const correctIndex = shuffledOptions.indexOf(q.answer);

    return {
      hour: q.hour,
      minute: q.minute,
      options: shuffledOptions,
      correctIndex: correctIndex,
      correctAnswer: q.answer,
      explanation: q.explanation
    };
  });
}

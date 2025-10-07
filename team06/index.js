// ==============================================
// Owned by Team 06
// ==============================================
("use strict");

// ==============================================
// VIEW SWITCHING FUNCTIONS
// ==============================================

//Initialize questionUtils
let questionUtils = null;

// Helper function to hide all views
function hideAllViews() {
  document.querySelectorAll(".view").forEach((view) => {
    view.style.display = "none";
  });
}

// Show Intro View
function showIntro() {
  hideAllViews();
  document.getElementById("intro-view").style.display = "block";
}

// Show Level Selection View
function showLevelSelection() {
  hideAllViews();
  document.getElementById("level-view").style.display = "block";
}

// Show Finish View
function showFinish() {
  hideAllViews();
  document.getElementById("finish-view").style.display = "block";

  // Display final results (to be implemented in game.js)
  if (typeof displayResults === "function") {
    displayResults();
  }
}

// ==============================================
// CLOCK INTEGRATION HELPER
// ==============================================

// Helper function to work with clock iframe/object
function withClockDoc(fn) {
  const clockObj =
    document.getElementById("clock-object") ||
    document.getElementById("clock-frame") ||
    document.querySelector("object[data*='clock.html']");

  if (!clockObj) {
    console.error("Clock object not found");
    return;
  }

  if (clockObj.contentDocument) {
    fn(clockObj.contentDocument, clockObj.contentWindow);
  } else {
    clockObj.addEventListener("load", () =>
      fn(clockObj.contentDocument, clockObj.contentWindow)
    );
  }
}

// ==============================================
// GAME LOGIC FUNCTIONS
// ==============================================

function updateQuestion(questionInfo) {
  if (!questionInfo) {
    console.error("No question info provided");
    return;
  }

  window.currentQuestion = questionInfo;
  selectedAnswer = null;
  selectedButton = null;

  document.getElementById("question").innerText = questionInfo.question;

  const allChoices = [questionInfo.answer, ...questionInfo.alternatives];

  const shuffledChoices = shuffleArray([...allChoices]);

  const answerContainer = document.getElementById("answers-container");

  answerContainer.innerHTML = "";

  // Create a button for each choice
  shuffledChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.innerText = choice;
    button.className = "answer-btn";
    button.onclick = () => selectAnswer(choice, button);
    answerContainer.appendChild(button);
  });

  if (questionInfo.type === "clock") {
    console.log("Setting clock time:", questionInfo.hour, questionInfo.minute);
    withClockDoc((doc, win) => {
      if (typeof win.setAnalogTime === "function") {
        win.setAnalogTime(questionInfo.hour, questionInfo.minute);
      } else {
        console.warn("No setAnalogTime function in clock.html");
      }
    });
    const clockObject = document.getElementById("clock-object");
    clockObject.style.display = "";
    clockObject.style.visibility = "visible";
  } else {
    // Hide the clock for non-clock questions
    const clockObject = document.getElementById("clock-object");
    clockObject.style.display = "none";
  }
}

function startGame(level) {
  if (!questionUtils) {
    console.error("Questions not loaded yet");
    return;
  }

  // Get a random question for the selected difficulty
  const questionInfo = questionUtils.getRandom({ difficulty: level });

  if (!questionInfo) {
    console.error("No questions found for level:", level);
    return;
  }

  // Update the display with the new question
  updateQuestion(questionInfo);

  // Show the game view
  hideAllViews();
  document.getElementById("game-view").style.display = "block";

  // // Initialize game with selected level (to be implemented in game.js)
  // if (typeof initializeGame === "function") {
  //   initializeGame(level);
  // }

  console.log("Game started with level:", level);
}

// ============================
// SELECTION AND SUBMISSION
// ============================

let selectedAnswer = null;
let selectedButton = null;
function selectAnswer(answer, buttonElement) {
  if (!window.currentQuestion) {
    console.error("No current question set");
    return;
  }

  selectedAnswer = answer;
  selectedButton = buttonElement;

  document.querySelectorAll(".answer-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  if (buttonElement) {
    buttonElement.classList.add("selected");
  }

  const submitButton = document.getElementById("submit-btn");
  if (submitButton) {
    submitButton.disabled = false;
  }

  console.log("Answer selected:", answer);
}

function submitAnswer() {
  if (!window.currentQuestion) {
    console.error("No current question set");
    return;
  }

  if (!selectedAnswer) {
    alert("Please select an answer before submitting.");
    return;
  }

  document.querySelectorAll(".answer-btn, .submit-btn").forEach((btn) => {
    btn.disabled = true;
  });

  try {
    const checkResult = questionUtils.checkAnswerEasy(
      window.currentQuestion,
      selectedAnswer
    );

    const progressResult = progressUtils.recordResult(
      window.currentQuestion.id,
      checkResult.correct
    );
    console.log(progressResult);
    console.log(checkResult);
    showSubmissionFeedback(checkResult, progressResult);
  } catch (error) {
    console.error("Error checking answer:", error);
    document.querySelectorAll(".answer-btn, .submit-button").forEach((btn) => {
      btn.disabled = false;
    });
  }
}

function showSubmissionFeedback(checkResult, progressResult) {
  document.querySelectorAll(".answer-btn").forEach((btn) => {
    const buttonText = btn.innerText;

    if (buttonText === checkResult.expected) {
      // Correct answer turns green
      btn.classList.add("correct");
    } else if (buttonText === checkResult.given && !checkResult.correct) {
      // User's wrong answer turns red
      btn.classList.add("wrong");
    }
    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "block";

    // Disable all buttons after submission
    btn.disabled = true;
  });

  let feedbackElement = document.getElementById("feedback-message");
  if (!feedbackElement) {
    console.error("Feedback element not found");
    return;
  }

  // const submitButton = document.getElementById("submit-btn");
  // if (submitButton) {
  //   submitButton.innerText = checkResult.message;
  //   submitButton.disabled = true;
  //   submitButton.className = `submit-btn feedback-button ${
  //     checkResult.correct ? "correct" : "incorrect"
  //   }`;
  // }
}

function nextQuestion() {
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("submit-btn").style.display = "block";

  if (!questionUtils) {
    console.error("Questions not loaded yet");
    return;
  }
  const questionInfo = questionUtils.getRandom({
    difficulty: window.currentQuestion.difficulty,
  });

  if (!questionInfo) {
    console.error("No more questions available");
    showFinish();
    return;
  }

  updateQuestion(questionInfo);
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

// Shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ==============================================
// INITIALIZATION
// ==============================================

$(function () {
  window.vocabulary.when_ready(async function () {
    console.log("Team 06 - Tick-Tock Time initialized!");
    try {
      questionUtils = await import("./utils/question_utils.js");
      await questionUtils.initQuestions("./data/questions.json");
      progressUtils = await import("./utils/progress_utils.js");

      console.log("Questions loaded successfully");
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
    // Show intro view on load
    showIntro();

    // OLD TEST FUNCTIONS (kept for reference)
    $("#check-jquery").on("click", () => {
      alert("JavaScript and jQuery are working.");
    });

    $("#check-saving").on("click", () => {
      var data = window.save.get("team06");
      data.counter = data.counter ?? 0;
      data.counter += 1;
      $("#check-saving").text(
        `This button has been pressed ${data.counter} times`
      );
      window.save.set("team06", data);
    });
  });
});

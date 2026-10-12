/**
 * Game 06 - Set the clock mode
 * Main game logic and UI controller for the drag-hand exercise.
 *
 * File responsibilities:
 * - Start a round of five distinct generated clock questions.
 * - Connect the clock to submission and feedback controls.
 * - Record one result per question and award 10 points for a correct answer.
 * - Handle question progression, replay, and return to level selection.
 */

import { createClockQuestions, clockQuestionClass, checkClockAnswer } from "./utils/clock_questions.js";
import { initProgress, createSession } from "./utils/progress_utils.js";

/** @typedef {import("./utils/question_utils.js").ClockQuestion} ClockQuestion */

// Create the mode's interface.
document.querySelector(".game-frame").insertAdjacentHTML("beforeend", `
<div id="set-clock-view" style="display: none;">
      <section class="game-container" aria-label="Set the clock game">
        <div id="set-clock-play">
          <div class="game-header">
            <span id="set-clock-counter" class="progress-info">Question 1/5</span>
            <span class="score-display"><i class="fa-solid fa-star" aria-hidden="true"></i> Score: <span id="set-clock-score">0</span></span>
          </div>
          <div class="clock-container">
            <div id="setting-clock" class="clock" aria-label="Draggable analog clock">
              <div class="clock-face">
                <div class="hand hour-hand" id="setting-hour-hand" role="slider" tabindex="-1" aria-label="Hour hand" aria-valuemin="1" aria-valuemax="12" title="Drag or use arrow keys to set the hour"></div>
                <div class="hand minute-hand" id="setting-minute-hand" role="slider" tabindex="-1" aria-label="Minute hand" aria-valuemin="0" aria-valuemax="55" title="Drag or use arrow keys to set the minutes"></div>
              </div>
            </div>
          </div>
          <div class="question-section">
            <p class="question-label">Set the clock to:</p>
            <p id="set-clock-question" class="question-text" lang="sv"></p>
          </div>
          <p class="question-label">Drag the red hour hand and blue minute hand to match the Swedish phrase, then submit your answer. You can also focus a hand and use the arrow keys.</p>
          <button id="set-clock-submit" class="submit-btn" type="button" disabled>Submit Answer</button>
          <button id="set-clock-next" class="next-btn" type="button" hidden>Next Question</button>
          <p id="set-clock-feedback" class="feedback-message" role="status" aria-live="polite" hidden></p>
        </div>
        <div id="set-clock-summary" hidden>
          <h2 class="summary-title">🎉 Well Done!</h2>
          <p class="summary-text">You've completed the challenge!</p>
          <div class="summary-score-box">
            <p class="summary-label">Final Score</p>
            <h2 id="set-clock-final-score" class="summary-title">0</h2>
          </div>
          <div class="summary-buttons">
            <button id="set-clock-replay" class="summary-btn" type="button">🔁 Play Again</button>
          </div>
        </div>
        <button id="set-clock-back" class="back-btn" type="button">Back to Levels</button>
      </section>
    </div>
`);

// Initialize the clock after its markup has been added to the page.
const { resetClock, getClockTime, setAnalogTime, setInteractive } = await import("./components/setting-clock.js");

const view = document.getElementById("set-clock-view");
const clock = document.getElementById("setting-clock");
const submit = document.getElementById("set-clock-submit");
const next = document.getElementById("set-clock-next");
const feedback = document.getElementById("set-clock-feedback");
/** @type {ClockQuestion[]} Questions selected for the current round */
let round = [];
/** @type {number} Index of the current question */
let index = 0;
/** @type {number} Current score in the round */
let score = 0;
/** @type {boolean} Prevents more than one submission for the current question */
let submitted = false;
let session = null;

// ==============================================
// CLOCK INTEGRATION HELPERS
// ==============================================

/**
 * Check whether the drag-hand mode is currently active.
 * @returns {boolean}
 */
function active() {
  return document.body.classList.contains("setting-clock-mode");
}

// Any resting clock can be submitted, including its initial 12:00 position.
clock.addEventListener("clock-change", (event) => {
  if (!active() || submitted) return;
  submit.disabled = event.detail.dragging;
});

// ==============================================
// QUESTION DISPLAY & ROUND SETUP
// ==============================================

/**
 * Display the current phrase and reset question controls and clock hands.
 * Clears previous feedback and allows the initial clock position to be submitted.
 * @returns {void}
 */
function showQuestion() {
  round[index] = session.next();
  submitted = false;
  document.getElementById("set-clock-question").textContent = round[index].question;
  document.getElementById("set-clock-counter").textContent = `Question ${index + 1}/5`;
  document.getElementById("set-clock-score").textContent = String(score);
  feedback.hidden = true;
  feedback.textContent = "";
  feedback.className = "feedback-message";
  submit.hidden = false;
  submit.disabled = false;
  next.hidden = true;
  resetClock();
}

/**
 * Start a fresh five-question round, including previously mastered targets.
 * Initializes missing progress records without clearing existing results.
 * @returns {void}
 */
function startRound() {
  const questions = createClockQuestions();
  initProgress(questions.map((question) => question.id));
  session = createSession(questions, { mode: "practice", size: 5, questionClass: clockQuestionClass });
  round = [];
  index = 0;
  score = 0;
  document.querySelectorAll(".view").forEach((other) => { other.style.display = "none"; });
  document.body.classList.add("setting-clock-mode");
  view.style.display = "block";
  document.getElementById("set-clock-play").hidden = false;
  document.getElementById("set-clock-summary").hidden = true;
  showQuestion();
}

// ==============================================
// ANSWER SUBMISSION & QUESTION PROGRESSION
// ==============================================

/**
 * Grade the snapped hand positions once and record the result.
 * Locks the hands, updates the score, and reveals the target after a wrong answer.
 */
submit.addEventListener("click", () => {
  const time = getClockTime();
  if (!active() || submitted || time.dragging) return;
  const question = round[index];
  const correct = checkClockAnswer(question, time);
  submitted = true;
  setInteractive(false);
  const status = session.record(question, correct);
  document.getElementById("save-warning").hidden = status.saved !== false;
  if (correct) {
    score += 10;
  } else {
    setAnalogTime(question.hour, question.minute);
  }
  document.getElementById("set-clock-score").textContent = String(score);
  const expected = question.answer;
  feedback.textContent = correct ? "Correct! Well done." : `Not quite. The correct time is ${expected}. The clock now shows the answer.`;
  feedback.className = `feedback-message ${correct ? "correct" : "wrong"}`;
  feedback.hidden = false;
  submit.disabled = true;
  submit.hidden = true;
  next.hidden = false;
  next.focus();
});

/**
 * Advance after submission or show the final score when the round is complete.
 */
next.addEventListener("click", () => {
  if (!submitted) return;
  index += 1;
  if (index < session.size) {
    showQuestion();
  } else {
    next.hidden = true;
    document.getElementById("set-clock-play").hidden = true;
    document.getElementById("set-clock-summary").hidden = false;
    document.getElementById("set-clock-final-score").textContent = String(score);
  }
});

// ==============================================
// MODE NAVIGATION & INITIALIZATION
// ==============================================

// The launch button becomes available after this module has installed its handlers.
document.getElementById("set-clock-launch").addEventListener("click", startRound);
document.getElementById("set-clock-launch").disabled = false;
document.getElementById("set-clock-replay").addEventListener("click", startRound);
/**
 * Stop dragging, remove this mode's layout class, and return to the existing menu.
 */
document.getElementById("set-clock-back").addEventListener("click", () => {
  setInteractive(false);
  document.body.classList.remove("setting-clock-mode");
  view.style.display = "none";
  window.showLevelSelection();
});

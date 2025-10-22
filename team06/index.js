// ==============================================
// Owned by Team 06
// ==============================================
("use strict");

// ==============================================
// VIEW SWITCHING FUNCTIONS
// ==============================================

// ==============================================
// Team 06 - Tick-Tock Time Game
// Main game logic and UI controller
// ==============================================
("use strict");

// ==============================================
// GLOBAL VARIABLES & STATE
// ==============================================

/** @type {Object|null} Question utilities module for managing questions */
let questionUtils = null;

/** @type {Object|null} Progress utilities module for tracking user progress */
let progressUtils = null;

/** @type {string|null} Current difficulty level (easy/medium/hard) */
let currentDifficulty = null;

/** @type {string|null} Currently selected answer by the user */
let selectedAnswer = null;

/** @type {HTMLElement|null} Currently selected answer button element */
let selectedButton = null;

/** @type {number} Current score in the session */
let score = 0;

/**
 * Hides all view containers in the game interface
 * Used to ensure only one view is visible at a time
 */
function hideAllViews() {
	document.querySelectorAll(".view").forEach((view) => {
		view.style.display = "none";
	});
}

/**
 * Shows the intro view (game start screen)
 * Hides all other views and displays the introduction
 */
function showIntro() {
	hideAllViews();
	document.getElementById("intro-view").style.display = "block";
}

/**
 * Shows the level selection view
 * Allows users to choose difficulty level (easy/medium/hard)
 */
function showLevelSelection() {
	hideAllViews();
	document.getElementById("level-view").style.display = "block";
}

// ==============================================
// GAME UI CONFIGURATION BY LEVEL
// ==============================================

// Configure game interface based on difficulty
function setupGameForLevel(level) {
	const clockSection = document.getElementById("clock-object");
	const answersContainer = document.getElementById("answers-container");
	const textInputSection = document.getElementById("text-input-section");
	const answerInput = document.getElementById("answer-input");

	// Reset input
	if (answerInput) answerInput.value = "";

	switch (level) {
		case "easy":
			// Easy: Show clock + multiple choice buttons
			if (clockSection) clockSection.style.display = "";
			if (answersContainer) answersContainer.style.display = "grid";
			if (textInputSection) textInputSection.style.display = "none";
			break;

		case "medium":
			// Medium: Show clock + text input
			if (clockSection) clockSection.style.display = "";
			if (answersContainer) answersContainer.style.display = "grid";
			if (textInputSection) textInputSection.style.display = "none";
			break;

		case "hard":
			// Hard: No clock + text input (dialogue mode)
			if (clockSection) clockSection.style.display = "none";
			if (answersContainer) answersContainer.style.display = "grid";
			if (textInputSection) textInputSection.style.display = "none";
			break;

		default:
			console.warn("Unknown difficulty level:", level);
	}
}

// Helper to show/hide hint
function toggleHint(show, hintText = "") {
	const hintSection = document.getElementById("hint-section");
	const hintTextElement = document.getElementById("hint-text");

	if (hintSection) {
		hintSection.style.display = show ? "block" : "none";
	}
	if (hintTextElement && show) {
		hintTextElement.textContent = hintText;
	}
}

// Insert Swedish special character into text input
function insertLetter(letter) {
	const input = document.getElementById("answer-input");
	if (!input) return;

	// Get current cursor position
	const start = input.selectionStart;
	const end = input.selectionEnd;
	const currentValue = input.value;

	// Insert letter at cursor position
	input.value =
		currentValue.substring(0, start) + letter + currentValue.substring(end);

	// Move cursor after inserted letter
	const newPosition = start + letter.length;
	input.setSelectionRange(newPosition, newPosition);

	// Focus back on input
	input.focus();
}
// ==============================================
//  Summary / Finish View (Updated)
// ==============================================

// Show Summary View (after all questions are done)
function showSummary() {
	hideAllViews();
	document.getElementById("summary-view").style.display = "block";
	const scoreElement = document.getElementById("final-score");
	if (scoreElement) scoreElement.textContent = String(score);

	// Optional: dynamic feedback text
	const summarySubtitle = document.querySelector(".summary-subtitle");
	if (summarySubtitle) {
		if (score >= 40)
			summarySubtitle.textContent =
				"🥇 Excellent! You mastered this topic perfectly!";
		else if (finalScore >= 30)
			summarySubtitle.textContent = "🥈 Great job! Keep practicing!";
		else
			summarySubtitle.textContent =
				"🥉 Good effort! Try again to improve!";
	}
}

// Restart Game
function restartGame() {
  console.log("🔁 Restarting game...");

  // Step 1: Reset global variables
  score = 0;
  selectedAnswer = null;
  selectedButton = null;
  currentDifficulty = currentDifficulty || "easy"; // fallback if none selected

  // Step 2: Recreate a new session with same difficulty
  if (questionUtils && progressUtils) {
    const levelQuestions = questionUtils.byDifficulty(currentDifficulty);
    const questionIds = levelQuestions.map((q) => q.id);
    progressUtils.initProgress(questionIds);

    window.currentSession = progressUtils.createSession(levelQuestions, {
      mode: "regular",
      size: 5,
    });
  }

  // Step 3: Update score UI
  const scoreEl = document.getElementById("score-value");
  if (scoreEl) scoreEl.textContent = "0";

  // Step 4: Switch back to game view and load first question
  hideAllViews();
  document.getElementById("game-view").style.display = "block";
  updateQuestion();

  console.log("✅ Game fully restarted at level:", currentDifficulty);
}
// Show Finish View
function showFinish() {
	showSummary();
}

// ==============================================
// CLOCK INTEGRATION HELPER
// ==============================================

/**
 * Helper function to interact with the clock iframe/object
 * Handles timing issues by waiting for the clock to load if necessary
 * @param {Function} fn - Callback function to execute with clock document and window
 */
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

/**
 * Updates the current question display and handles question progression
 *
 * This is the main function responsible for:
 * - Getting the next question from the session using nextReviewAll
 * - Updating the UI with question text and answer choices
 * - Handling clock questions by setting the analog time
 * - Managing session completion
 *
 * @description Uses progressUtils.nextReviewAll to prioritize questions with historical mistakes
 * @see progressUtils.nextReviewAll for question selection logic
 */
function updateQuestion() {
	if (!window.currentSession) {
		console.error("No active session");
		return;
	}

	// Pull the next eligible question from the session
	const q = window.currentSession.next();
	if (!q) {
		console.log("Session completed");
		showFinish();
		return;
	}

	// Cache + reset transient UI state
	window.currentQuestion = q;
	selectedAnswer = null;
	selectedButton = null;

	// // Reset/prepare hint UI
	// toggleHint(false, "");
	// const hintBtn = document.getElementById("hint-btn");
	// if (hintBtn) {
	//   const hasHint = !!(q.hint && String(q.hint).trim());
	//   hintBtn.style.display = hasHint ? "inline-block" : "none";
	//   hintBtn.textContent = "Show Hint";
	// }

	// Update counter "Question X/Y"
	const counterEl = document.getElementById("question-counter");
	if (counterEl)
		counterEl.textContent = `Question ${window.currentSession.asked}/${window.currentSession.size}`;

	// Render question text
	document.getElementById("question").innerText = q.question;

	// Build MCQ choices using the util, then shuffle
	const allChoices = questionUtils.choicesForEasy(q);
	const shuffled = shuffleArray([...allChoices]);

	const answerContainer = document.getElementById("answers-container");
	answerContainer.innerHTML = "";
	shuffled.forEach((choice) => {
		const btn = document.createElement("button");
		btn.innerText = choice;
		btn.className = "answer-btn";
		btn.onclick = () => selectAnswer(choice, btn);
		answerContainer.appendChild(btn);
	});

	// Show/hide the analog clock via <object> when needed
	const clockObject = document.getElementById("clock-object");
	if (q.type === "clock") {
		if (clockObject) {
			clockObject.style.display = "";
			clockObject.style.visibility = "visible";
			setTimeout(() => {
				withClockDoc((doc, win) => {
					if (typeof win.setAnalogTime === "function") {
						win.setAnalogTime(q.hour, q.minute);
					} else {
						console.warn("No setAnalogTime function in clock.html");
					}
				});
			}, 100);
		}
	} else if (clockObject) {
		clockObject.style.display = "none";
	}

	// Make sure Submit is visible & enabled; Next hidden
	const submitBtn = document.getElementById("submit-btn");
	const nextBtn = document.getElementById("next-btn");
	if (submitBtn) {
		submitBtn.style.display = "block";
		submitBtn.disabled = true;
	}
	if (nextBtn) nextBtn.style.display = "none";
}

/**
 * Initializes and starts a new game session
 *
 * Sets up the game with the specified difficulty level by:
 * - Setting the global difficulty state
 * - Initializing progress tracking for all questions of the difficulty
 * - Creating a new session with 5 questions
 * - Switching to the game view
 * - Loading the first question
 *
 * @param {string} level - Difficulty level ("easy", "medium", or "hard")
 */
function startGame(level) {
	if (!questionUtils || !progressUtils) {
		console.error("Question utils or progress utils not loaded yet");
		return;
	}

	// Set the global difficulty
	currentDifficulty = level;

	// Initialize progress for all questions of this difficulty
	const levelQuestions = questionUtils.byDifficulty(currentDifficulty);
	const questionIds = levelQuestions.map((q) => q.id);
	progressUtils.initProgress(questionIds);

	// Create a session with the selected difficulty questions
	window.currentSession = progressUtils.createSession(levelQuestions, {
		mode: "regular",
		size: 5,
	});

	score = 0;
	const scoreEl = document.getElementById("score-value");
	if (scoreEl) scoreEl.textContent = "0";

	// Show the game view
	hideAllViews();
	document.getElementById("game-view").style.display = "block";

	// Get and display the first question
	updateQuestion();

	console.log("Game started with level:", level);
}

// ==============================================
// SELECTION AND SUBMISSION
// ==============================================

/**
 * Handles user selection of an answer choice
 * Updates UI to show selected state and enables submit button
 * @param {string} answer - The selected answer text
 * @param {HTMLElement} buttonElement - The button element that was clicked
 */
function selectAnswer(answer, buttonElement) {
	if (!window.currentQuestion) {
		console.error("No current question set");
		return;
	}

	// Store the selected answer and button reference
	selectedAnswer = answer;
	selectedButton = buttonElement;

	// Clear previous selections and highlight the new one
	document.querySelectorAll(".answer-btn").forEach((btn) => {
		btn.classList.remove("selected");
	});

	if (buttonElement) {
		buttonElement.classList.add("selected");
	}

	// Enable the submit button once an answer is selected
	const submitButton = document.getElementById("submit-btn");
	if (submitButton) {
		submitButton.disabled = false;
	}
}

/**
 * Processes the user's submitted answer
 *
 * Handles the complete submission flow:
 * - Validates that an answer is selected
 * - Checks the answer using questionUtils.checkAnswerEasy
 * - Records the result in progress tracking
 * - Shows visual feedback (correct/wrong styling)
 * - Switches from Submit to Next button
 *
 * @description Disables all buttons after submission to prevent multiple submissions
 */
function submitAnswer() {
	if (!window.currentQuestion) return;
	if (!selectedAnswer) {
		alert("Please select an answer before submitting.");
		return;
	}

	document.querySelectorAll(".answer-btn, .submit-btn").forEach((btn) => {
		btn.disabled = true;
	});

	try {
		const check = questionUtils.checkAnswerEasy(
			window.currentQuestion,
			selectedAnswer
		);

		const status = window.currentSession.record(
			window.currentQuestion,
			check.correct
		);

		// update score on correct
		if (check.correct) {
			score += 10; // pick any increment you like
			const scoreEl = document.getElementById("score-value");
			if (scoreEl) scoreEl.textContent = String(score);
		}

		showSubmissionFeedback(check, status);
	} catch (e) {
		console.error("Error checking answer: ", e);
		document.querySelectorAll(".answer-btn, .submit-btn").forEach((btn) => {
			btn.disabled = false;
		});
	}
}

/**
 * Displays visual feedback after answer submission
 *
 * Provides immediate visual feedback by:
 * - Highlighting the correct answer in green
 * - Highlighting the user's wrong answer in red (if incorrect)
 * - Switching from Submit button to Next button
 * - Disabling all answer buttons
 *
 * @param {Object} checkResult - Result from questionUtils.checkAnswerEasy
 * @param {Object} progressResult - Updated progress data from progressUtils
 */
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

		// Switch to a "Next" button, so the user can progress
		document.getElementById("submit-btn").style.display = "none";
		document.getElementById("next-btn").style.display = "block";

		btn.disabled = true;
	});

	let feedbackElement = document.getElementById("feedback-message");
	if (!feedbackElement) {
		console.error("Feedback element not found");
		return;
	}
}

/**
 * Advances to the next question in the session
 *
 * Handles the progression flow:
 * - Switches from Next button back to Submit button
 * - Calls updateQuestion() to load and display the next question
 * - Automatically shows finish view if no more questions available
 */
function nextQuestion() {
	document.getElementById("next-btn").style.display = "none";
	document.getElementById("submit-btn").style.display = "block";

	// Get and display the next question
	updateQuestion();
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Randomizes the order of elements in an array
 *
 * Uses the Fisher-Yates shuffle algorithm to ensure uniform distribution
 * Used to randomize the order of answer choices for each question
 *
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new array with elements in random order
 */
function shuffleArray(array) {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
// Expose functions globally (for HTML onclick & console testing)
window.showSummary = showSummary;
window.startGame = startGame;
window.showLevelSelection = showLevelSelection;
window.showIntro = showIntro;
window.submitAnswer = submitAnswer;
window.restartGame = restartGame;
window.showFinish = showFinish;
window.setupGameForLevel = setupGameForLevel;
window.toggleHint = toggleHint;
window.insertLetter = insertLetter;
window.nextQuestion = nextQuestion;

// ==============================================
// INITIALIZATION
// ==============================================

/**
 * Application initialization when DOM and vocabulary are ready
 *
 * Sets up the game by:
 * - Loading question utilities and initializing questions from JSON
 * - Loading progress utilities for tracking user performance
 * - Displaying the intro view
 * - Setting up test functions for development/debugging
 */
$(function () {
	window.vocabulary.when_ready(async function () {
		console.log("Team 06 - Tick-Tock Time initialized!");

		try {
			// Load and initialize question management utilities
			questionUtils = await import("./utils/question_utils.js");
			await questionUtils.initQuestions("./data/questions.json");

			// Load progress tracking utilities
			progressUtils = await import("./utils/progress_utils.js");

			console.log("Questions and progress utils loaded successfully");
		} catch (error) {
			console.error("Failed to load question or progress utils:", error);
		}

		// Show intro view on load
		showIntro();

		// OLD TEST FUNCTIONS (kept for reference)
		// $("#check-jquery").on("click", () => {
		// 	alert("JavaScript and jQuery are working.");
		// });

		// $("#check-saving").on("click", () => {
		// 	var data = window.save.get("team06");
		// 	data.counter = data.counter ?? 0;
		// 	data.counter += 1;
		// 	$("#check-saving").text(
		// 		`This button has been pressed ${data.counter} times`
		// 	);
		// 	window.save.set("team06", data);
		// });
	});
});

// ==============================================
// Owned by Game 06
// ==============================================
("use strict");

// ==============================================
// VIEW SWITCHING FUNCTIONS
// ==============================================

// ==============================================
// Game 06 - Tick-Tock Time Game
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
 * All tiles for the current question, including tiles placed in answer slots.
 * Each tile has a unique ID and the text displayed on its button.
 * @type {Array<{id: string, text: string}>}
 */
let tiles = [];

/**
 * ID of the tile currently selected from the bank.
 * Null when no tile is selected.
 * @type {string|null}
 */
let selectedTileId = null;

/**
 * Answer slots in left-to-right order.
 * Each entry contains a tile ID, or null if the slot is empty.
 * @type {Array<string|null>}
 */
let answerSlots = [];

/**
 * Whether the current answer has been submitted.
 * Used to prevent further tile changes and duplicate submissions.
 * Reset to false when a new question loads.
 * @type {boolean}
 */
let answerSubmitted = false;

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
	const clockObj = document.getElementById("clock-object");
	if (!clockObj) return;

	function run() {
		const doc = clockObj.contentDocument;
		const win = doc?.defaultView;

		if (typeof win?.setAnalogTime !== "function") {
			return false;
		}

		fn(doc, win);
		return true;
	}

	// Update immediately if ready; otherwise wait for the clock to load.
	if (!run()) {
		clockObj.addEventListener("load", run, { once: true });
	}
}

function setupTileQuestion(q) {
	tiles = shuffleArray(
		q.tiles.map((text, index) => ({
			id: `${q.id}-tile-${index}`,
			text
		}))
	);

	selectedTileId = null;
	answerSlots = Array(q.answerTiles.length).fill(null);
	answerSubmitted = false;

	document.getElementById("tile-feedback").textContent = "";
	renderTileInterface();
}

function selectTile(tileId) {
	if (answerSubmitted) return;

	// Auto-place into the first empty slot
	const emptyIndex = answerSlots.indexOf(null);
	if (emptyIndex === -1) return; // All slots filled

	answerSlots[emptyIndex] = tileId;
	renderTileInterface();
	updateTileSubmitState();
}

function handleSlotClick(slotIndex) {
	if (answerSubmitted) return;

	// Click a filled slot to remove its tile
	if (answerSlots[slotIndex] !== null) {
		answerSlots[slotIndex] = null;
		renderTileInterface();
		updateTileSubmitState();
	}
}

/**
 * Enable Submit button only when all answer slots are filled.
 */
function updateTileSubmitState() {
	const allFilled = answerSlots.every(slot => slot !== null);
	const submitBtn = document.getElementById("submit-btn");
	if (submitBtn) submitBtn.disabled = !allFilled;
}

/**
 * Clear all answer slots and return tiles to the bank.
 */
function resetTiles() {
	if (answerSubmitted) return;
	answerSlots = answerSlots.map(() => null);
	renderTileInterface();
	updateTileSubmitState();
}



function renderTileInterface() {
	const bank = document.getElementById("tile-bank");
	const row = document.getElementById("answer-row");

	bank.replaceChildren();
	row.replaceChildren();

	// Show tiles that have not been placed in the answer row.
	tiles.forEach((tile) => {
		if (answerSlots.includes(tile.id)) return;

		const button = document.createElement("button");
		button.type = "button";
		button.className = "word-tile";
		button.textContent = tile.text;

		button.onclick = () => selectTile(tile.id);

		button.disabled = answerSubmitted;

		bank.appendChild(button);
	});

	// Show one button for each answer slot.
	answerSlots.forEach((tileId, index) => {
		const tile = tiles.find((item) => item.id === tileId);

		const slot = document.createElement("button");
		slot.type = "button";
		slot.className = "answer-slot";
		slot.textContent = tile ? tile.text : `${index + 1}. ___`;
		slot.setAttribute("aria-label", `Answer slot ${index + 1}`);

		slot.onclick = () => handleSlotClick(index);
		slot.disabled = answerSubmitted;

		row.appendChild(slot);
	});
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

	const isAdvanced = currentDifficulty === "hard";
	const answerContainer = document.getElementById("answers-container");
	const tileGame = document.getElementById("tile-game");

	// Show the appropriate answer interface for the selected level.
	answerContainer.replaceChildren();
	answerContainer.style.display = isAdvanced ? "none" : "grid";
	tileGame.hidden = !isAdvanced;

	if (isAdvanced) {
		// Advanced: display word blocks and answer slots.
		setupTileQuestion(q);
	} else {
		// Beginner and Intermediate: keep multiple-choice answers.
		const choices = shuffleArray(questionUtils.choicesForEasy(q));

		choices.forEach((choice) => {
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = choice;
			button.className = "answer-btn";
			button.onclick = () => selectAnswer(choice, button);

			answerContainer.appendChild(button);
		});
	}

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

	// Make sure Submit is visible & enabled; Next hidden; Reset only for hard
	const submitBtn = document.getElementById("submit-btn");
	const nextBtn = document.getElementById("next-btn");
	const resetBtn = document.getElementById("reset-tiles-btn");
	if (submitBtn) {
		submitBtn.style.display = "";
		submitBtn.disabled = true;
	}
	if (nextBtn) nextBtn.style.display = "none";
	if (resetBtn) resetBtn.style.display = isAdvanced ? "" : "none";
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
	const gameContainer = document.querySelector(".game-container");
	gameContainer.classList.toggle("hard-mode", level === "hard");
	// Initialize progress for all questions of this difficulty
	const levelQuestions = questionUtils.byDifficulty(currentDifficulty);
	const questionIds = levelQuestions.map((q) => q.id);

	// Reset progress so previously mastered questions can be played again
	questionIds.forEach((id) => progressUtils.resetQuestion(id));
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

	// --- Hard mode: tile game validation ---
	if (currentDifficulty === "hard") {
		if (answerSlots.some(slot => slot === null)) {
			alert("Please fill all slots before submitting.");
			return;
		}

		answerSubmitted = true;

		const q = window.currentQuestion;
		const userAnswer = answerSlots.map(tileId => {
			const tile = tiles.find(t => t.id === tileId);
			return tile ? tile.text : "";
		});

		const correct = q.answerTiles.length === userAnswer.length &&
			q.answerTiles.every((expected, i) => expected === userAnswer[i]);

		const status = window.currentSession.record(q, correct);

		if (correct) {
			score += 10;
			const scoreEl = document.getElementById("score-value");
			if (scoreEl) scoreEl.textContent = String(score);
		}

		const feedback = document.getElementById("tile-feedback");
		if (correct) {
			feedback.textContent = "✅ Correct!";
			feedback.style.color = "#4caf50";
		} else {
			feedback.textContent = `❌ Incorrect. The answer is: ${q.answerTiles.join(" ")}`;
			feedback.style.color = "#f44336";
		}

		renderTileInterface(); // Disable tile buttons

		document.getElementById("submit-btn").style.display = "none";
		document.getElementById("reset-tiles-btn").style.display = "none";
		document.getElementById("next-btn").style.display = "";
		return;
	}

	// --- Easy/Medium: MCQ validation ---
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
window.resetTiles = resetTiles;

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
		console.log("Game 06 - Tick-Tock Time initialized!");

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
		// 	var data = window.save.get("game06");
		// 	data.counter = data.counter ?? 0;
		// 	data.counter += 1;
		// 	$("#check-saving").text(
		// 		`This button has been pressed ${data.counter} times`
		// 	);
		// 	window.save.set("game06", data);
		// });
	});
});

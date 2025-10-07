// ==============================================
// Owned by Team 06
// ==============================================
"use strict";

// ==============================================
// VIEW SWITCHING FUNCTIONS
// ==============================================

// Helper function to hide all views
function hideAllViews() {
  document.querySelectorAll('.view').forEach(view => {
    view.style.display = 'none';
  });
}

// Show Intro View
function showIntro() {
  hideAllViews();
  document.getElementById('intro-view').style.display = 'block';
}

// Show Level Selection View
function showLevelSelection() {
  hideAllViews();
  document.getElementById('level-view').style.display = 'block';
}

// Show Game View
function startGame(level) {
  hideAllViews();
  document.getElementById('game-view').style.display = 'block';
  
  // Initialize game with selected level (to be implemented in game.js)
  if (typeof initializeGame === 'function') {
    initializeGame(level);
  }
}
// ==============================================
//  Summary / Finish View (Updated)
// ==============================================

// Show Summary View (after all questions are done)
function showSummary(finalScore) {
  hideAllViews();
  document.getElementById('summary-view').style.display = 'block';

  // If score element exists, update text
  const scoreElement = document.getElementById("final-score");
  if (scoreElement) scoreElement.textContent = finalScore ?? 0;

  // Optional: dynamic feedback text
  const summarySubtitle = document.querySelector(".summary-subtitle");
  if (summarySubtitle) {
    if (finalScore >= 90) summarySubtitle.textContent = "🥇 Excellent! You mastered this topic perfectly!";
    else if (finalScore >= 60) summarySubtitle.textContent = "🥈 Great job! Keep practicing!";
    else summarySubtitle.textContent = "🥉 Good effort! Try again to improve!";
  }
}

// Restart Game
function restartGame() {
  // Reset game-related variables (if declared globally)
  if (typeof resetGame === 'function') {
    resetGame();
  }

  hideAllViews();
  document.getElementById('game-view').style.display = 'block';
}
// Show Finish View
function showFinish() {
  hideAllViews();
  document.getElementById('summary-view').style.display = 'block';
  
  // Display final results (to be implemented in game.js)
  if (typeof displayResults === 'function') {
    displayResults();
  }
}

// Submit Answer (placeholder for backend team to implement)
function submitAnswer() {
  console.log("Submit answer clicked - to be implemented by backend team");
  // TODO: Backend team - implement answer checking logic here
}
// Expose functions globally (for HTML onclick & console testing)
window.showSummary = showSummary;
window.startGame = startGame;
window.showLevelSelection = showLevelSelection;
window.showIntro = showIntro;
window.submitAnswer = submitAnswer;
window.restartGame = restartGame;
window.showFinish = showFinish;

// ==============================================
// INITIALIZATION
// ==============================================

$(function () {
	window.vocabulary.when_ready(function () {
		// These are only dummy functions and can be removed.
		$("#check-jquery").on("click", () => {
			alert("JavaScript and jQuery are working.");
		});

		$("#display-vocab").text(
			JSON.stringify(window.vocabulary.get_random())
		);

		$("#check-saving").on("click", () => {
			var data = window.save.get("team06");
			data.counter = data.counter ?? 0;
			data.counter += 1;
			$("#check-saving").text(
				`This button has been pressed ${data.counter} times`
			);
			window.save.set("team06", data);
		});

		const clockObj = document.getElementById("clock-frame");
		function withClockDoc(fn) {
			if (!clockObj) return;
			if (clockObj.contentDocument) {
				fn(clockObj.contentDocument, clockObj.contentWindow);
			} else {
				clockObj.addEventListener("load", () =>
					fn(clockObj.contentDocument, clockObj.contentWindow)
				);
			}
		}

		$("#test-fetch").on("click", () => {
			fetch("./questions.json")
				.then((r) => r.json())
				.then((data) => {
					const q = data.qs[0].questions[0];
					document.getElementById("question").textContent = q.en;

					withClockDoc((doc, win) => {
						if (typeof win.setAnalogTime === "function") {
							win.setAnalogTime(q.hour, q.minute);
						} else {
							console.warn("No setAnalogTime in clock.html");
						}
					});
				})
				.catch((err) => {
					console.error(err);
					document.getElementById("question").textContent =
						"Failed to load questions.";
				});
		});
	});
});

// ==============================================
// Owned by Team 10
// ==============================================

"use strict";

import { loadProgress, resetProgress } from './dev-tools/cookies.js';

$(function() {window.vocabulary.when_ready(function () {

  // These are only dummy functions and can be removed.
  $("#check-jquery").on("click", () => {
    alert("JavaScript and jQuery are working.");
  });

  $("#display-vocab").text(JSON.stringify(window.vocabulary.get_random()));

  $("#check-saving").on("click", () => {
    var data = window.save.get("team10");
    data.counter = data.counter ?? 0;
    data.counter += 1;
    $("#check-saving").text(`This button has been pressed ${data.counter} times`);
    window.save.set("team10", data);
  });

})});

document.addEventListener('DOMContentLoaded', () => {
    const userProgress = loadProgress(); // From cookies.js
    const currentLevel = userProgress.currentLevel;

    updateProgressBar(userProgress);

    const level2Link = document.getElementById('level-2-link');
    const level3Link = document.getElementById('level-3-link');

    // Check and lock Level 2
    if (currentLevel < 2) {
        lockLevel(level2Link, 2);
    }

    // Check and lock Level 3
    if (currentLevel < 3) {
        lockLevel(level3Link, 3);
    }

    const resetButton = document.getElementById('reset-progress-btn');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Ask the user to confirm before deleting everything
            if (confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
                resetProgress(); // This function is from cookies.js
                // Clear all stats for team
                save.stats.clear("team10");
                alert('Your progress has been reset.');
                location.reload(); // Reload the page to update the UI
            }
        });
    }
});

/**
 * Calculates and updates the visual progress bar based on completed levels.
 * @param {{currentLevel: number, levelScores: object}} progress - The user's progress object.
 */
function updateProgressBar(progress) {
    let levelsCompleted = 0;
    const scoreToComplete = 10; // The score needed to pass a level

    if (progress.levelScores[1] >= scoreToComplete) {
        levelsCompleted++;
    }
    if (progress.levelScores[2] >= scoreToComplete) {
        levelsCompleted++;
    }
    if (progress.levelScores[3] >= scoreToComplete) {
        levelsCompleted++;
    }

    const totalLevels = 3;
    const completionPercentage = (levelsCompleted / totalLevels) * 100;

    const progressBarInner = document.querySelector('.progress-bar-inner');
    if (progressBarInner) {
        progressBarInner.style.width = completionPercentage + '%';
    }
}

/**
 * Disables a level link, adds a 'locked' class, and shows an alert on click.
 * @param {HTMLElement} linkElement - The <a> tag for the level.
 * @param {number} requiredLevel - The level required to unlock.
 */
function lockLevel(linkElement, requiredLevel) {
    if (!linkElement) return;

    const button = linkElement.querySelector('button');
    
    // Add a 'locked' class for styling
    button.classList.add('locked');
    button.innerHTML += ' <i class="fa fa-lock"></i>'; // Adds a lock icon

    // Prevent clicking
    linkElement.href = 'javascript:void(0)';

    // Show a message on click
    linkElement.addEventListener('click', (e) => {
        e.preventDefault(); // Stop navigation
        alert(`You must complete Level ${requiredLevel - 1} to unlock this!`);
    });
}
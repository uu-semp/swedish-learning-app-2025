// ==============================================
// Owned by Team 10
// ==============================================

"use strict";

import {loadProgress, saveProgress} from '../dev-tools/cookies.js'

$(function() {
    window.vocabulary.when_ready(function () {
        // Game state variables
        let score = 0;
        let questionsAnswered = 0;
        const totalQuestions = 10;
        let currentCorrectAnswer = false; // Is the current question's correct answer "TRUE"?

        // Game Setup 
        function nextQuestion() {
            if (questionsAnswered >= totalQuestions) {
                endGame();
                return;
            }

            const foodIds = window.vocabulary.get_category("food");
            
            // 50% chance to show a correct pair (True) or incorrect pair (False)
            if (Math.random() > 0.5) {
                // --- TRUE Case ---
                const randomId = foodIds[Math.floor(Math.random() * foodIds.length)];
                const vocab = window.vocabulary.get_vocab(randomId);
                
                $('.item-image').attr('src', `../../${vocab.img}`); // Make sure image path is correct
                $('.item-word').text(vocab.sv);
                currentCorrectAnswer = true;

            } else {
                // --- FALSE Case ---
                const id1 = foodIds[Math.floor(Math.random() * foodIds.length)];
                let id2 = foodIds[Math.floor(Math.random() * foodIds.length)];
                // Ensure we have two different items
                while (id1 === id2) {
                    id2 = foodIds[Math.floor(Math.random() * foodIds.length)];
                }
                const vocab1 = window.vocabulary.get_vocab(id1); // For the image
                const vocab2 = window.vocabulary.get_vocab(id2); // For the word

                $('.item-image').attr('src', `../../${vocab1.img}`);
                $('.item-word').text(vocab2.sv);
                currentCorrectAnswer = false;
            }
            questionsAnswered++;
        }

        // --- Answer Handling ---
        function checkAnswer(userAnswer) {
            // userAnswer is true if they clicked "TRUE", false if "FALSE"
            if (userAnswer === currentCorrectAnswer) {
                score++;
                // Optional: Add visual feedback for correct answer
                $('body').css('background-color', '#d4edda').animate({backgroundColor: '#f0f0f0'}, 200);
            } else {
                // Optional: Add visual feedback for incorrect answer
                $('body').css('background-color', '#f8d7da').animate({backgroundColor: '#f0f0f0'}, 200);
            }
            
            // Load the next question after a short delay
            setTimeout(nextQuestion, 300);
        }

        // --- End Game and Save Progress ---
        function endGame() {
            let progress = loadProgress(); // From cookies.js
            
            // Update score for level 1
            progress.levelScores[1] += score;
            let totalScore = progress.levelScores[1];
            // Check if they passed and can advance
            alert(`You got ${score} correct! Your total score is now ${totalScore}/10`);
            if (totalScore >= 10 && progress.currentLevel === 1) {
                progress.currentLevel = 2; // Advance to level 2
                save.stats.setCompletion("team10", 33); // Update main stats
                window.location.href = '../advance-next-level/advance-next-level2.html';
            } else {
                window.location.href = '../index.html';
            }

            saveProgress(progress); // Save the updated progress to the cookie
        }

        // --- Event Listeners ---
        $('.true-btn').on('click', () => checkAnswer(true));
        $('.false-btn').on('click', () => checkAnswer(false));

        // --- Start the Game ---
        nextQuestion();
    });
});

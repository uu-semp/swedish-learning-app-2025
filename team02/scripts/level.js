const TEAM_NAME = "team02";
const LEARNED_WORDS_KEY = "learnedWords";
if (!window.save.get(TEAM_NAME, LEARNED_WORDS_KEY)) {
    window.save.set(TEAM_NAME, LEARNED_WORDS_KEY, []);
}
let learnedWords = save.get(TEAM_NAME, LEARNED_WORDS_KEY);

let remainingQuestions = [];
window.currentQuestion = null;
let currentQuestionAttempts = 0; // Track attempts for current question
let totalScore = 0; // Track total score (first-try correct answers)

const urlParams = new URLSearchParams(window.location.search);
const levelIndex = urlParams.get("level") || "1";

document.title = `Level ${levelIndex}`;
const header = document.querySelector("header h1");
if (header) header.textContent = `Welcome to Level ${levelIndex}`;

// Add 6th and 7th tiles only for level 3
if (levelIndex === "3") {
    document.addEventListener('DOMContentLoaded', function() {
        const floor = document.querySelector('.floor');
        
        // Add 6th tile
        const sixthTile = document.createElement('div');
        sixthTile.className = 'floor-tile';
        sixthTile.setAttribute('data-index', '5');
        floor.appendChild(sixthTile);
        
        // Add 7th tile
        const seventhTile = document.createElement('div');
        seventhTile.className = 'floor-tile';
        seventhTile.setAttribute('data-index', '6');
        floor.appendChild(seventhTile);
    });
}

function loadLevelQuestions(level) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `./scripts/level${level}Questions.js`;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load level${level}Questions.js`));
        document.head.appendChild(script);
    });
}

function showRandomQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';
    if (remainingQuestions.length === 0) {
        // Store final score in localStorage before redirecting
        console.log('Game completed! Final score:', totalScore);
        window.save.stats.incrementWin(TEAM_NAME);
        localStorage.setItem('gameScore', totalScore);
        const requiredScore = levelIndex === "3" ? 7 : 5; // Level 3 has 7 questions, others have 5
        if (totalScore === requiredScore) {
            // Mark this level as passed
            window.save.set(TEAM_NAME, `level${levelIndex}Passed`, 1);
        }
        localStorage.setItem('gameLevel', `Level ${levelIndex}`);
        console.log('Stored in localStorage - Score:', totalScore, `Level: Level ${levelIndex}`);
        // Redirect to summary page when done
        window.location.href = "./summary.html";
        return;
    }

    // Take the first question from the remaining questions (they come in order from the group)
    window.currentQuestion = remainingQuestions.shift();
    currentQuestionAttempts = 0; // Reset attempts for new question
    const div = document.createElement('div');
    div.className = 'question-block';
    div.innerHTML = `
                <div class="question-content">
                    <p>${currentQuestion.question}</p>
                    <button id="hint-button" class="btn hint-btn">Need a hint?</button>
                </div>`;
    questionsContainer.appendChild(div);
    const hintButton = div.querySelector('#hint-button');
    hintButton.addEventListener('click', () => {
        const modal = document.getElementById('hintModal');
        const hintText = document.getElementById('hintText');
        hintText.textContent = `${window.currentQuestion.swedish} => ${window.currentQuestion.answer}.`;
        modal.style.display = 'flex'; // show modal with flex centering
    });
}

const questionsLoaded = loadLevelQuestions(levelIndex).then(() => {
    if (typeof getRandomQuestions !== "undefined") {
        remainingQuestions = getRandomQuestions();
    } else {
        return Promise.reject(new Error("getRandomQuestions is not defined in the loaded script"));
    }
});

document.addEventListener('DOMContentLoaded', function () {
    questionsLoaded.then(() => {
        showRandomQuestion();
    }).catch(err => {
        console.error(err);
    });

    // Function to set up drag and drop for floor tiles
    function setupFloorTileDragDrop(tile) {
        tile.addEventListener('dragover', e => {
            e.preventDefault();
            tile.classList.add('highlight-drop');
        });

        tile.addEventListener('dragleave', e => {
            tile.classList.remove('highlight-drop');
        });

        tile.addEventListener('drop', e => {
            e.preventDefault();
            tile.classList.remove('highlight-drop');

            const draggedElementId = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(draggedElementId);

            if (draggedElement) {
                tile.appendChild(draggedElement);
                const dropEvent = new CustomEvent('DropFromSidebar', {
                    detail: { dataset: draggedElement.dataset }
                });
                document.getElementById('workspace').dispatchEvent(dropEvent);
            }
        });
    }

    // Set up drag and drop for existing floor tiles
    const floorTiles = document.querySelectorAll('.floor-tile');
    floorTiles.forEach(setupFloorTileDragDrop);

    // Set up drag and drop for 6th and 7th tiles if they get added for level 3
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList && node.classList.contains('floor-tile') && (node.dataset.index === '5' || node.dataset.index === '6')) {
                        setupFloorTileDragDrop(node);
                    }
                });
            }
        });
    });
    observer.observe(document.querySelector('.floor'), { childList: true });

    document.addEventListener('AnswerCorrect', e => {
        console.log("Answer is correct!. Showing next question...");
        // Award point only if this was the first attempt (no incorrect attempts yet)
        if (currentQuestionAttempts === 0) {
            if (!learnedWords.includes(window.currentQuestion.swedish)) {
                learnedWords.push(window.currentQuestion.swedish);
                save.set(TEAM_NAME, LEARNED_WORDS_KEY, learnedWords);
            }
            totalScore++;
            console.log("First-try correct! Score:", totalScore);
        }
        setTimeout(showRandomQuestion, 300);
    });

    document.addEventListener('AnswerIncorrect', e => {
        currentQuestionAttempts++;
        console.log("Answer is not correct! Reason: ", e.detail.reason, "Attempt:", currentQuestionAttempts);
    })
});

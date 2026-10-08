const TEAM_NAME = "game03";
const LEARNED_WORDS_KEY = "learnedWords";
const saveStore = window.save || {
    get: () => ({}),
    set: () => false,
};

if (!saveStore.get(TEAM_NAME, LEARNED_WORDS_KEY)) {
    saveStore.set(TEAM_NAME, LEARNED_WORDS_KEY, []);
}
let learnedWords = saveStore.get(TEAM_NAME, LEARNED_WORDS_KEY) || [];

let remainingQuestions = [];
window.currentQuestion = null;
let currentQuestionAttempts = 0; // Track attempts for current question
let questionCount = 0; // Number of questions in the current round
let totalScore = 0; // Track total score (first-try correct answers)

const urlParams = new URLSearchParams(window.location.search);
const levelIndex = urlParams.get("level") || "1";
const selectedRoom = urlParams.get("room") || localStorage.getItem('gameRoom') || 'office';
const shouldResetLevel = urlParams.get("reset") === "true";
const colourPractice = urlParams.get("colours") === "on";

const colourTargets = {
    office: { answer: 'chair', colour: 'green', swedish: 'stol', colouredSwedish: 'grön stol', definite: 'stolen', colouredDefinite: 'den gröna stolen', english: 'green chair' },
    livingroom: { answer: 'couch', colour: 'blue', swedish: 'soffa', colouredSwedish: 'blå soffa', definite: 'soffan', colouredDefinite: 'den blå soffan', english: 'blue couch' },
    bedroom: { answer: 'carpet', colour: 'blue', swedish: 'matta', colouredSwedish: 'blå matta', definite: 'mattan', colouredDefinite: 'den blå mattan', english: 'blue carpet' },
    kitchen: { answer: 'table', colour: 'red', swedish: 'bord', colouredSwedish: 'rött bord', definite: 'bordet', colouredDefinite: 'det röda bordet', english: 'red table' },
    bathroom: { answer: 'cupboard', colour: 'green', swedish: 'skåp', colouredSwedish: 'grönt skåp', definite: 'skåpet', colouredDefinite: 'det gröna skåpet', english: 'green cupboard' }
};

const bathroomFallback = { answer: 'towel', colour: 'blue', swedish: 'handduk', colouredSwedish: 'blå handduk', definite: 'handduken', colouredDefinite: 'den blå handduken', english: 'blue towel' };

if (selectedRoom) {
    localStorage.setItem('gameRoom', selectedRoom);
}

function resetLevelSessionState() {
    remainingQuestions = [];
    window.currentQuestion = null;
    currentQuestionAttempts = 0;
    totalScore = 0;
    if (typeof window.resetSelectedGroup === "function") {
        window.resetSelectedGroup();
    }
}

if (shouldResetLevel) {
    resetLevelSessionState();
}

function addColourPractice(questions) {
    if (!colourPractice) return questions;

    let target = colourTargets[selectedRoom];
    if (selectedRoom === 'bathroom' && !questions.some(question => question.answer === target.answer)) {
        target = bathroomFallback;
    }

    return questions.map(question => {
        if (!target || question.answer !== target.answer) return question;

        const word = levelIndex === '1' ? `'${target.swedish}'` : target.definite;
        const colouredWord = levelIndex === '1' ? `'${target.colouredSwedish}'` : target.colouredDefinite;
        const colouredQuestion = question.question.replace(word, colouredWord);
        if (colouredQuestion === question.question) return question;

        return {
            ...question,
            question: colouredQuestion,
            colour: target.colour,
            hint: `${target.colouredSwedish} means ${target.english}. ${question.hint}`
        };
    });
}

// Wall and floor look comes from the room (see .room-* in room.css)
document.querySelector('.room-container').classList.add(`room-${selectedRoom}`);

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
        const oldQuestionFunction = window.getRandomQuestions;
        const oldDistractorFunction = window.getRandomDistractorImages;
        window.getRandomQuestions = undefined;
        window.getRandomDistractorImages = undefined;

        const script = document.createElement("script");
        script.src = `./scripts/level${level}Questions.js`;
        script.async = false;
        script.onload = () => {
            if (typeof window.getRandomQuestions !== "function") {
                window.getRandomQuestions = oldQuestionFunction;
                window.getRandomDistractorImages = oldDistractorFunction;
                reject(new Error(`getRandomQuestions is not defined after loading level${level}Questions.js`));
                return;
            }
            resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load level${level}Questions.js`));
        document.head.appendChild(script);
    });
}

// Remember this room + level as passed and update the overall completion.
// Every room in ROOM_GROUP_INDEX (including the bathroom) counts towards 100 %.
function markPassed() {
    const passed = window.save.get(TEAM_NAME, "passed") || {};
    passed[`${selectedRoom}-${levelIndex}`] = 1;
    window.save.set(TEAM_NAME, "passed", passed);

    const rooms = Object.keys(ROOM_GROUP_INDEX);
    const total = rooms.length * 3;
    const done = rooms.flatMap(room => [1, 2, 3].map(level => `${room}-${level}`)).filter(key => passed[key]).length;
    window.save.stats.setCompletion(TEAM_NAME, Math.round((done / total) * 100));
}

function showRandomQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';
    if (remainingQuestions.length === 0) {
        // Store final score in localStorage before redirecting
        console.log('Game completed! Final score:', totalScore);
        localStorage.setItem('gameScore', totalScore);
        // Only a perfect round counts as passed (and as a win)
        if (totalScore === questionCount) {
            window.save.stats.incrementWin(TEAM_NAME);
            markPassed();
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
    document.dispatchEvent(new CustomEvent('QuestionChanged', { detail: window.currentQuestion }));
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
        hintText.textContent = window.currentQuestion.hint || `${window.currentQuestion.swedish} => ${window.currentQuestion.answer}.`;
        modal.style.display = 'flex'; // show modal with flex centering
    });
}

export const questionsLoaded = (async () => {
    await loadLevelQuestions(levelIndex);

    if (typeof window.resetSelectedGroup === "function") {
        window.resetSelectedGroup();
    }

    if (typeof window.getRandomQuestions !== "function") {
        throw new Error("getRandomQuestions is not defined in the loaded script");
    }

    const selectedQuestions = addColourPractice(window.getRandomQuestions());
    if (!Array.isArray(selectedQuestions) || selectedQuestions.length === 0) {
        throw new Error(`No questions were returned for level ${levelIndex}`);
    }

    remainingQuestions = [...selectedQuestions];
    questionCount = selectedQuestions.length;
    return selectedQuestions;
})();

document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    if (header && typeof createHowToPlayModal === 'function') {
        createHowToPlayModal(false, header);
    }

    questionsLoaded.then(() => {
        // A room without questions yet (e.g. bathroom): explain instead of counting an instant win
        if (remainingQuestions.length === 0) {
            document.getElementById('questions-container').innerHTML = `
                <div class="question-block">
                    <div class="question-content">
                        <p>Inga fr&aring;gor f&ouml;r det h&auml;r rummet &auml;n &ndash; no questions for this room yet.</p>
                        <a class="btn" href="./index.html">&larr; Tillbaka till menyn</a>
                    </div>
                </div>`;
            return;
        }
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
                saveStore.set(TEAM_NAME, LEARNED_WORDS_KEY, learnedWords);
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

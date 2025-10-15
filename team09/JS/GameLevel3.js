// ==============================================
// Level 3: Type the correct article and word (fixed logic)
// ==============================================

const CATEGORY = "clothing";
const TOTAL_QUESTIONS = 10;

const imgEl = document.getElementById("vocabImg");
const progressEl = document.getElementById("progress");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");
const resultPopup = document.getElementById("resultPopup");
const submitBtn = document.getElementById("submitBtn");
const articleInput = document.getElementById("articleInput");
const wordInput = document.getElementById("wordInput");
const nextBtn = document.getElementById("nextBtn");

let allIds = [];
let unusedIds = [];
let currentWord = null;
let progress = 0;
let totalMistakes = 0;

// === Help popup ===
helpBtn.addEventListener("click", () => {
  helpPopup.classList.remove("hidden");
});
closeHelp.addEventListener("click", () => {
  helpPopup.classList.add("hidden");
});

// === Navigation ===
function goBacktoLevelSelectpage() {
  window.location.href = "../Views/levelSelect.html";
}
function goBacktomainpage() {
  window.location.href = "../index.html";
}

// === Utils ===
function shuffled(arr) {
  return arr.map(v => [Math.random(), v])
            .sort((a,b)=>a[0]-b[0])
            .map(x=>x[1]);
}

function normalizeAssetUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url; // 網址不動
  return url.startsWith("/") ? url : "/" + url;
}


function renderRound() {
  if (progress >= TOTAL_QUESTIONS) {
    showResult();
    return;
  }

  if (unusedIds.length === 0) unusedIds = shuffled(allIds.slice());
  const id = unusedIds.pop();

  const word = window.vocabulary.get_vocab(id);
  if (!word || !word.sv || !word.img) {
    console.warn("⚠️ Skipping invalid vocab:", id, word);
    renderRound();
    return;
  }

  currentWord = word;

  imgEl.src = normalizeAssetUrl(word.img);
  imgEl.alt = word.en || "";

  articleInput.value = "";
  wordInput.value = "";
  articleInput.style.borderColor = "#000000";
  wordInput.style.borderColor = "#000000";
  articleInput.disabled = false;
  wordInput.disabled = false;
  submitBtn.disabled = false;
  nextBtn.classList.add("hidden");

  document.getElementById("gameFeedback").innerHTML = 
    `Type the Swedish word for <b>${word.en}</b>.`;
}

submitBtn.addEventListener("click", () => {
  if (!currentWord) return;

  const userArticle = articleInput.value.trim().toLowerCase();
  const userWord = wordInput.value.trim().toLowerCase();

  const correctArticle = currentWord.article?.trim().toLowerCase() || "";
  const correctWord = currentWord.sv?.trim().toLowerCase() || "";

  articleInput.disabled = true;
  wordInput.disabled = true;
  submitBtn.disabled = true;


  const articleCorrect =
    (!correctArticle && userArticle === "") || (userArticle === correctArticle);
  const wordCorrect = userWord === correctWord;

  
  if (articleCorrect && wordCorrect) {
    articleInput.style.borderColor = "#5cb85c"; 
    wordInput.style.borderColor = "#5cb85c";
    document.getElementById("gameFeedback").innerHTML = `✅ Correct! Good job!`;
  } else {
    totalMistakes++;
    articleInput.style.borderColor = articleCorrect ? "#5cb85c" : "#d9534f"; // 紅/綠提示
    wordInput.style.borderColor = wordCorrect ? "#5cb85c" : "#d9534f";

    
    const correctAnswer = correctArticle ? `${correctArticle} ${correctWord}` : correctWord;
    document.getElementById("gameFeedback").innerHTML =
      `❌ Correct answer: <b>${correctAnswer}</b>`;
  }


  progress++;
  updateProgress();
  nextBtn.classList.remove("hidden");
});


nextBtn.addEventListener("click", () => {
  renderRound();
});

function updateProgress() {
  const ratio = progress / TOTAL_QUESTIONS;
  progressEl.style.width = `${ratio * 100}%`;
}

// === Result popup ===
function showResult() {
  const mistakeInfo = document.getElementById("mistakeInfo");
  const resultTitle = document.getElementById("resultTitle");
  const starContainer = document.getElementById("starContainer");

  const correctAnswers = TOTAL_QUESTIONS - totalMistakes;
  let stars = 0, message = "";

  if (correctAnswers >= 8) {
    stars = 3; message = "Fantastic typing! You nailed it!";
  } else if (correctAnswers >= 6) {
    stars = 2; message = "Great work! Just a few mistakes!";
  } else if (correctAnswers >= 3) {
    stars = 1; message = "Keep practicing! You’re getting there!";
  } else {
    stars = 0; message = "Don’t worry! Try again and improve!";
  }

  const fullStar = "⭐", emptyStar = "☆";
  starContainer.innerHTML = fullStar.repeat(stars) + emptyStar.repeat(3 - stars);
  resultTitle.textContent = message;
  mistakeInfo.innerHTML = 
    `You answered <b>${correctAnswers}</b> of <b>${TOTAL_QUESTIONS}</b> correctly.`;

  resultPopup.classList.remove("hidden");

  // === Save progress ===
  const params = new URLSearchParams(window.location.search);
  const currentLevel = parseInt(params.get("level") || "3");
  const TEAM_KEY = `Team09-Level${currentLevel}`;

  const completion = Math.round((correctAnswers / TOTAL_QUESTIONS) * 100);
  window.save.stats.setCompletion(TEAM_KEY, completion);
  window.save.stats.incrementWin(TEAM_KEY);

  const oldBest = window.save.get(TEAM_KEY, "bestScore") || 0;
  if (correctAnswers > oldBest) {
    window.save.set(TEAM_KEY, "bestScore", correctAnswers);
  }

  document.getElementById("playAgainBtn").onclick = () => {
    resultPopup.classList.add("hidden");
    start();
  };

  document.getElementById("closeResult").onclick = () => {
    resultPopup.classList.add("hidden");
  };

  document.getElementById("nextLevelBtn").onclick = () => {
    const params = new URLSearchParams(window.location.search);
    const currentLevel = parseInt(params.get("level") || "3");

    if (currentLevel >= 3) {
      
      alert("🎉 You have completed all available levels! Great job!");
    } else {
     
      const nextLevel = currentLevel + 1;
      window.location.href = `../Views/Levelview.html?level=${nextLevel}`;
    }
  };
}

// === Start game ===
function start() {
  progress = 0;
  totalMistakes = 0;
  resultPopup.classList.add("hidden");
  updateProgress();

  window.vocabulary.when_ready(() => {
    const ids = window.vocabulary.get_category(CATEGORY) || [];
    
    allIds = ids.filter(id => {
      const v = window.vocabulary.get_vocab(id);
      return v && v.sv && v.img; 
    });
    unusedIds = shuffled(allIds.slice());
    renderRound();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

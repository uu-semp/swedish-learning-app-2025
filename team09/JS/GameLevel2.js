const CATEGORY = "clothing";
const TOTAL_QUESTIONS = 10; 

const imgEl = document.getElementById("vocabImg");
const optsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progressEl = document.getElementById("progress");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");
const resultPopup = document.getElementById("resultPopup");

let allIds = [];
let unusedIds = [];
let currentCorrectId = null;
let progress = 0;      
let totalMistakes = 0;            
let mistakeDetails = {};          


helpBtn.addEventListener("click", () => {
  helpPopup.classList.remove("hidden");
});
closeHelp.addEventListener("click", () => {
  helpPopup.classList.add("hidden");
});

function goBacktoLevelSelectpage() {
    
  window.location.href = "../Views/levelSelect.html";
}

function shuffled(arr) {
  return arr.map(v => [Math.random(), v])
            .sort((a,b)=>a[0]-b[0])
            .map(x=>x[1]);
}
function sampleDistinct(pool, count, excludeSet = new Set()) {
  const src = pool.filter(x => !excludeSet.has(x));
  return shuffled(src).slice(0, count);
}
function getLabel(vocab) {
  const article = vocab.article ? vocab.article + " " : "";
  return (article + (vocab.sv || "")).trim();
}
function normalizeAssetUrl(url) {
  if (!url) return "";
  return url.startsWith("/") ? url : "/" + url;
}


function renderRound() {
    if (progress >= TOTAL_QUESTIONS) {
      showResult();
      return;
    }
  
    if (unusedIds.length === 0) unusedIds = shuffled(allIds.slice());
    currentCorrectId = unusedIds.pop();
  
    const correct = window.vocabulary.get_vocab(currentCorrectId);
    if (!correct.article || !correct.sv) {
      renderRound(); 
      return;
    }
  
    const correctPhrase = `${correct.article} ${correct.sv}`;
    const wrongArticle = correct.article === "en" ? "ett" : "en";
    const wrongPhrase = `${wrongArticle} ${correct.sv}`;
  
    
    const distractorIds = sampleDistinct(allIds, 6, new Set([currentCorrectId]));
    const distractors = distractorIds
      .map(id => window.vocabulary.get_vocab(id))
      .filter(v => v.article)
      .slice(0, 2)
      .map(v => `${v.article} ${v.sv}`);
  
   
    const options = shuffled([
      { text: correctPhrase, correct: true },
      { text: wrongPhrase, correct: false },
      ...distractors.map(d => ({ text: d, correct: false }))
    ]);
  
    imgEl.src = normalizeAssetUrl(correct.img);
    imgEl.alt = correct.en || correct.sv;
  
    optsEl.innerHTML = "";
    for (const opt of options) {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.textContent = opt.text;
      btn.addEventListener("click", () => onPick(btn, opt.correct));
      optsEl.appendChild(btn);
    }
  
    nextBtn.classList.add("hidden");
  }
  


function onPick(clickedBtn, isCorrect) {
  const buttons = [...optsEl.querySelectorAll(".option")];

  
  buttons.forEach(b => b.disabled = true);

  if (isCorrect) {
    clickedBtn.classList.add("correct");
  } else {
    totalMistakes++;
    mistakeDetails[currentCorrectId] = (mistakeDetails[currentCorrectId] || 0) + 1;

    clickedBtn.classList.add("wrong");
    const correctText = getLabel(window.vocabulary.get_vocab(currentCorrectId));
    const correctBtn = buttons.find(b => b.textContent === correctText);
    if (correctBtn) correctBtn.classList.add("correct");
  }

 
  progress++;
  updateProgress();
  nextBtn.classList.remove("hidden");
}


function updateProgress() {
  const ratio = progress / TOTAL_QUESTIONS;
  progressEl.style.width = `${ratio * 100}%`;
}

nextBtn.addEventListener("click", renderRound);


function showResult() {
  const mistakeInfo = document.getElementById("mistakeInfo");
  const resultTitle = document.getElementById("resultTitle");
  const starContainer = document.getElementById("starContainer");

  
  let stars = 0;
  let message = "";
  const correctAnswers = TOTAL_QUESTIONS - totalMistakes;
  if (correctAnswers >= 8) {
    stars = 3;
    message = "Amazing! You’re a Swedish star!";
  } else if (correctAnswers >= 6) {
    stars = 2;
    message = "Great work! Just a few more to be perfect.";
  } else if (correctAnswers >= 3) {
    stars = 1;
    message = "Nice try! Keep practicing and you’ll shine.";
  } else {
    stars = 0;
    message = "Don’t worry! Review and try again.";
  }

  const fullStar = "⭐";
  const emptyStar = "☆";
  starContainer.innerHTML = fullStar.repeat(stars) + emptyStar.repeat(3 - stars);
  resultTitle.textContent = message;
  mistakeInfo.innerHTML = `You answered <b>${correctAnswers}</b> out of <b>${TOTAL_QUESTIONS}</b> correctly.`;

  resultPopup.classList.remove("hidden");

  const params = new URLSearchParams(window.location.search);
  const currentLevel = parseInt(params.get("level") || "1");
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
  const currentLevel = parseInt(params.get("level") || "1");
  const nextLevel = currentLevel + 1;
  window.location.href = `../Views/AdvancedLevelview.html?level=${nextLevel}`;
};

}

function goBacktomainpage() {
    
  window.location.href = "../index.html";
}
function start() {
  progress = 0;
  totalMistakes = 0;
  mistakeDetails = {};
  updateProgress();
  resultPopup.classList.add("hidden");

  window.vocabulary.when_ready(function () {
    const ids = window.vocabulary.get_category(CATEGORY) || [];
    if (ids.length < 4) return;
    allIds = ids.slice();
    unusedIds = shuffled(allIds.slice());
    renderRound();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}



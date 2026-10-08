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

// Level 2 instructions (level-view.html is shared with level 1, so set the text here)
const helpText = helpPopup.querySelector("p");
if (helpText) helpText.textContent = "First choose the right article (en or ett), then choose the clothing item matching the image!";

// Level-2-only styles. They live here (not in level-view.css) so they always load
// together with this script and never affect level 1, which shares level-view.html.
const LEVEL2_CSS = `
.quiz.level2 {
  justify-content: safe center;
  overflow-y: auto;
  padding: 10px 16px;
}
.quiz.level2 .image-area {
  width: min(300px, 55vw);
  height: clamp(110px, 22vh, 200px);
  margin-top: clamp(8px, 4vh, 40px);
  margin-bottom: clamp(8px, 1.5vh, 16px);
  flex-shrink: 0;
}
.quiz.level2 .options {
  gap: clamp(8px, 1.6vh, 16px) clamp(16px, 4vw, 50px);
  width: min(70%, 760px);
}
.quiz.level2 .option {
  padding: clamp(10px, 1.8vh, 20px);
}
.quiz.level2 .bottom {
  margin-top: clamp(10px, 2vh, 24px);
  flex-shrink: 0;
}

/* Phrase being built: [ en ] [ jacka ] */
.l2-phrase {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 12px;
}
.l2-slot {
  min-width: 70px;
  padding: 4px 16px;
  border-radius: 14px;
  border: 3px dashed rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.6);
  font-size: clamp(20px, 3vh, 26px);
  font-weight: bold;
  text-align: center;
  transition: background 0.3s ease, border-color 0.3s ease;
}
.l2-slot-word { min-width: 130px; }
.l2-slot.active { border-color: #b08968; color: white; animation: l2-pulse 1.2s ease-in-out infinite; }
.l2-slot.filled { border-style: solid; border-color: white; color: white; animation: none; }
.l2-slot.right { background: #2ecc71; border-color: #2ecc71; }
.l2-slot.wrong { background: #e74c3c; border-color: #e74c3c; }
@keyframes l2-pulse { 50% { transform: scale(1.06); } }

/* Step labels: (1) Choose en or ett   (2) Choose the word */
.l2-step {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: clamp(16px, 2.2vh, 20px);
  font-weight: bold;
  opacity: 0.5;
  transition: opacity 0.3s ease;
  margin-bottom: -4px;
}
.l2-step.active, .l2-step.done { opacity: 1; }
.l2-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #b08968;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
}
.l2-step.done .l2-badge { background: #2ecc71; }

/* Article picked (before checking) */
.quiz.level2 .option.selected {
  outline: 4px solid #b08968;
  outline-offset: 3px;
}
/* Words waiting for step 1 */
.quiz.level2 .option.locked {
  opacity: 0.45;
  cursor: not-allowed;
}
.quiz.level2 .option:disabled:hover { transform: none; }
.quiz.level2 .option:disabled:not(.locked) { cursor: default; }

/* Short frames */
@media (max-height: 560px) {
  .quiz.level2 { padding-top: 6px; padding-bottom: 6px; }
  .quiz.level2 .bottom { margin-top: 8px; margin-bottom: 0; }
  .l2-step { font-size: 15px; }
  .l2-badge { width: 24px; height: 24px; font-size: 14px; }
  .l2-slot { padding: 2px 14px; }
}

/* Phones (image sits between the ⬅ / ? buttons, so push it below them) */
@media (max-width: 420px) {
  .quiz.level2 .image-area { margin-top: 60px; }
}
@media (max-width: 600px) {
  .quiz.level2 .options { width: 100%; }
  .quiz.level2 .option { font-size: 18px; border-radius: 22px; }
  .l2-slot-word { min-width: 100px; }
}
`;
if (!document.getElementById("level2-styles")) {
  const styleTag = document.createElement("style");
  styleTag.id = "level2-styles";
  styleTag.textContent = LEVEL2_CSS;
  document.head.appendChild(styleTag);
}
document.querySelector(".quiz").classList.add("level2");

function goBacktoLevelSelectpage() {
    
  window.location.href = "level-select.html";
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
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  
  return `../${cleanUrl}`;
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
  
    // Word options are shown WITHOUT the article – the user picks the article separately.
    const usedWords = new Set([correct.sv]);
    const distractorWords = [];
    for (const id of shuffled(allIds.filter(x => x !== currentCorrectId))) {
      const v = window.vocabulary.get_vocab(id);
      if (!v || !v.sv || usedWords.has(v.sv)) continue;
      usedWords.add(v.sv);
      distractorWords.push(v.sv);
      if (distractorWords.length === 3) break;
    }

    const wordOptions = shuffled([
      { text: correct.sv, correct: true },
      ...distractorWords.map(w => ({ text: w, correct: false }))
    ]);

    imgEl.src = normalizeAssetUrl(correct.img);
    imgEl.alt = correct.en || correct.sv;

    selectedArticleBtn = null;
    selectedWordBtn = null;
    optsEl.innerHTML = "";

    // Phrase being built: [article] [word] – fills in as the user picks
    const phrase = document.createElement("div");
    phrase.className = "l2-phrase";
    phrase.innerHTML =
      '<span id="slotArticle" class="l2-slot l2-slot-article active">?</span>' +
      '<span id="slotWord" class="l2-slot l2-slot-word">?</span>';
    optsEl.appendChild(phrase);

    // Step 1: article buttons (en / ett)
    optsEl.appendChild(makeStep(1, "Choose <b>en</b> or <b>ett</b>", "step1"));
    for (const art of ["en", "ett"]) {
      const btn = document.createElement("button");
      btn.className = "option article-option";
      btn.textContent = art;
      btn.dataset.correct = String(art === correct.article);
      btn.addEventListener("click", () => onPick(btn, "article"));
      optsEl.appendChild(btn);
    }

    // Step 2: word buttons – locked until an article is chosen
    optsEl.appendChild(makeStep(2, "Choose the word", "step2"));
    for (const opt of wordOptions) {
      const btn = document.createElement("button");
      btn.className = "option word-option locked";
      btn.textContent = opt.text;
      btn.dataset.correct = String(opt.correct);
      btn.disabled = true;
      btn.addEventListener("click", () => onPick(btn, "word"));
      optsEl.appendChild(btn);
    }

    nextBtn.classList.add("hidden");
  }

let selectedArticleBtn = null;
let selectedWordBtn = null;

function makeStep(num, html, id) {
  const step = document.createElement("div");
  step.className = "l2-step" + (num === 1 ? " active" : "");
  step.id = id;
  step.innerHTML = `<span class="l2-badge">${num}</span><span class="l2-step-text">${html}</span>`;
  return step;
}

function onPick(clickedBtn, group) {
  if (clickedBtn.disabled) return;

  const slotArticle = document.getElementById("slotArticle");
  const slotWord = document.getElementById("slotWord");

  if (group === "article") {
    if (selectedArticleBtn) selectedArticleBtn.classList.remove("selected");
    selectedArticleBtn = clickedBtn;
    clickedBtn.classList.add("selected");

    // Show the article in the phrase and move the user on to step 2
    slotArticle.textContent = clickedBtn.textContent;
    slotArticle.classList.remove("active");
    slotArticle.classList.add("filled");
    slotWord.classList.add("active");

    const step1 = document.getElementById("step1");
    step1.classList.remove("active");
    step1.classList.add("done");
    step1.querySelector(".l2-badge").textContent = "✓";
    document.getElementById("step2").classList.add("active");

    optsEl.querySelectorAll(".word-option").forEach(b => {
      b.disabled = false;
      b.classList.remove("locked");
    });
    return;
  }

  // Word picked (only possible once an article is chosen) → check
  selectedWordBtn = clickedBtn;
  slotWord.textContent = clickedBtn.textContent;
  slotWord.classList.remove("active");
  slotWord.classList.add("filled");
  checkAnswer();
}

function checkAnswer() {
  const buttons = [...optsEl.querySelectorAll(".option")];
  buttons.forEach(b => b.disabled = true);
  selectedArticleBtn.classList.remove("selected");

  const articleOk = selectedArticleBtn.dataset.correct === "true";
  const wordOk = selectedWordBtn.dataset.correct === "true";

  // Colour the phrase slots too
  document.getElementById("slotArticle").classList.add(articleOk ? "right" : "wrong");
  document.getElementById("slotWord").classList.add(wordOk ? "right" : "wrong");
  const step2 = document.getElementById("step2");
  step2.classList.remove("active");
  step2.classList.add("done");
  step2.querySelector(".l2-badge").textContent = "✓";

  // Article feedback
  if (articleOk) {
    selectedArticleBtn.classList.add("correct");
  } else {
    selectedArticleBtn.classList.add("wrong");
    const rightArticle = buttons.find(b => b.classList.contains("article-option") && b.dataset.correct === "true");
    if (rightArticle) rightArticle.classList.add("correct");
  }

  // Word feedback
  if (wordOk) {
    selectedWordBtn.classList.add("correct");
  } else {
    selectedWordBtn.classList.add("wrong");
    const rightWord = buttons.find(b => b.classList.contains("word-option") && b.dataset.correct === "true");
    if (rightWord) rightWord.classList.add("correct");
  }

  // The question only counts as correct if BOTH are right.
  if (!(articleOk && wordOk)) {
    totalMistakes++;
    mistakeDetails[currentCorrectId] = (mistakeDetails[currentCorrectId] || 0) + 1;
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
  const TEAM_KEY = `Game09-Level${currentLevel}`;
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
  window.location.href = `advanced-level-view.html?level=${nextLevel}`;
};

}

function goBacktomainpage() {
    
  window.location.href = "index.html";
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
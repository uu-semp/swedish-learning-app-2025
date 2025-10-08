const CATEGORY = "clothing";
const TOTAL_QUESTIONS = 5; 

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
  const distractorIds = sampleDistinct(allIds, 3, new Set([currentCorrectId]));
  const options = [
    { id: currentCorrectId, text: getLabel(correct), correct: true },
    ...distractorIds.map(id => {
      const v = window.vocabulary.get_vocab(id);
      return { id, text: getLabel(v), correct: false };
    })
  ];

  imgEl.src = normalizeAssetUrl(correct.img);
  imgEl.alt = correct.en || correct.sv;

  optsEl.innerHTML = "";
  for (const opt of shuffled(options)) {
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

  if (isCorrect) {
    clickedBtn.classList.add("correct");
    for (const b of buttons) b.disabled = true;
    progress++;
    updateProgress();
    nextBtn.classList.remove("hidden");
  } else {
    
    totalMistakes++;
    mistakeDetails[currentCorrectId] = (mistakeDetails[currentCorrectId] || 0) + 1;

    clickedBtn.classList.add("wrong");
    const correctText = getLabel(window.vocabulary.get_vocab(currentCorrectId));
    const correctBtn = buttons.find(b => b.textContent === correctText);
    if (correctBtn) correctBtn.classList.add("correct");

    for (const b of buttons) b.disabled = true;

    
    setTimeout(() => {
      buttons.forEach(b => {
        b.disabled = false;
        b.classList.remove("wrong", "correct");
      });
    }, 1000);
  }
}

function updateProgress() {
  const ratio = progress / TOTAL_QUESTIONS;
  progressEl.style.width = `${ratio * 100}%`;
}

nextBtn.addEventListener("click", renderRound);


function showResult() {
  const mistakeInfo = document.getElementById("mistakeInfo");
  let detailText = `You finished this level with <b>${totalMistakes}</b> mistakes.<br/><br/>`;
  mistakeInfo.innerHTML = detailText;

  resultPopup.classList.remove("hidden");

  document.getElementById("playAgainBtn").onclick = () => {
    resultPopup.classList.add("hidden");
    start();
  };
  document.getElementById("closeResult").onclick = () => {
    resultPopup.classList.add("hidden");
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

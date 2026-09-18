// ==============================================
// Owned by Game 10
// ==============================================

import { getLang, recordLevelScore } from "../dev-tools/cookies.js";
import { t, roundSummary } from "../dev-tools/i18n.js";
import { whenReady, foodItems, vocabUrl, playAudio, renderPips } from "../dev-tools/util.js";

const TOTAL = 10;
const screens = {
  play: document.getElementById("play"),
  correct: document.getElementById("correct"),
  wrong: document.getElementById("wrong"),
  done: document.getElementById("done")
};

let lang = "en";
let foods = [];
let qIndex = 0;
let results = [];
let questions = [];
let current = null;

function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(lang, el.dataset.i18n);
  });
}

function show(name) {
  Object.values(screens).forEach((el) => el.classList.remove("is-on"));
  screens[name].classList.add("is-on");
}

function scoreCounts() {
  return {
    ok: results.filter((r) => r === true).length,
    no: results.filter((r) => r === false).length
  };
}

function updateHud() {
  const { ok, no } = scoreCounts();
  const label = lang === "sv" ? `Fråga ${Math.min(qIndex + 1, TOTAL)} av ${TOTAL}` : `Question ${Math.min(qIndex + 1, TOTAL)} of ${TOTAL}`;
  const scoreHtml = `<i class="fa-solid fa-check" style="color:#1f6b3a;margin-right:5px"></i>${ok}<span style="color:#cfc7bb;margin:0 8px">|</span><i class="fa-solid fa-xmark" style="color:#9d0000;margin-right:5px"></i>${no}`;
  ["q-label", "q-label-ok", "q-label-no"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = label;
  });
  ["live-score", "live-score-ok", "live-score-no"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = scoreHtml;
  });
  renderPips(document.getElementById("pips"), results, qIndex, TOTAL);
  renderPips(document.getElementById("pips-ok"), results, qIndex, TOTAL);
  renderPips(document.getElementById("pips-no"), results, qIndex, TOTAL);
}

function makeQuestions() {
  const pool = foods.filter((item) => item.img) || foods;
  questions = [];
  for (let i = 0; i < TOTAL; i++) {
    const isTrue = Math.random() > 0.5;
    const shown = pool[Math.floor(Math.random() * pool.length)];
    if (isTrue) {
      questions.push({ shown, word: shown, isTrue: true });
    } else {
      let other = pool[Math.floor(Math.random() * pool.length)];
      while (other.id === shown.id && pool.length > 1) {
        other = pool[Math.floor(Math.random() * pool.length)];
      }
      questions.push({ shown, word: other, isTrue: false });
    }
  }
}

function renderPlay() {
  current = questions[qIndex];
  const src = vocabUrl(current.shown.img);
  document.getElementById("play-img").src = src;
  document.getElementById("play-img").alt = current.shown.en || current.shown.sv;
  document.getElementById("play-word").textContent = current.word.sv;
  updateHud();
  show("play");
}

function answer(userTrue) {
  const correct = userTrue === current.isTrue;
  results[qIndex] = correct;
  updateHud();
  const src = vocabUrl(current.shown.img);
  if (correct) {
    document.getElementById("ok-img").src = src;
    document.getElementById("ok-word").textContent = current.shown.sv;
    document.getElementById("ok-meaning").innerHTML = `<strong>${current.shown.sv}</strong> = ${current.shown.en || ""}`;
    show("correct");
  } else {
    document.getElementById("no-img").src = src;
    document.getElementById("no-sv").textContent = current.shown.sv;
    document.getElementById("no-en").textContent = current.shown.en || "";
    document.getElementById("no-saw").innerHTML = `<i class="fa-solid fa-xmark" style="color:#9d0000"></i><span>${t(lang, "youSaw")} <strong style="color:#14100e">${current.word.sv}</strong></span>`;
    show("wrong");
  }
}

function finishRound() {
  const roundScore = results.filter((r) => r === true).length;
  const { progress, total, unlockedNext } = recordLevelScore(1, roundScore);
  document.getElementById("done-score").textContent = String(roundScore);
  renderPips(document.getElementById("pips-done"), results, -1, TOTAL);
  const next = document.getElementById("next-level");
  if (progress.currentLevel >= 2) {
    next.style.display = "flex";
  } else {
    next.style.display = "none";
  }
  document.getElementById("done-note").textContent = roundSummary(lang, {
    round: roundScore,
    max: TOTAL,
    level: 1,
    total,
    unlockedNext
  });
  show("done");
}

function nextQuestion() {
  qIndex += 1;
  if (qIndex >= TOTAL) finishRound();
  else renderPlay();
}

function startRound() {
  qIndex = 0;
  results = [];
  makeQuestions();
  renderPlay();
}

whenReady(() => {
  lang = getLang();
  foods = foodItems();
  applyI18n();

  document.querySelectorAll(".js-menu").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  });
  document.getElementById("true-btn").addEventListener("click", () => answer(true));
  document.getElementById("false-btn").addEventListener("click", () => answer(false));
  document.querySelectorAll(".js-next").forEach((btn) => btn.addEventListener("click", nextQuestion));
  document.querySelectorAll(".js-audio").forEach((btn) => {
    btn.addEventListener("click", () => playAudio(current?.shown?.audio));
  });
  startRound();
});

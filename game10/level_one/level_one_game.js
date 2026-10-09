// ==============================================
// Owned by Game 10
// ==============================================

import { getLang, recordLevelScore, changeWeight, getStreak, recordStreak } from "../dev-tools/cookies.js";
import { t, roundSummary } from "../dev-tools/i18n.js";
import { whenReady, foodItems, getBatch, vocabUrl, playAudio, renderPips, preloadImages } from "../dev-tools/util.js";

const TOTAL = 10;
const LEVEL_ID = 1;
const initialStreak = getStreak(LEVEL_ID);

let currentStreak = initialStreak.current;
let bestStreak = initialStreak.best;

const screens = {
  play: document.getElementById("play"),
  correct: document.getElementById("correct"),
  wrong: document.getElementById("wrong"),
  review: document.getElementById("review"),
  done: document.getElementById("done")
};

let lang = "en";
let foods = [];
let qIndex = 0;
let phase = "main"; // "main" or "review"
let results = [];
let reviewResults = [];
let questions = [];
let queue = [];
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

function activeResults() {
  return phase === "main" ? results : reviewResults;
}

function scoreCounts() {
  const res = activeResults();
  return {
    ok: res.filter((r) => r === true).length,
    no: res.filter((r) => r === false).length
  };
}

function reviewNote(missed, again) {
  const words = missed === 1 ? t(lang, "wordOne") : t(lang, "wordMany");
  const them = missed === 1 ? t(lang, "themOne") : t(lang, "themMany");
  return t(lang, again ? "reviewAgainNote" : "reviewNote", { n: missed, words, them });
}

function updateHud() {
  const { ok, no } = scoreCounts();
  const total = phase === "main" ? TOTAL : queue.length;
  const n = Math.min(qIndex + 1, total);
  const label =
    phase === "main"
      ? lang === "sv"
        ? `Fråga ${n} av ${total}`
        : `Question ${n} of ${total}`
      : t(lang, "reviewLabel", { i: n, n: total });
  const scoreHtml = `
    <i class="fa-solid fa-check" style="color:#1f6b3a;margin-right:3px"></i>${ok}
    <span style="color:#cfc7bb;margin:0 6px">|</span>
    <i class="fa-solid fa-xmark" style="color:#9d0000;margin-right:3px"></i>${no}
    <span style="color:#cfc7bb;margin:0 6px">|</span>
    <i class="fa-solid fa-fire" style="color:#ff6b00;margin-right:3px"></i>${currentStreak}
  `.trim();
  ["q-label", "q-label-ok", "q-label-no"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = label;
  });
  ["live-score", "live-score-ok", "live-score-no"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = scoreHtml;
  });
  const res = activeResults();
  renderPips(document.getElementById("pips"), res, qIndex, total);
  renderPips(document.getElementById("pips-ok"), res, qIndex, total);
  renderPips(document.getElementById("pips-no"), res, qIndex, total);
}

function makeQuestions() {
  const pool = foods.filter((item) => item.img).length ? foods.filter((item) => item.img) : foods;
  const batch = getBatch(TOTAL, "recognition");
  preloadImages(batch);
  questions = [];
  for (let i = 0; i < batch.length; i++) {
    const isTrue = Math.random() > 0.5;
    const shown = batch[i];
    if (isTrue) {
      questions.push({ shown, word: shown, isTrue: true });
    } else {
      let other = pool[Math.floor(Math.random() * pool.length)];
      while (other && other.id === shown.id && pool.length > 1) {
        other = pool[Math.floor(Math.random() * pool.length)];
      }
      questions.push({ shown, word: other || shown, isTrue: false });
    }
  }
}

function renderPlay() {
  current = queue[qIndex];
  const src = vocabUrl(current.shown.img);
  document.getElementById("play-img").src = src;
  document.getElementById("play-img").alt = current.shown.en || current.shown.sv;
  document.getElementById("play-word").textContent = current.word.sv;
  updateHud();
  show("play");
}

function answer(userTrue) {
  const correct = userTrue === current.isTrue;
  activeResults()[qIndex] = correct;
  const src = vocabUrl(current.shown.img);
  if (correct) {
    currentStreak += 1;
    if (currentStreak >= bestStreak) {
      bestStreak = currentStreak;
    }
    document.getElementById("ok-img").src = src;
    document.getElementById("ok-word").textContent = current.shown.sv;
    document.getElementById("ok-meaning").innerHTML = `<strong>${current.shown.sv}</strong> = ${current.shown.en || ""}`;
    show("correct");
  } else {
    currentStreak = 0;
    document.getElementById("no-img").src = src;
    document.getElementById("no-sv").textContent = current.shown.sv;
    document.getElementById("no-en").textContent = current.shown.en || "";
    document.getElementById("no-saw").innerHTML = `<i class="fa-solid fa-xmark" style="color:#9d0000"></i><span>${t(lang, "youSaw")} <strong style="color:#14100e">${current.word.sv}</strong></span>`;
    show("wrong");
  }
  recordStreak(LEVEL_ID, currentStreak, bestStreak);
  updateHud();
}

function showReviewChoice(missed) {
  const res = activeResults();
  const total = phase === "main" ? TOTAL : queue.length;
  const score = res.filter((r) => r === true).length;
  const isReview = phase === "review";

  document.getElementById("review-title").textContent = t(lang, isReview ? "reviewDoneTitle" : "reviewTitle");
  document.getElementById("review-score").textContent = String(score);
  document.getElementById("review-max").textContent = `/ ${total}`;
  document.getElementById("review-note").textContent = reviewNote(missed, isReview);
  renderPips(document.getElementById("pips-review"), res, -1, total);
  show("review");
}

function finishRound() {
  const firstScore = results.filter((r) => r === true).length;
  questions.forEach((q, i) => changeWeight(q.shown.id, "recognition", results[i] ? 1 : -1));
  const { total } = recordLevelScore(1, firstScore);

  const res = activeResults();
  const shownMax = phase === "main" ? TOTAL : queue.length;
  const shownScore = res.filter((r) => r === true).length;
  const isReview = phase === "review";
  const reviewAllRight = isReview && shownScore === shownMax;

  document.getElementById("done-score").textContent = String(shownScore);
  document.getElementById("done-max").textContent = `/ ${shownMax}`;
  renderPips(document.getElementById("pips-done"), res, -1, shownMax);
  document.getElementById("next-level").style.display = "flex";
  document.getElementById("done-note").textContent = isReview
    ? reviewAllRight
      ? t(lang, "reviewGoodJob")
      : t(lang, "reviewPartial", { ok: shownScore, n: shownMax })
    : roundSummary(lang, {
        round: firstScore,
        max: TOTAL,
        level: LEVEL_ID,
        total
      });
  show("done");
}

function nextQuestion() {
  qIndex += 1;
  if (qIndex < queue.length) {
    renderPlay();
    return;
  }
  const missed = activeResults().filter((r) => r === false).length;
  if (missed > 0) showReviewChoice(missed);
  else finishRound();
}

function startReview() {
  const prev = activeResults();
  queue = queue.filter((_, i) => prev[i] === false);
  phase = "review";
  reviewResults = [];
  qIndex = 0;
  renderPlay();
}

function startRound() {
  qIndex = 0;
  phase = "main";
  results = [];
  reviewResults = [];
  makeQuestions();
  queue = [...questions];
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
  document.getElementById("start-review").addEventListener("click", startReview);
  document.getElementById("end-round").addEventListener("click", finishRound);
  startRound();
});

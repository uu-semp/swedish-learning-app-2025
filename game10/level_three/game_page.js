// ==============================================
// Owned by Game 10
// ==============================================

import { getLang, recordLevelScore, changeWeight, getStreak, recordStreak  } from "../dev-tools/cookies.js";
import { t, applyI18n as fillText, roundSummary } from "../dev-tools/i18n.js";
import {
  whenReady,
  getBatch,
  vocabUrl,
  preloadImages,
  playAudio,
  renderPips,
  normalizeAnswer
} from "../dev-tools/util.js";


const TOTAL = 10;
const LEVEL_ID = 3;
const initialStreak = getStreak(LEVEL_ID);

let currentStreak = initialStreak.current;
let bestStreak = initialStreak.best;

const screens = {
  intro: document.getElementById("intro"),
  play: document.getElementById("play"),
  review: document.getElementById("review"),
  done: document.getElementById("done")
};

const TEXT = {
  en: {
    reviewTitle: "First pass complete",
    reviewNote: (n) =>
      `You missed ${n} ${n === 1 ? "word" : "words"}. Review ${n === 1 ? "it" : "them"} now for another go, or end the round.`,
    reviewBtn: "Review mistakes",
    endBtn: "End round",
    reviewDoneTitle: "Review complete",
    reviewAgainNote: (n) =>
      `You still missed ${n} ${n === 1 ? "word" : "words"}. Review ${n === 1 ? "it" : "them"} again, or end the round.`,
    reviewLabel: (i, n) => `Review ${i} of ${n}`,
    reviewGoodJob: "Good job reviewing all the words!",
    reviewPartial: (ok, n) => `You got ${ok} of ${n} right in the review. Keep practising!`,
    emptyAnswer: "Please type an answer before submitting.",
  },
  sv: {
    reviewTitle: "Första genomgången klar",
    reviewNote: (n) =>
      `Du missade ${n} ord. Repetera ${n === 1 ? "det" : "dem"} nu för ett nytt försök, eller avsluta rundan.`,
    reviewBtn: "Repetera felen",
    endBtn: "Avsluta rundan",
    reviewDoneTitle: "Repetitionen klar",
    reviewAgainNote: (n) =>
      `Du missade fortfarande ${n} ord. Repetera ${n === 1 ? "det" : "dem"} igen, eller avsluta rundan.`,
    reviewLabel: (i, n) => `Repetition ${i} av ${n}`,
    reviewGoodJob: "Bra jobbat med att repetera alla orden!",
    reviewPartial: (ok, n) => `Du fick ${ok} av ${n} rätt i repetitionen. Fortsätt öva!`,
    emptyAnswer: "Du måste skriva ett svar innan du kan gå vidare.",
  }
};

let lang = "en";
let words = [];
let queue = [];
let phase = "main"; // "main" or "review"
let qIndex = 0;
let results = [];
let reviewResults = [];
let lastTyped = "";
let enterHeld = false;

function txt() {
  return TEXT[lang] || TEXT.en;
}

function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(lang, el.dataset.i18n);
  });
  document.getElementById("answer").placeholder = t(lang, "typeHere");
}

function show(name) {
  Object.values(screens).forEach((el) => el.classList.remove("is-on"));
  screens[name].classList.add("is-on");
}

function hidePopups() {
  document.getElementById("popup-ok").classList.remove("is-on");
  document.getElementById("popup-no").classList.remove("is-on");
}

function hasAnswer() {
  return document.getElementById("answer").value.trim().length > 0;
}

function hideEmptyMsg() {
  document.getElementById("empty-msg").classList.remove("is-on");
}

function showEmptyMsg() {
  const el = document.getElementById("empty-msg");
  el.textContent = txt().emptyAnswer;
  el.classList.add("is-on");
}

function updateSubmitState() {
  const filled = hasAnswer();
  document.getElementById("submit-btn").disabled = !filled;
  if (filled) hideEmptyMsg();
}

function current() {
  return queue[qIndex];
}

function activeResults() {
  return phase === "main" ? results : reviewResults;
}

// Use Levenshtein distance to make it clearer which spelling mistakes were made
function getSpellingDiff(typed, target) {
  const a = normalizeAnswer(typed);
  const b = normalizeAnswer(target);

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const diff = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    // Same character
    if (
      i > 0 &&
      j > 0 &&
      a[i - 1] === b[j - 1] &&
      matrix[i][j] === matrix[i - 1][j - 1]
    ) {
      diff.push({ char: a[i - 1], error: false });
      i -= 1;
      j -= 1;
    }
    // Wrong character
    else if (
      i > 0 &&
      j > 0 &&
      matrix[i][j] === matrix[i - 1][j - 1] + 1
    ) {
      diff.push({ char: a[i - 1], error: true });
      i -= 1;
      j -= 1;
    }
    // Extra character typed
    else if (
      i > 0 &&
      matrix[i][j] === matrix[i - 1][j] + 1
    ) {
      diff.push({ char: a[i - 1], error: true });
      i -= 1;
    }
    // Missing character
    else {
      diff.push({ char: "_", error: true });
      j -= 1;
    }
  }

  return diff.reverse();
}

function renderSpellingDiff(element, typed, target) {
  const diff = getSpellingDiff(typed, target);

  element.textContent = "";

  diff.forEach(({ char, error }) => {
    const span = document.createElement("span");
    span.textContent = char;

    if (error) {
      span.classList.add("spelling-error");
    }

    element.appendChild(span);
  });
}

function updateHud() {
  const res = activeResults();
  const total = phase === "main" ? TOTAL : queue.length;
  const ok = res.filter((r) => r === true).length;
  const no = res.filter((r) => r === false).length;
  const n = Math.min(qIndex + 1, total);
  let label;
  if (phase === "main") {
    label = lang === "sv" ? `Fråga ${n} av ${total}` : `Question ${n} of ${total}`;
  } else {
    label = txt().reviewLabel(n, total);
  }
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
  renderPips(document.getElementById("pips"), res, qIndex, total);
}

function renderPlay() {
  hidePopups();
  const word = current();
  document.getElementById("play-img").src = vocabUrl(word.img);
  document.getElementById("play-img").alt = word.en || word.sv;
  document.getElementById("play-en").textContent = word.en || "";
  document.getElementById("answer").value = "";
  document.getElementById("answer").value = "";
  hideEmptyMsg();
  updateSubmitState();
  updateHud();
  show("play");
  document.getElementById("answer").focus();
}

function startRound() {
  words = getBatch(TOTAL, "spelling");
  preloadImages(words);
  queue = [...words];
  phase = "main";
  qIndex = 0;
  results = [];
  reviewResults = [];
  renderPlay();
}

function startReview() {
  const prev = activeResults();
  queue = queue.filter((_, i) => prev[i] === false);
  phase = "review";
  reviewResults = [];
  qIndex = 0;
  renderPlay();
}

function submitAnswer() {
  if (document.querySelector(".al-popup.is-on")) return;
  if (!hasAnswer()) {
    showEmptyMsg();
    return;
  }
  const word = current();
  const res = activeResults();
  lastTyped = document.getElementById("answer").value;
  const ok = normalizeAnswer(lastTyped) === normalizeAnswer(word.sv);
  if (ok) {
    res[qIndex] = true;
    currentStreak += 1;
    if (currentStreak >= bestStreak) {
      bestStreak = currentStreak;
    }
    document.getElementById("ok-img").src = vocabUrl(word.img);
    document.getElementById("ok-sv").textContent = word.sv;
    document.getElementById("popup-ok").classList.add("is-on");
  } else {
    res[qIndex] = false;
    currentStreak = 0;
    renderSpellingDiff(document.getElementById("typed"), lastTyped || "—", word.sv);
    document.getElementById("closeness-feedback").textContent = t(lang, "spellingFeedback");
    document.getElementById("no-img").src = vocabUrl(word.img);
    document.getElementById("no-sv").innerHTML = `${word.sv} <span style="font-size:15px;font-weight:400;color:#555">— ${word.en || ""}</span>`;
    document.getElementById("popup-no").classList.add("is-on");
  }
  recordStreak(LEVEL_ID, currentStreak, bestStreak);
  updateHud();
}

function nextQuestion() {
  hidePopups();
  qIndex += 1;
  if (qIndex < queue.length) {
    renderPlay();
    return;
  }

  const missed = activeResults().filter((r) => r === false).length;
  if (missed > 0) showReviewChoice(missed);
  else finishRound();
}

function showReviewChoice(missed) {
  const res = activeResults();
  const total = phase === "main" ? TOTAL : queue.length;
  const score = res.filter((r) => r === true).length;
  const isReview = phase === "review";

  document.getElementById("review-title").textContent = isReview ? txt().reviewDoneTitle : txt().reviewTitle;
  document.getElementById("review-score").textContent = String(score);
  document.getElementById("review-max").textContent = `/ ${total}`;
  document.getElementById("review-note").textContent = isReview ? txt().reviewAgainNote(missed) : txt().reviewNote(missed);
  document.getElementById("start-review").lastElementChild.textContent = txt().reviewBtn;
  document.getElementById("end-round").textContent = txt().endBtn;
  renderPips(document.getElementById("pips-review"), res, -1, total);
  show("review");
}

function finishRound() {
  hidePopups();

  const firstScore = results.filter((r) => r === true).length;
  words.forEach((w, i) => changeWeight(w.id, "spelling", results[i] ? 1 : -1));
  const { progress, total } = recordLevelScore(LEVEL_ID, firstScore);

  const res = activeResults();
  const shownMax = phase === "main" ? TOTAL : queue.length;
  const shownScore = res.filter((r) => r === true).length;

  document.getElementById("done-score").textContent = String(shownScore);
  document.getElementById("done-max").textContent = `/ ${shownMax}`;
  renderPips(document.getElementById("pips-done"), res, -1, shownMax);
  const isReview = phase === "review";
  const reviewAllRight = isReview && shownScore === shownMax;
  document.getElementById("done-note").textContent = isReview
    ? (reviewAllRight ? txt().reviewGoodJob : txt().reviewPartial(shownScore, shownMax))
    : roundSummary(lang, {
        round: firstScore,
        max: TOTAL,
        level: LEVEL_ID,
        total,
        finished: progress.game_completed
      });
  show("done");
}

whenReady(() => {
  lang = getLang();
  applyI18n();

  document.querySelectorAll(".js-menu").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  });

  document.getElementById("start").addEventListener("click", startRound);
  document.getElementById("spell-form").addEventListener("submit", (e) => {
    e.preventDefault();
    submitAnswer();
  });

  const answerInput = document.getElementById("answer");
  answerInput.addEventListener("input", updateSubmitState);
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.repeat && !hasAnswer()) {
      e.preventDefault();
      showEmptyMsg();
    }
  });

  document.querySelectorAll("[data-char]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById("answer");
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, start) + btn.dataset.char + input.value.slice(end);
      input.focus();
      const pos = start + 1;
      input.setSelectionRange(pos, pos);
      updateSubmitState();
    });
  });

  document.querySelectorAll(".js-audio").forEach((btn) => {
    btn.addEventListener("click", () => playAudio(current()?.audio));
  });

  document.querySelectorAll(".al-popup .js-next").forEach((btn) => btn.addEventListener("click", nextQuestion));
  document.getElementById("start-review").addEventListener("click", startReview);
  document.getElementById("end-round").addEventListener("click", finishRound);
  document.getElementById("again").addEventListener("click", () => show("intro"));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    if (enterHeld) {
      e.preventDefault();
      return;
    }

    enterHeld = true;

    if (document.getElementById("popup-ok").classList.contains("is-on")) {
      e.preventDefault();
      nextQuestion();
    } else if (document.getElementById("popup-no").classList.contains("is-on")) {
      e.preventDefault();
      nextQuestion();
    }

  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      enterHeld = false;
    }
  });
});

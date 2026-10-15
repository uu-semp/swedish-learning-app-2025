// ==============================================
// Owned by Game 10
// ==============================================

const COOKIE = "eatAndLearnProgress";
export const SCORE_TO_PASS = 10;
export const PLATEAU = 2;
const COLUMNS = { recognition: 0, spelling: 1 };

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
}

function defaults() {
  return {
    game_completed: false,
    currentLevel: 1,
    levelScores: { 1: 0, 2: 0, 3: 0 },
    learnedIds: [],
    weights: {},
    currentStreak: { 1: 0, 2: 0, 3: 0 },
    bestStreak: { 1: 0, 2: 0, 3: 0 }
  };
}

export function saveProgress(progressData) {
  setCookie(COOKIE, JSON.stringify(progressData), 365);
}

export function loadProgress() {
  const raw = getCookie(COOKIE);
  if (!raw) return defaults();
  try {
    const data = JSON.parse(raw);
    const base = defaults();
    return {
      ...base,
      ...data,
      levelScores: { ...base.levelScores, ...(data.levelScores || {}) },
      learnedIds: Array.isArray(data.learnedIds) ? data.learnedIds : [],
      weights: data.weights && typeof data.weights === "object" ? data.weights : {},
      currentStreak: typeof data.currentStreak === "object" && data.currentStreak !== null
        ? { ...base.currentStreak, ...data.currentStreak }
        : base.currentStreak,
      bestStreak: typeof data.bestStreak === "object" && data.bestStreak !== null
        ? { ...base.bestStreak, ...data.bestStreak }
        : base.bestStreak
    };
  } catch {
    return defaults();
  }
}

export function resetProgress() {
  setCookie(COOKIE, "", -1);
  if (window.save?.stats) window.save.stats.clear("game10");
}

// Uses the language selected in the main menu (currentLanguage in /index.js).
// The game runs in an iframe there, so read it from the parent window.
export function getLang() {
  try {
    const lang = new window.parent.Function("return currentLanguage")();
    if (lang === "sv" || lang === "en") return lang;
  } catch (e) {}
  return "en";
}

// Reload the page when the language is switched in the main menu while the game is open
try {
  const shownLang = getLang();
  const onLangClick = () => {
    if (getLang() !== shownLang) window.location.reload();
  };
  const langButtons = ["lang-eng", "lang-sv"]
    .map((id) => window.parent.document.getElementById(id))
    .filter(Boolean);
  langButtons.forEach((btn) => btn.addEventListener("click", onLangClick));
  window.addEventListener("pagehide", () => {
    langButtons.forEach((btn) => btn.removeEventListener("click", onLangClick));
  });
} catch (e) {}

export function getWeight(progress, id, mode) {
  return (progress.weights[id] || [0, 0])[COLUMNS[mode]] || 0;
}

export function changeWeight(id, mode, delta) {
  const progress = loadProgress();
  const weights = (progress.weights[id] || [0, 0]).slice();
  const col = COLUMNS[mode];
  weights[col] = Math.max(0, Math.min(PLATEAU, (weights[col] || 0) + delta));
  progress.weights[id] = weights;
  if (weights[0] >= PLATEAU && weights[1] >= PLATEAU && !progress.learnedIds.includes(id)) {
    progress.learnedIds.push(id);
  }
  saveProgress(progress);
}

export function getStreak(level) {
  const progress = loadProgress();
  return {
    current: progress.currentStreak[level] || 0,
    best: progress.bestStreak[level] || 0
  };
}


export function recordStreak(level, current, best) {
  const progress = loadProgress();
  progress.currentStreak[level] = current;
  progress.bestStreak[level] = best;
  saveProgress(progress);
}

// export function recordStreak(level, current, best) {
//   const progress = loadProgress();
//   const lvl = String(level);

//   // Ensure currentStreak and bestStreak are objects before writing
//   if (typeof progress.currentStreak !== "object" || progress.currentStreak === null) {
//     progress.currentStreak = {};
//   }
//   if (typeof progress.bestStreak !== "object" || progress.bestStreak === null) {
//     progress.bestStreak = {};
//   }

//   progress.currentStreak[lvl] = current;
//   progress.bestStreak[lvl] = Math.max(best, progress.bestStreak[lvl] || 0);

//   saveProgress(progress);
// }

export function recordLevelScore(level, roundScore) {
  const progress = loadProgress();
  const currentBest = progress.levelScores[level] || 0;
  progress.levelScores[level] = Math.max(currentBest, roundScore);
  const total = progress.levelScores[level];
  const completion = level === 1 ? 33 : level === 2 ? 67 : 100;
  window.save?.stats?.setCompletion("game10", completion);
  if (level === 3 && !progress.game_completed) {
    progress.game_completed = true;
    window.save?.stats?.incrementWin("game10");
  }
  saveProgress(progress);
  return { progress, total };
}

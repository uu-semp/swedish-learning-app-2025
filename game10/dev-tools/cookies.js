// ==============================================
// Owned by Game 10
// ==============================================

const COOKIE = "eatAndLearnProgress";
const LANG_KEY = "eatAndLearnLang";
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
    weights: {}
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
      weights: data.weights && typeof data.weights === "object" ? data.weights : {}
    };
  } catch {
    return defaults();
  }
}

export function resetProgress() {
  setCookie(COOKIE, "", -1);
  if (window.save?.stats) window.save.stats.clear("game10");
}

export function getLang() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === "sv" || stored === "en") return stored;
  return "en";
}

export function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
}

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

export function recordLevelScore(level, roundScore) {
  const progress = loadProgress();
  progress.levelScores[level] = (progress.levelScores[level] || 0) + roundScore;
  const total = progress.levelScores[level];
  let unlockedNext = false;

  if (total >= SCORE_TO_PASS && progress.currentLevel === level) {
    if (level < 3) {
      progress.currentLevel = level + 1;
      unlockedNext = true;
    }
    const completion = level === 1 ? 33 : level === 2 ? 67 : 100;
    window.save?.stats?.setCompletion("game10", completion);
    if (level === 3 && !progress.game_completed) {
      progress.game_completed = true;
      window.save?.stats?.incrementWin("game10");
    }
  }

  saveProgress(progress);
  return { progress, total, unlockedNext };
}

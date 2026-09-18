// ==============================================
// Owned by Game 10
// ==============================================

const COOKIE = "eatAndLearnProgress";
const LANG_KEY = "eatAndLearnLang";
export const SCORE_TO_PASS = 10;

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
    learnedIds: []
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
      learnedIds: Array.isArray(data.learnedIds) ? data.learnedIds : []
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

export function addLearned(id) {
  const progress = loadProgress();
  if (!progress.learnedIds.includes(id)) {
    progress.learnedIds.push(id);
    saveProgress(progress);
  }
  return progress.learnedIds.length;
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

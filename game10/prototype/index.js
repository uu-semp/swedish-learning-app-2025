// ==============================================
// Owned by Game 10
// ==============================================

import { getLang, setLang, loadProgress, resetProgress, SCORE_TO_PASS } from "./dev-tools/cookies.js";
import { t, applyI18n as fillText } from "./dev-tools/i18n.js";
import { whenReady, foodItems } from "./dev-tools/util.js";

const LEVEL_HREF = {
  1: "level_one/level_one.html",
  2: "level_two/level_two.html",
  3: "level_three/level_three.html"
};

function applyI18n(lang) {
  fillText(lang);
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("is-on", btn.dataset.lang === lang);
  });
}

function renderMenu() {
  const lang = getLang();
  const progress = loadProgress();
  const foods = foodItems();
  applyI18n(lang);

  const learned = progress.learnedIds.length;
  const total = Math.max(foods.length, 1);
  document.getElementById("learned-count").textContent = String(learned);
  document.getElementById("learned-total").textContent = String(foods.length);
  document.getElementById("learned-bar").style.width = Math.min(100, (learned / total) * 100) + "%";

  document.querySelectorAll("[data-score]").forEach((el) => {
    const level = Number(el.dataset.score);
    const score = Math.min(progress.levelScores[level] || 0, SCORE_TO_PASS);
    const locked = progress.currentLevel < level;
    if (locked) {
      el.innerHTML = `<i class="fa-solid fa-lock" style="color:#9d0000;font-size:10px;margin-right:5px"></i>${t(lang, "needTen", { n: level - 1 })}`;
    } else if (score >= SCORE_TO_PASS) {
      const done = level < 3 ? t(lang, "nextOpen") : t(lang, "gameWon");
      el.innerHTML = `<i class="fa-solid fa-check" style="color:#1f6b3a;font-size:10px;margin-right:5px"></i>${t(lang, "best")} ${score}/${SCORE_TO_PASS} — ${done}`;
    } else {
      const goal = level < 3 ? t(lang, "toUnlockNext", { n: level + 1 }) : t(lang, "toFinish");
      el.innerHTML = `<i class="fa-solid fa-star" style="color:#9d0000;font-size:10px;margin-right:5px"></i>${t(lang, "best")} ${score}/${SCORE_TO_PASS} — ${goal}`;
    }
  });

  document.querySelectorAll(".al-level-card").forEach((card) => {
    const level = Number(card.dataset.level);
    card.classList.toggle("is-locked", progress.currentLevel < level);
  });
}

whenReady(() => {
  renderMenu();

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
      renderMenu();
    });
  });

  document.getElementById("open-learn").addEventListener("click", () => {
    window.location.href = "learning_mode/learning_mode.html";
  });

  document.querySelectorAll(".al-level-card").forEach((card) => {
    card.addEventListener("click", () => {
      const lang = getLang();
      const progress = loadProgress();
      const level = Number(card.dataset.level);
      if (progress.currentLevel < level) {
        alert(t(lang, "locked", { n: level - 1 }));
        return;
      }
      window.location.href = LEVEL_HREF[level];
    });
  });

  const modal = document.getElementById("reset-modal");
  document.getElementById("reset-open").addEventListener("click", () => modal.classList.add("is-on"));
  document.getElementById("reset-cancel").addEventListener("click", () => modal.classList.remove("is-on"));
  document.getElementById("reset-confirm").addEventListener("click", () => {
    resetProgress();
    modal.classList.remove("is-on");
    renderMenu();
  });
});

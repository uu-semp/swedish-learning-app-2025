// ==============================================
// Owned by Game 10
// ==============================================

import { getLang, loadProgress, resetProgress, getWeight, getStreak, PLATEAU } from "./dev-tools/cookies.js";
import { t, applyI18n } from "./dev-tools/i18n.js";
import { proverbOfTheDay } from "./dev-tools/proverbs.js";
import { whenReady, foodItems, vocabUrl } from "./dev-tools/util.js";

const LEVEL_HREF = {
  1: "level_one/level_one.html",
  2: "level_two/level_two.html",
  3: "level_three/level_three.html"
};

function renderMenu() {
  const lang = getLang();
  const progress = loadProgress();
  const foods = foodItems();
  applyI18n(lang);

  const proverb = proverbOfTheDay();
  document.getElementById("proverb-sv").textContent = proverb.sv;
  document.getElementById("proverb-en").textContent = `“${proverb.en}”`;
  document.getElementById("proverb-meaning").textContent = proverb.meaning[lang];

  const learned = progress.learnedIds.length;
  const total = Math.max(foods.length, 1);
  document.getElementById("learned-count").textContent = String(learned);
  document.getElementById("learned-total").textContent = String(foods.length);
  document.getElementById("learned-bar").style.width = Math.min(100, (learned / total) * 100) + "%";
  document.querySelectorAll("[data-score]").forEach((el) => {
    const level = Number(el.dataset.score);
    const streak = getStreak(level);
    const levelcurrentStreak = streak.current;
    const levelbestStreak = streak.best;
    el.innerHTML = `${t(lang, "streak")} ${levelcurrentStreak} | ${t(lang, "best")} ${levelbestStreak}`;
  });
}

let wordSort = "az";
let wordReverse = false;

function renderWords() {
  const lang = getLang();
  const progress = loadProgress();
  document.querySelector('[data-i18n="masteredRule"]').textContent = t(lang, "masteredRule", { n: PLATEAU });
  document.querySelectorAll("[data-sort]").forEach((btn) => {
    btn.classList.toggle("is-on", btn.dataset.sort === wordSort);
  });
  document.querySelector('[data-sort="az"]').textContent = wordReverse ? "Ö–A" : "A–Ö";
  document.getElementById("words-reverse").classList.toggle("is-on", wordReverse);
  const bar = (label, weight) => {
    const cls = weight >= PLATEAU ? "is-full" : weight > 0 ? "is-half" : "";
    return `<div class="al-word-score">${label} ${weight}/${PLATEAU}<div class="al-bar"><span class="${cls}" style="width:${(weight / PLATEAU) * 100}%"></span></div></div>`;
  };
  const score = (id, mode) => bar(t(lang, mode), getWeight(progress, id, mode));
  document.getElementById("words-list").innerHTML = foodItems()
    .sort((a, b) => {
      let order = a.sv.localeCompare(b.sv, "sv");
      if (wordSort !== "az") {
        order = getWeight(progress, b.id, wordSort) - getWeight(progress, a.id, wordSort) || order;
      }
      return wordReverse ? -order : order;
    })
    .map((item, i) => {
      return `<div class="al-word-row" style="--i:${Math.min(i, 12)}">
        <img src="${vocabUrl(item.img)}" alt="">
        <div class="al-word-name">${item.sv}<span>${item.en || ""}</span></div>
        ${score(item.id, "recognition")}
        ${score(item.id, "spelling")}
      </div>`;
    })
    .join("");
}

whenReady(() => {
  renderMenu();

  document.getElementById("open-learn").addEventListener("click", () => {
    window.location.href = "learning_mode/learning_mode.html";
  });

  document.querySelectorAll(".al-level-card").forEach((card) => {
    card.addEventListener("click", () => {
      const level = Number(card.dataset.level);
      window.location.href = LEVEL_HREF[level];
    });
  });

  const wordsModal = document.getElementById("words-modal");
  document.getElementById("words-open").addEventListener("click", () => {
    renderWords();
    wordsModal.classList.add("is-on");
  });
  document.querySelectorAll("[data-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      wordSort = btn.dataset.sort;
      renderWords();
    });
  });
  document.getElementById("words-reverse").addEventListener("click", () => {
    wordReverse = !wordReverse;
    renderWords();
  });
  document.getElementById("words-close").addEventListener("click", () => wordsModal.classList.remove("is-on"));

  const modal = document.getElementById("reset-modal");
  document.getElementById("reset-open").addEventListener("click", () => modal.classList.add("is-on"));
  document.getElementById("reset-cancel").addEventListener("click", () => modal.classList.remove("is-on"));
  document.getElementById("reset-confirm").addEventListener("click", () => {
    resetProgress();
    modal.classList.remove("is-on");
    renderMenu();
  });
});

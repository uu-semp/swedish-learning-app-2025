// ==============================================
// Owned by Game 10
// ==============================================

import { getLang, recordLevelScore } from "../dev-tools/cookies.js";
import { t, applyI18n, roundSummary } from "../dev-tools/i18n.js";
import { vocabUrl } from "../dev-tools/util.js";

const PAIR_COUNT = 4;
const state = JSON.parse(sessionStorage.getItem("eatLearnL2") || "null");
const lang = getLang();

function show(id) {
  document.getElementById("results").classList.toggle("is-on", id === "results");
  document.getElementById("done").classList.toggle("is-on", id === "done");
}

function render() {
  applyI18n(lang);
  if (!state) {
    window.location.href = "game_page.html";
    return;
  }
  const { leftItems, rightItems, links } = state;
  const graded = links.map((link) => {
    const left = leftItems[link.left];
    const right = rightItems[link.right];
    return { ...link, correct: left.id === right.id, leftItem: left, rightItem: right };
  });
  const roundScore = graded.filter((g) => g.correct).length;
  document.getElementById("res-ok").innerHTML = `<i class="fa-solid fa-check"></i>${roundScore} ${t(lang, "rightWord")}`;
  document.getElementById("res-no").innerHTML = `<i class="fa-solid fa-xmark"></i>${PAIR_COUNT - roundScore} ${t(lang, "wrongWord")}`;
  document.getElementById("res-left").innerHTML = leftItems
    .map(
      (item) => `
      <div class="al-pair">
        <img src="${vocabUrl(item.img)}" alt="">
        <span style="font:500 13px 'Work Sans',sans-serif;color:#555">${item.en || ""}</span>
      </div>`
    )
    .join("");
  document.getElementById("res-right").innerHTML = rightItems
    .map((item, index) => {
      const matched = graded.find((g) => g.right === index);
      const ok = matched?.correct;
      const note = matched
        ? ok
          ? lang === "sv"
            ? `${item.en || ""} — din linje var rätt`
            : `${item.en || ""} — your line was right`
          : lang === "sv"
            ? `du kopplade den till ${matched.leftItem.sv}`
            : `you linked this to ${matched.leftItem.en || matched.leftItem.sv}`
        : "";
      return `<div class="al-result-word ${ok ? "al-result-ok" : "al-result-no"}">
        <i class="fa-solid ${ok ? "fa-check" : "fa-xmark"}" style="color:${ok ? "#1f6b3a" : "#9d0000"}"></i>
        <div><div style="font:600 19px/1.1 'Work Sans',sans-serif;color:#14100e">${item.sv}</div>
        <div style="font:400 12.5px 'Work Sans',sans-serif;margin-top:2px">${note}</div></div>
      </div>`;
    })
    .join("");

  requestAnimationFrame(() => {
    const svg = document.getElementById("result-wires");
    const stage = document.getElementById("result-stage");
    const root = stage.getBoundingClientRect();
    const leftCards = [...document.querySelectorAll("#res-left .al-pair")];
    const rightCards = [...document.querySelectorAll("#res-right .al-result-word")];
    svg.innerHTML = graded
      .map((g) => {
        const a = leftCards[g.left].getBoundingClientRect();
        const b = rightCards[g.right].getBoundingClientRect();
        const x1 = a.right - root.left - 8;
        const y1 = a.top + a.height / 2 - root.top;
        const x2 = b.left - root.left + 8;
        const y2 = b.top + b.height / 2 - root.top;
        const stroke = g.correct ? "#1f6b3a" : "#9d0000";
        const dash = g.correct ? "" : 'stroke-dasharray="8 7"';
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round" ${dash}></line>`;
      })
      .join("");
  });

  document.getElementById("continue").addEventListener("click", () => {
    const { progress, total, unlockedNext } = recordLevelScore(2, roundScore);
    document.getElementById("done-score").textContent = String(roundScore);
    document.getElementById("next-level").style.display = progress.currentLevel >= 3 ? "flex" : "none";
    document.getElementById("done-note").textContent = roundSummary(lang, {
      round: roundScore,
      max: PAIR_COUNT,
      level: 2,
      total,
      unlockedNext
    });
    show("done");
  });
}

render();

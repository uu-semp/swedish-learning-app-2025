// ==============================================
// Owned by Game 10
// ==============================================

import { getLang } from "../dev-tools/cookies.js";
import { applyI18n } from "../dev-tools/i18n.js";
import { whenReady, foodItems, pickN, vocabUrl, renderPips } from "../dev-tools/util.js";

const PAIR_COUNT = 4;

let lang = "en";
let leftItems = [];
let rightItems = [];
let links = []; // {left, right}
let drag = null;

function applyText() {
  applyI18n(lang);
}

function nodePoint(side, index) {
  const el = document.querySelector(`[data-${side}="${index}"] .al-node`);
  const stage = document.getElementById("stage");
  const root = stage.getBoundingClientRect();
  const box = el.getBoundingClientRect();
  return { x: box.left + box.width / 2 - root.left, y: box.top + box.height / 2 - root.top };
}

function drawPlayWires() {
  const svg = document.getElementById("wires");
  let html = "";
  links.forEach((link) => {
    const a = nodePoint("left", link.left);
    const b = nodePoint("right", link.right);
    html += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#9d0000" stroke-width="3" stroke-linecap="round"></line>`;
  });
  if (drag) {
    const a = nodePoint("left", drag.left);
    html += `<line x1="${a.x}" y1="${a.y}" x2="${drag.x}" y2="${drag.y}" stroke="#9d0000" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"></line>`;
  }
  svg.innerHTML = html;
  document.querySelectorAll("[data-left]").forEach((el) => {
    el.classList.toggle("al-linked", links.some((l) => l.left === Number(el.dataset.left)));
  });
  document.querySelectorAll("[data-right]").forEach((el) => {
    el.classList.toggle("al-linked", links.some((l) => l.right === Number(el.dataset.right)));
  });
  document.getElementById("link-count").textContent = `${links.length} / ${PAIR_COUNT}`;
  document.getElementById("submit").disabled = links.length !== PAIR_COUNT;
}

function renderPlayBoard() {
  const leftCol = document.getElementById("left-col");
  const rightCol = document.getElementById("right-col");
  leftCol.innerHTML = leftItems
    .map(
      (item, i) => `
      <div class="al-pair" data-left="${i}">
        <img src="${vocabUrl(item.img)}" alt="${item.en || item.sv}">
        <span style="font:500 13px 'Work Sans',sans-serif;color:#555">${item.en || ""}</span>
        <span class="al-node al-node-r"></span>
      </div>`
    )
    .join("");
  rightCol.innerHTML = rightItems
    .map(
      (item, i) => `
      <div class="al-word" data-right="${i}">
        <span class="al-node al-node-l"></span>
        ${item.sv}
      </div>`
    )
    .join("");
  links = [];
  drag = null;
  requestAnimationFrame(drawPlayWires);
}

function startRound() {
  const pool = foodItems().filter((item) => item.img);
  leftItems = pickN(pool.length ? pool : foodItems(), PAIR_COUNT);
  rightItems = pickN(leftItems, PAIR_COUNT);
  document.getElementById("round-label").textContent =
    lang === "sv" ? "Matcha paren" : "Match the pairs";
  renderPips(document.getElementById("pips"), [], 0, PAIR_COUNT);
  renderPlayBoard();
}

function pointerPos(e, stage) {
  const root = stage.getBoundingClientRect();
  return { x: e.clientX - root.left, y: e.clientY - root.top };
}

function setupDrag() {
  const stage = document.getElementById("stage");
  stage.addEventListener("pointerdown", (e) => {
    const card = e.target.closest("[data-left]");
    if (!card) return;
    const left = Number(card.dataset.left);
    links = links.filter((l) => l.left !== left);
    const p = pointerPos(e, stage);
    drag = { left, x: p.x, y: p.y };
    stage.setPointerCapture(e.pointerId);
    drawPlayWires();
  });
  stage.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const p = pointerPos(e, stage);
    drag.x = p.x;
    drag.y = p.y;
    drawPlayWires();
  });
  const endDrag = (e) => {
    if (!drag) return;
    const drop = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-right]");
    if (drop) {
      const right = Number(drop.dataset.right);
      links = links.filter((l) => l.left !== drag.left && l.right !== right);
      links.push({ left: drag.left, right });
    }
    drag = null;
    drawPlayWires();
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", () => {
    drag = null;
    drawPlayWires();
  });
}

function submitRound() {
  sessionStorage.setItem(
    "eatLearnL2",
    JSON.stringify({ leftItems, rightItems, links })
  );
  window.location.href = "answer_verify.html";
}

whenReady(() => {
  lang = getLang();
  applyText();
  setupDrag();

  document.querySelectorAll(".js-menu").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  });
  document.getElementById("clear").addEventListener("click", () => {
    links = [];
    drawPlayWires();
  });
  document.getElementById("submit").addEventListener("click", submitRound);
  startRound();
});

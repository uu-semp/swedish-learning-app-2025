// ==============================================
// Owned by Game 10
// ==============================================

import { getLang, changeWeight } from "../dev-tools/cookies.js";
import { t } from "../dev-tools/i18n.js";
import { whenReady, getBatch, vocabUrl, playAudio, preloadImages } from "../dev-tools/util.js";

const FRONT = document.getElementById("card-front");
const BACK = document.getElementById("card-back");
const DONE = document.getElementById("done");
const DECK_SIZE = 10;

let lang = "en";
let cards = [];
let index = 0;
let known = [];
let queue = [];

function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(lang, el.dataset.i18n);
  });
}

function show(screen) {
  [FRONT, BACK, DONE].forEach((el) => el.classList.toggle("is-on", el === screen));
}

function renderPips(el) {
  el.innerHTML = cards
    .map((_, i) => {
      let cls = "al-card-pip";
      if (known.includes(i)) cls += " is-on";
      else if (i === index) cls += " is-now";
      return `<div class="${cls}"></div>`;
    })
    .join("");
}

function renderCard() {
  const card = cards[index];
  if (!card) return finish();
  const label = lang === "sv" ? `Kort ${index + 1} av ${cards.length}` : `Card ${index + 1} of ${cards.length}`;
  document.getElementById("card-label").textContent = label;
  document.getElementById("card-label-back").textContent = label;
  renderPips(document.getElementById("card-pips"));
  renderPips(document.getElementById("card-pips-back"));
  const src = vocabUrl(card.img);
  document.getElementById("front-img").src = src;
  document.getElementById("front-img").alt = card.en || card.sv;
  document.getElementById("back-img").src = src;
  document.getElementById("back-sv").textContent = card.sv;
  document.getElementById("back-en").textContent = card.en || "";
}

function showNext() {
  if (!queue.length) return finish();
  index = queue[0];
  renderCard();
  show(FRONT);
}

function finish() {
  show(DONE);
}

function start() {
  lang = getLang();
  applyI18n();
  cards = getBatch(DECK_SIZE, "recognition");
  preloadImages(cards);
  index = 0;
  known = [];
  queue = cards.map((_, i) => i);
  if (!cards.length) return;
  renderCard();
  show(FRONT);
}

whenReady(() => {
  start();
  document.querySelectorAll(".js-exit").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  });
  document.getElementById("flip-front").addEventListener("click", () => {
    show(BACK);
    playAudio(cards[index]?.audio);
  });
  document.getElementById("flip-back").addEventListener("click", (e) => {
    if (e.target.closest("#listen")) return;
    show(FRONT);
  });
  document.getElementById("listen").addEventListener("click", (e) => {
    e.stopPropagation();
    playAudio(cards[index]?.audio);
  });
  document.getElementById("repeat").addEventListener("click", (e) => {
    e.stopPropagation();
    queue.push(queue.shift());
    showNext();
  });
  document.getElementById("got-it").addEventListener("click", (e) => {
    e.stopPropagation();
    if (!known.includes(index)) {
      known.push(index);
      const id = cards[index]?.id;
      if (id) changeWeight(id, "recognition", 1);
    }
    queue.shift();
    showNext();
  });
  document.getElementById("again").addEventListener("click", start);
});

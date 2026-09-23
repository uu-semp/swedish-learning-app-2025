// ==============================================
// Owned by Game 10
// ==============================================

export function rootPath() {
  return document.documentElement.dataset.root || "../..";
}

export function decoPath(file) {
  const base = document.documentElement.dataset.images || "images";
  return `${base}/${file}`;
}

export function vocabUrl(rel) {
  if (!rel) return "";
  return `${rootPath()}/${String(rel).replace(/^\//, "")}`;
}

export function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function foodItems() {
  const ids = window.vocabulary.get_category("food") || [];
  return ids
    .map((id) => {
      const v = window.vocabulary.get_vocab(id);
      return v ? { id, ...v } : null;
    })
    .filter((v) => v && v.sv);
}

export function pickN(list, n) {
  return shuffle(list).slice(0, Math.min(n, list.length));
}

export function playAudio(rel) {
  const src = vocabUrl(rel);
  if (!src) return;
  const audio = new Audio(src);
  audio.play().catch(() => {});
}

export function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("sv-SE")
    .replace(/\s+/g, " ");
}

export function whenReady(callback) {
  window.vocabulary.when_ready(callback);
}

export function pipClass(state) {
  if (state === 1) return "al-pip al-pip-ok";
  if (state === 0) return "al-pip al-pip-no";
  if (state === "now") return "al-pip al-pip-now";
  return "al-pip";
}

export function renderPips(el, results, currentIndex, total) {
  if (!el) return;
  const bits = [];
  for (let i = 0; i < total; i++) {
    let cls = "al-pip";
    let icon = "fa-solid fa-minus";
    if (results[i] === true) {
      cls += " al-pip-ok";
      icon = "fa-solid fa-check";
    } else if (results[i] === false) {
      cls += " al-pip-no";
      icon = "fa-solid fa-xmark";
    } else if (i === currentIndex) {
      cls += " al-pip-now";
      icon = "fa-solid fa-circle";
    }
    bits.push(`<div class="${cls}"><i class="${icon}"></i></div>`);
  }
  el.innerHTML = bits.join("");
}

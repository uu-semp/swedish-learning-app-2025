"use strict";

let language = new URLSearchParams(window.location.search).get("lang") || "sv";
let translations = {};
let games = [];

const categorySelect = document.getElementById("srs-category");
const tableBody = document.getElementById("srs-words");

function categoryLabel(category) {
  const translation = translations[`srs-category-${category}`] ||
    translations[`theme-${category}`];
  return translation
    ? translation[language]
    : category.charAt(0).toUpperCase() + category.slice(1);
}

function translatePage() {
  document.querySelectorAll(".translate").forEach((element) => {
    const entry = translations[element.id];
    if (entry) element.innerHTML = entry[language];
  });
  document.documentElement.lang = language;
}

function populateCategories() {
  const previousValue = categorySelect.value || "all";
  const categories = window.parent.vocabulary.get_categories();
  if (!Array.isArray(categories)) {
    throw new Error("Vocabulary categories are not available.");
  }

  categorySelect.replaceChildren();
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = translations["srs-all-categories"][language];
  categorySelect.appendChild(allOption);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = categoryLabel(category);
    categorySelect.appendChild(option);
  });

  categorySelect.value = categories.includes(previousValue) ? previousValue : "all";
}

function waitForVocabulary() {
  if (window.parent._vocabulary?.pending === 0) return Promise.resolve();

  return new Promise((resolve) => {
    window.parent.vocabulary.when_ready(resolve);
  });
}

function renderWords() {
  const category = categorySelect.value === "all" ? null : categorySelect.value;
  const words = window.parent.srs.getSeenWords(
    games.map((game) => game.id),
    category
  );
  tableBody.replaceChildren();

  words.forEach((word) => {
    const row = document.createElement("tr");
    [
      word.sv || word.en || word.id,
      categoryLabel(word.category),
      word.seen,
      word.correct,
      word.wrong,
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = String(value);
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });

  document.getElementById("srs-empty").hidden = words.length > 0;
  document.getElementById("srs-table").hidden = words.length === 0;
}

async function refresh() {
  const errorElement = document.getElementById("srs-error");
  try {
    await waitForVocabulary();
    errorElement.hidden = true;
    populateCategories();
    renderWords();
  } catch (error) {
    console.error("Could not display vocabulary practice history:", error);
    errorElement.textContent = error.message;
    errorElement.hidden = false;
  }
}

categorySelect.addEventListener("change", refresh);
window.addEventListener("message", (event) => {
  if (event.source !== window.parent) return;
  if (event.data?.type === "setLanguage" && ["en", "sv"].includes(event.data.lang)) {
    language = event.data.lang;
    translatePage();
    refresh();
  } else if (event.data?.type === "srsUpdated") {
    refresh();
  }
});

async function init() {
  try {
    const [translationResponse, gamesResponse] = await Promise.all([
      fetch("assets/main_menu/menu_translations.json"),
      fetch("assets/main_menu/games.json"),
    ]);
    if (!translationResponse.ok || !gamesResponse.ok) {
      throw new Error("Could not load vocabulary practice page data.");
    }
    translations = await translationResponse.json();
    games = await gamesResponse.json();
    translatePage();
    refresh();
  } catch (error) {
    console.error("Could not initialize vocabulary practice page:", error);
    const errorElement = document.getElementById("srs-error");
    errorElement.textContent = error.message;
    errorElement.hidden = false;
  }
}

init();

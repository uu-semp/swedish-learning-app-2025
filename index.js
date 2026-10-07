// ==============================================
// Owned by the Menu Team
// ==============================================

"use strict";


// Elements
const grid = document.getElementById("game-grid");
const frame = document.getElementById("game-frame");
const menu = document.getElementById("game-menu");
const stage = document.getElementById("game-stage");
const backBtn = document.getElementById("back-btn");
const filterBar = document.getElementById("filter-bar");

let allGames = [];
let currentLanguage = 'sv';
let translations = {};

/** Stable order for theme filter buttons (not game sort order). */
const THEME_ORDER = ["clothing", "furniture", "food", "time", "numbers", "places", "colors"];

/** Active theme ids; empty set means "All themes" mode. */
const activeThemes = new Set();

function themeLabel(themeId) {
  const entry = translations[`theme-${themeId}`];
  return entry ? entry[currentLanguage] : themeId;
}

function isAllThemesMode() {
  return activeThemes.size === 0;
}

function getFilteredGames() {
  if (isAllThemesMode()) return allGames;
  return allGames.filter(
    (g) =>
      Array.isArray(g.themes) &&
      g.themes.some((themeId) => activeThemes.has(themeId))
  );
}

function syncFilterButtonStyles() {
  document.querySelectorAll(".filter-btn").forEach((b) => {
    const id = b.dataset.theme;
    if (id === "all") {
      b.classList.toggle("active", isAllThemesMode());
    } else {
      b.classList.toggle("active", activeThemes.has(id));
    }
  });
}

function applyThemeFilter() {
  syncFilterButtonStyles();
  renderGrid(getFilteredGames());
}

function selectAllThemes() {
  activeThemes.clear();
  applyThemeFilter();
}

function toggleThemeFilter(value) {
  if (value === "all") {
    selectAllThemes();
    return;
  }

  if (isAllThemesMode()) {
    activeThemes.add(value);
  } else if (activeThemes.has(value)) {
    activeThemes.delete(value);
  } else {
    activeThemes.add(value);
  }

  applyThemeFilter();
}

function updateFilterBarLabels() {
  const label = document.getElementById("filter");
  if (label && translations.filter) {
    label.textContent = translations.filter[currentLanguage];
  }
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    const id = btn.dataset.theme;
    btn.textContent =
      id === "all" ? translations["theme-all"][currentLanguage] : themeLabel(id);
  });
}

//// Data ////
// Load games from JSON
async function loadGames() {
  try {
    setLanguage(currentLanguage)
    // Load game data
    const res = await fetch("assets/main_menu/games.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load games.json");
    allGames = await res.json();

    const themeSet = new Set(allGames.flatMap((g) => g.themes || []));
    const themes = THEME_ORDER.filter((t) => themeSet.has(t));
    buildFilter(themes);
    selectAllThemes();
  } catch (err) {
    console.error("Error loading games:", err);
    grid.innerHTML = "<p>Could not load games.</p>";
  }
}


//// UI ////
function buildFilter(themes) {
  filterBar.innerHTML = "";

  const label = document.createElement("span");
  label.className = "filter-label";
  label.id = "filter";
  label.textContent = translations.filter[currentLanguage];
  filterBar.appendChild(label);

  filterBar.appendChild(makeFilterBtn("all"));
  themes.forEach((themeId) => filterBar.appendChild(makeFilterBtn(themeId)));
}

function makeFilterBtn(value) {
  const btn = document.createElement("button");
  btn.className = "filter-btn";
  btn.dataset.theme = value;
  btn.textContent =
    value === "all"
      ? translations["theme-all"][currentLanguage]
      : themeLabel(value);
  return btn;
}

filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  toggleThemeFilter(btn.dataset.theme);
});

// Render grid of game cards
function renderGrid(games) {
  grid.innerHTML = "";

  games.forEach((g) => {
    const card = document.createElement("article");
    card.className = "card";
    card.id = `${g.id}`

    const uniqueThemes = Array.isArray(g.themes)
      ? [...new Set(g.themes)]
      : [];
    const tagsHtml = uniqueThemes.length
      ? `<div class="card-tags">
           ${uniqueThemes
             .map(
               (themeId) =>
                 `<span class="tag" data-theme="${themeId}">${themeLabel(themeId)}</span>`
             )
             .join("")}
         </div>`
      : "";
    
    // Build game card HTML
    card.innerHTML = `
      <img src="assets/main_menu/images/game_logos/${g.id}_logo.png" 
           alt="${g.title[currentLanguage]}"
           onerror="this.onerror=null; this.src='assets/main_menu/images/game_logos/default_image.png';">
      <div class="card-body">
        <h3>${g.title[currentLanguage]}</h3>
        <p>${g.desc[currentLanguage].replace(/\n/g, '<br>')}</p>
        ${tagsHtml}
      </div>
      `;

    // Add click event to open game
    card.addEventListener("click", () => openIframe(`./${g.id}/index.html`));
    grid.appendChild(card);
  });
}

//// Settings Feature ////
 // Creates a settings overlay with the following features:
 // (1) a slider for the global volume control
 // (2) a button to the 'add vocabulary' form, managed by team03
 // (3) a 'clear saved data' button
(() => {
  const settingsBtn = document.getElementById('settings-btn');
  if (!settingsBtn) return;

  //Creates the settings overlay UI
  function createSettingsOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'settings-overlay';

    const box = document.createElement('div');
    box.id = 'settings-box';
    
    box.innerHTML = `
      <div class="settings-header">
        <h2 class="settings-title">${translations["settings-btn"][currentLanguage]}</h2>
        <button id="_close_settings" class="settings-btn close">${translations["close"][currentLanguage]}</button>
      </div>
      <div class="settings-actions">
        <button id="_open_add" class="settings-btn primary">${translations["add-word"][currentLanguage]}</button>
        <button id="_clear_save" class="settings-btn secondary">${translations["clear-data"][currentLanguage]}</button>
      </div>
    `;
      
    
    overlay.appendChild(box);
      // Close overlay when clicking outside the box
      overlay.addEventListener('mousedown', (e) => {
        if (e.target === overlay) overlay.remove();
      });

    // Settings overlay event handlers
    overlay.querySelector('#_close_settings').addEventListener('click', () => overlay.remove());

    // Clear saved data button
    overlay.querySelector('#_clear_save').addEventListener('click', () => {
      const confirmBox = document.createElement('div');
      confirmBox.className = 'confirm-box translate';
      confirmBox.innerHTML = `
        ${translations["clear?"][currentLanguage]}
        <div class="confirm-box-actions">
          <button class="settings-btn confirm-box-btn cancel" 
            onclick="this.parentElement.parentElement.remove()">${translations["cancel"][currentLanguage]}</button>
          <button class="settings-btn confirm-box-btn confirm" 
            id="_confirm_clear">${translations["clear-data"][currentLanguage]}</button>
        </div>
      `;
      
      box.appendChild(confirmBox);
      
      confirmBox.querySelector('#_confirm_clear').onclick = () => {
        // Clear data for every game, plus the vocabulary extension
        [...allGames.map(g => g.id), 'team03'].forEach(name => window.save.clear(name));
        confirmBox.remove();
        
        // Show success message
        const msg = document.createElement('div');
        msg.className = 'success-message';
        msg.textContent = 'Game data cleared successfully';
        box.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
      };
    });  // Add vocabulary button - will open the form once present, for now opens a new tab to team03
  overlay.querySelector('#_open_add').addEventListener('click', () => {
      const candidate = './team03/index.html';
      fetch(candidate, { method: 'HEAD' }).then(res => {
        if (res.ok) window.open(candidate, '_blank');
        else window.open('about:blank', '_blank');
      }).catch(() => window.open('about:blank', '_blank'));
    });

    return overlay;
  }

  settingsBtn.addEventListener('click', () => {
    const existing = document.getElementById('settings-overlay');
    if (existing) return; // already open
    document.body.appendChild(createSettingsOverlay());
  });
})();

//// Navigation ////
// Open game in iframe
function openIframe(src) {
  let back_btn
  frame.src = src;
  menu.hidden = true;
  stage.hidden = false;
  // Get correctly translated text for the back button
  back_btn = document.getElementById('back-btn')
  back_btn.textContent = translations['back-btn'][currentLanguage]

  // Save current game to sessionStorage
  sessionStorage.setItem("currentGameSrc", src);
}

// Back to menu
backBtn.addEventListener("click", () => {
  frame.src = ""; // Stop the game
  stage.hidden = true;
  menu.hidden = false;

  // Remove current game to sessionStorage
  sessionStorage.removeItem("currentGameSrc");
});

window.addEventListener("DOMContentLoaded", () => {
  // Restore current game from sessionStorage
  const savedSrc = sessionStorage.getItem("currentGameSrc");

  if (savedSrc) {
    // Reopen the game directly
    openIframe(savedSrc);
  } else {
    // Make sure we’re on the menu
    backBtn.click();
  }
});

//// Language toggle ////

// Note: All text with translations in menu_translations.json must have the class 'translate'

/**
 * Loads the translations of menu text objects from the file menu_translations.json
 * Must be run first since text objects depend on access to the translations.
 */
async function loadTranslations() {
  try {
    const data = await fetch('assets/main_menu/menu_translations.json');
    if (!data.ok) throw new Error("Failed to menu_translations.json");
    translations = await data.json()
  } catch (error) {
    console.error(error);
  }
}

/**
 * Executes when one of the language toggle buttons are pressed or when the page is first loaded. 
 * Fetches text from menu_translations.json for all menu elements that require text and switches
 * so the 'lang' translation is displayed. Also rerenders the filter buttons and game grid to
 * display the correct translation.
 * @param lang either 'en' or 'sv', since those are the two options in the menu_translations file
 */
async function setLanguage(lang) {
  try {
    currentLanguage = lang
    const elements = document.querySelectorAll('.translate');

    // Translating menu text (not games or filter)
    elements.forEach(el => {
      const id = el.getAttribute('id');
      el.innerHTML = translations[id][lang];
    })

    updateFilterBarLabels();

    if (allGames.length) {
      renderGrid(getFilteredGames());
    }
   
  } catch (error) {
    console.error(error)
  }
}

//// Init ////

async function init() {
  await loadTranslations()
  loadGames();
}

init()
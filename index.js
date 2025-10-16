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

//// Data ////
// Load games from JSON
async function loadGames() {
  try {
    setLanguage(currentLanguage)
    // Load game data
    const res = await fetch("assets/main_menu/games.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load games.json");
    allGames = await res.json();

    // Sort by smallest supported chapter
    allGames.sort((a, b) => {
      const aMin = Math.min(...a.supported_chapters);
      const bMin = Math.min(...b.supported_chapters);
      return aMin - bMin;
    });

    // Filter games by chapter
    const chapters = [...new Set(allGames.flatMap(g => g.supported_chapters))].sort((a, b) => a - b);
    buildFilter(chapters);
    setActiveFilter("all", true);

    // Render game grid
    renderGrid(allGames);
  } catch (err) {
    console.error("Error loading games:", err);
    grid.innerHTML = "<p>Could not load games.</p>";
  }
}


//// UI ////
// Build filter button
function buildFilter(chapters){
  filterBar.innerHTML = ""; // clear

  // Add instruction text
  const label = document.createElement("span");
 
  label.className = "filter-label";
  label.id = "filter"
   label.textContent = translations["filter"][currentLanguage];
  filterBar.appendChild(label);

  // "All" first
  filterBar.appendChild(makeFilterBtn("All","all"));
  // then one per chapter
  chapters.forEach(ch => filterBar.appendChild(makeFilterBtn(ch, String(ch))));
}

function makeFilterBtn(index, value){
  const btn = document.createElement("button");
  btn.className = "filter-btn"; 
  btn.textContent = `${translations["chapter"][currentLanguage]} ${index}`;
 
  btn.dataset.chapter = value;
  return btn;
}

// Handle filter button
filterBar.addEventListener("click", (e)=>{
  const btn = e.target.closest(".filter-btn");
  if(!btn) return;
  const value = btn.dataset.chapter;
  const wasActive = btn.classList.contains("active");
  setActiveFilter(value, !wasActive);
  
  // Show all games if "all" is selected or no filters active
  if(activeFilters.has("all") || activeFilters.size === 0) {
    return renderGrid(allGames);
  }
  
  // Show games matching any selected chapter
  renderGrid(allGames.filter(g => 
    g.supported_chapters.some(ch => activeFilters.has(String(ch)))
  ));
});

// Track active filters using a Set
const activeFilters = new Set(["all"]);

function setActiveFilter(value, active) {
  if (value === "all") {
    activeFilters.clear();
    if (active) activeFilters.add("all");
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", active && b.dataset.chapter === "all"));
  } else {
    activeFilters.delete("all");
    if (active) activeFilters.add(value);
    else activeFilters.delete(value);
    document.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.chapter === "all" ? false : activeFilters.has(b.dataset.chapter));
    });
  }
}

// Render grid of game cards
function renderGrid(games) {
  grid.innerHTML = "";

  games.forEach((g) => {
    const card = document.createElement("article");
    card.className = "card";
    card.id = `${g.id}`

    // Build game tags HTML
    const tagsHtml = (Array.isArray(g.supported_chapters) && g.supported_chapters.length)
      ? `<div class="card-tags">
           ${g.supported_chapters.map(ch => `<span class="tag" data-chapter=${ch}>${translations["chapter"][currentLanguage]} ${ch}</span>`).join("")}
         </div>`
      : "";
    
    // Build game card HTML
    card.innerHTML = `
      <img src="assets/main_menu/images/game_logos/${g.id}_logo.png" 
           alt="${g.title[currentLanguage]}"
           onerror="this.onerror=null; this.src='assets/main_menu/images/games/default_image.png';">
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
        // Clear data for all teams
        for (let i = 1; i <= 16; i++) {
          const teamName = `team${String(i).padStart(2, '0')}`;
          window.save.clear(teamName);
        }
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

    // Translating all text in the game grid
    allGames.forEach((g) => {
      // the 'alt' text for the image
      const img = document.querySelector(`#${g.id} > img`);
      img.alt = g["title"][currentLanguage];

      // the title of the game
      const h3 = document.querySelector(`#${g.id} > div > h3`);
      h3.innerHTML = g["title"][currentLanguage];

      // the description of the game
      const p = document.querySelector(`#${g.id} > div > p`);
      p.innerHTML = g["desc"][currentLanguage];
    })

    // Translating the filter buttons
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(fil => {
      //console.log(fil)
      const index = fil.getAttribute('data-chapter')
      fil.textContent = `${translations["chapter"][currentLanguage]} ${index}`
    })

    // Translating the filter tags in the game grid
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
      const index = tag.getAttribute('data-chapter')
      tag.textContent = `${translations["chapter"][currentLanguage]} ${index}`
    })
   
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
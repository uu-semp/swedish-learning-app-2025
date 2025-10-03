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
let language = 'sv'

//// Data ////
// Load games from JSON
async function loadGames() {
  try {
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
    buildFilter(chapters, language);
    setActiveFilter("all"); // default

    // Render game grid
    renderGrid(allGames, language);
  } catch (err) {
    console.error("Error loading games:", err);
    grid.innerHTML = "<p>Could not load games.</p>";
  }
}


//// UI ////
// Build filter button
function buildFilter(chapters, lang){
  filterBar.innerHTML = ""; // clear

  // Add instruction text
  const label = document.createElement("span");

  if (lang == 'sv') {
    label.textContent = "Filtrera efter kapitel:";
  } else if (lang == 'en') {
    label.textContent = "Filter by chapter:";
  }

  label.className = "filter-label";
  filterBar.appendChild(label);

  // "All" first
  filterBar.appendChild(makeFilterBtn("All","all"));
  // then one per chapter
  if (lang == 'en') {
    chapters.forEach(ch => filterBar.appendChild(makeFilterBtn(`Chapter ${ch}`, String(ch))));
  } else {
    chapters.forEach(ch => filterBar.appendChild(makeFilterBtn(`Kapitel ${ch}`, String(ch))));
  }
  
}

function makeFilterBtn(label, value){
  const btn = document.createElement("button");
  btn.className = "filter-btn";
  btn.textContent = label;
  btn.dataset.chapter = value;
  return btn;
}

// Handle filter button
filterBar.addEventListener("click", (e)=>{
  const btn = e.target.closest(".filter-btn");
  if(!btn) return;
  const value = btn.dataset.chapter;
  setActiveFilter(value);
  if(value === "all") return renderGrid(allGames, language);
  const chNum = Number(value);
  renderGrid(allGames.filter(g => g.supported_chapters.includes(chNum)), language);
});

function setActiveFilter(value){
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b.dataset.chapter === value));
}

// Render grid of game cards
function renderGrid(games, lang) {
  console.log("renderGrid, language. ", lang)
  grid.innerHTML = "";

  games.forEach((g) => {
    const card = document.createElement("article");
    card.className = "card";

    // Build game tags HTML
    const tagsHtml = (Array.isArray(g.supported_chapters) && g.supported_chapters.length)
      ? `<div class="card-tags">
           ${g.supported_chapters.map(ch => `<span class="tag">Kapitel ${ch}</span>`).join("")}
         </div>`
      : "";

    // Build game card HTML
    if(lang == 'sv') {
      console.log('svenska')
      card.innerHTML = `
      <img src="assets/main_menu/images/games/${g.id}.png" 
           alt="${g.sv_title}"
           onerror="this.onerror=null; this.src='assets/main_menu/images/games/default_image.png';">
      <div class="card-body">
        <h3>${g.sv_title}</h3>
        <p>${g.sv_desc}</p>
        ${tagsHtml}
      </div>
      `;
    } else if (lang == 'en') {
      console.log('english')
      card.innerHTML = `
      <img src="assets/main_menu/images/games/${g.id}.png" 
           alt="${g.eng_title}"
           onerror="this.onerror=null; this.src='assets/main_menu/images/games/default_image.png';">
      <div class="card-body">
        <h3>${g.eng_title}</h3>
        <p>${g.eng_desc}</p>
        ${tagsHtml}
      </div>
      `;
    }

    // Add click event to open game
    card.addEventListener("click", () => openIframe(`./${g.id}/index.html`));
    grid.appendChild(card);
  });
}


//// Navigation ////
// Open game in iframe
function openIframe(src) {
  frame.src = src;
  menu.hidden = true;
  stage.hidden = false;

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


//// Init ////
loadGames();

//// Language toggle buttons////

/**
 * Executes when one of the language toggle buttons are pressed. Fetches text from
 * either sv.json or en.json for all menu elements that require text.
 * @param new_lang 'sv' or 'en' depending on which button was pressed
 */
function toggleLanguage(new_lang) {
  const chapters = [...new Set(allGames.flatMap(g => g.supported_chapters))].sort((a, b) => a - b);
  buildFilter(chapters, new_lang)
  setActiveFilter("all");
  renderGrid(allGames, new_lang)

  if (new_lang == 'en'){
    fetch('assets/main_menu/menu_text/en.json')
      .then(response => response.json())
      .then(data => {
        document.getElementById('footer-text').textContent=data.footer
        document.getElementById('back-btn').textContent=data.backbtn
        document.getElementById('about-btn').textContent=data.about
        document.getElementById('settings-btn').textContent=data.settings
        document.getElementById('intro-title').innerHTML=data.title
        document.getElementById('intro-desc').innerHTML=data.desc
      })
    .catch(error => {
        console.error('JSON loading error: ', error);
    });
  } else if (new_lang == 'sv'){
    fetch('assets/main_menu/menu_text/sv.json')
        .then(response => response.json())
        .then(data => {
          document.getElementById('footer-text').textContent=data.footer
          document.getElementById('back-btn').textContent=data.backbtn
          document.getElementById('about-btn').textContent=data.about
          document.getElementById('settings-btn').textContent=data.settings
          document.getElementById('intro-title').innerHTML=data.title
          document.getElementById('intro-desc').innerHTML=data.desc
        })
    .catch(error => {
        console.error('JSON loading error: ', error);
    });
  }

  
}
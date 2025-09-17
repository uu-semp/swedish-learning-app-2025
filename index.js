// ==============================================
// Owned by the Menu Team
// ==============================================

"use strict";

// TODO: Remove this test code
$(function() {
    $("#check-jquery").on("click", () => {
        alert("JavaScript and jQuery are working.");
    });
});

// Elements
const grid = document.getElementById("game-grid");
const frame = document.getElementById("game-frame");
const menu = document.getElementById("game-menu");
const stage = document.getElementById("game-stage");
const backBtn = document.getElementById("back-btn");
const filterBar = document.getElementById("filter-bar");

let allGames = [];

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
    buildFilter(chapters);
    setActiveFilter("all"); // default

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
  label.textContent = "Filter by chapter:";
  label.className = "filter-label";
  filterBar.appendChild(label);

  // "All" first
  filterBar.appendChild(makeFilterBtn("All","all"));
  // then one per chapter
  chapters.forEach(ch => filterBar.appendChild(makeFilterBtn(`Chapter ${ch}`, String(ch))));
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
  if(value === "all") return renderGrid(allGames);
  const chNum = Number(value);
  renderGrid(allGames.filter(g => g.supported_chapters.includes(chNum)));
});

function setActiveFilter(value){
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b.dataset.chapter === value));
}

// Render grid of game cards
function renderGrid(games) {
  grid.innerHTML = "";
  games.forEach((g) => {
    const card = document.createElement("article");
    card.className = "card";

    // Build game tags HTML
    const tagsHtml = (Array.isArray(g.supported_chapters) && g.supported_chapters.length)
      ? `<div class="card-tags">
           ${g.supported_chapters.map(ch => `<span class="tag">Chapter ${ch}</span>`).join("")}
         </div>`
      : "";

    // Build game card HTML
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
}

// Back to menu
backBtn.addEventListener("click", () => {
  frame.src = "about:blank"; // Stop the game
  stage.hidden = true;
  menu.hidden = false;
});

//// Init ////
loadGames();
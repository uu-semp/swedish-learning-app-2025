document.addEventListener("DOMContentLoaded", () => {

  const bubble = document.getElementById("bubble")
let typingTimer = null

function typeText(text, i = 0) {
    clearTimeout(typingTimer)
    bubble.textContent = text.slice(0, i)

    if (i < text.length) {
        typingTimer = setTimeout(function () {
            typeText(text, i + 1)
        }, 50)
    }
}

  const english = {
    title: "Find the right house",
    instruction: "Choose a difficulty:",
    level1: "1 - Addresses and numbers",
    level2: "2 - Directions",
    level3: "3 - Transport",
    bubble: "Choose a difficulty and help us find the right place!"
}

const swedish = {
    title: "Hitta rätt hus",
    instruction: "Välj svårighetsgrad:",
    level1: "1 - Adresser och nummer",
    level2: "2 - Riktningar",
    level3: "3 - Färdsätt",
    bubble: "Välj en svårighetsgrad och hjälp oss hitta rätt!"
}

function setLanguage(language) {
    
    localStorage.setItem("game12Language", language)
    let text

    if (language === "en") {
        text = english
    } else {
        text = swedish
    }

    document.getElementById("menu-title").textContent = text.title
    document.getElementById("menu-instruction").textContent = text.instruction
    document.getElementById("lvl1").textContent = text.level1
    document.getElementById("lvl2").textContent = text.level2
    document.getElementById("lvl3").textContent = text.level3

    document.title = text.title
    document.documentElement.lang = language
    typeText(text.bubble)
}

const englishButton = window.parent.document.getElementById("lang-eng")
const swedishButton = window.parent.document.getElementById("lang-sv")

function useEnglish() {
    setLanguage("en")
}

function useSwedish() {
    setLanguage("sv")
}

englishButton.addEventListener("click", useEnglish)
swedishButton.addEventListener("click", useSwedish)

setLanguage(localStorage.getItem("game12Language") || "sv")

window.addEventListener("pagehide", function () {
    englishButton.removeEventListener("click", useEnglish)
    swedishButton.removeEventListener("click", useSwedish)
    clearTimeout(typingTimer)
})

  // === Click animation for characters and house ===
  document.querySelectorAll('.character, .house').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      img.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.08)' },
        { transform: 'scale(1)' }
      ], {
        duration: 220,
        easing: 'ease-out'
      });
    });
  });

});

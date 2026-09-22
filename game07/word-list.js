// ==============================================
// Owned by Game 07
// ==============================================

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  window.vocabulary.when_ready(function () {
    const list = document.getElementById("list");
    const tabAll = document.getElementById("tab-all-words");
    const tabMissed = document.getElementById("tab-missed-words");

    // Retrieve all words across main categories
    const clothing = window.vocabulary.get_category("clothing");
    const food = window.vocabulary.get_category("food");
    const furniture = window.vocabulary.get_category("furniture");
    const allIds = clothing.concat(food, furniture);

    const allWords = allIds.map(id => window.vocabulary.get_vocab(id)).filter(Boolean);

    let activeTab = "all";

    function getMissedWords() {
      if (window.save) {
        const saved = window.save.get("game07", "wrong_words");
        if (Array.isArray(saved)) {
          return saved;
        }
      }
      return [];
    }

    function renderList() {
      list.innerHTML = "";

      let wordsToDisplay = [];
      if (activeTab === "all") {
        wordsToDisplay = allWords;
      } else {
        wordsToDisplay = getMissedWords();
      }

      // Update tab counts
      const missedCount = getMissedWords().length;
      tabMissed.textContent = `Missed Words (${missedCount})`;

      if (wordsToDisplay.length === 0) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "empty-state";
        if (activeTab === "missed") {
          emptyDiv.textContent = "No missed words recorded yet! Play a game to test your vocabulary.";
        } else {
          emptyDiv.textContent = "No words available.";
        }
        list.appendChild(emptyDiv);
        return;
      }

      wordsToDisplay.forEach((word, index) => {
        const row = document.createElement("div");
        row.className = "word-row";

        const textP = document.createElement("p");
        textP.className = "word-text";
        const swedishFormatted = word.article ? `${word.article} ${word.sv}` : word.sv;
        textP.innerHTML = `${word.en} = <b>${swedishFormatted}</b>`;
        row.appendChild(textP);

        // Sound button
        if (word.audio) {
          const audioBtn = document.createElement("button");
          audioBtn.className = "word-audio-btn";
          audioBtn.title = "Play sound";
          audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
          audioBtn.addEventListener("click", () => {
            const audioPath = word.audio.startsWith("http") ? word.audio : "../" + word.audio;
            const audio = new Audio(audioPath);
            audio.play().catch((err) => {
              console.warn("Could not play audio for word:", word.sv, err);
            });
          });
          row.appendChild(audioBtn);
        }

        list.appendChild(row);

        if (index < wordsToDisplay.length - 1) {
          const hr = document.createElement("hr");
          list.appendChild(hr);
        }
      });
    }

    if (tabAll && tabMissed) {
      tabAll.addEventListener("click", () => {
        if (activeTab !== "all") {
          activeTab = "all";
          tabAll.classList.add("active");
          tabMissed.classList.remove("active");
          renderList();
        }
      });

      tabMissed.addEventListener("click", () => {
        if (activeTab !== "missed") {
          activeTab = "missed";
          tabMissed.classList.add("active");
          tabAll.classList.remove("active");
          renderList();
        }
      });
    }

    // Initial render
    renderList();
  });
});
"use strict";

$(function () {

  // --- 1. MODAL HELPER ---
  // A generic function to show the modal with custom title and content
  function showModal(title, contentHtml) {
    $("#modal-title").text(title);
    $("#modal-body").html(contentHtml);
    $("#generic-modal").removeClass("hidden");
  }

  // Event listener for closing the modal
  $("#modal-close").on("click", function () {
    $("#generic-modal").addClass("hidden");
  });


  // --- 2. UI UPDATE FUNCTION ---
  // This function runs on page load to set the correct state for buttons and progress
  function updateUI() {
    const stats = save.stats.get("team05");
    const wins = stats ? stats.wins : 0;
    const completion = stats ? stats.completion : 0;
    const continueBtn = $("#btn-continue");
    const progressIndicator = $("#progress-indicator");

    // Update progress text
    progressIndicator.text(`Progress: ${wins}/9 Levels (${completion}%)`);

    // Configure the "Continue" button based on progress
    if (wins > 0 && wins < 9) {
      continueBtn.prop("disabled", false);
    } else if (wins >= 9) {
      continueBtn.prop("disabled", true).html('<i class="fa-solid fa-check"></i> Game Complete');
    } else { // wins === 0
      continueBtn.prop("disabled", true);
    }
  }


  // --- 3. EVENT LISTENERS ---

  // "Start Game" button
  $("#btn-start").on("click", function () {
    $("#start-screen").hide();
    $("#levels-menu").removeClass("hidden");
  });

  // "Continue" button
  $("#btn-continue").on("click", function () {
    const stats = save.stats.get("team05");
    const wins = stats ? stats.wins : 0;

    if (wins > 0 && wins < 9) {
      const nextLevel = wins + 1;
      let path = '';
      if (nextLevel <= 3) path = 'easy';
      else if (nextLevel <= 6) path = 'medium';
      else path = 'hard';
      location.href = `${path}?level=${nextLevel}`;
    }
  });

  // "Back to Menu" button
  $("#btn-back-to-menu").on("click", function () {
    $("#levels-menu").addClass("hidden");
    $("#start-screen").show();
  });

  // "Introduction" button
  $("#btn-intro").on("click", function () {
    const introHtml = `
      <p>Welcome to Red Room, a vocabulary learning game designed to help you master Swedish words for furniture.</p>
      <h3>How to Play</h3>
      <p>The game is divided into three difficulties:</p>
      <ul>
        <li><b>Easy (Levels 1-3):</b> Match the Swedish words to the correct images.</li>
        <li><b>Medium (Levels 4-6):</b> Type the correct Swedish word for the item shown.</li>
        <li><b>Hard (Levels 7-9):</b> Drag and drop items into a room based on a descriptive prompt.</li>
      </ul>
      <p>Your progress is saved automatically. Good luck!</p>
    `;
    showModal("Introduction", introHtml);
  });

  // "Help" button
  $("#btn-help").on("click", function () {
    const helpHtml = `
      <h3>Navigation</h3>
      <ul>
          <li><b>Start Game:</b> Opens the difficulty selection menu.</li>
          <li><b>Continue:</b> Jumps to the next level you need to complete. This button is disabled if you haven't started or have finished the game.</li>
          <li><b>Clear Data:</b> Deletes all your saved progress. This cannot be undone!</li>
      </ul>
      <h3>Gameplay</h3>
      <p>Follow the on-screen instructions for each level. If you get stuck on the Hard levels, you will be given a hint after your first mistake and the option to skip the level after the second.</p>
    `;
    showModal("Help", helpHtml);
  });

  // "Credits" button
  $("#btn-credits").on("click", function () {
    let creditsHtml = '<ul>';
    const ids = window.vocabulary.get_category("furniture");

    // Auto-generate entries from vocabulary
    for (const id of ids) {
      const vocab = window.vocabulary.get_vocab(id);
      if (vocab && vocab.img && vocab.img_copyright) {
        creditsHtml += `
          <li>
            <img src="../${vocab.img}" alt="${vocab.en}">
            <strong>${vocab.en}</strong>
            <div class="copyright-text">${vocab.img_copyright}</div>
          </li>
        `;
      }
    }

    creditsHtml += `
      <li>
        <img src="assets/backgrounds/bathroom.svg">
        <strong>bathroom</strong>
        <div class="copyright-text"><a href="https://www.freepik.com/free-vector/empty-white-room-with-windows-white-tiles_19747879.htm#fromView=search&page=1&position=34&uuid=4556207f-3f01-4ae4-8040-9794f71bbda9&query=%40brgfx+empty+room">Image by brgfx on Freepik</a></div>
      </li>
    `;

    creditsHtml += `
      <li>
        <img src="assets/backgrounds/bedroom.svg">
        <strong>bedroom</strong>
        <div class="copyright-text"><a href="https://www.freepik.com/free-vector/empty-room-with-window-wooden-parquet-floor_16460044.htm#fromView=search&page=3&position=13&uuid=4556207f-3f01-4ae4-8040-9794f71bbda9&query=%40brgfx+empty+room">Image by brgfx on Freepik</a></div>
      </li>
    `;

    creditsHtml += `
      <li>
        <img src="assets/backgrounds/hallway.svg">
        <strong>hallway</strong>
        <div class="copyright-text"><a href="https://www.freepik.com/free-vector/empty-room-with-light-yellow-wall-parquet-floor_21196882.htm#fromView=keyword&page=2&position=11&uuid=c574da87-5d9b-42ae-8c46-e695856502f9&query=Room+side">Image by brgfx on Freepik</a></div>
      </li>
    `;

    creditsHtml += `
      <li>
        <img src="assets/logo.svg" alt="Game Logo">
        <strong>Game Logo & Design</strong>
        <div class="copyright-text">SEMP Team 05 2025</div>
      </li>
    `;

    creditsHtml += '</ul>';
    showModal('Credits & Licenses', creditsHtml);
  });

  // "Clear Data" button
  $("#btn-clear-data").on("click", function () {
    if (confirm("Are you sure you want to delete all your progress? This cannot be undone.")) {
      save.stats.clear("team05");
      location.reload();
    }
  });


  // --- 4. INITIALIZE ---
  // Run the UI update function when the page loads
  updateUI();

});
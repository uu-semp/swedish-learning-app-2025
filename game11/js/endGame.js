//This file is used to display the end game stats for the game.

//Trying to get the stats from sessionStorage, if it fails, stats will be null 
let stats = null;
try { stats = JSON.parse(sessionStorage.getItem('game11_end_stats') || 'null'); } catch (e) { }

/**
 * Retrieves an HTML element by its ID.
 *
 * @param {string} id - The ID of the HTML element.
 * @returns {HTMLElement|null} The matching HTML element, or null if not found.
 */
const $ = id => document.getElementById(id);

// Display the end-game statistics if available.
// Otherwise, display default values and a "No data" message.
const isSwedish = true;
const languageBtn = document.querySelector('#toggle-language-btn');
// NOTE: This check is quite fragile to changes
if (languageBtn) isSwedish = languageBtn.textContent == "English";

if (stats) {
    const { total, correct, mistakes, threshold, won } = stats;
    $('correct').textContent = String(correct);
    $('total').textContent = String(total);
    $('mistakes').textContent = String(mistakes);
    $('headline').textContent = 
        won
            ? isSwedish
                ? 'Bra jobbat, du vann!' 
                : 'Good job, you won!'
            : isSwedish
                ? 'Bra försök!'
                : 'Nice try!';
} else {
    $('headline').textContent = 'Ingen data';
    $('correct').textContent = $('total').textContent = $('mistakes').textContent = '0';
}

// Set up the "Play Again" button to notify the parent window when clicked.
document.getElementById('playAgain').onclick = () => {
    try { window.parent.postMessage({ type: 'playAgain' }, '*'); } catch (_) { }
};

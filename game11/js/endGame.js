// Pull saved results
let stats = null;
try { stats = JSON.parse(sessionStorage.getItem('game11_end_stats') || 'null'); } catch (e) { }

const $ = id => document.getElementById(id);
if (stats) {
    const { total, correct, mistakes, threshold, won } = stats;
    $('correct').textContent = String(correct);
    $('total').textContent = String(total);
    $('mistakes').textContent = String(mistakes);
    $('headline').textContent = won ? 'Bra jobbat, du vann!' : 'Bra försök!';
} else {
    $('headline').textContent = 'Ingen data';
    $('correct').textContent = $('total').textContent = $('mistakes').textContent = '0';
}

// Button
document.getElementById('playAgain').onclick = () => {
    try { window.parent.postMessage({ type: 'playAgain' }, '*'); } catch (_) { }
};
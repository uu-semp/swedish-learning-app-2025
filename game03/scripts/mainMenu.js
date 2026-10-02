// mainMenu.js – opens/closes the How to Play popup
const overlay = document.getElementById('helpOverlay');
document.getElementById('helpBtn').addEventListener('click', () => overlay.classList.add('open'));
document.getElementById('closeHelp').addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.classList.remove('open'); });

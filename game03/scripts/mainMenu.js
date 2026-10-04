// mainMenu.js – opens/closes the How to Play popup
const overlay = document.getElementById('helpOverlay');
document.getElementById('helpBtn').addEventListener('click', () => overlay.classList.add('open'));
document.getElementById('closeHelp').addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.classList.remove('open'); });

// ---- Play flow: main menu → pick a room → pick a level ----
// The sidebar swaps between three views; the floor plan stays and rings the room in question.
const views = document.querySelectorAll('.menu-view');
const rings = document.querySelectorAll('.room-ring');
const levelRoomName = document.getElementById('levelRoomName');
let chosenRoom = null;

function showView(name) {
    views.forEach(v => { v.hidden = v.dataset.view !== name; });
    if (name === 'main') chosenRoom = null;
    ringRoom(chosenRoom);
    const first = document.querySelector(`.menu-view[data-view="${name}"] button`);
    if (first) first.focus({ preventScroll: true });
}

function ringRoom(room) {
    rings.forEach(r => r.classList.toggle('is-active', r.dataset.room === room));
}

document.getElementById('playBtn').addEventListener('click', () => showView('rooms'));
document.querySelectorAll('.back-link').forEach(btn =>
    btn.addEventListener('click', () => showView(btn.dataset.back))
);

document.querySelectorAll('.room-btn').forEach(btn => {
    const room = btn.dataset.room;
    btn.addEventListener('mouseenter', () => ringRoom(room));
    btn.addEventListener('focus', () => ringRoom(room));
    btn.addEventListener('mouseleave', () => ringRoom(chosenRoom));
    btn.addEventListener('blur', () => ringRoom(chosenRoom));
    btn.addEventListener('click', () => {
        chosenRoom = room;
        levelRoomName.innerHTML = btn.querySelector('.title').innerHTML;
        showView('levels');
    });
});

document.querySelectorAll('.level-btn').forEach(btn =>
    btn.addEventListener('click', () => {
        window.location.href = `level.html?level=${btn.dataset.level}&room=${chosenRoom}`;
    })
);

// dragAndDrop.js
import { loadImages } from './imageFetching.js';

let dragSource = null;

(async () => {
    const images = await loadImages();

    const workspace = document.getElementById('workspace');
    const sidebar = document.getElementById('sidebar');
    let draggedImage = null;

    images.forEach(img => {
        img.addEventListener('dragstart', () => draggedImage = img);
    });

    document.addEventListener('dragstart', e => {
        if (e.target.closest('#sidebar')) dragSource = 'sidebar';
        else if (e.target.closest('#workspace')) dragSource = 'workspace';
    });
    workspace.addEventListener('dragover', e => e.preventDefault());
    workspace.addEventListener('drop', e => {
        e.preventDefault();
        if (!draggedImage) return;

        const tile = e.target.closest('.floor-tile');
        if (tile) {
            const rect = workspace.getBoundingClientRect();
            tile.appendChild(draggedImage);
            draggedImage.className = 'draggable';
            draggedImage.style.position = '';
            draggedImage.style.left = '';
            draggedImage.style.top = '';
            const index = tile.dataset.index;
            console.log('Dropped on tile index:', index);
            console.log("Current question:", window.currentQuestion);
            // Fire events
            const eventName = dragSource === 'sidebar' ? 'DropFromSidebar' : 'DropFromWorkspace';
            workspace.dispatchEvent(new CustomEvent(eventName, { detail: { draggedImage, tile } }));
            workspace.dispatchEvent(new CustomEvent('FurnitureDropped', { detail: { draggedImage, tile } }));
        }
        dragSource = null;
        draggedImage = null;
    });
})();

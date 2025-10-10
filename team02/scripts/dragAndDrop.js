// dragAndDrop.js
import { loadImages } from './imageFetching.js';

let dragSource = null;

(async () => {
    const images = await loadImages();

    const workspace = document.getElementById('workspace');
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
            const index = tile.dataset.index;
            console.log('Dropped on tile index:', index);
            console.log("Current question:", currentQuestion);
        }

        workspace.appendChild(draggedImage);
        const rect = workspace.getBoundingClientRect();
        draggedImage.className = 'draggable';
        draggedImage.style.position = 'absolute';
        draggedImage.style.left = (e.clientX - rect.left - 75) + 'px';
        draggedImage.style.top = (e.clientY - rect.top - 75) + 'px';

        const eventName = dragSource === 'sidebar' ? 'DropFromSidebar' : 'DropFromWorkspace';
        console.log("Event name: ", eventName)
        workspace.dispatchEvent(new CustomEvent(eventName, { detail: {draggedImage, tile}}));
        // Unified event
        workspace.dispatchEvent(new CustomEvent('FurnitureDropped', { detail: {draggedImage, tile}}));

        dragSource = null;
        draggedImage = null;
    });
})();

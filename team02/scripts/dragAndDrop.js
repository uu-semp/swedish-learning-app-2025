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
            const tileRect = tile.getBoundingClientRect();
            const workspaceRect = workspace.getBoundingClientRect();

            workspace.appendChild(draggedImage);
            draggedImage.classList.add('draggable', 'placed');
            draggedImage.style.position = 'absolute';
            draggedImage.style.left = (tileRect.left - workspaceRect.left + tileRect.width / 2 - draggedImage.offsetWidth / 2) + 'px';
            draggedImage.style.top = (tileRect.top - workspaceRect.top + tileRect.height / 2 - draggedImage.offsetHeight / 2) + 'px';
            // Prevent tilt inheritance
            draggedImage.style.transform = 'none';
            draggedImage.style.transformOrigin = 'center center';
            // Fire events
            const eventName = dragSource === 'sidebar' ? 'DropFromSidebar' : 'DropFromWorkspace';
            workspace.dispatchEvent(new CustomEvent(eventName, { detail: { draggedImage, tile } }));
            workspace.dispatchEvent(new CustomEvent('FurnitureDropped', { detail: { draggedImage, tile } }));
        }
        dragSource = null;
        draggedImage = null;
    });
})();

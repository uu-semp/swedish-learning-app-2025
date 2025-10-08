// dragAndDrop.js
import { loadImages } from './imageFetching.js';

(async () => {
    const images = await loadImages();

    const workspace = document.getElementById('workspace');
    let draggedImage = null;

    images.forEach(img => {
        img.addEventListener('dragstart', () => draggedImage = img);
    });

    workspace.addEventListener('dragover', e => e.preventDefault());
    workspace.addEventListener('drop', e => {
        e.preventDefault();
        if (!draggedImage) return;

        workspace.appendChild(draggedImage);
        const rect = workspace.getBoundingClientRect();
        draggedImage.className = 'draggable';
        draggedImage.style.position = 'absolute';
        draggedImage.style.left = (e.clientX - rect.left - 75) + 'px';
        draggedImage.style.top = (e.clientY - rect.top - 75) + 'px';
        makeDraggable(draggedImage);

        draggedImage = null;
    });
})();

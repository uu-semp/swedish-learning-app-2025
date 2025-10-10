// dragAndDrop.js
import { loadImages } from './imageFetching.js';

let dragSource = null;

(async () => {
    const images = await loadImages();

    const workspace = document.getElementById('workspace');
    const room = document.querySelector('.room-container');
    const floorTiles = document.querySelectorAll('.floor-tile');
    let draggedImage = null;

    // Make sidebar images draggable
    images.forEach(img => {
        img.addEventListener('dragstart', e => {
            draggedImage = img;
            e.dataTransfer.effectAllowed = 'move';
        });
    });

    // Detect drag origin
    document.addEventListener('dragstart', e => {
        if (e.target.closest('#sidebar')) dragSource = 'sidebar';
        else if (e.target.closest('#workspace')) dragSource = 'workspace';
    });

    //
    // --- Tile highlighting logic ---
    //
    floorTiles.forEach(tile => {
        // highlight on enter / over
        tile.addEventListener('dragenter', e => {
            e.preventDefault();
            tile.classList.add('highlight-drop');
        });

        tile.addEventListener('dragover', e => {
            e.preventDefault(); // must be here to allow drop
            tile.classList.add('highlight-drop');
        });

        // remove highlight when cursor leaves tile
        tile.addEventListener('dragleave', e => {
            const rect = tile.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                tile.classList.remove('highlight-drop');
            }
        });

        // handle drop
        tile.addEventListener('drop', e => {
            e.preventDefault();
            tile.classList.remove('highlight-drop');

            if (!draggedImage) return;

            // Restrict to room boundaries
            const roomRect = room.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            if (x < roomRect.left || x > roomRect.right || y < roomRect.top || y > roomRect.bottom) {
                console.log("Drop ignored — outside room area");
                return;
            }

            // Place image inside the tile
            draggedImage.classList.add('placed');
            draggedImage.style.position = 'static';
            tile.appendChild(draggedImage);

            // Fire event for question logic
            const eventName = dragSource === 'sidebar' ? 'DropFromSidebar' : 'DropFromWorkspace';
            workspace.dispatchEvent(new CustomEvent(eventName, { detail: draggedImage }));

            dragSource = null;
            draggedImage = null;
        });
    });

    //
    // Prevent dropping anywhere else in workspace
    //
    workspace.addEventListener('dragover', e => e.preventDefault());
    workspace.addEventListener('drop', e => {
        e.preventDefault();
        console.log("Ignored drop — only tiles allowed");
    });
})();

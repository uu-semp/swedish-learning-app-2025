// dragAndDrop.js
import { loadImages } from './imageFetching.js?v=20261008';

let dragSource = null;

(async () => {
    const images = await loadImages();

    const workspace = document.getElementById('workspace');
    const sidebar = document.getElementById('sidebar');
    const colourClasses = ['colour-red', 'colour-green', 'colour-blue'];
    const colours = ['original', 'red', 'green', 'blue'];
    let draggedImage = null;
    let colourAlternative = null;

    function setColour(image, colour) {
        image.classList.remove(...colourClasses);
        image.dataset.colour = colour;
        if (colour !== 'original') image.classList.add(`colour-${colour}`);
    }

    function showColourChoices() {
        if (colourAlternative) {
            colourAlternative.remove();
            colourAlternative = null;
        }

        const question = window.currentQuestion;
        if (!question?.colour) return;

        const correctImage = images.find(image =>
            image.dataset.name === question.answer && image.draggable && image.closest('#sidebar')
        );
        if (!correctImage) return;

        setColour(correctImage, question.colour);
        const wrongColours = colours.filter(colour => colour !== question.colour);
        const wrongColour = wrongColours[Math.floor(Math.random() * wrongColours.length)];
        colourAlternative = correctImage.cloneNode(true);
        setColour(colourAlternative, wrongColour);

        if (Math.random() < 0.5) {
            sidebar.insertBefore(colourAlternative, correctImage);
        } else {
            sidebar.insertBefore(colourAlternative, correctImage.nextSibling);
        }
    }

    document.addEventListener('QuestionChanged', showColourChoices);
    showColourChoices();

    sidebar.addEventListener('dragstart', event => {
        if (event.target.classList.contains('image-item')) draggedImage = event.target;
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
        if (!tile) return;
        const tileIndex = parseInt(tile.dataset.index);
        const itemName = draggedImage.dataset.name;
        const colourMatches = !window.currentQuestion?.colour || draggedImage.dataset.colour === window.currentQuestion.colour;
        console.log(itemName);
        console.log(currentQuestion);
        console.log(itemName === window.currentQuestion.answer);
        if (
            window.currentQuestion &&
            itemName === window.currentQuestion.answer &&
            colourMatches &&
            window.currentQuestion.index.includes(tileIndex)
        ) {
            // Correct placement
            const tileRect = tile.getBoundingClientRect();
            const workspaceRect = workspace.getBoundingClientRect();
            workspace.appendChild(draggedImage);
            draggedImage.classList.add('draggable', 'placed');
            draggedImage.draggable = false;
            draggedImage.style.cursor = 'default'; // optional visual cue
            draggedImage.style.position = 'absolute';
            draggedImage.style.left = (tileRect.left - workspaceRect.left + tileRect.width / 2 - draggedImage.offsetWidth / 2) + 'px';
            draggedImage.style.top = (tileRect.top - workspaceRect.top + tileRect.height / 2 - draggedImage.offsetHeight / 2) + 'px';
            draggedImage.style.transform = 'scale(1.6) translateY(-10px)';
            draggedImage.style.transition = 'transform 0.3s ease';
            const eventName = dragSource === 'sidebar' ? 'DropFromSidebar' : 'DropFromWorkspace';
            workspace.dispatchEvent(new CustomEvent(eventName, { detail: { draggedImage, tile } }));
            workspace.dispatchEvent(new CustomEvent('FurnitureDropped', { detail: { draggedImage, tile } }));
            dragSource = null;
            draggedImage = null;
        }
        else {
            // Incorrect placement
            tile.classList.add('wrong-drop');
            setTimeout(() => tile.classList.remove('wrong-drop'), 400);
            sidebar.appendChild(draggedImage);
            draggedImage.style.position = '';
            draggedImage.style.left = '';
            draggedImage.style.top = '';
            document.dispatchEvent(new CustomEvent('AnswerIncorrect', {
                detail: { reason: 'Wrong item or tile' }
            }));
            dragSource = null;
            draggedImage = null;
        }

    });
})();

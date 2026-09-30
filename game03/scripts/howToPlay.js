function createHowToPlayModal(showText = true, target = null) {
    const targetElement = target || document.querySelector('.menu-buttons') || document.body;

    const howToPlayButton = document.createElement('button');
    const icon = '<span aria-hidden="true">?</span>';
    howToPlayButton.innerHTML = showText ? `${icon} How to Play` : icon;
    howToPlayButton.className = showText ? 'menu-btn how-to-play-button' : 'header-help-btn';
    howToPlayButton.setAttribute('aria-label', 'How to Play');
    howToPlayButton.title = 'How to Play';

    if (!showText) {
        howToPlayButton.style.fontWeight = '700';
        howToPlayButton.style.fontSize = '1.1rem';
    }

    if (!showText) {
        howToPlayButton.classList.add('icon-only');
    }

    targetElement.appendChild(howToPlayButton);

    const dialog = document.createElement('dialog');
    dialog.className = 'how-to-play-dialog';

    const paragraph = document.createElement('div');
    paragraph.className = 'how-to-play-text';
    paragraph.innerHTML = `
        <strong>This is how to play the game:</strong>
        <ul>
            <li>The goal is to match the image of furniture with their correct Swedish names and the place where they belong in the room.</li>
            <li>Drag and drop the image into the correct place.</li>
            <li>If you get stuck, there is a hint button that will show you the correct answer.</li>
        </ul>
    `;

    const closeButton = document.createElement('button');
    closeButton.className = 'close-btn';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close');
    
    dialog.appendChild(paragraph);
    dialog.appendChild(closeButton);

    // Open and close the popup
    howToPlayButton.addEventListener('click', () => {
        dialog.showModal();
        howToPlayButton.blur();
    });
    closeButton.addEventListener('click', () => {
        dialog.close();
        howToPlayButton.blur();
    });

    document.body.appendChild(dialog);
}

//createHowToPlayModal();       // shows icon + text 
//createHowToPlayModal(false);  // shows only the icon

// fetchImages.js
import { questionsLoaded } from './level.js';

export async function loadImages() {
    const selectedQuestions = await questionsLoaded;
    return new Promise(async resolve => {
        window.vocabulary.when_ready(async () => {
            // Get level from URL first
            const urlParams = new URLSearchParams(window.location.search);
            const levelIndex = urlParams.get("level") || "1";

            const requiredImages = selectedQuestions.map(q => q.answer);

            const sidebar = document.getElementById('sidebar');

            // All furniture image paths from the vocabulary
            const ids = window.vocabulary.get_category("furniture");
            const vocabularies = ids.map(id => window.vocabulary.get_vocab(id));
            const allImages = vocabularies.filter(v => v.img).map(v => v.img);
            const nameOf = path => path.split('/').pop().replace('.png', '');

            // Collect the images to show: the required ones plus any distractors
            const trayPaths = allImages.filter(path => requiredImages.includes(nameOf(path)));

            // Level 2: add 3 random distractors
            if (levelIndex === "2" && window.getRandomDistractorImages) {
                try {
                    const distractorPaths = await window.getRandomDistractorImages();
                    trayPaths.push(...distractorPaths);
                } catch (error) {
                    console.log('Could not load distractor images:', error);
                }
            }

            // Level 3: add up to 8 random extra images
            if (levelIndex === "3") {
                const extras = allImages.filter(path => !requiredImages.includes(nameOf(path)));
                trayPaths.push(...window.shuffle(extras).slice(0, Math.min(8, extras.length)));
            }

            // Shuffle everything together so the tray order isn't predictable
            const imageElements = [];
            window.shuffle(trayPaths).forEach(path => {
                const img = document.createElement('img');
                img.src = "../" + path;
                img.draggable = true;
                img.className = 'image-item';
                img.dataset.name = nameOf(path);
                sidebar.appendChild(img);
                imageElements.push(img);
            });

            resolve(imageElements);
        });
    });
}

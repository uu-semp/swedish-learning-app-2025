// fetchImages.js
export async function loadImages() {
    return new Promise(async resolve => {
        window.vocabulary.when_ready(async () => {
            // Get the 5 randomly selected questions for this game session
            const selectedQuestions = window.getRandomQuestions ? window.getRandomQuestions() : [];
            const requiredImages = selectedQuestions.map(q => q.answer);
            
            // console.log('Selected questions:', selectedQuestions);
            // console.log('Required images:', requiredImages);

            const sidebar = document.getElementById('sidebar');
            const imageElements = [];

            // Load required images (5 images)
            const ids = window.vocabulary.get_category("furniture");
            const vocabularies = ids.map(id => window.vocabulary.get_vocab(id));
            const allImages = vocabularies.filter(v => v.img).map(v => v.img);

            allImages.forEach(path => {
                // Extract the image name from the path (e.g., "chair" from "/assets/images/furniture/chair.png")
                const imageName = path.split('/').pop().replace('.png', '');
                
                // console.log('Checking image:', imageName, 'Required:', requiredImages, 'Match:', requiredImages.includes(imageName));
                
                // Only load images that are needed for the questions
                if (requiredImages.includes(imageName)) {
                    const img = document.createElement('img');
                    img.src = "../" + path;
                    img.draggable = true;
                    img.className = 'image-item';
                    img.dataset.name = imageName;
                    sidebar.appendChild(img);
                    imageElements.push(img);
                    // console.log('Added required image:', imageName);
                }
            });

            // Load 3 additional random distractor images (only for level 2)
            if (window.getRandomDistractorImages) {
                try {
                    const distractorPaths = await window.getRandomDistractorImages();
                    // console.log('Distractor paths:', distractorPaths);
                    
                    distractorPaths.forEach(path => {
                        const imageName = path.split('/').pop().replace('.png', '');
                        const img = document.createElement('img');
                        img.src = "../" + path;
                        img.draggable = true;
                        img.className = 'image-item';
                        img.dataset.name = imageName;
                        sidebar.appendChild(img);
                        imageElements.push(img);
                        // console.log('Added distractor image:', imageName);
                    });
                } catch (error) {
                    console.log('Could not load distractor images:', error);
                }
            }

            // console.log('Total images loaded:', imageElements.length);
            resolve(imageElements);
        });
    });
}

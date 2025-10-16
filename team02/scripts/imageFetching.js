// fetchImages.js
export async function loadImages() {
    return new Promise(async resolve => {
        window.vocabulary.when_ready(async () => {
            // Get level from URL first
            const urlParams = new URLSearchParams(window.location.search);
            const levelIndex = urlParams.get("level") || "1";
            
            // Wait for level-specific questions to be loaded
            if (levelIndex === "3") {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Get the randomly selected questions for this game session
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

            // Load additional random distractor images
            if (levelIndex === "2" && window.getRandomDistractorImages) {
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
            
            // For level 3, add 8 additional random images (total 15: 7 required + 8 random)
            if (levelIndex === "3") {
                const remainingImages = allImages.filter(path => {
                    const imageName = path.split('/').pop().replace('.png', '');
                    return !requiredImages.includes(imageName);
                });
                
                console.log('Available images for random selection:', remainingImages.length);
                
                // Shuffle and take 8 random images (or as many as available)
                const shuffled = remainingImages.sort(() => 0.5 - Math.random());
                const randomImages = shuffled.slice(0, Math.min(8, remainingImages.length));
                
                console.log('Adding random images:', randomImages.length);
                
                randomImages.forEach(path => {
                    const imageName = path.split('/').pop().replace('.png', '');
                    const img = document.createElement('img');
                    img.src = "../" + path;
                    img.draggable = true;
                    img.className = 'image-item';
                    img.dataset.name = imageName;
                    sidebar.appendChild(img);
                    imageElements.push(img);
                });
            }

            // console.log('Total images loaded:', imageElements.length);
            resolve(imageElements);
        });
    });
}

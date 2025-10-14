// fetchImages.js
export async function loadImages() {
    return new Promise(resolve => {
        window.vocabulary.when_ready(() => {
            const ids = window.vocabulary.get_category("furniture");
            const vocabularies = ids.map(id => window.vocabulary.get_vocab(id));
            const images = vocabularies.filter(v => v.img).map(v => v.img);

            // Get the 5 randomly selected questions for this game session
            const selectedQuestions = window.getRandomQuestions ? window.getRandomQuestions() : [];
            const level1RequiredImages = selectedQuestions.map(q => q.answer);
            
            console.log('Selected questions:', selectedQuestions);
            console.log('Required images:', level1RequiredImages);

            const sidebar = document.getElementById('sidebar');
            const imageElements = [];

            images.forEach(path => {
                // Extract the image name from the path (e.g., "chair" from "/assets/images/furniture/chair.png")
                const imageName = path.split('/').pop().replace('.png', '');
                
                console.log('Checking image:', imageName, 'Required:', level1RequiredImages, 'Match:', level1RequiredImages.includes(imageName));
                
                // Only load images that are needed for level1
                if (level1RequiredImages.includes(imageName)) {
                    const img = document.createElement('img');
                    img.src = "../" + path;
                    img.draggable = true;
                    img.className = 'image-item';
                    img.dataset.name = imageName;
                    sidebar.appendChild(img);
                    imageElements.push(img);
                    console.log('Added image:', imageName);
                }
            });

            resolve(imageElements);
        });
    });
}

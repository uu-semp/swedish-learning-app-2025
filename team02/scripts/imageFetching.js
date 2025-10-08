// fetchImages.js
export async function loadImages() {
    return new Promise(resolve => {
        window.vocabulary.when_ready(() => {
            const ids = window.vocabulary.get_category("furniture");
            const vocabularies = ids.map(id => window.vocabulary.get_vocab(id));
            const images = vocabularies.filter(v => v.img).map(v => v.img);

            const sidebar = document.getElementById('sidebar');
            const imageElements = [];

            images.forEach(path => {
                const img = document.createElement('img');
                img.src = "../" + path;
                img.draggable = true;
                img.className = 'image-item';
                sidebar.appendChild(img);
                imageElements.push(img);
            });

            resolve(imageElements);
        });
    });
}

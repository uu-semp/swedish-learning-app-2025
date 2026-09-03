// feedback.js
const workspace = document.getElementById('workspace');

workspace.addEventListener('FurnitureDropped', e => {
    e.preventDefault();

    const tile = e.detail.tile;
    if (tile) {
        const index = parseInt(tile.dataset.index);
        let imageName = e.detail.draggedImage.dataset.name;

        if (imageName != currentQuestion.answer) {
            document.dispatchEvent(new CustomEvent("AnswerIncorrect", { detail: { reason: "Wrong furniture" } }));
            return;
        }

        for (let i = 0; i < currentQuestion.index.length; i++) {
            if (currentQuestion.index[i] === index) {
                document.dispatchEvent(new CustomEvent("AnswerCorrect"));
                return;
            }
        }

        document.dispatchEvent(new CustomEvent("AnswerIncorrect", { detail: { reason: "Wrong position" } }));
    }
});

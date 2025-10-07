export const PelleContainer = {
    name: 'pelle-container',
    emits: ['item-dropped'], 
    template: `
        <div class="pelle-container" 
             @drop="handleItemDrop" 
             @dragover.prevent="handleDragOver"
             @dragleave.prevent="handleDragLeave">
          <img src="./components/assets/pelle.png">
        </div>
    `,
    methods: {
        handleItemDrop(event) {
            const droppedItem = event.dataTransfer.getData('text/plain');
            console.log('Dropped item in component:', droppedItem);
            
            const isCorrect = Math.random() > 0.66;
            this.$emit('item-dropped', { isCorrect: isCorrect });

            event.currentTarget.classList.remove('drag-over');
        },
        handleDragOver(event) {
            event.currentTarget.classList.add('drag-over');
        },
        handleDragLeave(event) {
            event.currentTarget.classList.remove('drag-over');
        }
    }
};

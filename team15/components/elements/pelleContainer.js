export const PelleContainer = {
    name: 'pelle-container',
    emits: ['item-dropped'], 
    template: `
        <div class="drop-zone" 
             @drop="handleItemDrop" 
             @dragover.prevent="handleDragOver"
             @dragleave.prevent="handleDragLeave">
          'Drop Item Here'
        </div>
    `,
    methods: {
        handleItemDrop(event) {
            // Get the dragged data
            const droppedItem = event.dataTransfer.getData('text/plain');
            console.log('Dropped item in component:', droppedItem);

            // Determine the result (in a real game, this would be your logic)
            const isCorrect = Math.random() > 0.5;

            // Emit an event to the parent with the result
            this.$emit('item-dropped', { isCorrect: isCorrect });

            // Clean up visual feedback
            event.target.classList.remove('drag-over');
        },
        handleDragOver(event) {
            // Add visual feedback
            event.target.classList.add('drag-over');
        },
        handleDragLeave(event) {
            // Remove visual feedback
            event.target.classList.remove('drag-over');
        }
    }
};
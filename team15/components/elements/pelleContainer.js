export const PelleContainer = {
    name: 'pelle-container',
    props: {
        expectedItemId: {
            type: String,
            required: false,
            default: ''
        }
    },
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
            const droppedItem = (event.dataTransfer.getData('text/plain') || '').trim();
            console.log('Dropped item ID in component:', droppedItem, 'expected:', this.expectedItemId);

            // Determine correctness by comparing the dragged item's ID with the expected item's ID
            const isCorrect = this.expectedItemId && droppedItem === this.expectedItemId;

            // Emit the result along with the dropped item for further handling/logging
            this.$emit('item-dropped', { isCorrect: Boolean(isCorrect), droppedItem });

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

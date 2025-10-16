export default {
  name: 'progressbar',
  props: {
    steps: { type: Number, required: true },
    active: { type: Number, required: true }
  },
  computed: {
    stepArray() {
      return Array.from({ length: this.steps }, (_, i) => i + 1);
    }
  },
  template: `
    <div class="progress-root">
      <div class="progress-container">
        <ul class="progressbar">
          <li v-for="step in stepArray" :key="step" :class="{ active: step <= active }">
            Step {{ step }}
          </li>
        </ul>
      </div>
    </div>
  `,
};
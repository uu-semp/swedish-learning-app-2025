// Animated sky background with drifting clouds and grass.
// Used in app.js to wrap the views listed in skyViews, the view is placed in the slot.
// Since it stays mounted when switching between those views, the clouds keep drifting.

export const SkyBackground = {
  name: "sky-background",
  data() {
    return {
      cloudInterval: null,
    };
  },
  mounted() {
    this.startCloudGeneration();
  },
  beforeUnmount() {
    if (this.cloudInterval) {
      clearInterval(this.cloudInterval);
    }
  },
  methods: {
    startCloudGeneration() {
      const sky = this.$refs.skyContainer;
      if (!sky) return;

      this.cloudInterval = setInterval(() => {
        this.createRandomCloud(sky);
      }, 6000);
    },
    createRandomCloud(sky) {
      const cloud = document.createElement('div');
      const types = ['small', 'medium', 'large'];
      const randomType = types[Math.floor(Math.random() * types.length)];

      cloud.classList.add('cloud', randomType);

      const randomTop = Math.floor(Math.random() * 50) + 5;
      cloud.style.top = randomTop + '%';

      let duration = 30;
      if (randomType === 'small') duration = Math.floor(Math.random() * 20) + 45;
      if (randomType === 'medium') duration = Math.floor(Math.random() * 15) + 30;
      if (randomType === 'large') duration = Math.floor(Math.random() * 15) + 20;

      cloud.style.animationDuration = duration + 's';

      sky.appendChild(cloud);

      setTimeout(() => {
        if (cloud.parentNode) {
          cloud.remove();
        }
      }, duration * 1000);
    },
  },
  template: `
    <div class="start-view-wrapper">
      <div class="sky" ref="skyContainer">
        <div class="cloud large" style="top: 15%; animation-duration: 40s; animation-delay: -5s;"></div>
        <div class="cloud medium" style="top: 30%; animation-duration: 28s; animation-delay: -12s;"></div>
        <div class="cloud small" style="top: 10%; animation-duration: 55s; animation-delay: -2s;"></div>
        <div class="cloud medium" style="top: 45%; animation-duration: 35s; animation-delay: -18s;"></div>
        <div class="cloud large" style="top: 22%; animation-duration: 45s; animation-delay: -25s;"></div>
        <slot></slot>
      </div>
    </div>
  `,
};

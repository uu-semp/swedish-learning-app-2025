export default {
  name: "startView",
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;"> 
      <!-- Game instruction -->
      <div style="background: #fff3cd; color: #5a4636; padding: 20px 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); max-width: 600px; margin-bottom: 30px;">
        <h3 style=" margin-left: 200px; margin-bottom: 10px; font-weight: bold; color: #856404;">Welcome to Clock it!</h3>
        <p style="margin: 0;">
          Test your Swedish time telling skills in a fun and interactive way. A clock will show a random time, and you’ll choose the correct Swedish phrase that matches it. Learn, practice, and master how to tell the time in Swedish, one round at a time!
        </p>
      </div>

      <!-- Buttons for each level -->
      <div style="display: flex; flex-direction: column; gap: 15px; width: 30%;">
        <button @click="selectLevel(1)" 
                style="padding: 12px; border: none; border-radius: 8px; background: #5de9acc8; color: white; font-size: 18px; cursor: pointer;">
          Level 1
        </button>
        <button @click="selectLevel(2)" 
                style="padding: 12px; border: none; border-radius: 8px; background: #3786ed86; color: white; font-size: 18px; cursor: pointer;">
          Level 2
        </button>
        <button @click="selectLevel(3)" 
                style="padding: 12px; border: none; border-radius: 8px; background: #ef4a5ab3; color: white; font-size: 18px; cursor: pointer;">
          Level 3
        </button>
      </div>
    </div>
  `,
  methods: {
    selectLevel(levelNum) {
      console.log(`▶ Selected Level ${levelNum}`);
      // Emit event to parent component (app.js) to change view and set selected level
      this.$emit('level-selected', levelNum);
    }
  }
};

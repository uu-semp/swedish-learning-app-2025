export default {
  name: "startView",
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; padding: 40px; font-family: Arial, sans-serif;">

      <!-- game title -->
      <h1 style="margin-bottom: 20px; font-size: 32px; font-weight: bold; color: #222;">
        Clock it!
      </h1>

      <!-- game instruction -->
      <div style="background: #fff3cd; color: #5a4636; padding: 20px 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); max-width: 600px; margin-bottom: 30px;">
        <h3 style="margin-bottom: 10px; font-weight: bold; color: #856404;">Game Instruction</h3>
        <ol style="margin: 0; padding-left: 20px; line-height: 1.6;">
          <li>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</li>
          <li>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</li>
          <li>xxxxxxxxxxxxxxxxx</li>
        </ol>
      </div>

      <!-- buttons guide to each level-->
      <div style="display: flex; flex-direction: column; gap: 15px; width: 200px;">
        <button @click="$root.currentView = 'game'" 
                style="padding: 12px; border: none; border-radius: 8px; background: #5de9acc8; color: white; font-size: 18px; cursor: pointer;">
          Level 1
        </button>
        <button @click="$root.currentView = 'game'" 
                style="padding: 12px; border: none; border-radius: 8px; background: #3786ed86; color: white; font-size: 18px; cursor: pointer;">
          Level 2
        </button>
        <button @click="$root.currentView = 'game'" 
                style="padding: 12px; border: none; border-radius: 8px; background: #ef4a5ab3; color: white; font-size: 18px; cursor: pointer;">
          Level 3
        </button>
      </div>

    </div>
  `,
  data() {
    return {};
  },
  created() {
    console.log("startView component created");
  },
  methods: {
  }
};

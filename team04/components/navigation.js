export default {
    name: "Navigation",
    template: `
      <nav class="navigation">
          <button class="level-select-btn">Level select menu</button>
          <button class="reset-btn">Reset level</button>
          <button class="level-btn" title="Previous question" @click='$emit("prev")'>&#8678;</button>
          <button class="level-btn" title="Next question" @click='$emit("next")'>&#8680;</button>
        </div>      
 
      </nav>

    `
  };
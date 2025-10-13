export default {
    name: "Navigation",
    template: `
      <nav class="navigation">
        <div class="navigation-btn-group">
            <button class="main-menu-btn">Main menu</button>
            <button class="reset-btn">Reset level</button>
        </div>
        <div class="level-select-group">
            <button class="level-btn" @click='$emit("prev")'>&#8678;</button>
            <button class="level-btn" @click='$emit("next")'>&#8680;</button>
        </div>      
 
      </nav>

    `
  };
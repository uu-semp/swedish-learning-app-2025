export default {
    name: "Navigation",
    template: `
      <nav class="navigation">
        <div class="level-select-group">
            <button class="level-btn" @click='$emit("prev")'>&lt;</button>
            <button class="level-btn" @click='$emit("next")'>&gt;</button>
        </div>      
        <div class="navigation-btn-group">
            <button class="main-menu-btn">Main menu</button>
            <button class="reset-btn">Reset level</button>
        </div>
      </nav>

    `
  };
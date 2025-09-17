window.finishView = {
  name: "FinishView",
  template: `
    <div>
        <div>✅ FinishView loaded</div>
        
        <button @click="$root.currentView = 'game'">Switch to gameView</button>
    </div>
  `
};
class EndScreen {
  constructor() {
    this.wordsVisible = false;
    this.gameData = null;
    this.elements = this.cacheElements();
    this.init();
  }

  cacheElements() {
    return {
      scoreText: document.getElementById('scoreText'),
      scoreBar: document.getElementById('scoreBar'),
      completionText: document.getElementById('completionText'),
      completionBar: document.getElementById('completionBar'),
      categoryName: document.getElementById('categoryName'),
      showWordsBtn: document.getElementById('showWordsBtn'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      exitBtn: document.getElementById('exitBtn')
    };
  }

  init() {
    this.loadGameResults();
    this.attachEventListeners();
    this.animateProgressBars();
  }

  attachEventListeners() {
    // Navigate to words detail page
    this.elements.showWordsBtn?.addEventListener('click', () => {
      this.handleViewWordsDetail();
    });

    // Play again button
    this.elements.playAgainBtn?.addEventListener('click', () => {
      this.handlePlayAgain();
    });

    // Exit button
    this.elements.exitBtn?.addEventListener('click', () => {
      this.handleExit();
    });
  }

  loadGameResults() {
    // In production, this would load from the store
    // this.gameData = store.getGameResults();
    
    // For demonstration, using example data
    this.gameData = this.getExampleGameData();
    this.displayResults(this.gameData);
  }

  getExampleGameData() {
    return {
      correct: 7,
      incorrect: 3,
      total: 10,
      currentLevel: 1,
      totalLevels: 3,
      category: 'Food',
      words: [
        { word: 'Ost', translation: 'Cheese', correct: true },
        { word: 'Mjölk', translation: 'Milk', correct: true },
        { word: 'Bröd', translation: 'Bread', correct: false },
        { word: 'Smör', translation: 'Butter', correct: true },
        { word: 'Ägg', translation: 'Egg', correct: true },
        { word: 'Kött', translation: 'Meat', correct: false },
        { word: 'Fisk', translation: 'Fish', correct: true },
        { word: 'Sallad', translation: 'Lettuce', correct: true },
        { word: 'Tomat', translation: 'Tomato', correct: false },
        { word: 'Gurka', translation: 'Cucumber', correct: true }
      ]
    };
  }

  displayResults(data) {
    // Update score text and bar
    if (this.elements.scoreText) {
      this.elements.scoreText.textContent = `${data.correct}/${data.total}`;
    }
    
    if (this.elements.scoreBar) {
      const scorePercentage = (data.correct / data.total) * 100;
      this.elements.scoreBar.style.width = `${scorePercentage}%`;
    }

    // Update completion text and bar
    if (this.elements.completionText) {
      this.elements.completionText.textContent = `${data.currentLevel}/${data.totalLevels} Levels`;
    }
    
    if (this.elements.completionBar) {
      const completionPercentage = (data.currentLevel / data.totalLevels) * 100;
      this.elements.completionBar.style.width = `${completionPercentage}%`;
    }

    // Update category
    if (this.elements.categoryName) {
      this.elements.categoryName.textContent = data.category;
    }
  }

  handleViewWordsDetail() {
    // Navigate to the words detail page
    window.location.href = 'words-detail.html';
  }

  animateProgressBars() {
    // Reset bars to 0 and animate after a small delay
    const bars = [this.elements.scoreBar, this.elements.completionBar];
    
    bars.forEach(bar => {
      if (bar) {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 100);
      }
    });
  }

  handlePlayAgain() {
    // REQ-USER19: Return to start screen to play again
    console.log('Returning to game setup...');
    
    window.location.href = '/';
    
  }

  handleExit() {
    // REQ-USER15: Exit to main menu
    console.log('Exiting to main menu... rest');
    // In production:
    // window.location.href = '/';
    
    // For demonstration
    if (confirm('Exit to main menu?')) {
      window.location.href = '/';
    }
  }


  // Method to update results from external source (for integration)
  updateResults(newData) {
    this.gameData = newData;
    this.displayResults(newData);
    this.animateProgressBars();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const endScreen = new EndScreen();
  
  // Export for potential external use
  window.sayWhatEndScreen = endScreen;
});

// Export for ES modules
export default EndScreen;
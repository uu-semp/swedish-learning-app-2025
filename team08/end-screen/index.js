import { init_db, local_get_guesses_with_vocab, local_get_categories } from "../store/read.js";

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

  async init() {
    await this.loadGameResults();
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

  async loadGameResults() {
    // Initialize DB and read guesses/categories from Team 8 store
    await init_db();

    const guesses = local_get_guesses_with_vocab();
    const categories = local_get_categories() || [];

    const total = guesses.length;
    const correct = guesses.filter(g => !!g.guessed_correct).length;
    const incorrect = total - correct;

    // Build UI data model
    this.gameData = {
      correct,
      incorrect,
      total,
      currentLevel: 1,
      totalLevels: 1,
      category: categories.length ? categories.join(", ") : "—",
      words: guesses.map(({ guessed_correct, vocab }) => ({
        word: vocab?.sv ?? "",
        translation: vocab?.en ?? "",
        correct: !!guessed_correct,
      })),
    };

    this.displayResults(this.gameData);
  }

  // Example data kept for reference but unused after integration
  getExampleGameData() {
    return {
      correct: 0,
      incorrect: 0,
      total: 0,
      currentLevel: 1,
      totalLevels: 1,
      category: '',
      words: []
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
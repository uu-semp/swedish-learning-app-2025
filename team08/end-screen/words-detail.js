class WordsDetail {
  constructor() {
    this.currentTab = 'all';
    this.showImages = false;
    this.gameData = null;
    this.elements = this.cacheElements();
    this.init();
  }

  cacheElements() {
    return {
      backBtn: document.getElementById('backBtn'),
      allWordsTab: document.getElementById('allWordsTab'),
      mistakesTab: document.getElementById('mistakesTab'),
      toggleImagesBtn: document.getElementById('toggleImagesBtn'),
      toggleImagesText: document.getElementById('toggleImagesText'),
      wordsList: document.getElementById('wordsList'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      exitBtn: document.getElementById('exitBtn'),
      imageModal: document.getElementById('imageModal'),
      imageModalOverlay: document.getElementById('imageModalOverlay'),
      imageModalClose: document.getElementById('imageModalClose'),
      imageModalImage: document.getElementById('imageModalImage'),
      imageModalCaption: document.getElementById('imageModalCaption')
    };
  }

  init() {
    this.loadGameResults();
    this.attachEventListeners();
    this.updateTabLabels();
    this.displayWords();
  }

  attachEventListeners() {
    // Back button
    this.elements.backBtn?.addEventListener('click', () => {
      this.handleBack();
    });

    // Tab buttons
    this.elements.allWordsTab?.addEventListener('click', () => {
      this.switchTab('all');
    });

    this.elements.mistakesTab?.addEventListener('click', () => {
      this.switchTab('mistakes');
    });

    // Toggle images button
    this.elements.toggleImagesBtn?.addEventListener('click', () => {
      this.toggleImages();
    });

    // Footer buttons
    this.elements.playAgainBtn?.addEventListener('click', () => {
      this.handlePlayAgain();
    });

    this.elements.exitBtn?.addEventListener('click', () => {
      this.handleExit();
    });

    // Image modal events
    this.elements.imageModalOverlay?.addEventListener('click', () => {
      this.closeImageModal();
    });

    this.elements.imageModalClose?.addEventListener('click', () => {
      this.closeImageModal();
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.elements.imageModal?.classList.contains('show')) {
        this.closeImageModal();
      }
    });
  }

  loadGameResults() {
    // In production, this would load from the store or URL parameters
    // this.gameData = store.getGameResults();
    
    // For demonstration, using example data
    this.gameData = this.getExampleGameData();
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
        { 
          word: 'Ost', 
          translation: 'Cheese', 
          correct: true,
          userAnswer: 'Cheese',
          feedback: 'Great job! You got this one right.'
        },
        { 
          word: 'Mjölk', 
          translation: 'Milk', 
          correct: true,
          userAnswer: 'Milk',
          feedback: 'Perfect! You know this word well.'
        },
        { 
          word: 'Bröd', 
          translation: 'Bread', 
          correct: false,
          userAnswer: 'Cake',
          feedback: 'Not quite! Bröd means bread, not cake. Try to remember: bröd sounds like "bread".'
        },
        { 
          word: 'Smör', 
          translation: 'Butter', 
          correct: true,
          userAnswer: 'Butter',
          feedback: 'Excellent! Smör is indeed butter.'
        },
        { 
          word: 'Ägg', 
          translation: 'Egg', 
          correct: true,
          userAnswer: 'Egg',
          feedback: 'Well done! Ägg is a common word you should remember.'
        },
        { 
          word: 'Kött', 
          translation: 'Meat', 
          correct: false,
          userAnswer: 'Fish',
          feedback: 'Close, but not quite! Kött means meat. Fish would be "fisk".'
        },
        { 
          word: 'Fisk', 
          translation: 'Fish', 
          correct: true,
          userAnswer: 'Fish',
          feedback: 'Correct! Fisk is fish - you got this one right.'
        },
        { 
          word: 'Sallad', 
          translation: 'Lettuce', 
          correct: true,
          userAnswer: 'Lettuce',
          feedback: 'Perfect! Sallad is lettuce or salad.'
        },
        { 
          word: 'Tomat', 
          translation: 'Tomato', 
          correct: false,
          userAnswer: 'Potato',
          feedback: 'Not quite! Tomat means tomato. Potato would be "potatis". Remember: tomat sounds like "tomato".'
        },
        { 
          word: 'Gurka', 
          translation: 'Cucumber', 
          correct: true,
          userAnswer: 'Cucumber',
          feedback: 'Excellent! Gurka is cucumber - a healthy vegetable!'
        }
      ]
    };
  }

  updateTabLabels() {
    if (!this.gameData?.words) return;
    
    const totalWords = this.gameData.words.length;
    const mistakesCount = this.gameData.words.filter(word => !word.correct).length;
    
    if (this.elements.allWordsTab) {
      this.elements.allWordsTab.textContent = `All Words (${totalWords})`;
    }
    
    if (this.elements.mistakesTab) {
      this.elements.mistakesTab.textContent = `Mistakes Only (${mistakesCount})`;
    }
  }

  switchTab(tab) {
    this.currentTab = tab;
    
    // Update tab buttons
    this.elements.allWordsTab?.classList.toggle('tab-btn--active', tab === 'all');
    this.elements.mistakesTab?.classList.toggle('tab-btn--active', tab === 'mistakes');
    
    this.displayWords();
  }

  toggleImages() {
    this.showImages = !this.showImages;
    
    // Update button appearance
    this.elements.toggleImagesBtn?.classList.toggle('active', this.showImages);
    this.elements.toggleImagesText.textContent = this.showImages ? 'Hide Images' : 'Show Images';
    
    this.displayWords();
  }

  displayWords() {
    if (!this.elements.wordsList || !this.gameData?.words) return;

    let wordsToShow = this.gameData.words;
    
    if (this.currentTab === 'mistakes') {
      wordsToShow = this.gameData.words.filter(word => !word.correct);
    }

    this.elements.wordsList.innerHTML = wordsToShow.map(word => this.createWordCard(word)).join('');
  }

  createWordCard(word) {
    const cardClass = word.correct ? 'word-card--correct' : 'word-card--incorrect';
    const iconClass = word.correct ? 'word-icon--correct' : 'word-icon--incorrect';
    const icon = word.correct ? '✓' : '✗';
    const feedbackClass = word.correct ? 'word-feedback--correct' : 'word-feedback--incorrect';
    
    const imagePath = this.getImagePath(word);
    const imageHtml = this.showImages && imagePath ? 
      `<img src="${imagePath}" alt="${word.translation}" class="word-image" onerror="this.style.display='none'" onclick="window.sayWhatWordsDetail.openImageModal('${imagePath}', '${word.word} - ${word.translation}')">` : 
      '';
    
    return `
      <div class="word-card ${cardClass}">
        <div class="word-icon ${iconClass}">${icon}</div>
        ${imageHtml}
        <div class="word-content">
          <div class="word-text">${word.word}</div>
          <div class="word-translation">${word.translation}</div>
          ${word.userAnswer ? `<div class="word-feedback ${feedbackClass}">Your answer: "${word.userAnswer}"</div>` : ''}
          <div class="word-feedback ${feedbackClass}">${word.feedback}</div>
        </div>
      </div>
    `;
  }

  getImagePath(word) {
    // Map Swedish words to image filenames
    const imageMap = {
      'Ost': 'cheese.png',
      'Mjölk': 'milk.png',
      'Bröd': 'bread.png',
      'Smör': 'butter.png',
      'Ägg': 'eggs.png',
      'Kött': 'meat.png',
      'Fisk': 'fish.png',
      'Sallad': 'salad.png',
      'Tomat': 'tomato.png',
      'Gurka': 'cucumber.png'
    };
    
    const imageName = imageMap[word.word];
    if (imageName) {
      return `../../assets/images/food/${imageName}`;
    }
    return null;
  }

  handleBack() {
    // Return to the end screen
    window.history.back();
  }

  handlePlayAgain() {
    // Return to start screen to play again
    console.log('Returning to game setup...');
    window.location.href = '..';
  }

  handleExit() {
    // Exit to main menu
    console.log('Exiting to main menu...');
    if (confirm('Exit to main menu?')) {
      window.location.href = '/';
    }
  }

  openImageModal(imagePath, caption) {
    if (this.elements.imageModalImage && this.elements.imageModalCaption && this.elements.imageModal) {
      this.elements.imageModalImage.src = imagePath;
      this.elements.imageModalImage.alt = caption;
      this.elements.imageModalCaption.textContent = caption;
      this.elements.imageModal.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  closeImageModal() {
    if (this.elements.imageModal) {
      this.elements.imageModal.classList.remove('show');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  // Method to update data from external source (for integration)
  updateData(newData) {
    this.gameData = newData;
    this.updateTabLabels();
    this.displayWords();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const wordsDetail = new WordsDetail();
  
  // Export for potential external use
  window.sayWhatWordsDetail = wordsDetail;
});

// Export for ES modules
export default WordsDetail;

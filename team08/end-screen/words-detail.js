import { init_db, local_get_guesses_with_vocab } from "../store/read.js";

class WordsDetail {
  constructor() {
    this.currentTab = 'all';
    this.showImages = true;
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
      imageModal: document.getElementById('imageModal'),
      imageModalOverlay: document.getElementById('imageModalOverlay'),
      imageModalClose: document.getElementById('imageModalClose'),
      imageModalImage: document.getElementById('imageModalImage'),
      imageModalCaption: document.getElementById('imageModalCaption')
    };
  }

  async init() {
    await this.loadGameResults();
    this.attachEventListeners();
    this.updateTabLabels();
    this.updateImagesToggleUI();
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

  async loadGameResults() {
    await init_db();
    const guesses = local_get_guesses_with_vocab();
    this.gameData = {
      words: guesses.map(({ guessed_correct, vocab }) => ({
        word: vocab?.sv ?? "",
        translation: vocab?.en ?? "",
        correct: !!guessed_correct,
        imageUrl: vocab?.img ?? null,
        userAnswer: undefined,
        feedback: guessed_correct ? "Correct" : "Try again next time",
      })),
    };
  }

  // Example placeholder retained but not used after integration
  getExampleGameData() {
    return { words: [] };
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
    this.updateImagesToggleUI();
    this.displayWords();
  }

  updateImagesToggleUI() {
    // Update button appearance and label to reflect current state
    this.elements.toggleImagesBtn?.classList.toggle('active', this.showImages);
    if (this.elements.toggleImagesText) {
      this.elements.toggleImagesText.textContent = this.showImages ? 'Hide Images' : 'Show Images';
    }
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
    
    const candidates = this.getImageCandidates(word);
    const firstImage = candidates[0] || '';
    const restCandidates = candidates.slice(1);
    const dataAttr = encodeURIComponent(JSON.stringify(restCandidates));
    const imageHtml = this.showImages && firstImage ? 
      `<img src="${firstImage}" data-candidates="${dataAttr}" alt="${word.translation}" class="word-image" onerror="window.sayWhatWordsDetail.tryNextImage(this)" onclick="window.sayWhatWordsDetail.openImageModal(this.src, '${word.word} - ${word.translation}')">` : 
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
    // Prefer remote image URL provided by vocab data when available
    return word?.imageUrl || null;
  }

  getImageCandidates(word) {
    const candidates = [];
    const remote = this.getImagePath(word);
    if (remote) candidates.push(remote);

    const english = (word?.translation || '').toLowerCase().trim();
    if (!english) return candidates;

    const variants = Array.from(new Set([
      english,
      english.replace(/\s+/g, '_'),
      english.replace(/\s+/g, ''),
      english.replace(/[\s-]+/g, ''),
    ]));

    const categories = ['food', 'furniture', 'clothes', 'colors'];
    for (const cat of categories) {
      for (const v of variants) {
        candidates.push(`/assets/images/${cat}/${v}.png`);
      }
    }

    return candidates;
  }

  tryNextImage(imgEl) {
    if (!imgEl) return;
    const encoded = imgEl.getAttribute('data-candidates');
    if (!encoded) {
      imgEl.style.display = 'none';
      return;
    }
    let remaining = [];
    try {
      remaining = JSON.parse(decodeURIComponent(encoded));
    } catch (_) {
      imgEl.style.display = 'none';
      return;
    }

    if (remaining.length === 0) {
      imgEl.style.display = 'none';
      return;
    }

    const next = remaining.shift();
    imgEl.setAttribute('data-candidates', encodeURIComponent(JSON.stringify(remaining)));
    imgEl.src = next;
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

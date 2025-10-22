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
      imageModalCaption: document.getElementById('imageModalCaption'),
      copyrightBtn: document.getElementById('copyrightBtn'),
      copyrightModal: document.getElementById('copyright'),
      copyrightClose: document.getElementById('close-copyright'),
      copyrightContent: document.getElementById('copyrightContent')
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

    // Open image modal on image click (delegated for dynamic content)
    this.elements.wordsList?.addEventListener('click', (event) => {
      const target = event.target;
      if (!target) return;
      // Support clicking directly on the image
      if (target.classList && target.classList.contains('word-image')) {
        const src = target.getAttribute('src') || '';
        const caption = target.getAttribute('data-translation') || target.getAttribute('alt') || '';
        if (src) this.openImageModal(src, caption);
        return;
      }
      // Or any nested element inside the image (future-proofing)
      const img = target.closest && target.closest('.word-image');
      if (img) {
        const src = img.getAttribute('src') || '';
        const caption = img.getAttribute('data-translation') || img.getAttribute('alt') || '';
        if (src) this.openImageModal(src, caption);
      }
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

    // Copyright button
    this.elements.copyrightBtn?.addEventListener('click', () => {
      this.openCopyrightModal();
    });

    // Copyright modal close
    this.elements.copyrightClose?.addEventListener('click', () => {
      this.closeCopyrightModal();
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
        vocab: vocab, // Include full vocab object for license information
      })),
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

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
        `<img src="${firstImage}" data-candidates="${dataAttr}" alt="${this.escapeHtml(word.translation)}" class="word-image" data-word="${this.escapeHtml(word.word)}" data-translation="${this.escapeHtml(word.translation)}" onerror="window.sayWhatWordsDetail.tryNextImage(this)">` :
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
    return word?.imageUrl;
  }

  getImageCandidates(word) {
    const candidates = [];
    const imagePath = this.getImagePath(word);
    if (imagePath) {
      candidates.push('../../' + imagePath);
      return candidates;
    } else {
      console.warn('No image URL found for word:', word);
    }

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
    // Return to the end screen index page
    window.location.href = './index.html';
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

  openCopyrightModal() {
    if (this.elements.copyrightModal && this.elements.copyrightContent) {
      this.updateCopyrightContent();
      this.elements.copyrightModal.style.display = 'block';
    }
  }

  closeCopyrightModal() {
    if (this.elements.copyrightModal) {
      this.elements.copyrightModal.style.display = 'none';
    }
  }

  updateCopyrightContent() {
    if (!this.elements.copyrightContent || !this.gameData?.words) return;

    // Get unique images and their licenses from the current words
    const imageLicenses = new Map();
    
    this.gameData.words.forEach((word, index) => {
      if (word.imageUrl && word.vocab?.img_copyright) {
        const imagePath = word.imageUrl;
        const license = word.vocab.img_copyright;
        
        // Use image path as key to avoid duplicates
        if (!imageLicenses.has(imagePath)) {
          imageLicenses.set(imagePath, {
            word: word.word,
            translation: word.translation,
            license: license,
            index: index + 1
          });
        }
      }
    });

    // Create table HTML
    let tableHTML = '';
    if (imageLicenses.size > 0) {
      tableHTML = `
        <table>
          <tr>
            <th>Image</th>
            <th>Word</th>
            <th>License</th>
          </tr>
      `;
      
      let counter = 1;
      for (const [imagePath, data] of imageLicenses) {
        tableHTML += `
          <tr>
            <td>${counter}</td>
            <td>${this.escapeHtml(data.word)} (${this.escapeHtml(data.translation)})</td>
            <td>${data.license}</td>
          </tr>
        `;
        counter++;
      }
      
      tableHTML += '</table>';
    } else {
      tableHTML = '<p>No image license information available.</p>';
    }

    this.elements.copyrightContent.innerHTML = tableHTML;
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

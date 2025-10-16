// ==============================================
// Owned by Team 03
// ==============================================

"use strict";

// ============================================
// VOCABULARY MANAGER CLASS
// ============================================

class VocabularyManager {
  constructor() {
    this.STORAGE_KEY = "team03";
    this.words = this.loadWords();
  }

  loadWords() {
    const data = window.save.get(this.STORAGE_KEY);
    return data.customWords || [];
  }

  saveWords() {
    const data = window.save.get(this.STORAGE_KEY);
    data.customWords = this.words;
    window.save.set(this.STORAGE_KEY, data);
  }

  generateId() {
    return Math.random().toString(36).substring(2, 10);
  }

  addWord(wordData) {
    const newWord = {
      id: this.generateId(),
      en: wordData.english,
      sv: wordData.swedish,
      sv_pl: wordData.swedish_plural,
      article: wordData.article,
      literal: wordData.literal,
      category: wordData.category,
      img: wordData.image_url,
      img_copyright: wordData.image_copyright_info,
      audio: wordData.audio_url
    };
    
    // Duplicate prevention
    for(let i = 0; i < this.words.length; i++) {
      if (this.words[i].en && this.words[i].en.localeCompare(newWord.en) == 0) {
        alert(`The word "${newWord.en}" already exists!`);
        return {success: false, error: 'Word already exists'};
      }
    }

    this.words.push(newWord);
    this.saveWords();
    console.log('Word added:', newWord);
    return { success: true, word: newWord };
  }

  getAllWords() {
    return [...this.words];
  }

  clearAllWords() {
    const count = this.words.length;
    if (window.save.clear(this.STORAGE_KEY)) {
      this.words = [];
      return {success: true, count: count};
    }
    return {success: false, error: 'Failed to clear storage'};
  }

  clearWord(id) {
    let found = false;
    let remove = null;
    const newWords =[];
    for(let i = 0; i < this.words.length; i++) {
      if(this.words[i].id === id) {
        found = true;
        remove = this.words[i];
      } else {
        newWords.push(this.words[i]);
      }
    }

    if (found) {
      this.words = newWords;
      this.saveWords();
      return {success: true, word: remove};
    }
    return {success: false, error: "Word not found"};
  }
}

// ============================================
// GLOBAL STATE
// ============================================

let vocabManager;
let selectedCategories = [];

// ============================================
// MEDIA HELPERS
// ============================================

function setupMediaPreview(urlInputId, previewId, previewHTML) {
  let timeout;
  $(`#${urlInputId}`).on("input", function() {
    clearTimeout(timeout);
    const url = $(this).val().trim();
    const preview = $(`#${previewId}`);
    
    if (!url) {
      preview.empty();
      return;
    }
    
    timeout = setTimeout(() => preview.html(previewHTML(url)), 500);
  });
}

function setupFileUpload(fileInputId, urlInputId, previewId, config) {
  $(`#${fileInputId}`).on("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > config.maxSize) {
      alert(`${config.type} file is too large. Maximum size is ${config.maxSize / (1024 * 1024)}MB.`);
      $(this).val('');
      return;
    }
    
    if (!file.type.startsWith(config.mimeType)) {
      alert(`Please select a valid ${config.type} file.`);
      $(this).val('');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      $(`#${urlInputId}`).val(event.target.result);
      $(`#${previewId}`).html(config.previewHTML(event.target.result, file));
    };
    reader.onerror = () => alert(`Error reading ${config.type} file.`);
    reader.readAsDataURL(file);
  });
}

// ============================================
// CATEGORY MANAGEMENT
// ============================================

function handleCategorySelect(event) {
  const value = $(event.target).val();
  if (value && !selectedCategories.includes(value)) {
    selectedCategories.push(value);
    renderCategoryChips();
  }
  $(event.target).val('');
}

function renderCategoryChips() {
  const container = $("#selected-categories");
  container.empty();
  
  selectedCategories.forEach(category => {
    const chip = $(`
      <div class="category-chip">
        <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
        <button type="button" class="remove-category" data-category="${category}">×</button>
      </div>
    `);
    container.append(chip);
  });
  
  $(".remove-category").on("click", function() {
    const categoryToRemove = $(this).data("category");
    selectedCategories = selectedCategories.filter(cat => cat !== categoryToRemove);
    renderCategoryChips();
  });
}

function populateCategoryDropdown() {
  const dropdown = $("#category-dropdown");
  const categories = Object.keys(window._vocabulary.categories || {});
  
  dropdown.find('option:not(:first)').remove();
  
  if (categories.length === 0) {
    dropdown.append($('<option value="general">General</option>'));
    return;
  }
  
  categories.sort().forEach(category => {
    const option = $('<option></option>')
      .attr('value', category)
      .text(category.charAt(0).toUpperCase() + category.slice(1));
    dropdown.append(option);
  });
}

// ============================================
// FORM HANDLING
// ============================================

function handleAddWord(event) {
  event.preventDefault();
  
  const wordData = {
    english: $("#english").val().trim(),
    swedish: $("#swedish").val().trim(),
    article: $("input[name='article']:checked").val() || '',
    swedish_plural: $("#swedish-plural").val().trim(),
    literal: $("#literal").val().trim(),
    category: selectedCategories.join(", "),
    image_url: $("#image-url").val().trim(),
    image_copyright_info: $("#image-copyright").val().trim(),
    audio_url: $("#audio-url").val().trim()
  };

  if (!validateForm(wordData)) return;

  if (vocabManager.addWord(wordData).success) {
    clearForm();
    displayWords();
  }
}

function clearForm() {
  $("form")[0].reset();
  selectedCategories = [];
  renderCategoryChips();
  $("#image-preview, #audio-preview").empty();
  $("#image-file, #audio-file").val('');
}

function validateForm(wordData) {
  $('.error-message').text('');
  $('.form-group input, .form-group select').removeClass('error');
  
  const required = [
    {field: 'english', value: wordData.english, message: 'English translation is required'},
    {field: 'swedish', value: wordData.swedish, message: 'Swedish word is required'},
    {field: 'category', value: wordData.category, message: 'At least one category is required'}
  ];
  
  let isValid = true;
  required.forEach(item => {
    if (!item.value) {
      $(`#${item.field}`).addClass('error');
      $(`#${item.field}-error`).text(item.message);
      isValid = false;
    }
  });
  
  return isValid;
}

// ============================================
// WORD DISPLAY
// ============================================

function displayWords() {
  const words = vocabManager.getAllWords();
  const display = $("#words-display");
  
  if (words.length === 0) {
    display.text("No custom words yet.");
    return;
  }

  const wordItems = words.map(word => `
    <li>
      <div class="word-header">
        <strong>${word.sv} (Swedish)</strong> = ${word.en} (English)
      </div>
      ${word.article ? `Article: ${word.article}` : ''}
      ${word.sv_pl ? `<div class="word-detail">Plural: ${word.sv_pl}</div>` : ''}
      ${word.literal ? `<div class="word-detail"><em>Literal: ${word.literal}</em></div>` : ''}
      ${word.category ? `<div class="word-detail">Category: ${word.category}</div>` : ''}
      ${word.img ? `
        <div class="word-media">
          <img src="${word.img}" alt="${word.sv}" class="word-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
          <span class="image-error" style="display:none;">Image not found</span>
          ${word.img_copyright ? `<div class="copyright-info">© ${word.img_copyright}</div>` : ''}
        </div>
      ` : ''}
      ${word.audio ? `
        <div class="word-media">
          <audio controls class="word-audio">
            <source src="${word.audio}" type="audio/mpeg">
            <source src="${word.audio}" type="audio/wav">
            Your browser does not support audio playback.
          </audio>
        </div>
      ` : ''}
      <div class="word-actions">
        <small>ID: ${word.id}</small>
        <button class="delete-word btn-delete" data-id="${word.id}">Delete Word</button>
      </div>
    </li>
  `).join('');
  
  display.html(`<ul>${wordItems}</ul>`);
  $(".delete-word").on("click", handleClearWord);
}

function handleClearAll() {
  if (vocabManager.getAllWords().length === 0) return;

  if (confirm('Are you sure you want to clear all custom words? This cannot be undone.')) {
    if (vocabManager.clearAllWords().success) {
      displayWords();
    }
  }
}

function handleClearWord(event) {
  const id = $(event.target).data("id");
  
  if (confirm("Are you sure you want to delete this word?")) {
    const result = vocabManager.clearWord(id);
    if (result.success) {
      displayWords();
    }
  }
}

// ============================================
// INITIALIZATION
// ============================================

$(function() {
  // Info dialog handlers
  $(".info-btn").on("click", function(e) {
    e.preventDefault();
    $("#info-dialog").addClass("active");
  });
  
  $(".close-dialog").on("click", function(e) {
    e.preventDefault();
    $("#info-dialog").removeClass("active");
  });
  
  $("#info-dialog").on("click", function(e) {
    if (e.target === this) {
      $(this).removeClass("active");
    }
  });

  // Setup image preview and upload
  setupMediaPreview("image-url", "image-preview", url => `
    <img src="${url}" alt="Preview" class="preview-image" 
         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
    <div class="preview-error" style="display:none;">Cannot load image</div>
  `);
  
  setupFileUpload("image-file", "image-url", "image-preview", {
    type: "Image",
    mimeType: "image/",
    maxSize: 2 * 1024 * 1024,
    previewHTML: (base64, file) => `
      <img src="${base64}" alt="Preview" class="preview-image">
      <div class="file-info">Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)</div>
    `
  });
  
  // Setup audio preview and upload
  setupMediaPreview("audio-url", "audio-preview", url => `
    <audio controls class="preview-audio">
      <source src="${url}" type="audio/mpeg">
      <source src="${url}" type="audio/wav">
      Cannot load audio
    </audio>
  `);
  
  setupFileUpload("audio-file", "audio-url", "audio-preview", {
    type: "Audio",
    mimeType: "audio/",
    maxSize: 5 * 1024 * 1024,
    previewHTML: (base64, file) => `
      <audio controls class="preview-audio">
        <source src="${base64}">
        Your browser does not support audio playback.
      </audio>
      <div class="file-info">Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)</div>
    `
  });

  // Initialize when vocabulary data is ready
  window.vocabulary.when_ready(function() {
    vocabManager = new VocabularyManager();
    
    // Form handlers
    $("form").on("submit", handleAddWord);
    $("#clear-all").on("click", handleClearAll);
    $("#category-dropdown").on("change", handleCategorySelect);
    
    // Allow deselecting article buttons
    let lastSelectedArticle = null;
    $("input[name='article']").on("click", function() {
      if (lastSelectedArticle === this) {
        this.checked = false;
        lastSelectedArticle = null;
      } else {
        lastSelectedArticle = this;
      }
    });
    
    // Initial setup
    populateCategoryDropdown();
    displayWords();
  });
});

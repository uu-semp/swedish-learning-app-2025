# Team 03 - Custom Words Vocabulary Manager

## Overview
Team 03 has developed a **User-Managed Vocabulary Extension** that allows users to create, store, and manage their own Swedish vocabulary words to use in the Swedish Learning App 2025-project.

## Features

### ✨ Core Functionality
- **Add Custom Words** - Create new vocabulary entries with detailed information
- **Multiple Categories** - Assign multiple categories to each word using an intuitive selector
- **Duplicate Prevention** - Automatically prevents adding words that already exist (case-insensitive)
- **Persistent Storage** - Words are saved locally and persist across sessions
- **View All Words** - Display all custom words in an organized, scrollable list
- **Delete Words** - Remove individual words or clear all words at once

### 📝 Supported Fields

#### Required Fields:
- **English** - English translation
- **Swedish** - Swedish word
- **Category** - One or more categories

#### Optional Fields:
- **Article** - Swedish article (en/ett) with click-to-deselect functionality
- **Swedish Plural** - Plural form of the Swedish word
- **Literal** - Literal translation or meaning
- **Image URL** - Link to an image
- **Image Copyright Info** - Copyright information for images
- **Audio URL** - Link to audio pronunciation

### 🎨 User Interface

#### Layout
- **Two-Column Design** - Form on the left, word list display on the right
- **Responsive** - Stacks vertically on smaller screens

#### Category Selection
- Select categories from a dropdown menu
- Click the "×" button on any chosen category to remove it
- No duplicate categories allowed

#### Form Validation
- Required fields are clearly marked with a red asterisk (*)
- Optional fields are marked with "(optional)"
- Error messages appear below invalid fields
- Error highlighting with red borders

## Usage

### Adding a Word
1. Fill in the required fields: English, Swedish, and at least one Category
2. Optionally fill in additional fields (article, plural, literal, URLs)
3. Click "Add Word" button
4. Form clears automatically on successful submission

### Managing Categories
1. Select a category from the dropdown
2. Category appears as a blue chip in the box below
3. Click the "×" on any chip to remove it
4. Select multiple categories by repeating steps 1-2

### Deleting Words
- **Single Word**: Click "Delete Word" button on any word entry
- **All Words**: Click "Clear All" button at the top of the word list
- Both actions require confirmation

## Technical Implementation

### File Structure
```
team03/
├── index.html       # Main HTML structure
├── index.css        # Styling and layout
├── index.js         # JavaScript logic and data management
└── README.md        # This file
```

### Data Schema
Each word is stored with the following structure:
```javascript
{
  id: "abc123de",                        // Auto-generated 8-character ID
  english: "apple",                      // Required
  swedish: "äpple",                      // Required
  article: "ett",                        // Optional (en/ett)
  swedish_plural: "äpplen",              // Optional
  literal: "apple",                      // Optional
  category: "food, fruits",              // Required
  image_url: "/assets/images/apple.png", // Optional
  image_copyright_info: "Example",       // Optional
  audio_url: "/assets/audio/apple.mp3"   // Optional
}
```

### Storage
- Uses `window.save` (Save.js) API for persistent storage
- Storage key: `"team03"`
- Data is stored under `customWords` property

### Key Classes and Functions

#### VocabularyManager Class
- `loadWords()` - Load words from storage
- `saveWords()` - Save words to storage
- `generateId()` - Generate unique 8-character IDs
- `addWord(wordData)` - Add new word with duplicate checking
- `getAllWords()` - Retrieve all words
- `clearWord(id)` - Delete specific word
- `clearAllWords()` - Delete all words

#### Main Functions
- `handleAddWord()` - Form submission handler
- `validateForm()` - Validates required fields
- `displayWords()` - Renders word list
- `handleCategorySelect()` - Manages category selection
- `renderCategoryChips()` - Displays selected category chips
- `populateCategoryDropdown()` - Loads categories from vocabulary data

## Future Enhancements
- Image upload functionality
- Audio recording/upload

## Team Members
Team 03

# Team 03 - User-Managed Vocabulary Extension

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
- **Literal** - Literal representation (e.g., "0" for "noll")
- **Image** - Upload file (max 2MB) OR enter URL (relative/external paths supported)
- **Image Copyright Info** - Copyright information for images
- **Audio** - Upload file (max 5MB) OR enter URL (relative/external paths supported)

### 🎨 User Interface

#### Layout
- **Two-Column Design** - Form on the left, word list display on the right
- **Responsive** - Stacks vertically on smaller screens

#### Information Dialog
- **Information Button** - "i" button in the top-right corner of the form
- **Field Guide** - Opens a dialog explaining all form fields
- **Easy to Close** - Click the "×" button or click outside the dialog on the overlay
- **Comprehensive Help** - Includes explanations for required fields, optional fields, and helpful tips

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

### Getting Help
- Click the **"i" button** in the top-right corner of the form
- A dialog will open explaining what to fill in for each field
- Provides guidance on required and optional fields

### Adding a Word
1. Fill in the required fields: English, Swedish, and at least one Category
2. Optionally fill in additional fields (article, plural, literal)
3. For media: Enter URL OR click "Upload Image"/"Upload Audio" to select files from your computer
4. Preview appears automatically for images and audio
5. Click "Add Word" button
6. Form clears automatically on successful submission

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
Words are stored using the same format as system vocabulary for compatibility:
```javascript
{
  id: "abc123de",                   // Auto-generated 8-character ID
  en: "apple",                      // English (required)
  sv: "äpple",                      // Swedish (required)
  sv_pl: "äpplen",                  // Swedish plural (optional)
  article: "ett",                   // Article: en/ett (optional)
  literal: "🍎",                    // Literal representation (optional)
  category: "food, fruits",         // Categories, comma-separated (required)
  img: "/assets/images/apple.png",  // Image URL or upload (optional)
  img_copyright: "Own photo",       // Image copyright (optional)
  audio: "/assets/audio/apple.mp3"  // Audio URL or upload (optional)
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
- `displayWords()` - Renders word list with associated fields
- `handleCategorySelect()` - Manages category selection
- `renderCategoryChips()` - Displays selected category chips
- `populateCategoryDropdown()` - Loads categories from vocabulary data
- `clearForm()` - Resets all form fields after successful submission
- `setupMediaPreview()` - Handles URL preview
- `setupFileUpload()` - Handles file upload with validation and conversion

#### Dialog Handlers
- Info button click handler - Opens the field guide dialog
- Close button click handler - Closes the dialog
- Overlay click handler - Closes dialog when clicking outside

## Future Enhancements
- Edit existing words
- Search and filter word list

## Team Members
Team 03

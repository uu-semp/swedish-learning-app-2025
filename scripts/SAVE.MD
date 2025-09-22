# Save.js API Documentation
This API allows groups to save and retrieve data using the browser's localStorage. It's designed to be simple and flexible for all game groups.
It also enables groups to share data if that is something needed.

## IMPORTANT: group Name Convention
**All groups MUST use their assigned group name as the first parameter.** This prevents groups from accidentally overwriting each other's data.

## API Methods

### `save.get(group_name, key)`
Retrieves saved data.
- `group_name`: For instance group_8, or group_2.
- `key` (optional): Specific data key to retrieve. If omitted, returns all data for the group.

### `save.set(group_name, key_or_data, value)`
Saves data. Has two usage patterns:
- `save.set(group_name, key, value)` - Sets a specific key-value pair
- `save.set(group_name, object)` - Merges an object with existing data

### `save.clear(group_name)`
Removes all saved data for the group.

## Usage Examples

### Basic Usage
```js
// Save a single value
save.set("group_5", "score", 1500);

// Get a single value
let score = save.get("group_5", "score");

// Get all group data
let allData = save.get("group_5");

// Save multiple values at once
save.set("group_5", {
    level: 3,
    score: 1500,
    settings: { volume: 0.8 }
});
```

### Learned Words Example
```js
// Initialize learned words array (only needed once)
if (!save.get("group_5", "learnedWords")) {
    save.set("group_5", "learnedWords", []);
}

// Add a learned word
let learnedWords = save.get("group_5", "learnedWords");
if (!learnedWords.includes("hund")) {
    learnedWords.push("hund");
    save.set("group_5", "learnedWords", learnedWords);
}

// Check if a word is learned
let isLearned = save.get("group_5", "learnedWords").includes("katt");
```

### Settings Example
```js
// Save user preferences
save.set("group_3", "settings", {
    volume: 0.7,
    difficulty: "medium",
    showHints: true
});

// Get specific setting
let volume = save.get("group_3", "settings").volume;
```

### Game Progress Example
```js
// Save player progress
save.set("group_7", {
    currentLevel: 5,
    score: 2300,
    lives: 3,
    timeStarted: Date.now()
});

// Load game state
let gameState = save.get("group_7");
if (gameState.currentLevel) {
    // Continue existing game
} else {
    // Start new game
}
```
## Error
The API includes built-in error handling:
- Returns empty object `{}` if no data exists
- Returns `null` for specific keys that don't exist
- Logs warnings to console if localStorage fails
- `set()` and `clear()` return `true`/`false` to indicate success
- Remember that localStorage has size limits (~5-10MB)
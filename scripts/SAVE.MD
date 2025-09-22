# Save.js API Documentation
This API allows teams to save and retrieve data using the browser's localStorage. It's designed to be simple and flexible for all game teams.
It also enables teams to share data if that is something needed.

## IMPORTANT: team Name Convention
**All teams MUST use their assigned team name as the first parameter.** This prevents teams from accidentally overwriting each other's data.

## API Methods

### `save.get(team_name, key)`
Retrieves saved data.
- `team_name`: For instance team08, or team02.
- `key` (optional): Specific data key to retrieve. If omitted, returns all data for the team.

### `save.set(team_name, key_or_data, value)`
Saves data. Has two usage patterns:
- `save.set(team_name, key, value)` - Sets a specific key-value pair
- `save.set(team_name, object)` - Merges an object with existing data

### `save.clear(team_name)`
Removes all saved data for the team.

## Usage Examples

### Basic Usage
```js
// Save a single value
save.set("team05", "score", 1500);

// Get a single value
let score = save.get("team05", "score");

// Get all team data
let allData = save.get("team05");

// Save multiple values at once
save.set("team05", {
    level: 3,
    score: 1500,
    settings: { volume: 0.8 }
});
```

### Learned Words Example
```js
// Initialize learned words array (only needed once)
if (!save.get("team05", "learnedWords")) {
    save.set("team05", "learnedWords", []);
}

// Add a learned word
let learnedWords = save.get("team05", "learnedWords");
if (!learnedWords.includes("hund")) {
    learnedWords.push("hund");
    save.set("team05", "learnedWords", learnedWords);
}

// Check if a word is learned
let isLearned = save.get("team05", "learnedWords").includes("katt");
```

### Settings Example
```js
// Save user preferences
save.set("team03", "settings", {
    volume: 0.7,
    difficulty: "medium",
    showHints: true
});

// Get specific setting
let volume = save.get("team03", "settings").volume;
```

### Game Progress Example
```js
// Save player progress
save.set("team07", {
    currentLevel: 5,
    score: 2300,
    lives: 3,
    timeStarted: Date.now()
});

// Load game state
let gameState = save.get("team07");
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
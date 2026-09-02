# Save.js API Documentation
This API allows games to save and retrieve data using the browser's localStorage. It's designed to be simple and flexible for all games.
It also enables games to share data if that is something needed.

## IMPORTANT: Game Name Convention
**Every game MUST use its own folder name as the first parameter.** This prevents games from accidentally overwriting each other's data.

---

## API Methods

### `save.get(game_name, key)`
Retrieves saved data for a game.

**Parameters:**
- `game_name` (string): Your game identifier, matching your folder name (e.g., "game08", "game03")
- `key` (string, optional): Specific data key to retrieve. If omitted, returns all data for the game.

**Returns:**
- If `key` is provided: the value associated with that key, or `null` if not found
- If `key` is omitted: an object containing all game data, or `{}` if no data exists

**Example:**
```js
const score = save.get("game05", "score");      // Get specific value
const allData = save.get("game05");             // Get all game data
```

---

### `save.set(game_name, key_or_data, value)`
Saves data for a game. Has two usage patterns:

**Pattern 1: Set a single key-value pair**
```js
save.set("game05", "score", 1500);
```

**Pattern 2: Merge an object with existing data**
```js
save.set("game05", { level: 3, score: 1500 });
```

**Parameters:**
- `game_name` (string): Your game identifier
- `key_or_data` (string | object): Either a key name or an object to merge
- `value` (any, optional): The value to save (only used with Pattern 1)

**Returns:**
- `true` if successful
- `false` if an error occurred

---

### `save.clear(game_name)`
Removes all saved data for a game, including stats.

**Parameters:**
- `game_name` (string): Your game identifier

**Returns:**
- `true` if successful
- `false` if an error occurred

**Example:**
```js
save.clear("game05");  // Removes all data for game05
```

---

## Stats API

The stats API provides a standardized way to track wins and completion percentage (0-100).

### `save.stats.set(game_name, wins, completion)`
Sets the win count and completion percentage for a game.

**Parameters:**
- `game_name` (string): Your game identifier
- `wins` (number): Number of wins (will be floored and clamped to minimum 0)
- `completion` (number): Completion percentage 0-100 (will be floored and clamped to 0-100 range)

**Returns:**
- `true` if successful
- `false` if validation fails or storage error occurs

**Example:**
```js
save.stats.set("game05", 10, 75);  // 10 wins, 75% completion
```

---

### `save.stats.get(game_name)`
Retrieves the stats for a game.

**Parameters:**
- `game_name` (string): Your game identifier

**Returns:**
- An object with `{ wins: number, completion: number }`
- Returns `{ wins: 0, completion: 0 }` if no stats exist

**Example:**
```js
const stats = save.stats.get("game05");
console.log(`Wins: ${stats.wins}, Completion: ${stats.completion}%`);
```

---

### `save.stats.incrementWin(game_name)`
Increases the win count by 1 while keeping completion unchanged.

**Parameters:**
- `game_name` (string): Your game identifier

**Returns:**
- `true` if successful
- `false` if an error occurred

**Example:**
```js
save.stats.incrementWin("game05");  // Adds 1 to wins
```

---

### `save.stats.setCompletion(game_name, completion)`
Updates only the completion percentage while keeping wins unchanged.

**Parameters:**
- `game_name` (string): Your game identifier
- `completion` (number): New completion percentage 0-100 (will be floored and clamped)

**Returns:**
- `true` if successful
- `false` if an error occurred

**Example:**
```js
save.stats.setCompletion("game05", 85);  // Set completion to 85%
```

---

### `save.stats.clear(game_name)`
Resets stats to zero (0 wins, 0% completion).

**Parameters:**
- `game_name` (string): Your game identifier

**Returns:**
- `true` if successful
- `false` if an error occurred

**Example:**
```js
save.stats.clear("game05");  // Resets to { wins: 0, completion: 0 }
```

---

## Usage Examples

### Basic Usage
```js
// Save a single value
save.set("game05", "score", 1500);

// Get a single value
let score = save.get("game05", "score");

// Get all game data
let allData = save.get("game05");

// Save multiple values at once
save.set("game05", {
    level: 3,
    score: 1500,
    settings: { volume: 0.8 }
});
```

### Stats Example
```js
// Initialize stats: 0 wins and 0% completion
save.stats.set("game05", 0, 0);

// Get all game stats data
const stats = save.stats.get("game05");
console.log(`Wins: ${stats.wins}, Completion: ${stats.completion}%`);

// Increment wins by 1
save.stats.incrementWin("game05");

// Update completion to new value
save.stats.setCompletion("game05", 40);

// Clear all stats for the game
save.stats.clear("game05");
```

### Learned Words Example
```js
// Initialize learned words array (only needed once)
if (!save.get("game05", "learnedWords")) {
    save.set("game05", "learnedWords", []);
}

// Add a learned word
let learnedWords = save.get("game05", "learnedWords");
if (!learnedWords.includes("hund")) {
    learnedWords.push("hund");
    save.set("game05", "learnedWords", learnedWords);
}

// Check if a word is learned
let isLearned = save.get("game05", "learnedWords").includes("katt");
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
save.set("game07", {
    currentLevel: 5,
    score: 2300,
    lives: 3,
    timeStarted: Date.now()
});

// Load game state
let gameState = save.get("game07");
if (gameState.currentLevel) {
    // Continue existing game
} else {
    // Start new game
}
```

---

## Error Handling
The API includes built-in error handling:
- Returns empty object `{}` if no data exists for a game
- Returns `null` for specific keys that don't exist
- Logs warnings to console if localStorage fails
- `set()` and `clear()` return `true`/`false` to indicate success
- `stats.set()` validates that wins and completion are numbers
- `stats.set()` automatically clamps values to valid ranges
- Remember that localStorage has size limits (~5-10MB depending on browser)

---

## Testing

### Browser Compatibility
The included tests in save_test.html work best in **Chrome**. Some tests do not run correctly in Firefox, reason is probably how different broswers handles overwriting localStorage methods like the one below.
```js
localStorage.getItem = () => {
                    throw new Error("getItem failed");
                };
```
# Save.js API Documentation
This API allows teams to save and retrieve data using the browser's localStorage. It's designed to be simple and flexible for all game teams.
It also enables teams to share data if that is something needed.

## IMPORTANT: Team Name Convention
**All teams MUST use their assigned team name as the first parameter.** This prevents teams from accidentally overwriting each other's data.

---

## API Methods

### `save.get(team_name, key)`
Retrieves saved data for a team.

**Parameters:**
- `team_name` (string): Your team identifier (e.g., "team08", "team02")
- `key` (string, optional): Specific data key to retrieve. If omitted, returns all data for the team.

**Returns:**
- If `key` is provided: the value associated with that key, or `null` if not found
- If `key` is omitted: an object containing all team data, or `{}` if no data exists

**Example:**
```js
const score = save.get("team05", "score");      // Get specific value
const allData = save.get("team05");             // Get all team data
```

---

### `save.set(team_name, key_or_data, value)`
Saves data for a team. Has two usage patterns:

**Pattern 1: Set a single key-value pair**
```js
save.set("team05", "score", 1500);
```

**Pattern 2: Merge an object with existing data**
```js
save.set("team05", { level: 3, score: 1500 });
```

**Parameters:**
- `team_name` (string): Your team identifier
- `key_or_data` (string | object): Either a key name or an object to merge
- `value` (any, optional): The value to save (only used with Pattern 1)

**Returns:**
- `true` if successful
- `false` if an error occurred

---

### `save.clear(team_name)`
Removes all saved data for a team, including stats.

**Parameters:**
- `team_name` (string): Your team identifier

**Returns:**
- `true` if successful
- `false` if an error occurred

**Example:**
```js
save.clear("team05");  // Removes all data for team05
```

---

## Stats API

The stats API provides a standardized way to track wins and completion percentage (0-100).

### `save.stats.set(team_name, wins, completion)`
Sets the win count and completion percentage for a team.

**Parameters:**
- `team_name` (string): Your team identifier
- `wins` (number): Number of wins (will be floored and clamped to minimum 0)
- `completion` (number): Completion percentage 0-100 (will be floored and clamped to 0-100 range)

**Returns:**
- `true` if successful
- `false` if validation fails or storage error occurs

**Example:**
```js
save.stats.set("team05", 10, 75);  // 10 wins, 75% completion
```

---

### `save.stats.get(team_name)`
Retrieves the stats for a team.

**Parameters:**
- `team_name` (string): Your team identifier

**Returns:**
- An object with `{ wins: number, completion: number }`
- Returns `{ wins: 0, completion: 0 }` if no stats exist

**Example:**
```js
const stats = save.stats.get("team05");
console.log(`Wins: ${stats.wins}, Completion: ${stats.completion}%`);
```

---

### `save.stats.incrementWin(team_name)`
Increases the win count by 1 while keeping completion unchanged.

**Parameters:**
- `team_name` (string): Your team identifier

**Returns:**
- `true` if successful
- `false` if an error occurred

**Example:**
```js
save.stats.incrementWin("team05");  // Adds 1 to wins
```

---

### `save.stats.setCompletion(team_name, completion)`
Updates only the completion percentage while keeping wins unchanged.

**Parameters:**
- `team_name` (string): Your team identifier
- `completion` (number): New completion percentage 0-100 (will be floored and clamped)

**Returns:**
- `true` if successful
- `false` if an error occurred

**Example:**
```js
save.stats.setCompletion("team05", 85);  // Set completion to 85%
```

---

### `save.stats.clear(team_name)`
Resets stats to zero (0 wins, 0% completion).

**Parameters:**
- `team_name` (string): Your team identifier

**Returns:**
- `true` if successful
- `false` if an error occurred

**Example:**
```js
save.stats.clear("team05");  // Resets to { wins: 0, completion: 0 }
```

---

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

### Stats Example
```js
// Initialize stats: 0 wins and 0% completion
save.stats.set("team05", 0, 0);

// Get all team stats data
const stats = save.stats.get("team05");
console.log(`Wins: ${stats.wins}, Completion: ${stats.completion}%`);

// Increment wins by 1
save.stats.incrementWin("team05");

// Update completion to new value
save.stats.setCompletion("team05", 40);

// Clear all stats for team
save.stats.clear("team05");
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

---

## Error Handling
The API includes built-in error handling:
- Returns empty object `{}` if no data exists for a team
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
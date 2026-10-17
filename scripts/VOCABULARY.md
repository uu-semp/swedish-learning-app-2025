# vocabulary.js and vocabulary_await.js API Documentation
This API fetches and configures the datasheet that all games use. It enables all games to load the datasheet and access words in different formats and with differing information.

---

## API Methods

### `loaddb()`
Fetches the datasheet and configures a db object that has all words with their information.

db = {
    vocab: each word with corresponding information in a dictionary see assets/README.md or scripts database_type.js for specifics,
    categories: dictionary with the key being a specific category and the object being a list of all ids in that category,
    rows: each row in the datasheet,
    game: all ids containing game specific data (not used anymore should be removed),
    vocabLength: amount of words,
    }


**Example:**
loaddb gets called when the vocabulary.js gets imported in games' html files. and then the games can access all functions in vocabulary.js

---

### `vocabulary.when_ready(callback)`
Runs a callback function when all loading from the database is done.

**Parameters:**
- `Callback` (function): A function to run when loading is done

**Example:**
```js
function startGame(){
    // some code
}

//start game when the datasheet has loaded
vocabulary.when_ready(startGame)
```

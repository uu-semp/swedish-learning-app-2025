# How to use the vocabulary data

The application now loads vocabulary data from the `words.csv` file in the root of the repository. This file is parsed and the data is made available through a global `window.vocabulary` object.

## `words.csv` file format

The `words.csv` file has the following columns:

- `id`: A unique identifier for the word.
- `en`: The English translation.
- `sv`: The Swedish translation.
- `literal`: A literal translation or explanation (optional).
- `category`: The category of the word (e.g., "furniture", "time").
- `image_path`: A relative path to an image for the word (optional).
- `team`: The team number that this word might have specific data for (optional).

## Using the `window.vocabulary` object

The `window.vocabulary` object provides functions to access the vocabulary data. Since the data is loaded asynchronously, you must wrap your code in `window.vocabulary.when_ready()` to ensure the data is available before you try to use it.

### Example Usage

```javascript
// Always wait for the data to be ready
window.vocabulary.when_ready(() => {
  // Load data for team 4
  window.vocabulary.load_team_data(4);

  // Get all keys for team 4's data
  const team4_keys = window.vocabulary.get_team_data_keys();
  console.log("Team 4 has data for these vocabulary IDs:", team4_keys);

  // Get the data for a specific word
  const clock_id = "3959537c";
  const clock_data = window.vocabulary.get_vocab(clock_id);
  console.log("Data for clock:", clock_data);
  // Expected output: { en: "clock", sv: "klocka", literal: "", img: "team04/assets/images/clock.jpg" }

  // Example of getting team specific data.
  // Currently, it just returns 'true' if the team has an entry for the word.
  const team_specific_data = window.vocabulary.get_team_data(clock_id);
  console.log("Team 4 specific data for clock:", team_specific_data);

  // Get all words in the 'furniture' category
  const furniture_words = window.vocabulary.get_category("furniture");
  console.log("Furniture words:", furniture_words);
});
```

### API Functions

- `when_ready(callback)`: Executes the `callback` function once the vocabulary data has been loaded.
- `get_vocab(id)`: Returns an object with the vocabulary metadata for the given `id`.
  - `en`: English word
  - `sv`: Swedish word
  - `literal`: Literal translation (if available)
  - `img`: Image path (if available)
- `get_category(category)`: Returns an array of vocabulary IDs that belong to the specified `category`.
- `load_team_data(team_id)`: Loads data associated with a specific team. You should call this inside `when_ready`.
- `get_team_data_keys()`: Returns an array of vocabulary IDs for which the currently loaded team has data.
- `get_team_data(id)`: Returns the specific data for a vocabulary `id` for the loaded team.

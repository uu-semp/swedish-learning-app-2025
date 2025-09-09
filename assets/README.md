# Assets

## Updating JSON

All JSON files related to the vocabulary are generated from `../words.csv` by the `gen-vocab.py` script. These are the steps to add new words:

1. Add your word to [`../words.csv`](../words.csv).
    * The ID needs to be unique for every word. The current dataset uses a hash function to generate a unique identifier to each word.
    * You can clone the following google sheets document to make this generation easy: https://docs.google.com/spreadsheets/d/1BGk3K4gBoB2JGesPwPGclhyoUnfVh9-zgSVHn_Q5k64/edit?usp=sharing
2. Run `gen-vocab.py` from the root of the repository to update the files:
    ```
    python3 ./assets/gen-vocab.py
    ```

Done, everything should be updated.

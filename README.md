# A simple website to learn basic Swedish Words

## Development:

- Run the following command to serve the website locally:
    ```
    python3 -m http.server 8000
    ```

    It can now be accessed from the browser under: <http://localhost:8000/index.html>

## Spaced repetition

The main menu loads `scripts/srs.js`, which exposes `window.srs` to games running
in its same-origin iframe. Games that use the shared vocabulary catalog can
record each checked response with:

```js
window.parent.srs?.recordAnswer("game02", wordId, isCorrect);
```

The API also exposes `getWordWeights(gameId, category)` and
`getWeightedRandom(gameId, category)` for vocabulary selection. Weights use a
smoothed wrong-answer rate, `(wrong + 1) / (seen + 2)`, so unseen words start
with a medium weight and every word retains a non-zero chance of selection.
Records are stored per game in browser local storage through `window.save`.
`getSeenWords(gameIds, category)` supplies the practice-history view, opened
from the menu header in its iframe, and `clear(gameIds)` removes only those
SRS records. Games using private
vocabulary data need to map their item IDs to the shared vocabulary catalog
before the history can display those words or category weights can include them.

## Technical Restraints

- The website has to be static to allow free and easy hosting on GitHub pages
- The website will use HTML, CSS, and JavaScript
    - The following external libraries and resourcesa are already included:
        - [JQuerry](https://jquery.com/)
        - [Vue.js](https://vuejs.org/)
        - [Font Awesome](https://fontawesome.com/start)
    - The usage of other external libraries have to be approved first.

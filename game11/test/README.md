# Game 11 – Tests

Run from the repository root (Node 22+, no install needed):

```
node --test game11/test/game11.test.mjs
```

Tests use the repo's `words.csv` as vocabulary and check: item pool,
item data, image/audio files exist, unique item keys, shopping list, shelf, new/restored/corrupted
game state, that popup.html links to an existing end-screen file,
shelf click latency (< 200 ms, NFR 5.4) and the missing-image fallback.

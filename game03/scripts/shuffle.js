// Shared shuffle for game03 (loaded before the level scripts and imageFetching).

// Shuffle a copy of the array (Fisher-Yates).
window.shuffle = function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

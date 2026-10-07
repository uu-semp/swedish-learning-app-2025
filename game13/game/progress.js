// ==============================================
// Score / progress tracking for Game 13 (REQ-STUDENT-7)
//
// Stored with the shared save API (scripts/save.js) under "game13":
//   save.get("game13", "levels") -> { "1": { completed: 7, firstTry: 4 }, ... }
//
// A round is "completed" when the student either dresses Pelle correctly
// or gives up. It is "first try" when the very first full outfit the
// student confirmed was correct.
//
// Requires scripts/save.js to be loaded before this file.
// ==============================================

window.progress = (() => {
  const GAME_NAME = "game13";
  const LEVEL_COUNT = 3;          // levels shown on the level-selection page
  const FIRST_TRY_TARGET = 5;     // first-try rounds needed for a level to count as done

  function getAllLevels() {
    const levels = window.save.get(GAME_NAME, "levels");
    return levels && typeof levels === "object" ? levels : {};
  }

  // Returns { completed, firstTry } for a level, zeros if it hasn't been played.
  function getLevel(level) {
    const stats = getAllLevels()[String(level)] || {};
    return {
      completed: Number(stats.completed) || 0,
      firstTry: Number(stats.firstTry) || 0,
    };
  }

  // Records one finished round for a level and updates the hub stats.
  function recordRound(level, firstTry) {
    const levels = getAllLevels();
    const current = getLevel(level);
    levels[String(level)] = {
      completed: current.completed + 1,
      firstTry: current.firstTry + (firstTry ? 1 : 0),
    };
    window.save.set(GAME_NAME, "levels", levels);
    syncHubStats();
    return levels[String(level)];
  }

  // Keeps the shared hub stats in line with our per-level stats:
  //   wins       = total first-try rounds across all levels
  //   completion = share of levels that reached FIRST_TRY_TARGET
  function syncHubStats() {
    let wins = 0;
    let levelsDone = 0;
    for (let level = 1; level <= LEVEL_COUNT; level++) {
      const { firstTry } = getLevel(level);
      wins += firstTry;
      if (firstTry >= FIRST_TRY_TARGET) levelsDone++;
    }
    const completion = (levelsDone / LEVEL_COUNT) * 100;
    return window.save.stats.set(GAME_NAME, wins, completion);
  }

  return { LEVEL_COUNT, FIRST_TRY_TARGET, getLevel, recordRound, syncHubStats };
})();

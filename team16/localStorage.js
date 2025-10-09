import * as save from "../scripts/save.js";

export function updateGameProgress(currentProgression) {
  save.set("team16", currentProgression);
}

export function getGameProgress() {
  // Firstly if no game progress, reset
  if (!save.get("team16", "progression")) {
    save.set("team16", "progression", {
      level1: {
        completed: 0,
        total: 10,
        unlocked: true,
        attempts: 0,
      },
      level2: {
        completed: 0,
        total: 10,
        unlocked: false,
        attempts: 0,

      },
      level3: {
        completed: 0,
        total: 10,
        unlocked: false,
        attempts: 0,
      },
    });
  }
  // return game progress
  return save.get("team16");
}

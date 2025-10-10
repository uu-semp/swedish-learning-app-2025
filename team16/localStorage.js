export function updateGameProgress(currentProgression) {
  window.save.set("team16", currentProgression);
}

export function getGameProgress() {
  console.log('Getting game progress...');
  
  const existingData = window.save.get("team16");
  //idk why without this check sometimes it did not load
  if (!existingData || !existingData.level1 || !existingData.level2 || !existingData.level3) {
    console.log('No valid progress found or wrong structure, creating default...');
    const defaultProgress = {
      level1: {
        completed: 0,
        total: 10,
        unlocked: true,
        attempts: 0,
        timeSpent: 0,
        lastPlayed: null
      },
      level2: {
        completed: 0,
        total: 10,
        unlocked: false,
        attempts: 0,
        timeSpent: 0,
        lastPlayed: null
      },
      level3: {
        completed: 0,
        total: 10,
        unlocked: false,
        attempts: 0,
        timeSpent: 0,
        lastPlayed: null
      }
    };
    window.save.set("team16", defaultProgress);
    return defaultProgress;
  }
  return existingData;
}
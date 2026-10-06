// 4 groups of connected instructions for a row layout
const instructionGroups = [
  // Group 1: Office setup
  [
    { question: "Dra datorn till mitten.", answer: "computer", swedish: "dator", index: [2] },
    { question: "Dra stolen längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
    { question: "Dra lampan direkt till höger om datorn.", answer: "lamp", swedish: "lampa", index: [3] },
    { question: "Dra skrivbordet längst till höger.", answer: "desk", swedish: "skrivbord", index: [4] },
    { question: "Dra bokhyllan direkt till höger om stolen.", answer: "bookshelf", swedish: "bokhylla", index: [1] }
  ],

  // Group 2: Living room setup
  [
    { question: "Dra soffan längst till höger.", answer: "couch", swedish: "soffa", index: [4] },
    { question: "Dra tv:n till mitten.", answer: "tv", swedish: "tv", index: [2] },
    { question: "Dra bordet längst till vänster.", answer: "table", swedish: "bord", index: [0] },
    { question: "Dra lampan direkt till höger om tv:n.", answer: "lamp", swedish: "lampa", index: [3] },
    { question: "Dra mattan direkt till vänster om tv:n.", answer: "carpet", swedish: "matta", index: [1] }
  ],

  // Group 3: Bedroom setup
  [
    { question: "Dra sängen längst till vänster.", answer: "bed", swedish: "säng", index: [0] },
    { question: "Dra bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] },
    { question: "Dra lampan till mitten.", answer: "lamp", swedish: "lampa", index: [2] },
    { question: "Dra mattan direkt till höger om lampan.", answer: "carpet", swedish: "matta", index: [3] },
    { question: "Dra kudden direkt till höger om sängen.", answer: "pillow", swedish: "kudde", index: [1] }
  ],

  // Group 4: Kitchen setup
  [
    { question: "Dra kylskåpet till mitten.", answer: "refrigerator", swedish: "kylskåp", index: [2] },
    { question: "Dra spisen direkt till höger om kylskåpet.", answer: "stove", swedish: "spis", index: [3] },
    { question: "Dra bordet längst till höger.", answer: "table", swedish: "bord", index: [4] },
    { question: "Dra stolen längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
    { question: "Dra dörren direkt till vänster om kylskåpet.", answer: "door", swedish: "dörr", index: [1] }
  ],
  
  // Group 5: Bathroom setup (questions still to be written)
  []
];

// Room picked in the main menu (level.html?level=N&room=…) selects its group directly
const ROOM_GROUP_INDEX = { office: 0, livingroom: 1, bedroom: 2, kitchen: 3, bathroom: 4 };
function getRoomGroup() {
  const room = new URLSearchParams(window.location.search).get("room");
  return room in ROOM_GROUP_INDEX ? instructionGroups[ROOM_GROUP_INDEX[room]] : null;
}

// Store the selected group globally so both scripts use the same group
let selectedGroup = null;

// Function to get 1 random group with least learned words (5 connected questions) - returns a copy
function getRandomQuestions() {
  const roomGroup = getRoomGroup();
  if (roomGroup) {
    selectedGroup = roomGroup;
    return [...selectedGroup];
  }

  const learnedWords = save.get("game03", "learnedWords") || [];

  // Rooms without questions yet (e.g. bathroom) are never picked at random
  const playableGroups = instructionGroups.filter(group => group.length > 0);

  const learnedCounts = playableGroups.map(group =>
    group.filter(item => learnedWords.includes(item.swedish)).length
  );

  const minLearnedCount = Math.min(...learnedCounts);

  const leastLearnedGroups = playableGroups.filter((_, i) => learnedCounts[i] === minLearnedCount);

  const randomIndex = Math.floor(Math.random() * leastLearnedGroups.length);
  selectedGroup = leastLearnedGroups[randomIndex];

  console.log('Selected group:', selectedGroup, ". Learned word count: ", minLearnedCount);

  return [...selectedGroup];
}

// Export the function to be used by other scripts
window.getRandomQuestions = getRandomQuestions;

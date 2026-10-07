// 4 groups of connected instructions for a row layout
const instructionGroups = [
  // Group 1: Office setup
  [
    { question: "Dra datorn till mitten.", answer: "computer", swedish: "dator" , index: [3] },
    { question: "Dra stolen längst till vänster.", answer: "chair", swedish: "stol" , index: [0] },
    { question: "Dra lampan direkt till höger om datorn.", answer: "lamp", swedish: "lampa", index: [4] },
    { question: "Dra skrivbordet direkt till höger om lampan.", answer: "desk", swedish: "skrivbord", index: [5] },
    { question: "Dra bokhyllan direkt till höger om stolen.", answer: "bookshelf", swedish: "bokhylla", index: [1] },
    { question: "Dra kudden längst till höger.", answer: "pillow", swedish: "kudde", index: [6] },
    { question: "Dra spegeln direkt till vänster om datorn.", answer: "mirror", swedish: "spegel", index: [2] }
  ],
  
  // Group 2: Living room setup
  [
    { question: "Dra soffan längst till höger.", answer: "couch", swedish: "soffa", index: [6] },
    { question: "Dra tv:n till mitten.", answer: "tv", swedish: "tv", index: [3]},
    { question: "Dra bordet längst till vänster.", answer: "table", swedish: "bord", index: [0] },
    { question: "Dra lampan direkt till höger om tv:n.", answer: "lamp", swedish: "lampa", index: [4] },
    { question: "Dra mattan direkt till höger om bordet.", answer: "carpet", swedish: "matta", index: [1] },
    { question: "Dra kudden direkt till höger om lampan.", answer: "pillow", swedish: "kudde", index: [5] },
    { question: "Dra blomman direkt till vänster om tv:n.", answer: "flower", swedish: "blomma", index: [2] }
  ],
  
  // Group 3: Bedroom setup
  [
    { question: "Dra sängen längst till vänster.", answer: "bed", swedish: "säng", index: [0] },
    { question: "Dra bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [6] },
    { question: "Dra lampan till mitten.", answer: "lamp", swedish: "lampa", index: [3] },
    { question: "Dra mattan direkt till höger om lampan.", answer: "carpet", swedish: "matta", index: [4] },
    { question: "Dra kudden direkt till höger om sängen.", answer: "pillow", swedish: "kudde", index: [1] },
    { question: "Dra spegeln direkt till höger om mattan.", answer: "mirror", swedish: "spegel", index: [5] },
    { question: "Dra garderoben direkt till vänster om lampan.", answer: "wardrobe", swedish: "garderob", index: [2] }
  ],
  
  // Group 4: Kitchen setup
  [
    { question: "Dra kylskåpet till mitten.", answer: "refrigerator", swedish: "kylskåp", index: [3] },
    { question: "Dra spisen direkt till höger om kylskåpet.", answer: "stove", swedish: "spis", index: [4] },
    { question: "Dra bordet direkt till höger om spisen.", answer: "table", swedish: "bord", index: [5] },
    { question: "Dra stolen längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
    { question: "Dra dörren direkt till höger om stolen.", answer: "door", swedish: "dörr", index: [1] },
    { question: "Dra skåpet längst till höger.", answer: "cupboard", swedish: "skåp", index: [6] },
    { question: "Dra blomman direkt till vänster om kylskåpet.", answer: "flower", swedish: "blomma", index: [2] }
  ]
];

// Store the selected group globally so both scripts use the same group
let selectedGroup = null;

// Function to get 1 random group (7 connected questions) - returns a copy
function getRandomQuestions() {
  if (!selectedGroup) {
    const randomGroupIndex = Math.floor(Math.random() * instructionGroups.length);
    selectedGroup = instructionGroups[randomGroupIndex];
    console.log('Selected group index:', randomGroupIndex);
    console.log('Selected group questions:', selectedGroup);
  }
  // Return a copy of the group so modifications don't affect other scripts
  return [...selectedGroup];
}

// Export the function to be used by other scripts
window.getRandomQuestions = getRandomQuestions;

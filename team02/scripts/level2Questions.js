// 8 groups of connected instructions for a row layout with different question types
const instructionGroups = [
  // 🖥️ Group 1: Office setup
  [
    { question: "Placera datorn i mitten.", answer: "computer", swedish: "dator", index: [2] },
    { question: "Placera stolen längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
    { question: "Placera lampan längst till höger.", answer: "lamp", swedish: "lampa", index: [4] },
    { question: "Placera skrivbordet mellan datorn och lampan.", answer: "desk", swedish: "skrivbord", index: [3] },
    { question: "Placera bokhyllan mellan stolen och datorn.", answer: "bookshelf", swedish: "bokhylla", index: [1] }
  ],

  // 🛋️ Group 2: Living room setup
  [
    { question: "Placera soffan längst till höger.", answer: "couch", swedish: "soffa", index: [4] },
    { question: "Placera tv:n i mitten.", answer: "tv", swedish: "tv", index: [2] },
    { question: "Placera bordet längst till vänster.", answer: "table", swedish: "bord", index: [0] },
    { question: "Placera lampan mellan tv:n och soffan.", answer: "lamp", swedish: "lampa", index: [3] },
    { question: "Placera mattan mellan bordet och tv:n.", answer: "carpet", swedish: "matta", index: [1] }
  ],

  // 🛏️ Group 3: Bedroom setup
  [
    { question: "Placera sängen längst till vänster.", answer: "bed", swedish: "säng", index: [0] },
    { question: "Placera bokhyllan längst till höger.", answer: "bookshelf", swedish: "bokhylla", index: [4] },
    { question: "Placera lampan i mitten.", answer: "lamp", swedish: "lampa", index: [2] },
    { question: "Placera mattan mellan lampan och bokhyllan.", answer: "carpet", swedish: "matta", index: [3] },
    { question: "Placera kudden mellan sängen och lampan.", answer: "pillow", swedish: "kudde", index: [1] }
  ],

  // 🍳 Group 4: Kitchen setup
  [
    { question: "Placera kylskåpet i mitten.", answer: "refrigerator", swedish: "kylskåp", index: [2] },
    { question: "Placera spisen mellan kylskåpet och bordet.", answer: "stove", swedish: "spis", index: [3] },
    { question: "Placera bordet längst till höger.", answer: "table", swedish: "bord", index: [4] },
    { question: "Placera stolen längst till vänster.", answer: "chair", swedish: "stol", index: [0] },
    { question: "Placera dörren mellan stolen och kylskåpet.", answer: "door", swedish: "dörr", index: [1] }
  ]
];


// Store the selected group globally so both scripts use the same group
let selectedGroup = null;

// Function to get 1 random group (5 connected questions) - returns a copy
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

// Function to get 3 additional random furniture images (excluding question images)
function getRandomDistractorImages() {
  return new Promise(resolve => {
    window.vocabulary.when_ready(() => {
      // Get all furniture category IDs
      const furnitureIds = window.vocabulary.get_category("furniture");
      const furnitureVocabularies = furnitureIds.map(id => window.vocabulary.get_vocab(id));
      const allFurnitureImages = furnitureVocabularies.filter(v => v.img).map(v => v.img);
      
      // Get the required images from current questions
      const requiredImages = selectedGroup ? selectedGroup.map(q => q.answer) : [];
      
      // Extract image names from paths and filter out required ones
      const allImageNames = allFurnitureImages.map(path => path.split('/').pop().replace('.png', ''));
      const availableDistractors = allImageNames.filter(name => !requiredImages.includes(name));
      
      // Randomly select 3 distractor images
      const shuffled = [...availableDistractors].sort(() => 0.5 - Math.random());
      const selectedDistractors = shuffled.slice(0, 3);
      
      console.log('Available distractor images:', availableDistractors);
      console.log('Selected 3 random distractors:', selectedDistractors);
      
      // Convert back to full image paths
      const distractorPaths = selectedDistractors.map(name => 
        allFurnitureImages.find(path => path.split('/').pop().replace('.png', '') === name)
      ).filter(Boolean);
      
      resolve(distractorPaths);
    });
  });
}

// Export the functions to be used by other scripts
window.getRandomQuestions = getRandomQuestions;
window.getRandomDistractorImages = getRandomDistractorImages;

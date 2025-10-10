import clothingItems from "/team15/clothing-items-info.js";

export const LevelOneView = {
    name: 'level-one-view',
    props: ['switchTo'],
    data() {
        return {
            showModal: false, // Controls the visibility of the modal
            showCorrectFeedback: false,
            showIncorrectFeedback: false,
            currentScore: 0, // Initial  player's score
            currentItem: null, 
            // Track attempts for the current item
            currentAttempts: 0,
            incorrectMessage: '',
            // Placeholder progress data
            totalTries: 0,
            correctAnswers: 0,
            gameOver:false,
            showInfo:false,
            chosenClothingItems: [],
            numberOfQuestionsAsked: 10,
            indexesAsked: []

        };
    },

    mounted() {
        this.startLevel();
    },

    methods: {
            startLevel() {  
                const stats = window.save.stats.get("team15")  //Consol log state of system at start of each round
                console.log("State of the system: ", stats)  
                this.chosenClothingItems = this.generateSubCategories()
            if (this.chosenClothingItems && this.chosenClothingItems.length > 0) {
                let randomIndex = this.getRandomIndex(this.chosenClothingItems)
                this.currentItem = this.chosenClothingItems[randomIndex];
                this.indexesAsked.push(randomIndex); // keep track of what indexes we´ve asked for!
                this.currentAttempts = 0;
                this.incorrectMessage = '';
            } else {
                console.error("No clothing items found to start the level.");
            }
        },

        loadNextItem() {
            if (this.indexesAsked.length < this.numberOfQuestionsAsked) {  // Check if we have asked < than 10 indexes. 
                let randomIndex = this.getRandomIndex(this.chosenClothingItems)
                while (this.indexesAsked.includes(randomIndex)) {
                    randomIndex = this.getRandomIndex(this.chosenClothingItems)
                }
                this.currentItem = this.chosenClothingItems[randomIndex];
                this.currentAttempts = 0;
                this.incorrectMessage = '';
                this.indexesAsked.push(randomIndex)
            } else {
                this.saveGameScore()
                this.gameOver=true
            }
        },

        saveGameScore(){  // Uses the save.js API to set the score of our game! 
            //Right now this is really simplified, and we don't consider the other levels while setting completion.
            const stats = window.save.stats.get("team15")
            const completion = stats.completion
            let wins = stats.wins
            let percentageCorrect = this.getPercentage()
            if (percentageCorrect > completion){ //Only set percentage if better than prev attempts
                const numWins = wins + 1;
                save.stats.set("team15", numWins, percentageCorrect)
                console.log("set new record!")
            }
        },

        getPercentage(){
            return (this.currentScore/this.numberOfQuestionsAsked)*100;
        },

        getPercentageScore(){ // By using this method the lower the score the better the score point becomes
            //This can be used to send as the score feature of the save js API (which i cannot get to work ATM)
            const maxPossible = this.numberOfQuestionsAsked * 3; // We have 3 attempts per question
            const percentageScore = (this.currentScore / maxPossible) * 100;

            return percentageScore
        },

        generateSubCategories(){
            const categories = ["accessories", "shirts", "pants", "shoes"]
            const chosenClothingItems = []
            for (const subCategory  of categories){
                const categoryItems =  clothingItems.filter(items => items.Subcategory === subCategory);
                let chosenSubcategoryItems= [];
                if (categoryItems.length > 9){ // We only display 9 items, some don't have 9 items though!
                    chosenSubcategoryItems = this.subsetGenerator(categoryItems)
                }
                else{ chosenSubcategoryItems = categoryItems}
                chosenClothingItems.push(...chosenSubcategoryItems);
            }
            return chosenClothingItems;
        },

        subsetGenerator(categoryItems){
            let randomSubset = []
            for (let i=0; i < 9; i++) {
                let randomIndex = this.getRandomIndex(categoryItems)
                let randomItem = categoryItems[randomIndex];
                randomSubset.push(randomItem);
                categoryItems.splice(randomIndex, 1) // removes the selected item
            }
            return randomSubset;
        },

        getRandomIndex(subset){
            return Math.floor(Math.random() * subset.length) //Gives a random index, 
        },

        openModal() {
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.showInfo=false;
        },
        
        confirmExit() {
            this.saveGameScore()  // If user exits before we still want to save the progress. 
            this.switchTo('ChooseLevelView'); // Navigate to ChooseLevelView
            this.closeModal();
        },

        handleOverlayClick(event) {
            if (event.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        },

        // Placeholder progress tracking methods
        incrementTotalTries() {
            this.totalTries = (this.totalTries || 0) + 1;
        },

        recordCorrectAnswer() {
            this.correctAnswers = (this.correctAnswers || 0) + 1;
            // Reset attempts for the next question
            this.currentAttempts = 0;
        },

        recordIncorrectAttempt() {
            // Increment attempts for the current question and return the new value
            this.currentAttempts = Math.min(3, (this.currentAttempts || 0) + 1);
            return this.currentAttempts;
        },

      handleDropResult({ isCorrect, droppedItem }) {
            // Record that the player made a try (placeholder for persistent storage)
            this.incrementTotalTries();
            if (isCorrect) {
                // Correct answer: reset attempts, show success, award point and go next
                this.currentAttempts = 0;
                this.incorrectMessage = '';
                this.showCorrectFeedback = true;
                this.currentScore++;
                // Track correct answers (placeholder)
                this.recordCorrectAnswer();
                setTimeout(() => {
                    this.showCorrectFeedback = false;
                    this.loadNextItem();
                }, 1500);
            } else {
                // Incorrect: increment attempts and choose the message
                const attempts = this.recordIncorrectAttempt();
                // Map attempts to translation keys
                const key = attempts === 1 ? 'wrong-try-1' : (attempts === 2 ? 'wrong-try-2' : 'wrong-try-3');
                this.incorrectMessage = this.$language.translate(key);

                // Show the incorrect feedback with dynamic message
                this.showIncorrectFeedback = true;

                // If third attempt, after showing message advance to next item
                if (this.currentAttempts >= 3) {
                    setTimeout(() => {
                        this.showIncorrectFeedback = false;
                        // ensure no points awarded, reset attempts and move on
                        this.currentAttempts = 0;
                        this.incorrectMessage = '';
                        this.loadNextItem();
                    }, 1500);
                } else {
                    // For attempts 1 or 2, just show message briefly
                    setTimeout(() => {
                        this.showIncorrectFeedback = false;
                    }, 1500);
                }
            }
        },

        restartGame(){
            this.resetGameState()
            this.startLevel()
        },

        resetGameState(){
            this.showModal= false, 
            this.showCorrectFeedback= false;
            this.showIncorrectFeedback= false;
            this.currentScore= 0;
            this.currentItem= null;
            this.currentIndex= 0;
            this.currentAttempts= 0;
            this.incorrectMessage= '';
            this.totalTries= 0;
            this.correctAnswers= 0;
            this.gameOver=false;
            this.showInfo=false;
            this.chosenClothingItems= [];
            this.numberOfQuestionsAsked= 10;
            this.indexesAsked= []

        },

    },

    template: `
      <div class="level-one-view">
            <div class="level-header">

                <div class="score-counter">
                    <score-counter :score="currentScore" :item-amount="numberOfQuestionsAsked"></score-counter>
                </div>
                
                <dress-pelle-prompt :item="currentItem"></dress-pelle-prompt>
    
            </div>
            
            <correct-answer-feedback v-if="showCorrectFeedback"></correct-answer-feedback>
            <incorrect-answer-feedback v-if="showIncorrectFeedback" :message="incorrectMessage"></incorrect-answer-feedback>         

            <div class="main-content-area">
                                <div class="pelle-wrapper">
                                        <pelle-container
                                            :expected-item-id="currentItem ? currentItem.ID : ''"
                                            @item-dropped="handleDropResult"
                                        ></pelle-container>
                                </div>
                <div class="wardrobe-wrapper">
                    <wardrobe-container :clothes="this.chosenClothingItems"></wardrobe-container>
                </div>
            </div>

            <div>
                <exit-game-button @click="openModal"></exit-game-button>
                <info-button @click="this.showInfo=true"></info-button>
            </div>
            <div v-if="showModal" class="modal-overlay" @click="handleOverlayClick">
                <div class="modal-content" @click.stop>
                    <h2>{{$language.translate('exit-confirmation')}}</h2>
                    <div class="modal-buttons">
                        <button class="big-buttons" @click="confirmExit">{{$language.translate('yes')}}</button>
                        <button class="big-buttons" @click="closeModal">{{$language.translate('no')}}</button>
                    </div>
                </div>
            </div>
            <statisticsPopUp v-if="gameOver" @playAgain="restartGame" @exit="confirmExit" :totalNumberTries="totalTries" :score="this.currentScore" :numQuestionsAsked="this.numberOfQuestionsAsked"></statisticsPopUp>
            <div v-if="this.showInfo" class="modal-overlay" @click="handleOverlayClick">
                <div class="modal-content" @click="this.showInfo=false">
                    <h2>{{$language.translate('information-message')}}</h2>
                    <div class="modal-buttons">
                        <button class="big-buttons" id="info-back-button" @click="this.showInfo=false">{{$language.translate('okay-continue')}}</button>
                    </div>
                </div>
            </div>
        </div>
      `,
};
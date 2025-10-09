// ==============================================
// Owned by Team 10 - Level 2 Component
// ==============================================

const { ref } = Vue;

const LevelTwo = {
    template: `
    <div class="level-two-game">
        <h2 class="display-level">Level 2 - Matching</h2>
        <p class="instructions">Instructions: Match the Swedish word to its English translation.</p>
        
        <div class="score-display">
            <span :class="{'text-green-500': score > 0, 'text-red-500': maxQuestions - score > 0}">
                Matches: {{ score }} / {{ maxQuestions }}
            </span>
        </div>

        <div class="matching-grid">
            <!-- Render all cards -->
            <div 
                v-for="(card, index) in cards" 
                :key="index" 
                :class="['card', { 'selected': isSelected(index), 'matched': card.matched }]"
                @click="selectCard(index)"
            >
                {{ card.text }}
            </div>
        </div>

        <button 
            v-if="!levelComplete && score >= requiredScore" 
            @click="finishLevel" 
            class="submit-button mt-4"
        >
            Finish & Advance
        </button>
    </div>
    `,
    props: ['maxQuestions'], // Inherit maxQuestions (e.g., 5 matches)
    emits: ['level-complete'], // Emit event to main app when finished
    data() {
        // Sample data for matching: sv (Swedish), en (English)
        const wordPairs = [
            { sv: 'Smör', en: 'Butter', id: 1 },
            { sv: 'Sked', en: 'Spoon', id: 2 },
            { sv: 'Kniv', en: 'Knife', id: 3 },
            { sv: 'Salt', en: 'Salt', id: 4 },
            { sv: 'Gaffel', en: 'Fork', id: 5 }
        ];

        // Create cards from pairs: each pair becomes two separate cards
        let cardsData = [];
        wordPairs.forEach(pair => {
            cardsData.push({ text: pair.sv, pairId: pair.id, type: 'sv', matched: false });
            cardsData.push({ text: pair.en, pairId: pair.id, type: 'en', matched: false });
        });

        // Shuffle cards for initial display
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        return {
            cards: shuffle(cardsData),
            selectedCards: [], // Stores index of selected cards
            score: 0,
            levelComplete: false,
            // 80% completion criteria (e.g., 5 matches * 0.8 = 4 matches required)
            requiredScore: Math.ceil(wordPairs.length * 0.80) 
        };
    },
    methods: {
        isSelected(index) {
            return this.selectedCards.includes(index);
        },
        selectCard(index) {
            const card = this.cards[index];
            if (card.matched || this.selectedCards.includes(index) || this.selectedCards.length >= 2 || this.levelComplete) {
                return; // Ignore if matched, already selected, or already two selected
            }

            this.selectedCards.push(index);

            if (this.selectedCards.length === 2) {
                setTimeout(this.checkMatch, 800);
            }
        },
        checkMatch() {
            const index1 = this.selectedCards[0];
            const index2 = this.selectedCards[1];
            const card1 = this.cards[index1];
            const card2 = this.cards[index2];

            if (card1.pairId === card2.pairId && card1.type !== card2.type) {
                // Match found!
                card1.matched = true;
                card2.matched = true;
                this.score++;

                if (this.score >= this.requiredScore && this.score === (this.cards.length / 2)) {
                    this.levelComplete = true; // All pairs matched
                    this.finishLevel();
                }

                if (this.score >= this.requiredScore && !this.levelComplete) {
                    alert("You've met the passing score! Click 'Finish & Advance' to continue.");
                }

            } else {
                // No match, give feedback then flip back
                alert("No match. Try again!");
            }
            
            this.selectedCards = []; // Reset selected cards
        },
        finishLevel() {
            this.$emit('level-complete'); // Notify parent component
        }
    }
};

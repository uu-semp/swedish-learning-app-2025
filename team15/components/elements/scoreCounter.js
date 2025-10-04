export const ScoreCounter = {
    name: 'score-counter',
    props: {
        initialScore: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            score: this.initialScore
        };
    },
    template: `
        <div class="score-counter">
            <span>{{ score }}</span> P
            <img src="./components/assets/coin.png" alt="coin" class="coin-icon" />
        </div>
    `,
    methods: {
        addPoints(points) {
            this.score += points;
        },
        resetScore() {
            this.score = this.initialScore;
        }
    }
};
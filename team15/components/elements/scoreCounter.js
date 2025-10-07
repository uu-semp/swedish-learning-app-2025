export const ScoreCounter = {
    name: 'score-counter',
    props: {
        score: 0 
    },
    template: `
        <div class="score-counter">
            <span>{{ score }}</span> P
            <img src="./components/assets/coin.png" alt="coin"/>
        </div>
    `
};
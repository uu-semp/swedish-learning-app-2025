export const ScoreCounter = {
    name: 'score-counter',
    props: {
        score: 0,
        itemAmount: 0,
    },
    template: `
        <div>
            <span>{{ score }}</span>/{{ itemAmount }}  P
            <img src="./components/assets/coin.png" alt="coin"/>
        </div>
    `
};
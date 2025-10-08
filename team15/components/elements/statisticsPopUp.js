//Simple pop up after game is done

export const StatisticsPopUp = {
    name: "statisticsPopUp",
    props:{
        score:{
            type: Number,
            required: true
        }
    },
    methods:{
        procentCalculator(score){
            return (score/10)*100;
        }

    },
    emits:['playAgain', 'exit'],
    template: `
     <div class="modal-overlay">
        <div class="modal-content">
            <div class ="rowContainer">
                <img src="./components/assets/coin.png" alt="coin"/>
                <h2>{{$language.translate('good-job')}}</h2>
                <img src="./components/assets/coin.png" alt="coin"/>
            </div>
            <h3>Total number right: {{ procentCalculator(score) }}%</h3>
            <div class="popUpButtons">
                <button class="big-buttons" @click.self="$emit('playAgain')">{{$language.translate('play-again')}}</button>
                <button class="big-buttons" id="exitButton" @click.self="$emit('exit')">{{$language.translate('exit')}}</button>
            </div>
        </div>
    </div>
    `,
  };
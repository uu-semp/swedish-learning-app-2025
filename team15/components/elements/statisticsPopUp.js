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
    template: `
     <div class="modal-overlay" @click="console.log('!!')">
        <div class="modal-content">
            <h2>{{$language.translate('good-job')}}</h2>
            <h3>Total number right: {{ procentCalculator(score) }}%</h3>
            <div class="modal-buttons">
                <button class="big-buttons" id="medium-buttons">{{$language.translate('play-again')}}</button>
                <button class="big-buttons" id="medium-buttons">{{$language.translate('exit')}}</button>
            </div>
        </div>
    </div>
    `,
  };
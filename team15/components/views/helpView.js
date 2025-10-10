export const HelpView = {
  name: "help-view",
  props: ["switchTo"],
  template: `
      <div class="help-view">
      <h1 class = "main-text">{{$language.translate('about')}}</h1>  
      
      <div class = "help-content">
        <h2>{{$language.translate('goal')}}</h2>
        <p>{{$language.translate('purpose')}}</p>

        <h2>{{$language.translate('how-to')}}</h2>
        <p>{{$language.translate('how-to-play')}}</p>

        <h2>{{$language.translate('levels')}}</h2>
        <ul>
          <li><strong>{{$language.translate('l1-description')}}</strong></li>
          <li><strong>{{$language.translate('l2-description')}}</strong></li>
          <li><strong>{{$language.translate('l3-description')}}</strong></li>
        </ul>

        <h2>{{$language.translate('extra')}}</h2>
        <p>{{$language.translate('additional-info')}}</p>
      </div>

      <div class = button-container> 
        <go-back-button @click="switchTo('StartView')"></go-back-button>
      </div>
    </div>
    `,
};
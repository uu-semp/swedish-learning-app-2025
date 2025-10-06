export const ChooseLevelView = {
  name: "choose-level-view",
  props: ["switchTo"],
  template: `
      <div>
      <h1 class = "main-text">{{$language.translate('choose-level')}}</h1>    
        <level-button :label="$language.translate('level1')" @click="switchTo('LevelOneView')"></level-button>
        <level-button :label="$language.translate('level1')" @click="switchTo('LevelTwoView')"></level-button>

      <div class = button-container> 
        <go-back-button @click="switchTo('StartView')"></go-back-button>
      </div>
      </div>
    `,
};

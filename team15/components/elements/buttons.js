export const StartGameButton = {
  name: "start-game-button",
  props:["switchTo"],
  template: `
    <button class = "big-buttons" id="start-game-button" @click="switchTo('ChooseLevelView')">START GAME</button>
  `
};

export const HowToPlayButton = {
  name: "how-to-play-button",
  props: ["switchTo"],
  template:`
   <button class = "big-buttons" id="how-to-play-button" @click="switchTo('HelpView')">HOW TO PLAY</button>
  `
}
export const GoBackButton = {
  name: "go-back-button",
  props: ["switchTo"],
  template: `
  <button class = "big-buttons" id="go-back-button" @click="switchTo('StartView')">GO BACK</button>
  `
}

export const InfoButton = {
  name: "info-button",
  template: `
  <button class = "info-button">?</button>
  `
}


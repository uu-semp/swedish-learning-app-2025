export const StartGameButton = {
  name: "start-game-button",
  template: `
    <button class = "big-buttons" id="start-game-button">START GAME</button>
  `
};

export const HowToPlayButton = {
  name: "how-to-play-button",
  props: ["switchTo"],
  template:`
   <button class = "big-buttons" id="how-to-play-button" @click="switchTo('HelpView')">HOW TO PLAY</button>
  `
}

export const InfoButton = {
  name: "info-button",
  template: `
 <button class = "info-button">?</button>
  `
}

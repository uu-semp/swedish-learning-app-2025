export const StartGameButton = {
  name: "start-game-button",
  template: `
    <button class = "big-buttons" id="start-game-button">START GAME</button>
  `,
};

export const HowToPlayButton = {
  name: "how-to-play-button",
  template: `
   <button class = "big-buttons" id="how-to-play-button">HOW TO PLAY</button>
  `,
};
export const GoBackButton = {
  name: "go-back-button",
  template: `
  <button class = "big-buttons" id="go-back-button">GO BACK</button>
  `,
};

export const InfoButton = {
  name: "info-button",
  template: `
  <button class = "info-button">?</button>
  `,
};

export const LevelButton = {
  name: "level-button",
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  template: `
  <button class=big-buttons>{{ label }}</button>
  `,
};

export const ClothingItemButton = {
  name: "clothing-item-button",
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  template: `
    <button class=clothing-button>
      <img :src="label"  style="width: 50px;"></img>
    </button>
  `,
};

export const CategoryClothingButton = {
  name: "category-clothing-button",
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  template: `
    <button class=round-button>
      <img :src="label"  style="width: 40px;"></img>
    </button>
  `,
};
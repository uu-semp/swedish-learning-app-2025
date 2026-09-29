export const StartGameButton = {
    name: 'start-game-button',
    template: `
    <button class="capsule-button capsule-button--md" id="start-game-button">{{$language.translate('start-game')}}</button>
  `,
};

export const HowToPlayButton = {
    name: 'how-to-play-button',
    template: `
   <button class="capsule-button capsule-button--md" id="how-to-play-button">{{$language.translate('how-to')}}</button>
  `,
};

export const GoBackButton = {
    name: 'go-back-button',
    template: `
  <button class="capsule-button capsule-button--md" id="go-back-button">{{$language.translate('go-back')}}</button>
  `,
};

export const InfoButton = {
    name: 'info-button',
    template: `
  <button class="info-button">?</button>
  `,
};

export const LicenseButton = {
    name: 'license-button',
    template: `
  <button class="info-button">©</button>
  `,
};

export const LevelButton = {
    name: 'level-button',
    props: {
        label: {
            type: String,
            required: true,
        },
    },
    template: `
  <button class="capsule-button capsule-button--lg">{{ label }}</button>
  `,
};

export const ClothingItemButton = {
    name: 'clothing-item-button',
    props: {
        label: {
            type: String,
            required: true,
        },
        itemID: { 
          type: String, 
          required: true
        },
    },

    data(){
      return{
        isDragged: false,
      }
    },

    methods: {
        handleDragStart(event) {
            // Set drag data (you can customize this later)
            this.isDragged = true;
            event.dataTransfer.setData('text/plain', this.itemID); // We send the itemID of dropped item to check if true later
            event.dataTransfer.effectAllowed = 'move';
        },
    },
    template: `
    <button class="clothing-button">
      <img :src="label" 
      style="width: 80px;"
      draggable="true"
      @dragstart="handleDragStart"
      @dragend="isDragged = false"
       />
    </button>
  `,
};

export const CategoryClothingButton = {
    name: 'category-clothing-button',
    props: {
        label: {
            type: String,
            required: true,
        },
    },
    template: `
    <button class="round-button" draggable="false">
      <img :src="label" style="width: 55px;" draggable="false" />
    </button>
  `,
};

export const ExitGameButton = {
    template: `
    <button class="capsule-button capsule-button--md" id="exit-game-button">{{$language.translate('exit')}}</button>
  `,
};
export const LanguageFlagButton = {
  name: "language-flag-button",
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: "" },
    value: { type: String, required: true },
    selected: { type: Boolean, default: false },
    width: { type: String, default: "56px" },
    height: { type: String, default: "36px" },
  },
  emits: ["select", "click"],
  methods: {
    handleClick(event) {
      this.$emit("click", event);
      this.$emit("select", this.value);
    },
  },
  template: `
    <button
      class="flag-button"
      :class="{ selected: selected }"
      @click="handleClick"
    >
      <img
        :src="src"
        :alt="alt"
        :style="'width: ' + width + '; height: ' + height + ';'"
      />
    </button>
  `,
};

export const CapsuleButton = {
  name: "capsule-button",
  props: {
    label: { type: String, default: "" },
    translateKey: { type: Boolean, default: true },
    size: { type: String, default: "md", validator: (v) => ["sm", "md", "lg"].includes(v) },
    icon: { type: String, default: null, validator: (v) => v === null || ["play"].includes(v) },
    locked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    title: { type: String, default: "" },
  },
  emits: ["click"],
  computed: {
    buttonClasses() {
      const classes = ["capsule-button", `capsule-button--${this.size}`];
      if (this.locked) classes.push("capsule-button--locked");
      return classes;
    },
    displayLabel() {
      if (!this.label) return "";
      return this.translateKey && this.$language && this.$language.translate
        ? this.$language.translate(this.label)
        : this.label;
    },
  },
  methods: {
    handleClick(event) {
      if (this.locked || this.disabled) return;
      this.$emit("click", event);
    },
  },
  template: `
    <button
      :class="buttonClasses"
      :disabled="disabled || locked"
      :title="title || (translateKey && label ? label : '')"
      @click="handleClick"
    >
      <slot :label="displayLabel">
        <span v-if="displayLabel">{{ displayLabel }}</span>
        <span v-if="icon === 'play'" class="capsule-button__play-icon"></span>
      </slot>
    </button>
  `,
};
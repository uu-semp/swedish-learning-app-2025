// The Swedish/English flags shown in the top right corner of every sky view.
// Rendered once in app.js. The slot is for extra buttons next to the flags (the "?" on the start view).

export const LanguageSelection = {
  name: "language-selection",
  template: `
    <div class="language-selection">
      <language-flag-button
        src="./components/assets/game14FlagSE.png"
        alt="Swedish"
        value="sv"
        :selected="$language.selectedLanguage === 'sv'"
        @select="$language.load($event)"
      ></language-flag-button>

      <language-flag-button
        src="./components/assets/game14FlagEN.png"
        alt="English"
        value="en"
        :selected="$language.selectedLanguage === 'en'"
        @select="$language.load($event)"
      ></language-flag-button>

      <slot></slot>
    </div>
  `,
};

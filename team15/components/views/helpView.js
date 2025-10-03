export const HelpView = {
  name: "help-view",
  props: ["switchTo"],
  template: `
      <div class="help-view">
      <h1 class = "main-text">About The Game</h1>  
      
      <div class = "help-content">
        <h2>Goal of the Game</h2>
        <p>
          The purpose of the Dressing Pelle Game is to help players learn Swedish vocabulary 
          for clothing and practice grammar such as adjectives, colors, and 
          the use of <em>en</em>/<em>ett</em> and plural forms.
        </p>

        <h2>How to Play</h2>
        <p>
          On each level, you will see a description of an item of clothing 
          (for example: "a red sweater" or "blue shoes").  
          Your task is to find the correct item and place it on Pelle.  
          If your choice is correct, you continue; otherwise, you can try again.
        </p>

        <h2>Levels</h2>
        <ul>
          <li><strong>Level 1:</strong> Drag-and-drop recognition of single clothing items.</li>
          <li><strong>Level 2:</strong> Choose items with adjectives (color, size, etc.).</li>
          <li><strong>Level 3:</strong> More advanced grammar, including plural forms and correct adjective endings.</li>
        </ul>

        <h2>Extra Notes</h2>
        <p>
          If you are unsure about the vocabulary, you can always replay a level 
          or check the word list in the provided material.  
          The game is designed to be fun while reinforcing Swedish language learning.
        </p>
      </div>

      <div class = button-container> 
        <go-back-button @click="switchTo('StartView')"></go-back-button>
      </div>
    </div>
    `,
};
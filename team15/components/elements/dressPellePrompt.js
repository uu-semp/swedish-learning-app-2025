export const DressPellePrompt = {
    name: "dress-pelle-prompt",
    props: ['item'],

    template: `
    <div class="dress-prompt-container">
      <h1 class="question-prompt" v-if="item">
        {{$language.translate('dress-pelle-prompt')}} {{ item.Article }} <span v-if="item.is_pair">par </span> {{ item.Adjective_sv }} {{ item.Swedish }}
      </h1>
    </div>
    `,
};

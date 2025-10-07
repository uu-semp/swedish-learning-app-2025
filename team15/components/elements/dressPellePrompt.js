export const DressPellePrompt = {
    name: "dress-pelle-prompt",
    props: ['item'],

    template: `
    <div>
        <h1 v-if="item">
          {{$language.translate('dress-pelle-prompt')}} {{ item.Article }} {{ item.Swedish }}
      </h1>
    </div>
    `,
};

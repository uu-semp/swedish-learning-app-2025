export default {
    name: "Statistics",
    template: `
      <section class="statistics">
        <span class="level-indicator">
        {{currentIndex + 1}}/10
         </span>
      </section>
    `,
    props: ["currentIndex"] // receive current index from gameView
};
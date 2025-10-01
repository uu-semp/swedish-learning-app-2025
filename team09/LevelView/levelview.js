const { createApp } = Vue;

createApp({
  data() {
    return {
      progress: 25,
      selected: null, 
      question: {
        img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Trousers_line_drawing.png",
        answer: "Ett par byxor",
        options: ["En vante", "En mössa", "Ett par byxor", "En strumpa"]
      }
    }
  },
  methods: {
    checkAnswer(opt) {
      if (this.selected !== null) return; 
      this.selected = opt;
      if (opt === this.question.answer) {
        this.progress += 25;
      }
    },
    buttonClass(opt) {
      if (this.selected === null) return "";
      if (opt === this.question.answer) return "correct"; 
      if (opt === this.selected && opt !== this.question.answer) return "wrong"; 
      return "";
    }
  }
}).mount("#app");

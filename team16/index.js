new Vue({
  el: '#app',
  data: {
    character: { name: 'Kevin' },
    lives: 3, score: 0, level: 1,
    tasksDone: 0,
    textAnswer: "",
    currentQuestion: null,
    remainingQuestions: [],
    translation: "",
    feedback: "",   // ✅ / ❌ feedback
    feedbackClass: "",

    // Svensk ordbank för tal 1–20
    numberWords: {
      1:"ett", 2:"två", 3:"tre", 4:"fyra", 5:"fem",
      6:"sex", 7:"sju", 8:"åtta", 9:"nio", 10:"tio",
      11:"elva", 12:"tolv", 13:"tretton", 14:"fjorton", 15:"femton",
      16:"sexton", 17:"sjutton", 18:"arton", 19:"nitton", 20:"tjugo"
    },

    houses: [
      { street:"Storgatan", number:10, x:0.455, y:0.467, color:"lila" }, 
      { street:"Storgatan", number:14, x:0.610, y:0.470, color:"röd" },
      { street:"Storgatan", number:8,  x:0.779, y:0.470, color:"grön" }, 
      { street:"Storgatan", number:6,  x:0.283, y:0.470, color:"gul" }, 
      { street:"Ringgatan", number:3,  x:0.508, y:0.142, color:"vit" },
      { street:"Ringgatan", number:4,  x:0.655, y:0.142, color:"grön" }, 
      { street:"Ringgatan", number:1,  x:0.359, y:0.142, color:"röd" },
      { street:"Parkgatan", number:6,  x:0.247, y:0.78, color:"blå" },
      { street:"Parkgatan", number:8,  x:0.502, y:0.78, color:"orange" },
      { street:"Parkgatan", number:9,  x:0.745, y:0.78, color:"grön" }
    ],

    questions: {}
  },

  created(){ 
    // Bygg frågebanken automatiskt
    this.questions = {
      1: this.houses.map(h => ({
        instruction: `Gå till ${h.street} ${this.numberWords[h.number] || h.number}`,
        correct: { street:h.street, number:h.number },
        type: "map"
      })),
      2: this.houses.map(h => ({
        instruction: `Vilken färg har huset på ${h.street} ${h.number}?`,
        correct: h.color,
        type: "color"
      })),
      3: this.houses.map(h => ({
        instruction: "Vilket hus pekar jag på?",
        correct: `${h.street.toLowerCase()} ${h.number}`,
        type: "point",
        target: h
      }))
    };

    this.startLevel(1);
  },

  methods: {
    // Starta vald nivå
    startLevel(lv){
      this.level = lv;
      this.remainingQuestions = [...this.questions[lv]];
      this.pickNextQuestion();
    },

    // Plocka nästa fråga
  pickNextQuestion(){
  this.translation = "";

  if (this.remainingQuestions.length > 0) {
    // Välj nästa fråga
    const i = Math.floor(Math.random() * this.remainingQuestions.length);
    this.currentQuestion = this.remainingQuestions.splice(i, 1)[0];
    this.textAnswer = "";
  } else {
    // Nivån är klar
    if (this.level < 3) {
      this.feedback = `🎉 Du klarade nivå ${this.level}! Bra jobbat 👏`;
      this.feedbackClass = "correct";
      setTimeout(() => this.startLevel(this.level+1), 2000);
    } else {
      this.feedback = "🏆 Du har klarat alla nivåer! Fantastiskt 🎉";
      this.feedbackClass = "correct";
      setTimeout(() => this.resetGame(), 3000);
    }
  }
},


    checkWin(){
      if(this.score >= 300){
        this.feedback = "🏆 Du vann spelet med 300 poäng!";
        this.feedbackClass = "correct";
        setTimeout(() => this.resetGame(), 3000);
      }
    },

    // Level 1
    checkAnswer(street, number){
      if (this.currentQuestion.type !== "map") return;
      if (street===this.currentQuestion.correct.street && number===this.currentQuestion.correct.number){
        this.score += 10; 
        this.feedback = "✅ Rätt svar!";
        this.feedbackClass = "correct";
        this.checkWin();
        this.pickNextQuestion();
      } else { this.fail(); }
    },

    // Level 2
    checkColorAnswer(){
      if (this.currentQuestion.type !== "color") return;
      if (this.textAnswer.trim().toLowerCase() === this.currentQuestion.correct){
        this.score += 10; 
        this.feedback = "✅ Rätt! bra jobbat.";
        this.feedbackClass = "correct";
        this.checkWin();
        this.pickNextQuestion();
      } else { this.fail(); }
    },

    // Level 3
    checkPointAnswer(){
      if (this.currentQuestion.type !== "point") return;
      const ans = this.textAnswer.trim().toLowerCase().replace(/\s+/g," ");
      if (ans === this.currentQuestion.correct){
        this.score += 10; 
        this.feedback = "✅ Rätt! bra jobbat.";
        this.feedbackClass = "correct";
        this.checkWin();
        this.pickNextQuestion();
      } else { this.fail(); }
    },

    fail(){
      this.lives--; 
      this.feedback = "❌ Fel svar! Försök igen.";
      this.feedbackClass = "wrong";
      if (this.lives <= 0){ 
        this.feedback = `💀 Du förlorade alla liv i nivå ${this.level}. Försök igen!`;
        this.feedbackClass = "wrong";
        setTimeout(() => this.restartLevel(), 2000); 
      }
    },

    resetGame(){
      this.lives = 3; 
      this.score = 0; 
      this.level = 1; 
      this.tasksDone = 0;
      this.feedback = "";
      this.feedbackClass = "";
      this.startLevel(1);
    },

    restartLevel(){
      this.lives = 3;
      this.feedback = "";
      this.feedbackClass = "";
      this.remainingQuestions = [...this.questions[this.level]];
      this.pickNextQuestion();
    },

    // Dynamisk översättning för alla nivåer
    translateQuestion(){
      if (!this.currentQuestion) return;
      let instr = this.currentQuestion.instruction.toLowerCase();

      if (this.currentQuestion.type === "map") {
        // Level 1
        this.translation = `Go to ${this.currentQuestion.correct.street} ${this.currentQuestion.correct.number}`;
      } 
      else if (this.currentQuestion.type === "color") {
        // Level 2
        this.translation = `What color is the house on ${this.currentQuestion.correct}?`.replace("undefined", "");
        this.translation = `What color is the house on ${this.currentQuestion.instruction.split("på ")[1]}`;
      } 
      else if (this.currentQuestion.type === "point") {
        // Level 3
        this.translation = "Which house am I pointing at?";
      } 
      else {
        this.translation = "No translation available";
      }
    },

    // Debug
    logCoords(e){
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      console.log(`x=${x.toFixed(3)}, y=${y.toFixed(3)}`);
    }
  }
});

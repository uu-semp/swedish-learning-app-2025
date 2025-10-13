// ==============================================
// Owned by Team 10
// ==============================================
import {loadProgress, saveProgress} from '../dev-tools/cookies.js'

$(document).ready(function(){
  const svg = document.getElementById('result-wires');
  const gameState = JSON.parse(localStorage.getItem('level2GameState'));
  if(!gameState) return;

  // recreate buttons in same order
  const leftCol = $('#left-col');
  const rightCol = $('#right-col');

  gameState.leftWords.forEach(word => {
    leftCol.append(`<button class="word-btn" data-id="${word.id}">${word.text}</button>`);
  });
  gameState.rightWords.forEach(word => {
    rightCol.append(`<button class="word-btn" data-id="${word.id}">${word.text}</button>`);
  });

  // Re-map buttons now that they are in the DOM
  const leftButtons = $('.col.left .word-btn');
  const rightButtons = $('.col.right .word-btn');
  // draw lines and color them according to correctness

  let correctAnswers = 0;
  gameState.pairs.forEach(p => {
    const leftBtn = leftButtons.filter(`[data-id="${p.leftId}"]`);
    const rightBtn = rightButtons.filter(`[data-id="${p.rightId}"]`);

    // The logic is now much simpler: are the IDs the same?
    const correct = p.leftId === p.rightId;

    if(correct){
      $(leftBtn).addClass('correct');
      $(rightBtn).addClass('correct');
      correctAnswers++;
    } else {
      $(leftBtn).addClass('incorrect');
      $(rightBtn).addClass('incorrect');
    }

    const line = drawLine(leftBtn[0], rightBtn[0]);
    line.setAttribute('class', correct ? 'correct' : 'incorrect');

  });

  updateAndSaveProgress(correctAnswers);


  /**
   * Loads progress, adds the new score, and saves the total back to a cookie.
   * Advances the player to level 3 if their cumulative score reaches 10.
   * @param {number} newScore - The number of correct answers in this round.
   */
  function updateAndSaveProgress(newScore) {
    let progress = loadProgress();

    // Initialize score for level 2 if it doesn't exist
    if (!progress.levelScores[2]) {
      progress.levelScores[2] = 0;
    }
    
    // Add the new score to the existing total for Level 2
    progress.levelScores[2] += newScore;
    const totalScore = progress.levelScores[2];

    // Check for level up condition (only advance if they are currently on level 2)
    if (totalScore >= 10 && progress.currentLevel === 2) {
      progress.currentLevel = 3; // Advance to Level 3!
      alert(`You got ${newScore} correct! Your total score is now ${totalScore}/10. Congratulations, you've unlocked Level 3!`);
      save.stats.setCompletion("team10", 67);
    } else if (progress.currentLevel > 2) {
       alert(`You got ${newScore} correct! Great job practicing!`);
    } else {
      alert(`You got ${newScore} correct! Your total score is now ${totalScore}/10. You need 10 to unlock the next level.`);
    }
    
    // Save the updated progress object back to the cookie
    saveProgress(progress);
    console.log("Progress saved:", progress);
  }

  function drawLine(elA, elB){
    const ra = elA.getBoundingClientRect();
    const rb = elB.getBoundingClientRect();
    const root = svg.getBoundingClientRect();
    const ax = (ra.left + ra.right) / 2 - root.left;
    const ay = (ra.top + ra.bottom) / 2 - root.top;
    const bx = (rb.left + rb.right) / 2 - root.left;
    const by = (rb.top + rb.bottom) / 2 - root.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1", ax);
    line.setAttribute("y1", ay);
    line.setAttribute("x2", bx);
    line.setAttribute("y2", by);
    line.setAttribute("stroke-width", 3);
    svg.appendChild(line);
    return line;
  }

});

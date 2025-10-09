$(document).ready(function(){
  const svg = document.getElementById('result-wires');
  const gameState = JSON.parse(localStorage.getItem('level2GameState'));
  if(!gameState) return;

  let score = 0;

  // recreate buttons in same order
  const leftCol = $('#left-col');
  const rightCol = $('#right-col');

  gameState.leftWords.forEach(w => {
    leftCol.append(`<button class="word-btn">${w}</button>`);
  });
  gameState.rightWords.forEach(w => {
    rightCol.append(`<button class="word-btn">${w}</button>`);
  });

  // draw lines and color them according to correctness
  gameState.pairs.forEach(p => {
    const leftBtn = $('.col.left .word-btn')[p.leftIndex];
    const rightBtn = $('.col.right .word-btn')[p.rightIndex];

    const leftWord = $(leftBtn).text().trim().toLowerCase();
    const rightWord = $(rightBtn).text().trim().toLowerCase();
    const expectedSwedish = translateToSwedish(leftWord);
    const correct = rightWord === expectedSwedish;

    if(correct){
      score++; // Increment score for correct answers
      $(leftBtn).addClass('correct');
      $(rightBtn).addClass('correct');
    } else {
      $(leftBtn).addClass('incorrect');
      $(rightBtn).addClass('incorrect');
    }

    const line = drawLine(leftBtn, rightBtn);
    line.setAttribute('class', correct ? 'correct' : 'incorrect');
  });

  // --- Game constants ---
  const maxQuestions = gameState.leftWords.length;
  const requiredScore = 4; // User needs 4 out of 5 to pass

  // --- Show Modal ---
  showCompletionModal(score, maxQuestions, requiredScore);


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

  // simple demo translation function
  function translateToSwedish(english){
    const map = {
      'apple':'äpple',
      'bread':'bröd',
      'cheese':'ost',
      'milk':'mjölk',
      'fish':'fisk'
    };
    return map[english] || '';
  }

  // This function shows the completion modal.
  function showCompletionModal(score, maxQuestions, requiredScore) {
      const modal = $('#completionModal');
      
      // Check if the user passed
      if (score >= requiredScore) {
          // --- SUCCESS STATE ---
          $('#modalTitle').text('🎉 Level Complete!').removeClass('failure').addClass('success');
          $('#modalMessage').html(`You scored <strong>${score}</strong> out of ${maxQuestions}.`);
          $('#modalActionText').text(`Your score meets the ${requiredScore} needed. Well done!`);
          $('#modalButton').text('Advance to Next Level').off('click').on('click', function() {
              // Redirect to the main menu (placeholder for Level 3)
              window.location.href = '../index.html';
          });
      } else {
          // --- FAILURE STATE ---
          $('#modalTitle').text('❌ Level Failed').removeClass('success').addClass('failure');
          $('#modalMessage').html(`You scored <strong>${score}</strong> out of ${maxQuestions}.`);
          $('#modalActionText').text(`You needed ${requiredScore} to pass. You can try again!`);
          $('#modalButton').text('Try Level Again').off('click').on('click', function() {
              // Redirect to the game page to try again
              window.location.href = 'game_page.html';
          });
      }

      // Display the modal
      modal.show();
  }
});
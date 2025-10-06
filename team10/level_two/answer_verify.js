$(document).ready(function(){
  const svg = document.getElementById('result-wires');
  const gameState = JSON.parse(localStorage.getItem('level2GameState'));
  if(!gameState) return;

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
      $(leftBtn).addClass('correct');
      $(rightBtn).addClass('correct');
    } else {
      $(leftBtn).addClass('incorrect');
      $(rightBtn).addClass('incorrect');
    }

    const line = drawLine(leftBtn, rightBtn);
    line.setAttribute('class', correct ? 'correct' : 'incorrect');
  });

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
});

$(document).ready(function () {
  window.vocabulary.when_ready(function() {
    setupLevel(5); // Setup the game with 10 word pairs
  });

  let leftSelected = null;
  let rightSelected = null;
  const svg = document.querySelector('.wires');
  const connections = [];

  function setupLevel(wordCount) {
    const foodIds = window.vocabulary.get_category("food"); // Assuming you have a "foods" category
    
    // Get a random selection of word IDs
    const randomIds = foodIds.sort(() => 0.5 - Math.random()).slice(0, wordCount);
    
    const leftWords = [];
    const rightWords = [];

    randomIds.forEach(id => {
      const vocab = window.vocabulary.get_vocab(id);
      leftWords.push({ text: vocab.en, id: id });
      rightWords.push({ text: vocab.sv, id: id });
    });
    // Shuffle the Swedish words to make it a challenge
    rightWords.sort(() => 0.5 - Math.random());

    // Create and append buttons
    const leftCol = $('.col.left');
    const rightCol = $('.col.right');
    leftWords.forEach(word => {
      leftCol.append(`<button class="word-btn" data-id="${word.id}">${word.text}</button>`);
    });
    rightWords.forEach(word => {
      rightCol.append(`<button class="word-btn" data-id="${word.id}">${word.text}</button>`);
    });
  }
  
  // Re-attach event listeners since buttons are now dynamic
  $('.match-stage').on('click', '.col.left .word-btn', function () {
    const $btn = $(this);
    if ($btn.hasClass('paired')) { unpairButton(this); return; }
    if ($btn.hasClass('selected')) {
      $btn.removeClass('selected');
      leftSelected = null;
      $('.col.left .word-btn').not('.paired').removeClass('disabled');
      return;
    }
    $('.col.left .word-btn').not('.paired').removeClass('selected').addClass('disabled');
    $btn.removeClass('disabled').addClass('selected');
    leftSelected = this;
    tryPair();
  });

  $('.match-stage').on('click', '.col.right .word-btn', function () {
    const $btn = $(this);
    if ($btn.hasClass('paired')) { unpairButton(this); return; }
    if ($btn.hasClass('selected')) {
      $btn.removeClass('selected');
      rightSelected = null;
      $('.col.right .word-btn').not('.paired').removeClass('disabled');
      return;
    }
    $('.col.right .word-btn').not('.paired').removeClass('selected').addClass('disabled');
    $btn.removeClass('disabled').addClass('selected');
    rightSelected = this;
    tryPair();
  });

  $('#submitBtn').on('click', function(){
    saveGameState();
    window.location.href = 'answer_verify.html';
  });

  function tryPair() {
    if (leftSelected && rightSelected) {
      // draw line
      const line = drawLine(leftSelected, rightSelected);
      connections.push({ left: leftSelected, right: rightSelected, line });

      // mark paired
      $(leftSelected).addClass('paired').removeClass('selected disabled');
      $(rightSelected).addClass('paired').removeClass('selected disabled');

      // reset for next pair
      leftSelected = null;
      rightSelected = null;

      // re-enable all unpaired
      $('.col.left .word-btn').not('.paired').removeClass('disabled');
      $('.col.right .word-btn').not('.paired').removeClass('disabled');
    }
  }

  function unpairButton(btn) {
    // find the connection that involves this button
    const idx = connections.findIndex(c => c.left === btn || c.right === btn);
    if (idx >= 0) {
      // remove line
      svg.removeChild(connections[idx].line);
      const leftBtn = connections[idx].left;
      const rightBtn = connections[idx].right;

      // unmark paired
      $(leftBtn).removeClass('paired disabled');
      $(rightBtn).removeClass('paired disabled');

      // remove from connections
      connections.splice(idx, 1);

      // re-enable unpaired
      $('.col.left .word-btn').not('.paired').removeClass('disabled');
      $('.col.right .word-btn').not('.paired').removeClass('disabled');
    }
  }

  function drawLine(elA, elB) {
    const ra = elA.getBoundingClientRect();
    const rb = elB.getBoundingClientRect();
    const root = svg.getBoundingClientRect();
    const ax = (ra.left + ra.right) / 2 - root.left;
    const ay = (ra.top + ra.bottom) / 2 - root.top;
    const bx = (rb.left + rb.right) / 2 - root.left;
    const by = (rb.top + rb.bottom) / 2 - root.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", ax);
    line.setAttribute("y1", ay);
    line.setAttribute("x2", bx);
    line.setAttribute("y2", by);
    line.setAttribute("stroke-width", 3);
    line.setAttribute("stroke", "#888");
    svg.appendChild(line);
    return line;
  }
  function saveGameState() {
    // collect the left/right button texts and the connections
    const leftWords = $('.col.left .word-btn').map(function(){
        return { text: $(this).text(), id: $(this).data('id') };
    }).get();

    const rightWords = $('.col.right .word-btn').map(function(){
        return { text: $(this).text(), id: $(this).data('id') };
    }).get();

    // build array of pairs with index of left and right button
    const pairs = connections.map(c => ({
        leftId: $(c.left).data('id'),
        rightId: $(c.right).data('id')
    }));

    const gameState = { leftWords, rightWords, pairs };
    localStorage.setItem('level2GameState', JSON.stringify(gameState));
}
});

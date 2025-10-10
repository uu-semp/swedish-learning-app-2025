/* DICTIONARY */

/* Load and sortt vocabulary. Populate dictionary */
window.vocabulary.when_ready(() => {
  const ids  = window.vocabulary.get_category('clothing') || [];
  const list = ids.map(id => window.vocabulary.get_vocab(id));

 
  list.sort((a, b) =>
    (a.en || '').localeCompare(b.en || '', 'en', { sensitivity: 'base' })
  );

  const dict = document.getElementById('dict');
  dict.innerHTML = '';

  dict.classList.add('dict-grid');

  for (const v of list) {
    const art = v.article?.trim() ? v.article.trim() + ' ' : '';
    const item = document.createElement('div');
    item.className = 'dict-item';
    item.textContent = `${v.en || ''} — ${art}${v.sv || ''}`.trim();
    dict.appendChild(item);
  }
});

/* Button link to main page */
function goBacktomainpage() {
  window.location.href = '../index.html';
}

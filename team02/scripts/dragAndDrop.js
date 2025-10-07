function awaitVocabulary() {
  return new Promise(resolve => {
    window.vocabulary.when_ready(resolve);
  });
}

(async () => {
  await awaitVocabulary();

  // TODO : Load only the ones that are mentioned in the description
  // Loads all furniture images into the sidebar
  const ids = window.vocabulary.get_category("furniture");
  const vocabularies = ids.map(id => window.vocabulary.get_vocab(id));
  const images = vocabularies.filter(v => v.img).map(v => v.img);

  const sidebar = document.getElementById('sidebar');
  const workspace = document.getElementById('workspace');
  let draggedImage = null;

  images.forEach(path => {
    const img = document.createElement('img');
    img.src = "../" + path;
    img.draggable = true;
    img.className = 'image-item';
    img.addEventListener('dragstart', () => draggedImage = img);
    sidebar.appendChild(img);
  });

  workspace.addEventListener('dragover', e => e.preventDefault());
  workspace.addEventListener('drop', e => {
    e.preventDefault();
    if (!draggedImage) return;

    workspace.appendChild(draggedImage);
    const rect = workspace.getBoundingClientRect();
    draggedImage.className = 'draggable';
    draggedImage.style.position = 'absolute';
    draggedImage.style.left = (e.clientX - rect.left - 75) + 'px';
    draggedImage.style.top = (e.clientY - rect.top - 75) + 'px';
    makeDraggable(draggedImage);

    draggedImage = null;
  });
})();

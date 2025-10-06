// Replace with fetching images from the Data Team
// This static loading is temporary
const imageFolder = './images/';
const images = ['arbetsbord.png', 'bänk.png', 'bord.png', 'byrå.png'];
// ----------------------------------------------------------------------
const sidebar = document.getElementById('sidebar');
const workspace = document.getElementById('workspace');
let draggedImage = null;

images.forEach(name => {
  const img = document.createElement('img');
  img.src = imageFolder + name;
  img.draggable = true;
  img.className = 'image-item';
  img.addEventListener('dragstart', e => {
    draggedImage = img;
  });
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

function makeDraggable(img) {
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  img.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isDragging = true;
    const rect = img.getBoundingClientRect();
    const parentRect = workspace.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    img.style.zIndex = 1000;

    const moveHandler = e => {
      if (!isDragging) return;
      const x = e.clientX - parentRect.left - offsetX;
      const y = e.clientY - parentRect.top - offsetY;
      img.style.left = x + 'px';
      img.style.top = y + 'px';
    };

    const upHandler = () => {
      isDragging = false;
      img.style.zIndex = '';
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  });

  img.addEventListener('dragstart', e => {
    e.preventDefault();
  });
}

import { getGameProgress, updateGameProgress } from './localStorage.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing welcome component...');
  initWelcomeComponent();
});

function initWelcomeComponent() {
  // Check if the levelButtons element exists before trying to render
  const levelButtonsContainer = document.getElementById('levelButtons');
  if (levelButtonsContainer) {
    console.log('Level buttons container found, rendering levels...');
    renderLevels();
  } else {
    console.error('Level buttons container not found!');
  }
}

function updateLevelProgress() {
  console.log('Updating level progress...');
  const gameProgress = getGameProgress();
  console.log('Current game progress:', gameProgress);
  
  // Check if levels should be unlocked
  if (gameProgress.level1.completed === gameProgress.level1.total) {
    gameProgress.level2.unlocked = true;
  }
  if (gameProgress.level2.completed === gameProgress.level2.total) {
    gameProgress.level3.unlocked = true;
  }

  updateGameProgress(gameProgress);
  return gameProgress;
}

function createLevelButton(levelNum, progress) {
  const button = document.createElement('button');
  button.className = progress.unlocked ? 'level-btn' : 'level-btn locked';
  
  const progressPercent = (progress.completed / progress.total) * 100;
  
  button.innerHTML = `
    <div class="level-info">
      <span class="level-name">Nivå ${levelNum}</span>
      <span class="progress-indicator">
        ${progress.completed}/${progress.total}
        ${!progress.unlocked ? '<span class="locked-icon">🔒</span>' : ''}
      </span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progressPercent}%"></div>
    </div>
  `;
  
  if (progress.unlocked) {
    button.onclick = () => startLevel(levelNum);
  } else {
    button.onclick = () => alert('Du måste först slutföra föregående nivå!');
  }
  
  return button;
}

function renderLevels() {
  console.log('Rendering levels...');
  try {
    const gameProgress = updateLevelProgress();
    const container = document.getElementById('levelButtons');
    
    if (!container) {
      console.error('Container element not found!');
      return;
    }
    
    container.innerHTML = '';
    
    container.appendChild(createLevelButton(1, gameProgress.level1));
    container.appendChild(createLevelButton(2, gameProgress.level2));
    container.appendChild(createLevelButton(3, gameProgress.level3));
    
    console.log('Levels rendered successfully!');
  } catch (error) {
    console.error('Error rendering levels:', error);
  }
}

function startLevel(level) {
  console.log('Starting level:', level);
  // Store the selected level for the game to use
  window.save.set("team16", "selectedLevel", level);
  
  // Redirect to the level page
  window.location.href = 'level.html';
}

// Summary functions
window.showSummary = function() {
  const modal = document.getElementById('summaryModal');
  const content = document.getElementById('summaryContent');
  
  content.innerHTML = generateSummaryContent();
  modal.style.display = 'block';
}

window.closeSummary = function() {
  const modal = document.getElementById('summaryModal');
  modal.style.display = 'none';
}

function generateSummaryContent() {
  const gameProgress = getGameProgress();
  let html = '';
  
  Object.keys(gameProgress).forEach((levelKey, index) => {
    const level = gameProgress[levelKey];
    const levelNum = index + 1;
    
    let status = '';
    let statusClass = '';
    
    if (!level.unlocked) {
      status = 'Låst';
      statusClass = 'status-locked';
    } else if (level.completed === level.total) {
      status = 'Slutförd';
      statusClass = 'status-completed';
    } else if (level.completed > 0) {
      status = 'Pågående';
      statusClass = 'status-in-progress';
    } else {
      status = 'Ej påbörjad';
      statusClass = 'status-locked';
    }
    
    html += `
      <div class="summary-item">
        <div class="summary-level">Nivå ${levelNum}</div>
        <div class="summary-details">
          <strong>Status:</strong> <span class="${statusClass}">${status}</span><br>
          <strong>Framsteg:</strong> ${level.completed}/${level.total} frågor (${Math.round((level.completed/level.total)*100)}%)<br>
          <strong>Antal försök:</strong> ${level.attempts}<br>
          <strong>Tid spenderad:</strong> ${level.timeSpent} minuter<br>
          <strong>Senast spelad:</strong> ${level.lastPlayed ? level.lastPlayed : 'Aldrig'}
        </div>
      </div>
    `;
  });
  
  // Add overall summary
  const totalCompleted = Object.values(gameProgress).reduce((sum, level) => sum + level.completed, 0);
  const totalQuestions = Object.values(gameProgress).reduce((sum, level) => sum + level.total, 0);
  const totalAttempts = Object.values(gameProgress).reduce((sum, level) => sum + level.attempts, 0);
  const totalTime = Object.values(gameProgress).reduce((sum, level) => sum + level.timeSpent, 0);
  
  html += `
    <div class="summary-item" style="background-color: #e8f5e8; border-color: #4CAF50;">
      <div class="summary-level">Totalt Framsteg</div>
      <div class="summary-details">
        <strong>Slutförda frågor:</strong> ${totalCompleted}/${totalQuestions} (${Math.round((totalCompleted/totalQuestions)*100)}%)<br>
        <strong>Totala försök:</strong> ${totalAttempts}<br>
        <strong>Total tid:</strong> ${totalTime} minuter<br>
        <strong>Genomsnittlig tid per fråga:</strong> ${totalCompleted > 0 ? Math.round(totalTime/totalCompleted) : 0} minuter
      </div>
    </div>
  `;
  
  return html;
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('summaryModal');
  if (event.target === modal) {
    closeSummary();
  }
};
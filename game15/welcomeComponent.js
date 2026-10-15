import { getGameProgress } from './localStorage.js';

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

function createLevelButton(levelNum, progress) {
  const button = document.createElement('button');
  const isEn = sessionStorage.getItem('game15_lang') === 'en';
  button.className = 'level-btn';
  
  const progressPercent = (progress.completed / progress.total) * 100;
  
  button.innerHTML = `
    <div class="level-info">
      <span class="level-name">${isEn ? 'Level' : 'Nivå'} ${levelNum}</span>
      <span class="progress-indicator">
        ${progress.completed}/${progress.total}
      </span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progressPercent}%"></div>
    </div>
  `;
  
  button.onclick = () => startLevel(levelNum);
  
  return button;
}

function renderLevels() {
  console.log('Rendering levels...');
  try {
    const gameProgress = getGameProgress();
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
  window.save.set("game15", "selectedLevel", level);
  
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
  const isEn = sessionStorage.getItem('game15_lang') === 'en';
  const gameProgress = getGameProgress();
  let html = '';
  
  Object.keys(gameProgress).forEach((levelKey, index) => {
    const level = gameProgress[levelKey];
    const levelNum = index + 1;
    
    let status = '';
    let statusClass = '';
    
    if (level.completed === level.total) {
      status = isEn ? 'Completed' : 'Slutförd';
      statusClass = 'status-completed';
    } else if (level.completed > 0) {
      status = isEn ? 'In Progress' : 'Pågående';
      statusClass = 'status-in-progress';
    } else {
      status = isEn ? 'Not started' : 'Ej påbörjad';
      statusClass = 'status-locked';
    }
    
    html += `
      <div class="summary-item">
        <div class="summary-level">${isEn ? 'Level' : 'Nivå'} ${levelNum}</div>
        <div class="summary-details">
          <strong>Status:</strong> <span class="${statusClass}">${status}</span><br>
          <strong>${isEn ? 'Progress:' : 'Framsteg:'}</strong> ${level.completed}/${level.total} ${isEn ? 'questions' : 'frågor'} (${Math.round((level.completed/level.total)*100)}%)<br>
          <strong>${isEn ? 'Attempts:' : 'Antal försök:'}</strong> ${level.attempts}<br>
          <strong>${isEn ? 'Time spent:' : 'Tid spenderad:'}</strong> ${level.timeSpent} ${isEn ? 'minutes' : 'minuter'}<br>
          <strong>${isEn ? 'Last played:' : 'Senast spelad:'}</strong> ${level.lastPlayed ? level.lastPlayed : (isEn ? 'Never' : 'Aldrig')}
        </div>
      </div>
    `;
  });
  
  const totalCompleted = Object.values(gameProgress).reduce((sum, level) => sum + level.completed, 0);
  const totalQuestions = Object.values(gameProgress).reduce((sum, level) => sum + level.total, 0);
  const totalAttempts = Object.values(gameProgress).reduce((sum, level) => sum + level.attempts, 0);
  const totalTime = Object.values(gameProgress).reduce((sum, level) => sum + level.timeSpent, 0);
  
  html += `
    <div class="summary-item" style="background-color: #e8f5e8; border-color: #4CAF50;">
      <div class="summary-level">${isEn ? 'Total Progress' : 'Totalt Framsteg'}</div>
      <div class="summary-details">
        <strong>${isEn ? 'Completed questions:' : 'Slutförda frågor:'}</strong> ${totalCompleted}/${totalQuestions} (${Math.round((totalCompleted/totalQuestions)*100)}%)<br>
        <strong>${isEn ? 'Total attempts:' : 'Totala försök:'}</strong> ${totalAttempts}<br>
        <strong>${isEn ? 'Total time:' : 'Total tid:'}</strong> ${totalTime} ${isEn ? 'minutes' : 'minuter'}<br>
        <strong>${isEn ? 'Avg time per question:' : 'Genomsnittlig tid per fråga:'}</strong> ${totalCompleted > 0 ? Math.round(totalTime/totalCompleted) : 0} ${isEn ? 'minutes' : 'minuter'}
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
// Game progress data that would usually come from the actual student data
let gameProgress = {
    level1: { 
        completed: 7, 
        total: 10, 
        unlocked: true, 
        attempts: 12,
        timeSpent: 25, // im guessing minutes or something
        lastPlayed: '2025-09-15'
    },
    level2: { 
        completed: 0, 
        total: 10, 
        unlocked: false, 
        attempts: 0,
        timeSpent: 0,
        lastPlayed: null
    },
    level3: { 
        completed: 0, 
        total: 10, 
        unlocked: false, 
        attempts: 0,
        timeSpent: 0,
        lastPlayed: null
    }
};

function updateLevelProgress() {
    //To see if levels should be unlocked
    if (gameProgress.level1.completed === gameProgress.level1.total) {
        gameProgress.level2.unlocked = true;
    }
    if (gameProgress.level2.completed === gameProgress.level2.total) {
        gameProgress.level3.unlocked = true;
    }
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
        button.onclick = () => alert('Du måste klara föregående nivå först!');
    }
    
    return button;
}

function renderLevels() {
    updateLevelProgress();
    const container = document.getElementById('levelButtons');
    container.innerHTML = '';
    
    container.appendChild(createLevelButton(1, gameProgress.level1));
    container.appendChild(createLevelButton(2, gameProgress.level2));
    container.appendChild(createLevelButton(3, gameProgress.level3));
}


function initWelcomeComponent() {
    renderLevels();
}

document.addEventListener('DOMContentLoaded', initWelcomeComponent);

function showSummary() {
    const modal = document.getElementById('summaryModal');
    const content = document.getElementById('summaryContent');
    
    content.innerHTML = generateSummaryContent();
    modal.style.display = 'block';
}

function closeSummary() {
    const modal = document.getElementById('summaryModal');
    modal.style.display = 'none';
}

function generateSummaryContent() {
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
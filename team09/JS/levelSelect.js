
function goBacktomainpage() {
    
    window.location.href = "../index.html";
  }
  
 
  function startLevel(levelNum) {
    window.location.href = `../Views/Levelview.html?level=${levelNum}`;
  }

  function displayPlayerStats() {
    for (let i = 1; i <= 3; i++) {
      const TEAM_KEY = `Team09-Level${i}`;
      const stats = window.save.stats.get(TEAM_KEY);
      const bestScore = window.save.get(TEAM_KEY, "bestScore") || 0;
  
      const statsDiv = document.getElementById(`level${i}Stats`);
      if (!statsDiv) continue;
  
      statsDiv.innerHTML = `
      <div class="stats-content">
        <div class="stats-text">
          <p>Played times: <b>${stats.wins}</b></p>
          <p>Highest score: <b>${bestScore}</b></p>
        </div>
        <button class="reset-btn" onclick="resetLevel(${i})">Reset</button>
      </div>
    `;
    }
  }
  function resetLevel(levelNum) {
    const TEAM_KEY = `Team09-Level${levelNum}`;
    if (confirm(`Are you sure you want to reset Level ${levelNum}?`)) {
      window.save.clear(TEAM_KEY);
      alert(`Level ${levelNum} progress has been cleared.`);
      displayPlayerStats(); 
    }
  }
  document.addEventListener("DOMContentLoaded", displayPlayerStats);
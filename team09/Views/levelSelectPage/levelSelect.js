
function goBacktomainpage() {
    
    window.location.href = "../GameMainPage/GameMainPage.html";
  }
  
  function startLevel(levelNum) {
    
    if (levelNum === 1) {
      window.location.href = "../LevelView1/Levelview.html";
    } else {
      alert(`Level ${levelNum} is not ready yet!`);
    }
  }


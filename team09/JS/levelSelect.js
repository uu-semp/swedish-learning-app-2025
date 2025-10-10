
function goBacktomainpage() {
    
    window.location.href = "../index.html";
  }
  
  function startLevel(levelNum) {
    
    if (levelNum === 1) {
      window.location.href = "./Levelview.html";
    } else {
      alert(`Level ${levelNum} is not ready yet!`);
    }
  }


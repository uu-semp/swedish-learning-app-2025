
const params = new URLSearchParams(window.location.search);
const level = params.get("level") || "1";


const script = document.createElement("script");

switch (level) {
  case "1":
    script.src = "../JS/GameLevel1.js"; 
    break;
  case "2":
    script.src = "../JS/GameLevel2.js"; 
    break;
  case "3":
    script.src = "../JS/GameLevel3.js"; 
    break;
  default:
    script.src = "../JS/GameLevel1.js"; 
}

document.head.appendChild(script);

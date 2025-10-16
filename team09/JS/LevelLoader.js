
const params = new URLSearchParams(window.location.search);
const level = params.get("level") || "1";


const script = document.createElement("script");

script.src = `../JS/GameLevel${level}.js`;

document.head.appendChild(script);

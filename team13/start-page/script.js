document.addEventListener("DOMContentLoaded", () => {

  // === Speech bubble typewriter ===
  const msgs = {
    sv: "Starta spelet och hjälp oss hitta rätt!",
    en: "Start the game and help us find the right place!"
  };

  let lang = "sv";
  const bubble = document.getElementById("bubble");

  function typeText(text, i = 0) {
    if (!bubble) return;
    bubble.textContent = text.slice(0, i);
    if (i < text.length) {
      setTimeout(() => typeText(text, i + 1), 50); // typing speed
    }
  }

  // start in Swedish
  typeText(msgs[lang]);


  // === Click animation for characters and house ===
  document.querySelectorAll('.character, .house').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      img.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.08)' },
        { transform: 'scale(1)' }
      ], {
        duration: 220,
        easing: 'ease-out'
      });
    });
  });

});

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

  // language switch on flag click
  document.querySelectorAll(".flag").forEach(flag => {
    flag.addEventListener("click", () => {
      lang = flag.alt.includes("UK") ? "en" : "sv";
      typeText(msgs[lang], 0);
    });
  });

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

  // === Confetti effect on Start button click ===
  const startBtn = document.querySelector('.btn.start');
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault(); // prevent immediate page change for animation
      for (let i = 0; i < 14; i++) {
        const s = document.createElement('div');
        s.textContent = ['🎉', '✨', '🎈', '⭐'][i % 4];
        Object.assign(s.style, {
          position: 'fixed',
          left: (window.innerWidth / 2) + 'px',
          top: '140px',
          fontSize: '22px',
          pointerEvents: 'none',
          transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`
        });
        document.body.appendChild(s);
        const x = (Math.random() * 2 - 1) * 240, y = 160 + Math.random() * 120;
        s.animate([
          { transform: `translate(0,0)` },
          { transform: `translate(${x}px, ${y}px)`, opacity: .0 }
        ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.2,1)' })
        .onfinish = () => s.remove();
      }
      // navigate after confetti
      setTimeout(() => window.location.href = "game.html", 1000);
    });
  }

});

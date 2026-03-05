// Lv.3 — Memory Match (4x3, 6 pairs)
(function() {
  let cards = [];
  let flipped = [];
  let matched = new Set();
  let locked = false;

  function generate() {
    const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
    // Shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    cards = values;
    flipped = [];
    matched = new Set();
    locked = false;
  }

  function render() {
    const area = document.getElementById('game-area');
    const el = area.querySelector('.memory-grid') || document.createElement('div');
    el.className = 'memory-grid';
    el.innerHTML = cards.map((v, i) => {
      const isFlipped = flipped.includes(i);
      const isMatched = matched.has(i);
      let cls = 'memory-card';
      if (isMatched) cls += ' matched';
      else if (isFlipped) cls += ' flipped';
      const display = (isFlipped || isMatched) ? v : '?';
      return `<div class="${cls}" data-idx="${i}">${display}</div>`;
    }).join('');
    if (!el.parentNode) area.appendChild(el);

    el.querySelectorAll('.memory-card:not(.matched):not(.flipped)').forEach(card => {
      card.onclick = () => clickCard(parseInt(card.dataset.idx));
    });
  }

  function clickCard(idx) {
    if (locked) return;
    if (flipped.includes(idx) || matched.has(idx)) return;

    flipped.push(idx);
    SFX.flip();
    render();

    if (flipped.length === 2) {
      incrementMoves();
      locked = true;
      const [a, b] = flipped;
      if (cards[a] === cards[b]) {
        matched.add(a);
        matched.add(b);
        flipped = [];
        locked = false;
        SFX.match();
        render();
        if (matched.size === cards.length) {
          setTimeout(() => levelCleared(moveCount), 400);
        }
      } else {
        setTimeout(() => {
          SFX.miss();
          flipped = [];
          locked = false;
          render();
        }, 800);
      }
    }
  }

  registerGame(3, {
    init() {
      generate();
      render();
    },
    cleanup() {
      locked = false;
    }
  });
})();

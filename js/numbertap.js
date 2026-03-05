// Lv.1 — Number Tap (tap 1-9 in order, cards are rotated/flipped)
(function() {
  let nextNum = 1;
  let cards = []; // { num, x, y, rotate, flipX, flipY }

  function generate() {
    nextNum = 2; // Card 1 is already done as a sample
    cards = [];
    const positions = getRandomPositions(9, 80, 80, 400, 400);
    const rotations = [0, 90, 180, 270];

    for (let i = 1; i <= 9; i++) {
      const pos = positions[i - 1];
      const isSample = (i === 1);
      cards.push({
        num: i,
        x: pos.x,
        y: pos.y,
        rotate: isSample ? 0 : rotations[Math.floor(Math.random() * rotations.length)],
        flipX: isSample ? false : Math.random() < 0.4,
        flipY: isSample ? false : Math.random() < 0.4,
      });
    }
  }

  // Place cards without overlap
  function getRandomPositions(count, cardW, cardH, areaW, areaH) {
    const positions = [];
    const pad = 8;
    for (let i = 0; i < count; i++) {
      let tries = 0;
      let x, y;
      do {
        x = Math.floor(Math.random() * (areaW - cardW));
        y = Math.floor(Math.random() * (areaH - cardH));
        tries++;
      } while (tries < 200 && positions.some(p =>
        Math.abs(p.x - x) < cardW + pad && Math.abs(p.y - y) < cardH + pad
      ));
      positions.push({ x, y });
    }
    return positions;
  }

  function render() {
    const area = document.getElementById('game-area');
    const el = area.querySelector('.numbertap-field') || document.createElement('div');
    el.className = 'numbertap-field';

    el.innerHTML = cards.map((c, i) => {
      const isSample = c.num === 1;
      const done = c.num < nextNum;
      const transforms = [];
      if (c.rotate) transforms.push(`rotate(${c.rotate}deg)`);
      if (c.flipX) transforms.push('scaleX(-1)');
      if (c.flipY) transforms.push('scaleY(-1)');
      const tf = transforms.length ? transforms.join(' ') : 'none';

      return `<div class="numbertap-card ${isSample ? 'sample' : done ? 'done' : ''}"
        data-idx="${i}"
        style="left:${c.x}px; top:${c.y}px; transform:${tf};"
      >
        <span class="numbertap-mark"></span>
        <span class="numbertap-num">${c.num}</span>
      </div>`;
    }).join('');

    if (!el.parentNode) area.appendChild(el);

    el.querySelectorAll('.numbertap-card:not(.done)').forEach(card => {
      card.onclick = () => clickCard(parseInt(card.dataset.idx));
    });
  }

  function clickCard(idx) {
    const card = cards[idx];
    if (card.num === nextNum) {
      SFX.click();
      nextNum++;
      incrementMoves();
      render();

      if (nextNum > 9) {
        setTimeout(() => levelCleared(moveCount), 400);
      }
    } else {
      SFX.error();
    }
  }

  registerGame(0, {
    init() {
      generate();
      render();
    },
    cleanup() {}
  });
})();

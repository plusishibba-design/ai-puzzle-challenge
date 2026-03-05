// Lv.2 — Lights Out (3x3)
(function() {
  let grid = []; // 0=off, 1=on

  function generate() {
    // Start from all-off, apply random clicks to ensure solvable
    grid = Array(9).fill(0);
    const clicks = 3 + Math.floor(Math.random() * 4); // 3-6 random clicks
    for (let i = 0; i < clicks; i++) {
      toggleAt(Math.floor(Math.random() * 9));
    }
    // Make sure not already solved
    if (grid.every(v => v === 0)) {
      toggleAt(4); // center click
    }
  }

  function toggleAt(idx) {
    const row = Math.floor(idx / 3), col = idx % 3;
    const targets = [[row, col], [row-1, col], [row+1, col], [row, col-1], [row, col+1]];
    targets.forEach(([r, c]) => {
      if (r >= 0 && r < 3 && c >= 0 && c < 3) {
        const i = r * 3 + c;
        grid[i] = grid[i] ? 0 : 1;
      }
    });
  }

  function isComplete() {
    return grid.every(v => v === 0);
  }

  function render() {
    const area = document.getElementById('game-area');
    const el = area.querySelector('.lightsout-grid') || document.createElement('div');
    el.className = 'lightsout-grid';
    el.innerHTML = grid.map((v, i) =>
      `<div class="lightsout-cell ${v ? 'on' : 'off'}" data-idx="${i}"></div>`
    ).join('');
    if (!el.parentNode) area.appendChild(el);

    el.querySelectorAll('.lightsout-cell').forEach(cell => {
      cell.onclick = () => clickCell(parseInt(cell.dataset.idx));
    });
  }

  function clickCell(idx) {
    toggleAt(idx);
    SFX.click();
    incrementMoves();
    render();

    if (isComplete()) {
      setTimeout(() => levelCleared(moveCount), 300);
    }
  }

  registerGame(2, {
    init() {
      generate();
      render();
    },
    cleanup() {}
  });
})();

// Lv.2 — 8 Puzzle (3x3 slide puzzle, easy: 3-5 moves from solution)
(function() {
  let state = [];
  const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  function shuffle() {
    // Start from solved state and apply 3-5 random valid moves
    state = [...GOAL];
    const moves = 6 + Math.floor(Math.random() * 3); // 6-8 moves
    let lastEmpty = -1;
    for (let m = 0; m < moves; m++) {
      const emptyIdx = state.indexOf(0);
      const row = Math.floor(emptyIdx / 3), col = emptyIdx % 3;
      const neighbors = [];
      if (row > 0) neighbors.push(emptyIdx - 3);
      if (row < 2) neighbors.push(emptyIdx + 3);
      if (col > 0) neighbors.push(emptyIdx - 1);
      if (col < 2) neighbors.push(emptyIdx + 1);
      // Avoid undoing the last move
      const filtered = neighbors.filter(n => n !== lastEmpty);
      const pick = filtered[Math.floor(Math.random() * filtered.length)];
      lastEmpty = emptyIdx;
      [state[pick], state[emptyIdx]] = [state[emptyIdx], state[pick]];
    }
  }

  function isComplete() {
    return state.every((v, i) => v === GOAL[i]);
  }

  function render() {
    const area = document.getElementById('game-area');
    const grid = area.querySelector('.puzzle8-grid') || document.createElement('div');
    grid.className = 'puzzle8-grid';
    grid.innerHTML = state.map((v, i) =>
      `<div class="puzzle8-tile ${v === 0 ? 'empty' : ''}" data-idx="${i}">${v || ''}</div>`
    ).join('');
    if (!grid.parentNode) area.appendChild(grid);

    grid.querySelectorAll('.puzzle8-tile:not(.empty)').forEach(el => {
      el.onclick = () => clickTile(parseInt(el.dataset.idx));
    });
  }

  function clickTile(idx) {
    const emptyIdx = state.indexOf(0);
    const row = Math.floor(idx / 3), col = idx % 3;
    const eRow = Math.floor(emptyIdx / 3), eCol = emptyIdx % 3;
    const adjacent = (Math.abs(row - eRow) + Math.abs(col - eCol)) === 1;
    if (!adjacent) return;

    [state[idx], state[emptyIdx]] = [state[emptyIdx], state[idx]];
    SFX.click();
    incrementMoves();
    render();

    if (isComplete()) {
      setTimeout(() => levelCleared(moveCount), 300);
    }
  }

  registerGame(2, {
    init() {
      shuffle();
      render();
    },
    cleanup() {}
  });
})();

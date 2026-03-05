// Lv.1 — 8 Puzzle (3x3 slide puzzle)
(function() {
  let state = [];
  const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  function isSolvable(arr) {
    let inv = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) inv++;
      }
    }
    return inv % 2 === 0;
  }

  function shuffle() {
    do {
      state = [...GOAL];
      for (let i = state.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state[i], state[j]] = [state[j], state[i]];
      }
    } while (!isSolvable(state) || isComplete());
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

  registerGame(0, {
    init() {
      shuffle();
      render();
    },
    cleanup() {}
  });
})();

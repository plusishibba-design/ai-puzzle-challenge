// Lv.5 — Sudoku (9x9, medium preset)
(function() {
  // Preset puzzle (0 = empty)
  const PUZZLE = [
    [5,3,0, 0,7,0, 0,0,0],
    [6,0,0, 1,9,5, 0,0,0],
    [0,9,8, 0,0,0, 0,6,0],

    [8,0,0, 0,6,0, 0,0,3],
    [4,0,0, 8,0,3, 0,0,1],
    [7,0,0, 0,2,0, 0,0,6],

    [0,6,0, 0,0,0, 2,8,0],
    [0,0,0, 4,1,9, 0,0,5],
    [0,0,0, 0,8,0, 0,7,9],
  ];

  const SOLUTION = [
    [5,3,4, 6,7,8, 9,1,2],
    [6,7,2, 1,9,5, 3,4,8],
    [1,9,8, 3,4,2, 5,6,7],

    [8,5,9, 7,6,1, 4,2,3],
    [4,2,6, 8,5,3, 7,9,1],
    [7,1,3, 9,2,4, 8,5,6],

    [9,6,1, 5,3,7, 2,8,4],
    [2,8,7, 4,1,9, 6,3,5],
    [3,4,5, 2,8,6, 1,7,9],
  ];

  let grid; // current state
  let given; // boolean 9x9, true if preset
  let selected; // {r, c} or null

  function generate() {
    grid = PUZZLE.map(row => [...row]);
    given = PUZZLE.map(row => row.map(v => v !== 0));
    selected = null;
  }

  function isComplete() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== SOLUTION[r][c]) return false;
      }
    }
    return true;
  }

  function hasError(r, c) {
    const v = grid[r][c];
    if (v === 0) return false;
    return v !== SOLUTION[r][c];
  }

  function selectCell(r, c) {
    if (given[r][c]) return;
    selected = { r, c };
    render();
  }

  function inputNumber(n) {
    if (!selected) return;
    const { r, c } = selected;
    if (given[r][c]) return;

    if (grid[r][c] !== n) {
      grid[r][c] = n;
      incrementMoves();
      // Sound: error or click
      if (n !== SOLUTION[r][c]) SFX.error();
      else SFX.click();
    }
    render();

    if (isComplete()) {
      setTimeout(() => levelCleared(moveCount), 400);
    }
  }

  function clearCell() {
    if (!selected) return;
    const { r, c } = selected;
    if (given[r][c]) return;
    grid[r][c] = 0;
    render();
  }

  function render() {
    const area = document.getElementById('game-area');
    const el = area.querySelector('.sudoku-grid') || document.createElement('div');
    el.className = 'sudoku-grid';

    let html = '';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = grid[r][c];
        let cls = 'sudoku-cell';
        if (given[r][c]) cls += ' given';
        if (selected && selected.r === r && selected.c === c) cls += ' selected';
        if (!given[r][c] && hasError(r, c)) cls += ' error';
        // 3x3 box borders
        if (c === 2 || c === 5) cls += ' border-right';
        if (r === 2 || r === 5) cls += ' border-bottom';

        html += `<div class="${cls}" data-r="${r}" data-c="${c}">${v || ''}</div>`;
      }
    }
    el.innerHTML = html;
    if (!el.parentNode) area.appendChild(el);

    el.querySelectorAll('.sudoku-cell').forEach(cell => {
      cell.onclick = () => selectCell(parseInt(cell.dataset.r), parseInt(cell.dataset.c));
    });

    // Numpad
    let numpad = area.querySelector('.sudoku-numpad');
    if (!numpad) {
      numpad = document.createElement('div');
      numpad.className = 'sudoku-numpad';
      let btns = '';
      for (let i = 1; i <= 9; i++) {
        btns += `<button data-num="${i}">${i}</button>`;
      }
      btns += '<button class="clear-btn" data-num="0">Clear</button>';
      numpad.innerHTML = btns;
      numpad.querySelectorAll('button').forEach(btn => {
        const num = parseInt(btn.dataset.num);
        btn.onclick = () => {
          if (num === 0) clearCell();
          else inputNumber(num);
        };
      });
      area.appendChild(numpad);
    }
  }

  registerGame(4, {
    init() {
      generate();
      render();
    },
    cleanup() {
      selected = null;
    }
  });
})();

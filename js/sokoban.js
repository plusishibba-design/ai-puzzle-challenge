// Lv.5 — Sokoban (small map, 2 boxes)
(function() {
  // Map legend: 0=floor, 1=wall, 2=goal
  const MAP = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,2,1,0,1],
    [1,0,0,0,0,0,1],
    [1,0,1,2,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
  ];
  const INIT_PLAYER = [1, 1];
  const INIT_BOXES = [[3, 3], [3, 1]];

  let player, boxes, history;
  let boardEl = null;

  function generate() {
    player = [...INIT_PLAYER];
    boxes = INIT_BOXES.map(b => [...b]);
    history = [];
  }

  function cellType(r, c) {
    return MAP[r][c];
  }

  function hasBox(r, c) {
    return boxes.some(b => b[0] === r && b[1] === c);
  }

  function isComplete() {
    return boxes.every(b => MAP[b[0]][b[1]] === 2);
  }

  function tryMove(dr, dc) {
    const nr = player[0] + dr;
    const nc = player[1] + dc;
    if (cellType(nr, nc) === 1) return;

    const boxIdx = boxes.findIndex(b => b[0] === nr && b[1] === nc);
    if (boxIdx >= 0) {
      const br = nr + dr;
      const bc = nc + dc;
      if (cellType(br, bc) === 1) return;
      if (hasBox(br, bc)) return;

      history.push({
        player: [...player],
        boxes: boxes.map(b => [...b]),
      });

      boxes[boxIdx] = [br, bc];
      player = [nr, nc];
      if (MAP[br][bc] === 2) SFX.match();
      else SFX.click();
    } else {
      history.push({
        player: [...player],
        boxes: boxes.map(b => [...b]),
      });
      player = [nr, nc];
      SFX.move();
    }

    incrementMoves();
    renderBoard();

    if (isComplete()) {
      setTimeout(() => levelCleared(moveCount), 400);
    }
  }

  function undo() {
    if (history.length === 0) return;
    SFX.undo();
    const prev = history.pop();
    player = prev.player;
    boxes = prev.boxes;
    moveCount--;
    updateMoveDisplay();
    renderBoard();
  }

  // Only update the grid cells
  function renderBoard() {
    let html = '';
    for (let r = 0; r < MAP.length; r++) {
      for (let c = 0; c < MAP[r].length; c++) {
        const isWall = cellType(r, c) === 1;
        const isGoal = cellType(r, c) === 2;
        const isPlayer = player[0] === r && player[1] === c;
        const isBox = hasBox(r, c);
        const boxOnGoal = isBox && isGoal;

        let cls = 'sokoban-cell';
        let content = '';

        if (isWall) {
          cls += ' sokoban-wall';
        } else if (boxOnGoal) {
          cls += ' sokoban-box-on-goal';
          content = '📦';
        } else if (isBox) {
          cls += ' sokoban-box';
          content = '📦';
        } else if (isPlayer) {
          cls += ' sokoban-floor sokoban-player';
          content = '🧑';
        } else if (isGoal) {
          cls += ' sokoban-goal';
          content = '✖';
        } else {
          cls += ' sokoban-floor';
        }
        html += `<div class="${cls}">${content}</div>`;
      }
    }
    boardEl.innerHTML = html;
  }

  // Build full UI once
  function buildUI() {
    const area = document.getElementById('game-area');

    boardEl = document.createElement('div');
    boardEl.className = 'sokoban-board';
    boardEl.style.gridTemplateColumns = `repeat(${MAP[0].length}, 60px)`;
    area.appendChild(boardEl);

    const arrows = document.createElement('div');
    arrows.className = 'sokoban-arrows';

    const btnUp = document.createElement('button');
    btnUp.className = 'arrow-up';
    btnUp.textContent = '↑';
    btnUp.addEventListener('click', function() { tryMove(-1, 0); });

    const btnLeft = document.createElement('button');
    btnLeft.className = 'arrow-left';
    btnLeft.textContent = '←';
    btnLeft.addEventListener('click', function() { tryMove(0, -1); });

    const btnDown = document.createElement('button');
    btnDown.className = 'arrow-down';
    btnDown.textContent = '↓';
    btnDown.addEventListener('click', function() { tryMove(1, 0); });

    const btnRight = document.createElement('button');
    btnRight.className = 'arrow-right';
    btnRight.textContent = '→';
    btnRight.addEventListener('click', function() { tryMove(0, 1); });

    arrows.appendChild(btnUp);
    arrows.appendChild(btnLeft);
    arrows.appendChild(btnDown);
    arrows.appendChild(btnRight);
    area.appendChild(arrows);

    const extra = document.createElement('div');
    extra.className = 'sokoban-extra';
    const undoBtn = document.createElement('button');
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', function() { undo(); });
    extra.appendChild(undoBtn);
    area.appendChild(extra);
  }

  registerGame(4, {
    init() {
      generate();
      buildUI();
      renderBoard();
    },
    cleanup() {}
  });
})();

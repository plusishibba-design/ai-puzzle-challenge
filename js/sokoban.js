// Lv.4 — Sokoban (small map, 2 boxes)
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
    if (cellType(nr, nc) === 1) return; // wall

    const boxIdx = boxes.findIndex(b => b[0] === nr && b[1] === nc);
    if (boxIdx >= 0) {
      // Push box
      const br = nr + dr;
      const bc = nc + dc;
      if (cellType(br, bc) === 1) return; // wall behind box
      if (hasBox(br, bc)) return; // another box behind

      // Save state for undo
      history.push({
        player: [...player],
        boxes: boxes.map(b => [...b]),
      });

      boxes[boxIdx] = [br, bc];
      player = [nr, nc];
      // Check if this box landed on a goal
      if (MAP[br][bc] === 2) SFX.match();
      else SFX.click();
    } else {
      // Simple move
      history.push({
        player: [...player],
        boxes: boxes.map(b => [...b]),
      });
      player = [nr, nc];
      SFX.move();
    }

    incrementMoves();
    render();

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
    render();
  }

  function render() {
    const area = document.getElementById('game-area');
    const el = area.querySelector('.sokoban-board') || document.createElement('div');
    el.className = 'sokoban-board';
    el.style.gridTemplateColumns = `repeat(${MAP[0].length}, 60px)`;

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
    el.innerHTML = html;
    if (!el.parentNode) area.appendChild(el);

    // Arrow buttons
    let arrows = area.querySelector('.sokoban-arrows');
    if (!arrows) {
      arrows = document.createElement('div');
      arrows.className = 'sokoban-arrows';
      arrows.innerHTML = `
        <button class="arrow-up" data-dir="-1,0">↑</button>
        <button class="arrow-left" data-dir="0,-1">←</button>
        <button class="arrow-down" data-dir="1,0">↓</button>
        <button class="arrow-right" data-dir="0,1">→</button>
      `;
      arrows.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          const [dr, dc] = btn.dataset.dir.split(',').map(Number);
          tryMove(dr, dc);
        };
      });
      area.appendChild(arrows);
    }

    // Undo button
    let extra = area.querySelector('.sokoban-extra');
    if (!extra) {
      extra = document.createElement('div');
      extra.className = 'sokoban-extra';
      extra.innerHTML = '<button onclick="void(0)">Undo</button>';
      extra.querySelector('button').onclick = () => undo();
      area.appendChild(extra);
    }
  }

  registerGame(3, {
    init() {
      generate();
      render();
    },
    cleanup() {}
  });
})();

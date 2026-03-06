// ===== i18n =====
let currentLang = 'en';

const TEXTS = {
  en: {
    title: 'AI Puzzle Challenge',
    subtitle: '6 puzzle levels to test AI browser control',
    levelSelect: 'Select Level',
    moves: 'Moves',
    attempts: 'Attempts',
    reset: 'Reset',
    back: 'Level Select',
    next: 'Next Level',
    clearTitle: 'Level Clear!',
    clearStats: 'Completed in {n} moves',
    clearStatsAttempts: 'Completed in {n} attempts',
    completeTitle: 'All Clear!',
    completeMsg: 'Congratulations! All 6 levels completed.',
    langBtn: '日本語',
    levels: [
      { name: 'Number Tap', desc: 'Tap numbers 1-9 in order' },
      { name: 'Sokoban', desc: 'Push boxes onto the goals' },
      { name: '8-Puzzle', desc: 'Slide tiles into the correct order' },
      { name: 'Memory Match', desc: 'Find all matching pairs' },
      { name: 'Lights Out', desc: 'Turn off all the lights' },
      { name: 'Sudoku', desc: 'Fill the grid with numbers 1-9' },
    ],
    rules: [
      'Click the numbers from 1 to 9 in ascending order.',
      'Use arrow buttons to move. Push boxes onto red goals.',
      'Click a tile adjacent to the empty space to slide it.',
      'Click cards to flip them. Match all pairs.',
      'Click a cell to toggle it and its neighbors.',
      'Click a cell, then a number button to fill it in.',
    ],
  },
  ja: {
    title: 'AI パズルチャレンジ',
    subtitle: 'AIブラウザ操作の性能テスト — 6つのパズル',
    levelSelect: 'レベル選択',
    moves: '手数',
    attempts: '試行回数',
    reset: 'リセット',
    back: 'レベル選択',
    next: '次のレベル',
    clearTitle: 'レベルクリア！',
    clearStats: '{n}手でクリア',
    clearStatsAttempts: '{n}回の試行でクリア',
    completeTitle: '全レベルクリア！',
    completeMsg: 'おめでとうございます！6つのパズルをすべてクリアしました。',
    langBtn: 'EN',
    levels: [
      { name: 'ナンバータップ', desc: '1から9まで順番にタップしよう' },
      { name: '倉庫番', desc: '箱をゴールまで押して運ぼう' },
      { name: '8パズル', desc: 'タイルをスライドして正しい順番に並べよう' },
      { name: '神経衰弱', desc: 'すべてのペアを見つけよう' },
      { name: 'ライツアウト', desc: 'すべてのライトを消そう' },
      { name: '数独', desc: '1-9の数字でグリッドを埋めよう' },
    ],
    rules: [
      '回転・反転されたカードの数字を読み取り、1から9の順にクリック。',
      '矢印ボタンで移動し、箱を赤いゴールの上に押してください。',
      '空白に隣接するタイルをクリックしてスライドさせます。',
      'カードをクリックしてめくり、すべてのペアを見つけてください。',
      'セルをクリックすると、そのセルと上下左右が反転します。',
      'セルをクリックし、数字ボタンで入力してください。',
    ],
  },
};

function t(key) { return TEXTS[currentLang][key]; }

function toggleLang() {
  currentLang = currentLang === 'en' ? 'ja' : 'en';
  updateUI();
}

// ===== Timer =====
let timerStart = 0;
let timerInterval = null;

function startTimer() {
  stopTimer();
  timerStart = Date.now();
  updateTimerDisplay();
  timerInterval = setInterval(updateTimerDisplay, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function getElapsedSeconds() {
  return Math.floor((Date.now() - timerStart) / 1000);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  document.getElementById('timer').textContent = formatTime(getElapsedSeconds());
}

// ===== Stage Management =====
let currentLevel = 0; // 0-indexed (0=Lv1, 5=Lv6)
let moveCount = 0;

const games = []; // filled by each game module: { init, cleanup }

function registerGame(levelIndex, gameObj) {
  games[levelIndex] = gameObj;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showTitle() {
  stopTimer();
  if (games[currentLevel] && games[currentLevel].cleanup) games[currentLevel].cleanup();
  showScreen('title-screen');
  renderLevelSelect();
}

function startLevel(lvl) {
  currentLevel = lvl;
  moveCount = 0;
  showScreen('game-screen');
  updateUI();
  document.getElementById('game-area').innerHTML = '';
  if (games[currentLevel]) games[currentLevel].init();
  startTimer();
}

function resetLevel() {
  if (games[currentLevel] && games[currentLevel].cleanup) games[currentLevel].cleanup();
  startLevel(currentLevel);
}

function levelCleared(moves) {
  stopTimer();
  const elapsed = getElapsedSeconds();
  showScreen('clear-screen');
  const isMemory = currentLevel === 3;
  const template = isMemory ? t('clearStatsAttempts') : t('clearStats');
  document.getElementById('clear-stats').textContent = template.replace('{n}', moves);
  document.getElementById('clear-time').textContent = `Time: ${formatTime(elapsed)}`;
  document.getElementById('btn-next').style.display = currentLevel < 5 ? 'inline-block' : 'none';
  if (currentLevel >= 5) {
    showScreen('complete-screen');
    SFX.complete();
  } else {
    SFX.fanfare();
  }
}

function nextLevel() {
  if (currentLevel < 5) startLevel(currentLevel + 1);
}

function incrementMoves() {
  moveCount++;
  updateMoveDisplay();
}

function setMoveCount(n) {
  moveCount = n;
  updateMoveDisplay();
}

function updateMoveDisplay() {
  const isMemory = currentLevel === 3;
  const label = isMemory ? t('attempts') : t('moves');
  document.getElementById('move-count').textContent = `${label}: ${moveCount}`;
}

// ===== UI Update =====
function renderLevelSelect() {
  const container = document.getElementById('level-select');
  const levels = t('levels');
  container.innerHTML = levels.map((lv, i) => `
    <div class="level-btn" onclick="startLevel(${i})">
      <div class="level-num">${i + 1}</div>
      <div class="level-info">
        <div class="name">${lv.name}</div>
        <div class="desc">${lv.desc}</div>
      </div>
    </div>
  `).join('');
}

function updateUI() {
  document.getElementById('app-title').textContent = t('title');
  document.getElementById('title-desc').textContent = t('subtitle');
  document.getElementById('lang-btn').textContent = t('langBtn');
  document.getElementById('btn-reset').textContent = t('reset');
  document.getElementById('btn-back').textContent = t('back');
  document.getElementById('btn-next').textContent = t('next');
  document.getElementById('btn-back-title').textContent = t('back');
  document.getElementById('clear-title').textContent = t('clearTitle');
  document.getElementById('complete-title').textContent = t('completeTitle');
  document.getElementById('complete-msg').textContent = t('completeMsg');

  const levels = t('levels');
  if (levels[currentLevel]) {
    document.getElementById('level-label').textContent = `Level ${currentLevel + 1}`;
    document.getElementById('game-name').textContent = levels[currentLevel].name;
    document.getElementById('game-rule').textContent = t('rules')[currentLevel];
  }
  updateMoveDisplay();
  renderLevelSelect();
}

// Init
updateUI();
showScreen('title-screen');

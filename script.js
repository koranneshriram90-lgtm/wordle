/* Wordle - 5 Letter Word Game Logic (pure JS) */

(function () {
  'use strict';

  // ---------- Constants ----------
  const WORD_LENGTH = 5;
  const DEFAULT_MAX_GUESSES = 6;

  const DIFFICULTY_CONFIG = {
    easy: { maxGuesses: 8, wordPool: 'common', hardMode: false },
    medium: { maxGuesses: 6, wordPool: 'all', hardMode: false },
    hard: { maxGuesses: 4, wordPool: 'all', hardMode: true },
  };

  // Common 5-letter words used for Easy mode (smaller, more familiar pool)
  const COMMON_WORDS = new Set([
    'about','above','abode','abort','abuse','acute','adage','adapt','admin','admit','adopt','adult',
    'after','again','agent','agony','ahead','alarm','album','alert','alone','along','aloof','aloud',
    'alpha','alter','anger','angle','angry','apart','apple','apply','arena','argue','arise','armor',
    'array','arrow','asset','avoid','award','aware','awful','badly','bagel','basic','basin','batch',
    'beach','beard','beast','begin','being','below','bench','berry','birth','black','blade','blame',
    'blank','blast','blaze','bleed','blend','bless','blind','block','bloom','blunt','board','bonus',
    'boost','brain','brake','brand','brass','brave','bread','break','brick','brief','bring','broad',
    'broke','brown','brush','build','built','burst','cabin','candy','carry','catch','cause','cease',
    'chain','chair','chalk','chaos','charm','chart','chase','cheap','check','cheek','chess','chest',
    'chief','child','chill','chose','chord','chuck','civil','claim','clamp','class','clean','clear',
    'clerk','click','cliff','climb','cling','clock','close','cloth','cloud','coach','coast','color',
    'comic','count','court','cover','craft','crane','crash','crazy','cream','crime','cross','crowd',
    'crown','curve','cycle','daily','dance','dated','death','debut','delay','depot','depth','derby',
    'dodge','dozen','draft','drain','drama','drawn','dream','dress','drift','drink','drive','drunk',
    'eagle','early','earth','eight','elbow','elect','elite','empty','enemy','enjoy','entry','equal',
    'error','event','every','exact','exert','exile','exist','extra','faint','faith','false','fault',
    'fiber','field','fiend','fifth','fifty','fight','final','first','fixed','flash','fleet','floor',
    'flour','fluid','flush','flyer','focus','force','forth','forty','forum','found','frame','fraud',
    'fresh','front','frost','fruit','fully','funny','giant','given','glass','globe','glory','glove',
    'going','grace','grade','grain','grand','grant','grape','graph','grasp','grass','grave','great',
    'green','greet','grief','grill','gross','group','grown','guard','guess','guest','guide','happy',
    'harsh','heart','heavy','hence','horse','hotel','house','human','humor','hurry','ideal','image',
    'imply','index','inner','input','issue','jewel','joint','judge','juice','knife','known','label',
    'large','laser','later','laugh','layer','learn','lease','least','leave','legal','level','light',
    'limit','loose','lover','lower','loyal','lucky','lunch','lying','magic','major','maker','march',
    'match','mayor','meant','media','mercy','merge','merit','merry','metal','meter','metro','micro',
    'midst','mixed','model','money','month','moral','motor','mount','mouse','mouth','movie','music',
    'never','night','noise','north','noted','novel','nurse','occur','ocean','offer','often','older',
    'olive','orbit','order','organ','other','ought','outer','owner','paint','panel','panic','paper',
    'party','pause','peace','phase','phone','photo','piece','pilot','pitch','pixel','place','plain',
    'plane','plant','plate','plaza','plead','pluck','plumb','plump','point','poker','polka','pound',
    'power','press','price','pride','prime','print','prior','prize','proof','proud','prove','queue',
    'quick','quiet','quote','radar','raise','range','rapid','ratio','reach','ready','realm','rebel',
    'refer','reign','relax','relay','renew','reply','rider','ridge','rival','river','robin','robot',
    'rocky','roger','round','route','rowdy','rural','sadly','safer','salad','sandy','sauce','scale',
    'scaly','scene','scent','scoop','scope','score','sense','serve','setup','seven','shade','shake',
    'shall','shame','shape','share','sharp','sheep','sheer','sheet','shelf','shell','shift','shine',
    'shirt','shock','shoot','shore','short','shout','shown','shrug','sight','sigma','silky','since',
    'silly','sixth','sixty','skate','skull','slash','slave','sleep','slice','slide','slope','smart',
    'smell','smile','smoke','snake','sneak','solar','solid','solve','sorry','sound','south','space',
    'spare','spark','speak','speed','spend','spent','split','spoke','spoon','sport','spray','squad',
    'stack','staff','stage','stake','stall','stand','stark','start','state','steam','steel','steep',
    'steer','stick','still','stock','stoic','stone','stood','store','storm','story','stove','strap',
    'straw','strip','stuck','study','stuff','style','sugar','super','surge','swift','swing','sword',
    'table','taste','taxes','teach','teeth','terse','thank','theft','theme','there','these','thick',
    'thing','think','third','those','three','threw','throw','thumb','tiger','tight','timer','tonic',
    'topic','torch','total','touch','tough','tower','toxic','trace','track','trade','trail','train',
    'trait','tramp','trash','treat','trend','trial','tribe','trick','tried','truck','truly','trunk',
    'trust','truth','tutor','twice','twine','twist','under','union','unite','unity','until','upper',
    'upset','urban','usage','usual','utter','vague','valid','value','vault','venue','verse','video',
    'virus','visit','vital','vocal','voice','voter','waste','watch','water','weary','weigh','weird',
    'wheel','where','which','while','white','whole','whose','woman','world','worry','worse','worst',
    'worth','would','wound','write','wrong','wrote','yield','young','youth'
  ]);

  // ---------- Elements ----------
  const gridEl = document.getElementById('grid');
  const keyboardEl = document.getElementById('keyboard');
  const msgEl = document.getElementById('msg');

  const statsModal = document.getElementById('statsModal');
  const helpModal = document.getElementById('helpModal');
  const gameOverModal = document.getElementById('gameOverModal');
  const statsBackdrop = document.getElementById('statsBackdrop');
  const helpBackdrop = document.getElementById('helpBackdrop');
  const gameOverBackdrop = document.getElementById('gameOverBackdrop');

  const btnStats = document.getElementById('btnStats');
  const btnHelp = document.getElementById('btnHelp');

  const closeStats = document.getElementById('closeStats');
  const closeHelp = document.getElementById('closeHelp');
  const closeGameOver = document.getElementById('closeGameOver');

  const newGameStats = document.getElementById('newGameStats');
  const newGameHelp = document.getElementById('newGameHelp');
  const newGameOver = document.getElementById('newGameOver');

  const difficultySelect = document.getElementById('difficulty');

  // ---------- State ----------
  let currentDifficulty = 'medium';
  let maxGuesses = DEFAULT_MAX_GUESSES;
  let hardMode = false;

  let targetWord = '';
  let guesses = [];
  let currentGuess = '';
  let currentRow = 0;
  let gameOver = false;
  let processing = false;

  let stats = {
    played: 0,
    won: 0,
    streak: 0,
    maxStreak: 0,
    distribution: {},
  };

  // Keyboard key state: letter -> 'correct' | 'present' | 'absent' | null
  const keyState = {};

  // Hard-mode constraints
  const positionConstraints = {}; // index -> letter (green)
  const presentLetters = new Set(); // letters that must appear (yellow)

  const modalOpen = {};

  // ---------- Word selection ----------
  function getWordPool() {
    if (typeof WORD_LIST === 'undefined' || !WORD_LIST || WORD_LIST.length === 0) {
      return WORD_LIST || ['apple'];
    }
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    if (config.wordPool === 'common') {
      const pool = WORD_LIST.filter((w) => COMMON_WORDS.has(w));
      return pool.length > 0 ? pool : WORD_LIST;
    }
    return WORD_LIST;
  }

  function pickTargetWord() {
    const pool = getWordPool();
    targetWord = pool[Math.floor(Math.random() * pool.length)];
  }

  // ---------- Stats ----------
  function loadStats() {
    try {
      const raw = localStorage.getItem('wordle_stats');
      if (raw) {
        const parsed = JSON.parse(raw);
        stats = {
          played: Number(parsed.played) || 0,
          won: Number(parsed.won) || 0,
          streak: Number(parsed.streak) || 0,
          maxStreak: Number(parsed.maxStreak) || 0,
          distribution: { ...(parsed.distribution || {}) },
        };
      }
    } catch (e) {
      // ignore
    }
    renderStats();
  }

  function saveStats() {
    try {
      localStorage.setItem('wordle_stats', JSON.stringify(stats));
    } catch (e) {
      // ignore
    }
  }

  function renderStats() {
    document.getElementById('statPlayed').textContent = stats.played;
    document.getElementById('statWinPct').textContent =
      stats.played === 0 ? '0%' : Math.round((stats.won / stats.played) * 100) + '%';
    document.getElementById('statStreak').textContent = stats.streak;
    document.getElementById('statMaxStreak').textContent = stats.maxStreak;

    const distEl = document.getElementById('distribution');
    distEl.innerHTML = '';
    let maxCount = 0;
    for (let i = 1; i <= maxGuesses; i++) {
      const v = Number(stats.distribution[String(i)]) || 0;
      if (v > maxCount) maxCount = v;
    }
    for (let i = 1; i <= maxGuesses; i++) {
      const count = Number(stats.distribution[String(i)]) || 0;
      const pct = maxCount === 0 ? 0 : Math.round((count / maxCount) * 100);
      const bar = document.createElement('div');
      bar.className = 'dist-bar';
      bar.innerHTML = `
        <span class="dist-label">${i}</span>
        <div class="dist-track"><div class="dist-fill" style="width:${pct}%"></div></div>
        <span class="dist-count">${count}</span>
      `;
      distEl.appendChild(bar);
    }
  }

  // ---------- Board ----------
  function initBoard() {
    gridEl.innerHTML = '';
    for (let r = 0; r < maxGuesses; r++) {
      for (let c = 0; c < WORD_LENGTH; c++) {
        const tile = document.createElement('div');
        tile.className = 'tile empty';
        tile.dataset.row = r;
        tile.dataset.col = c;
        tile.setAttribute('role', 'gridcell');
        tile.setAttribute('aria-label', 'empty tile');
        gridEl.appendChild(tile);
      }
    }
  }

  function getTile(r, c) {
    return gridEl.children[r * WORD_LENGTH + c];
  }

  // ---------- Keyboard ----------
  function initKeyboard() {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ];

    keyboardEl.innerHTML = '';
    rows.forEach((letters, rowIdx) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'keyboard-row' + (rowIdx === 2 ? ' wide' : '');
      letters.forEach((letter) => {
        const key = document.createElement('button');
        key.type = 'button';
        key.className = 'key';
        key.textContent = letter;
        key.dataset.key = letter;
        key.setAttribute('aria-label', letter);
        rowEl.appendChild(key);
      });

      const back = document.createElement('button');
      back.type = 'button';
      back.className = 'key wide';
      back.dataset.key = 'BACKSPACE';
      back.innerHTML = '⌫';
      back.setAttribute('aria-label', 'Backspace');
      rowEl.appendChild(back);

      const enter = document.createElement('button');
      enter.type = 'button';
      enter.className = 'key wide';
      enter.dataset.key = 'ENTER';
      enter.textContent = 'ENTER';
      enter.setAttribute('aria-label', 'Enter');
      rowEl.appendChild(enter);

      keyboardEl.appendChild(rowEl);
    });
  }

  function updateKeyVisuals() {
    document.querySelectorAll('.key').forEach((key) => {
      const k = key.dataset.key;
      if (k === 'ENTER' || k === 'BACKSPACE') return;
      const state = keyState[k.toLowerCase()];
      key.classList.remove('correct', 'present', 'absent');
      if (state) key.classList.add(state);
    });
  }

  // ---------- Messages ----------
  function showMsg(text, type = 'warn') {
    msgEl.textContent = text;
    msgEl.className = 'msg show ' + type;
  }

  function hideMsg() {
    msgEl.className = 'msg';
    msgEl.textContent = '';
  }

  function updateFooterNote() {
    const footer = document.getElementById('footerNote');
    if (!footer) return;
    footer.innerHTML = `Guess the <strong>5-letter word</strong> in <strong>${maxGuesses} tries</strong>. Each guess must be a valid 5-letter word.`;
  }

  // ---------- Core ----------
  function startGame() {
    currentDifficulty = difficultySelect.value;
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    maxGuesses = config.maxGuesses;
    hardMode = config.hardMode;

    pickTargetWord();
    guesses = [];
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    processing = false;
    Object.keys(keyState).forEach((k) => delete keyState[k]);
    Object.keys(positionConstraints).forEach((k) => delete positionConstraints[k]);
    presentLetters.clear();
    initBoard();
    hideMsg();
    updateFooterNote();
  }

  function handleLetter(letter) {
    if (gameOver || processing) return;
    if (!/[a-z]/.test(letter)) return;
    if (currentGuess.length >= WORD_LENGTH) return;
    currentGuess += letter;
    renderCurrentGuess();
  }

  function handleBackspace() {
    if (gameOver || processing) return;
    currentGuess = currentGuess.slice(0, -1);
    renderCurrentGuess();
  }

  function renderCurrentGuess() {
    for (let c = 0; c < WORD_LENGTH; c++) {
      const tile = getTile(currentRow, c);
      const ch = currentGuess[c] || '';
      tile.textContent = ch.toUpperCase();
      tile.className = ch ? 'tile' : 'tile empty';
      tile.classList.remove('correct', 'present', 'absent', 'revealed', 'anim-pop', 'anim-flip');
      void tile.offsetWidth;
    }
  }

  function shakeRow(row) {
    for (let c = 0; c < WORD_LENGTH; c++) {
      const tile = getTile(row, c);
      tile.classList.remove('anim-pop');
      void tile.offsetWidth;
      tile.classList.add('anim-pop');
    }
  }

  function handleEnter() {
    if (gameOver || processing) return;
    if (currentGuess.length < WORD_LENGTH) {
      showMsg('Not enough letters.');
      return;
    }
    const guess = currentGuess.toLowerCase();

    // Hard-mode validation
    if (hardMode && guesses.length > 0) {
      let violation = '';
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (positionConstraints[i] && guess[i] !== positionConstraints[i]) {
          violation = `Hard mode: must keep "${positionConstraints[i].toUpperCase()}" in position ${i + 1}.`;
          break;
        }
      }
      if (!violation) {
        for (const ch of presentLetters) {
          if (!guess.includes(ch)) {
            violation = `Hard mode: must use "${ch.toUpperCase()}".`;
            break;
          }
        }
      }
      if (violation) {
        showMsg(violation);
        shakeRow(currentRow);
        return;
      }
    }

    if (typeof WORD_LIST === 'undefined' || !WORD_LIST.includes(guess)) {
      showMsg('Not in word list.');
      shakeRow(currentRow);
      return;
    }

    hideMsg();
    processing = true;
    processGuess(guess);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function processGuess(guess) {
    const target = targetWord;
    const result = evaluateGuess(guess, target);

    for (let c = 0; c < WORD_LENGTH; c++) {
      const tile = getTile(currentRow, c);
      tile.textContent = guess[c].toUpperCase();
      tile.classList.remove('empty');
      tile.classList.add('anim-flip');
      await sleep(120);
      tile.classList.remove('anim-flip');
      tile.classList.add('revealed', result[c]);
      void tile.offsetWidth;
    }

    await sleep(300);
    updateKeyState(guess, result);
    updateKeyVisuals();

    // Update hard-mode constraints
    if (hardMode) {
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (result[i] === 'correct') positionConstraints[i] = guess[i];
        if (result[i] === 'present') presentLetters.add(guess[i]);
      }
    }

    guesses.push(guess);
    currentGuess = '';
    processing = false;

    if (guess === target) {
      gameOver = true;
      endGame(true, currentRow + 1);
      return;
    }

    currentRow++;
    if (currentRow >= maxGuesses) {
      gameOver = true;
      endGame(false, undefined);
      return;
    }
  }

  function evaluateGuess(guess, target) {
    const result = new Array(WORD_LENGTH).fill('absent');
    const targetCounts = {};

    for (let i = 0; i < WORD_LENGTH; i++) {
      const ch = target[i];
      targetCounts[ch] = (targetCounts[ch] || 0) + 1;
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guess[i] === target[i]) {
        result[i] = 'correct';
        targetCounts[guess[i]]--;
      }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i] === 'correct') continue;
      const ch = guess[i];
      if (targetCounts[ch] > 0) {
        result[i] = 'present';
        targetCounts[ch]--;
      } else {
        result[i] = 'absent';
      }
    }

    return result;
  }

  function updateKeyState(guess, result) {
    const priority = { correct: 3, present: 2, absent: 1 };
    for (let i = 0; i < WORD_LENGTH; i++) {
      const ch = guess[i].toLowerCase();
      const res = result[i];
      const existing = keyState[ch];
      if (!existing || priority[res] > priority[existing]) {
        keyState[ch] = res;
      }
    }
  }

  // ---------- Game over ----------
  function endGame(won, guessNum) {
    stats.played++;
    if (won) {
      stats.won++;
      stats.streak++;
      if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
      stats.distribution[String(guessNum)] = (Number(stats.distribution[String(guessNum)]) || 0) + 1;
    } else {
      stats.streak = 0;
    }
    saveStats();

    if (won) {
      showGameOver(true, guessNum);
    } else {
      showGameOver(false, undefined, targetWord);
    }
  }

  function showGameOver(won, guessNum, answer) {
    const body = document.getElementById('gameOverBody');
    body.innerHTML = '';
    if (won) {
      const h = document.createElement('h2');
      h.textContent = '🎉 You got it!';
      h.style.margin = '0 0 8px';
      h.style.fontSize = '1.75rem';
      h.style.color = '#166534';
      body.appendChild(h);
      const p = document.createElement('p');
      p.textContent = `Solved in ${guessNum}/${maxGuesses}`;
      p.style.color = '#4b5563';
      body.appendChild(p);
    } else {
      const h = document.createElement('h2');
      h.textContent = 'Better luck next time';
      h.style.margin = '0 0 8px';
      h.style.fontSize = '1.25rem';
      h.style.color = '#991b1b';
      body.appendChild(h);
      const p = document.createElement('p');
      p.textContent = `The word was ${answer.toUpperCase()}.`;
      p.style.color = '#4b5563';
      body.appendChild(p);
    }
    openModal(gameOverModal, gameOverBackdrop);
  }

  // ---------- Modals ----------
  function openModal(modal, backdrop) {
    if (modalOpen[modal.id]) return;
    modalOpen[modal.id] = true;
    modal.removeAttribute('hidden');
    requestAnimationFrame(() => {
      modal.classList.add('open');
    });
  }

  function closeModal(modal, backdrop) {
    if (!modalOpen[modal.id]) return;
    modalOpen[modal.id] = false;
    modal.classList.remove('open');
    setTimeout(() => {
      modal.setAttribute('hidden', '');
    }, 300);
  }

  // ---------- Input ----------
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === 'Enter') {
      e.preventDefault();
      handleEnter();
    } else if (key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
    } else if (/^[a-zA-Z]$/.test(key)) {
      e.preventDefault();
      handleLetter(key.toLowerCase());
    }
  });

  keyboardEl.addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if (!key || processing || gameOver) return;
    const k = key.dataset.key;
    if (k === 'ENTER') handleEnter();
    else if (k === 'BACKSPACE') handleBackspace();
    else if (k && k.length === 1) handleLetter(k.toLowerCase());
  });

  // ---------- Wiring ----------
  btnStats.addEventListener('click', () => {
    renderStats();
    openModal(statsModal, statsBackdrop);
  });
  btnHelp.addEventListener('click', () => openModal(helpModal, helpBackdrop));

  closeStats.addEventListener('click', () => closeModal(statsModal, statsBackdrop));
  closeHelp.addEventListener('click', () => closeModal(helpModal, helpBackdrop));
  closeGameOver.addEventListener('click', () => closeModal(gameOverModal, gameOverBackdrop));

  difficultySelect.addEventListener('change', () => {
    closeModal(statsModal, statsBackdrop);
    closeModal(helpModal, helpBackdrop);
    closeModal(gameOverModal, gameOverBackdrop);
    startGame();
  });

  function resetAndStart() {
    closeModal(statsModal, statsBackdrop);
    closeModal(helpModal, helpBackdrop);
    closeModal(gameOverModal, gameOverBackdrop);
    startGame();
  }

  newGameStats.addEventListener('click', resetAndStart);
  newGameHelp.addEventListener('click', resetAndStart);
  newGameOver.addEventListener('click', resetAndStart);

  // ---------- Boot ----------
  loadStats();
  initKeyboard();
  startGame();
})();

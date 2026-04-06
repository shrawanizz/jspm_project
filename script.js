let user = { emoji: '🦊', name: 'NightFox' };
let timerSec = 29 * 60 + 59, timerInt;

// AVATAR PICK
function pickAv(el, emoji, name) {
  document.querySelectorAll('#avGrid > div').forEach(d => {
    d.style.borderColor = 'var(--border)';
    d.style.background = 'var(--bg2)';
  });
  el.style.borderColor = 'var(--accent2)';
  el.style.background = 'rgba(124,58,237,.12)';
  user.emoji = emoji;
  user.name = name;
  document.getElementById('uname').value = name;
}

// LOGIN
function doLogin() {
  const v = document.getElementById('uname').value.trim();
  if (v) user.name = v;
  syncUser();
  document.getElementById('loginScr').style.display = 'none';
  document.getElementById('appShell').style.display = 'flex';
  initDash();
  initLb();
}

function syncUser() {
  const ems = ['sbEm', 'heroAv', 'postEm', 'tbEm', 'teamEm1', 'liEm1', 'p1Em'];
  const nms = ['sbNm', 'heroNm', 'teamNm1', 'liNm1', 'p1Nm', 'introBN', 'postNm'];
  ems.forEach(id => { const e = document.getElementById(id); if (e) e.textContent = user.emoji; });
  nms.forEach(id => { const e = document.getElementById(id); if (e) e.textContent = user.name; });
  document.getElementById('heroSub').textContent = '@' + user.name.toLowerCase().replace(/\s/g, '') + ' · Elite Coder';
}

// NAV
function nav(page, el) {
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('act'));
  if (el) el.classList.add('act');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('act'));
  document.getElementById('pg-' + page).classList.add('act');
  if (page === 'arena') startArena();
}

function goArena() {
  cm('mJoin'); cm('mCreate'); cm('mCreated');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('act'));
  document.getElementById('pg-arena').classList.add('act');
  document.querySelectorAll('.sb-item').forEach((i, idx) => {
    i.classList.remove('act');
    if (idx === 3) i.classList.add('act');
  });
  startArena();
}

// DASHBOARD
function initDash() {
  setTimeout(() => {
    document.getElementById('pfE').style.width = '78%';
    document.getElementById('pfM').style.width = '57%';
    document.getElementById('pfH').style.width = '46%';
  }, 200);
  const hm = document.getElementById('hm');
  hm.innerHTML = '';
  for (let w = 0; w < 53; w++) {
    for (let d = 0; d < 7; d++) {
      const c = document.createElement('div');
      const r = Math.random();
      const l = r > .87 ? 4 : r > .72 ? 3 : r > .55 ? 2 : r > .4 ? 1 : 0;
      c.className = `hmc hm${l}`;
      c.title = `${l} contributions`;
      hm.appendChild(c);
    }
  }
}

// LEADERBOARD
const lbData = [
  { av: '🦊', name: 'NightFox',   score: 12400, streak: 23, chg: '+150', up: true  },
  { av: '🐉', name: 'DragonDev',  score: 10800, streak: 18, chg: '+80',  up: true  },
  { av: '🧙', name: 'CodeWizard', score: 9200,  streak: 12, chg: '-20',  up: false },
  { av: '⚡', name: 'ByteStrike', score: 8900,  streak: 31, chg: '+200', up: true  },
  { av: '🐱', name: 'CatCoder',   score: 7600,  streak: 5,  chg: '+50',  up: true  },
  { av: '🦁', name: 'LionScript', score: 6800,  streak: 9,  chg: '-100', up: false },
  { av: '🐧', name: 'PinguDev',   score: 5400,  streak: 22, chg: '+30',  up: true  },
];

function initLb() {
  lbData[0].av = user.emoji;
  lbData[0].name = user.name;
  document.getElementById('p1Em').textContent = user.emoji;
  document.getElementById('p1Nm').textContent = user.name;
  const body = document.getElementById('lbBody');
  body.innerHTML = '';
  const medals = ['🥇', '🥈', '🥉'];
  const rks = ['var(--gold)', 'var(--muted2)', '#cd7f32', 'var(--muted)'];
  lbData.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'lb-tr';
    row.innerHTML = `
      <div class="lb-rk" style="color:${rks[Math.min(i, 3)]}">${i < 3 ? medals[i] : i + 1}</div>
      <div class="lb-pl">
        <div class="lb-av">${p.av}</div>
        <div><div class="lb-nm">${p.name}</div><div class="lb-lv">Level ${30 - i}</div></div>
      </div>
      <div class="lb-sc">${p.score.toLocaleString()}</div>
      <div class="lb-st">🔥 ${p.streak}</div>
      <div class="${p.up ? 'lb-up' : 'lb-dn'}">${p.up ? '↑' : '↓'} ${p.chg}</div>`;
    body.appendChild(row);
  });
}

function lbF(el) {
  document.querySelectorAll('.lbf').forEach(b => b.classList.remove('act'));
  el.classList.add('act');
}

// MODALS
function om(id) { document.getElementById(id).classList.add('op'); }
function cm(id) { document.getElementById(id).classList.remove('op'); }

function cbN(el) {
  if (el.value.length === 1) {
    const n = el.nextElementSibling;
    if (n && n.classList.contains('cb')) n.focus();
  }
}

function joinRoom() { cm('mJoin'); goArena(); }

function sd(el) {
  document.querySelectorAll('.dopt').forEach(d => d.classList.remove('sel'));
  el.classList.add('sel');
}

function st(el) {
  document.querySelectorAll('.topt').forEach(t => t.classList.remove('sel'));
  el.classList.add('sel');
}

function doCreate() {
  const ch = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += ch[Math.floor(Math.random() * ch.length)];
  document.getElementById('genCode').textContent = code;
  cm('mCreate');
  om('mCreated');
}

// ARENA
function startArena() {
  document.getElementById('liEm1').textContent = user.emoji;
  document.getElementById('liNm1').textContent = user.name;
  clearInterval(timerInt);
  timerSec = 29 * 60 + 59;
  timerInt = setInterval(() => {
    timerSec--;
    if (timerSec < 0) { timerSec = 0; clearInterval(timerInt); }
    const m = Math.floor(timerSec / 60), s = timerSec % 60;
    const el = document.getElementById('atimer');
    if (el) {
      el.textContent = `⏱ ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      if (timerSec < 300) el.style.color = 'var(--danger)';
    }
  }, 1000);
  setInterval(liveUpd, 7500);
}

function th(btn, id) {
  const b = document.getElementById(id);
  b.classList.toggle('op');
  btn.style.borderColor = b.classList.contains('op') ? 'rgba(6,182,212,.38)' : 'rgba(245,158,11,.22)';
  btn.style.color = b.classList.contains('op') ? 'var(--cyan)' : 'var(--warn)';
}

function runCode() {
  const a = document.getElementById('outArea');
  a.style.display = 'block';
  const r = document.getElementById('tcRes');
  r.innerHTML = '';
  const tests = [
    { n: 'Test 1: put(1,1) → get(1)',   p: true,              o: '→ 1'      },
    { n: 'Test 2: capacity eviction',    p: true,              o: '→ -1'     },
    { n: 'Test 3: Existing key update',  p: true,              o: '→ 2'      },
    { n: 'Test 4: Empty cache',          p: true,              o: '→ -1'     },
    { n: 'Test 5: Stress 1000 ops',      p: Math.random() > .2, o: '1000/1000'},
  ];
  tests.forEach((t, i) => setTimeout(() => {
    const d = document.createElement('div');
    d.className = 'tc';
    d.innerHTML = `<span class="${t.p ? 'tc-p' : 'tc-f'}">${t.p ? '✓' : '✗'}</span><span style="flex:1">${t.n}</span><span style="color:var(--muted)">${t.o}</span>`;
    r.appendChild(d);
  }, i * 210));
}

function submitCode() {
  runCode();
  setTimeout(() => {
    const el = document.getElementById('liSc1');
    if (el) {
      const c = parseInt(el.textContent.replace(',', ''));
      el.textContent = (c + Math.floor(Math.random() * 180) + 80).toLocaleString();
    }
    const li = document.getElementById('li1');
    if (li) { li.classList.add('fl'); setTimeout(() => li.classList.remove('fl'), 2000); }
  }, 1700);
}

function aiExplain() {
  const c = document.getElementById('aiCards');
  c.innerHTML = '';
  const cards = [
    { col: 'var(--gold)',    lbl: 'Time Complexity', txt: 'O(1) for both get() and put(). HashMap gives O(1) lookup, DLL gives O(1) move-to-front.' },
    { col: 'var(--cyan)',    lbl: 'Approach',        txt: 'HashMap + Doubly Linked List. Map holds key→node refs. DLL keeps recency order with sentinel nodes.' },
    { col: 'var(--pink)',    lbl: 'Edge Cases',       txt: 'Sentinel head/tail eliminate null checks. Handles capacity=1, duplicate puts, and missing gets cleanly.' },
    { col: 'var(--green)',   lbl: 'Is It Optimal?',  txt: 'Yes — O(1) time, O(n) space. Canonical optimal solution. Python OrderedDict is a cleaner alternative.' },
  ];
  cards.forEach((card, i) => setTimeout(() => {
    const d = document.createElement('div');
    d.className = 'acard';
    d.style.animationDelay = '0s';
    d.innerHTML = `<div class="acard-l" style="color:${card.col}">${card.lbl}</div><div class="acard-t">${card.txt}</div>`;
    c.appendChild(d);
  }, i * 520));
}

function liveUpd() {
  const scs = ['liSc2', 'liSc3', 'liSc4'];
  const its = ['li2', 'li3', 'li4'];
  const idx = Math.floor(Math.random() * 3);
  const el = document.getElementById(scs[idx]);
  if (el) {
    const c = parseInt(el.textContent.replace(',', '')) || 500;
    el.textContent = (c + Math.floor(Math.random() * 110) + 30).toLocaleString();
  }
  const item = document.getElementById(its[idx]);
  if (item) { item.classList.add('fl'); setTimeout(() => item.classList.remove('fl'), 2000); }
}

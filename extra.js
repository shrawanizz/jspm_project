/* ============================================================
   CODEBATTLE — EXTRAS.JS
   Drop this in the same folder, add <script src="extras.js"></script>
   BEFORE </body> in index.html (after script.js)
   ============================================================ */

/* ── 1. BATTLE INTRO CINEMATIC ─────────────────────────────── */
function triggerBattleIntro(p1Name, p1Em, p2Name, p2Em, onComplete) {
  const overlay = document.createElement('div');
  overlay.id = 'battleIntro';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;background:#000;
    display:flex;align-items:center;justify-content:center;
    overflow:hidden;font-family:'Rajdhani',sans-serif;
  `;

  overlay.innerHTML = `
    <canvas id="introCanvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas>
    <div id="introLeft" style="
      position:relative;z-index:2;text-align:center;
      transform:translateX(-120vw);transition:transform .8s cubic-bezier(.23,1.1,.6,1);
    ">
      <div style="font-size:110px;filter:drop-shadow(0 0 40px rgba(124,58,237,.9));animation:bobL 2s ease-in-out infinite">${p1Em}</div>
      <div style="font-size:28px;font-weight:700;color:#fff;letter-spacing:.1em;margin-top:12px;text-shadow:0 0 30px rgba(168,85,247,.8)">${p1Name}</div>
      <div style="font-size:13px;color:#a855f7;letter-spacing:.2em;margin-top:4px">PLAYER 1</div>
    </div>
    <div id="vsBlock" style="
      position:relative;z-index:3;margin:0 60px;
      opacity:0;transform:scale(0) rotate(180deg);
      transition:all .5s cubic-bezier(.34,1.56,.64,1);
    ">
      <div id="vsText" style="
        font-size:96px;font-weight:700;
        background:linear-gradient(135deg,#fbbf24,#ec4899,#a855f7);
        -webkit-background-clip:text;-webkit-text-fill-color:transparent;
        filter:drop-shadow(0 0 0px #fbbf24);
        animation:vsPulse 1s ease-in-out infinite;
      ">VS</div>
    </div>
    <div id="introRight" style="
      position:relative;z-index:2;text-align:center;
      transform:translateX(120vw);transition:transform .8s cubic-bezier(.23,1.1,.6,1);
    ">
      <div style="font-size:110px;filter:drop-shadow(0 0 40px rgba(236,72,153,.9));animation:bobR 2s ease-in-out infinite">${p2Em}</div>
      <div style="font-size:28px;font-weight:700;color:#fff;letter-spacing:.1em;margin-top:12px;text-shadow:0 0 30px rgba(236,72,153,.8)">${p2Name}</div>
      <div style="font-size:13px;color:#ec4899;letter-spacing:.2em;margin-top:4px">PLAYER 2</div>
    </div>
    <div id="fightBlock" style="
      position:absolute;z-index:10;
      font-size:120px;font-weight:700;letter-spacing:.05em;
      background:linear-gradient(135deg,#fbbf24,#f43f5e);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      opacity:0;transform:scale(3);
      transition:all .4s cubic-bezier(.34,1.56,.64,1);
      pointer-events:none;
    ">FIGHT!</div>
    <style>
      @keyframes bobL{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-12px) rotate(3deg)}}
      @keyframes bobR{0%,100%{transform:translateY(0) rotate(3deg)}50%{transform:translateY(-12px) rotate(-3deg)}}
      @keyframes vsPulse{0%,100%{filter:drop-shadow(0 0 20px #fbbf24)}50%{filter:drop-shadow(0 0 50px #ec4899)}}
      @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
    </style>
  `;
  document.body.appendChild(overlay);

  /* particle canvas */
  const canvas = overlay.querySelector('#introCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + .5,
      dx: (Math.random() - .5) * .6,
      dy: (Math.random() - .5) * .6,
      color: ['#7c3aed','#ec4899','#06b6d4','#fbbf24','#10b981'][Math.floor(Math.random()*5)],
      alpha: Math.random() * .6 + .2
    });
  }
  let animId;
  (function drawParticles() {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(drawParticles);
  })();

  /* scanline flash */
  const scan = document.createElement('div');
  scan.style.cssText = 'position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(168,85,247,.06) 50%,transparent 100%);height:200px;animation:scanline 2s linear infinite;pointer-events:none;z-index:1';
  overlay.appendChild(scan);

  /* sequence */
  requestAnimationFrame(() => {
    setTimeout(() => {
      overlay.querySelector('#introLeft').style.transform = 'translateX(0)';
      overlay.querySelector('#introRight').style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
      const vs = overlay.querySelector('#vsBlock');
      vs.style.opacity = '1';
      vs.style.transform = 'scale(1) rotate(0deg)';
      shakeEl(overlay);
    }, 900);
    setTimeout(() => {
      /* clash: slam both players toward center */
      overlay.querySelector('#introLeft').style.transition = 'transform .25s ease-in';
      overlay.querySelector('#introRight').style.transition = 'transform .25s ease-in';
      overlay.querySelector('#introLeft').style.transform = 'translateX(40px)';
      overlay.querySelector('#introRight').style.transform = 'translateX(-40px)';
      spawnBurst(canvas, ctx, canvas.width/2, canvas.height/2);
      shakeEl(overlay, 12);
    }, 2200);
    setTimeout(() => {
      overlay.querySelector('#introLeft').style.transition = '';
      overlay.querySelector('#introRight').style.transition = '';
      overlay.querySelector('#introLeft').style.transform = 'translateX(0)';
      overlay.querySelector('#introRight').style.transform = 'translateX(0)';
      const vsBlock = overlay.querySelector('#vsBlock');
      vsBlock.style.transition = 'all .2s ease';
      vsBlock.style.opacity = '0';
      vsBlock.style.transform = 'scale(2)';
    }, 2450);
    setTimeout(() => {
      const fight = overlay.querySelector('#fightBlock');
      fight.style.opacity = '1';
      fight.style.transform = 'scale(1)';
      shakeEl(overlay, 16);
      spawnBurst(canvas, ctx, canvas.width/2, canvas.height/2, 200);
    }, 2700);
    setTimeout(() => {
      overlay.style.transition = 'opacity .5s ease';
      overlay.style.opacity = '0';
      cancelAnimationFrame(animId);
      setTimeout(() => { overlay.remove(); if(onComplete) onComplete(); }, 500);
    }, 3700);
  });
}

function shakeEl(el, intensity = 8) {
  let t = 0;
  const shake = () => {
    t++;
    const dx = (Math.random()-0.5)*intensity*2*(1-t/15);
    const dy = (Math.random()-0.5)*intensity*(1-t/15);
    el.style.transform = `translate(${dx}px,${dy}px)`;
    if (t < 15) requestAnimationFrame(shake);
    else el.style.transform = '';
  };
  requestAnimationFrame(shake);
}

function spawnBurst(canvas, ctx, cx, cy, count = 80) {
  const bursts = [];
  const colors = ['#7c3aed','#a855f7','#ec4899','#fbbf24','#06b6d4','#10b981','#f43f5e','#fff'];
  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = Math.random() * 14 + 4;
    bursts.push({
      x: cx, y: cy,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      r: Math.random()*4+1,
      color: colors[Math.floor(Math.random()*colors.length)],
      alpha: 1, life: 1,
      shape: Math.random() > .5 ? 'circle' : 'star'
    });
  }
  (function animBurst() {
    bursts.forEach(b => {
      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.fillStyle = b.color;
      if (b.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
        ctx.fill();
      } else {
        drawStar(ctx, b.x, b.y, b.r*2, b.r, 5);
        ctx.fill();
      }
      ctx.restore();
      b.x += b.vx; b.y += b.vy;
      b.vy += 0.3;
      b.alpha -= 0.025;
      b.life -= 0.025;
    });
    if (bursts.some(b => b.alpha > 0)) requestAnimationFrame(animBurst);
  })();
}

function drawStar(ctx, cx, cy, outerR, innerR, points) {
  ctx.beginPath();
  for (let i = 0; i < points*2; i++) {
    const r = i%2===0 ? outerR : innerR;
    const angle = (i * Math.PI) / points - Math.PI/2;
    i===0 ? ctx.moveTo(cx+r*Math.cos(angle), cy+r*Math.sin(angle))
           : ctx.lineTo(cx+r*Math.cos(angle), cy+r*Math.sin(angle));
  }
  ctx.closePath();
}

/* ── 2. XP LEVEL-UP BURST (call after submit) ──────────────── */
function triggerXpBurst(xpGained = 150) {
  const burst = document.createElement('div');
  burst.style.cssText = `
    position:fixed;bottom:80px;right:30px;z-index:8888;
    font-family:'Rajdhani',sans-serif;pointer-events:none;
  `;
  burst.innerHTML = `
    <div id="xpCard" style="
      background:linear-gradient(135deg,#7c3aed,#ec4899);
      border-radius:16px;padding:18px 26px;text-align:center;
      box-shadow:0 20px 60px rgba(124,58,237,.6);
      transform:scale(0) translateY(40px);opacity:0;
      transition:transform .5s cubic-bezier(.34,1.56,.64,1),opacity .4s ease;
    ">
      <div style="font-size:13px;color:rgba(255,255,255,.8);letter-spacing:.15em;margin-bottom:4px">XP GAINED</div>
      <div id="xpNum" style="font-size:52px;font-weight:700;color:#fff;line-height:1">+0</div>
      <div id="xpBar" style="height:6px;border-radius:3px;background:rgba(255,255,255,.25);margin-top:10px;overflow:hidden">
        <div id="xpFill" style="height:100%;width:0%;background:#fff;border-radius:3px;transition:width 1.2s cubic-bezier(.4,0,.2,1)"></div>
      </div>
      <div style="font-size:11px;color:rgba(255,255,255,.7);margin-top:5px">LEVEL 27 → 28</div>
    </div>
  `;
  document.body.appendChild(burst);

  const card = burst.querySelector('#xpCard');
  const xpNumEl = burst.querySelector('#xpNum');
  const xpFill = burst.querySelector('#xpFill');

  requestAnimationFrame(() => {
    card.style.transform = 'scale(1) translateY(0)';
    card.style.opacity = '1';
  });

  /* count up */
  let current = 0;
  const step = Math.ceil(xpGained / 40);
  const counter = setInterval(() => {
    current = Math.min(current + step, xpGained);
    xpNumEl.textContent = '+' + current;
    if (current >= xpGained) clearInterval(counter);
  }, 30);

  setTimeout(() => { xpFill.style.width = '72%'; }, 300);

  /* floating +pts particles */
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const fl = document.createElement('div');
      const rect = card.getBoundingClientRect();
      fl.style.cssText = `
        position:fixed;z-index:9000;pointer-events:none;
        font-family:'Rajdhani',sans-serif;font-size:${14+Math.random()*10}px;
        font-weight:700;color:${['#fbbf24','#a855f7','#06b6d4','#10b981'][Math.floor(Math.random()*4)]};
        left:${rect.left + Math.random()*rect.width}px;
        top:${rect.top}px;
        animation:floatUp 1.2s ease forwards;
      `;
      fl.textContent = '+' + (Math.floor(Math.random()*30)+5);
      document.body.appendChild(fl);
      setTimeout(() => fl.remove(), 1300);
    }, i * 120);
  }

  /* add keyframe if missing */
  if (!document.querySelector('#floatUpStyle')) {
    const s = document.createElement('style');
    s.id = 'floatUpStyle';
    s.textContent = '@keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-80px) scale(.7)}}';
    document.head.appendChild(s);
  }

  setTimeout(() => {
    card.style.transform = 'scale(0.8) translateY(20px)';
    card.style.opacity = '0';
    setTimeout(() => burst.remove(), 500);
  }, 3200);
}

/* ── 3. CODE RAIN EASTER EGG (Konami code or triple-click logo) */
(function initCodeRain() {
  let konamiSeq = [];
  const KONAMI = [38,38,40,40,37,39,37,39,66,65];
  let rainActive = false;
  let rainCanvas, rainCtx, rainAnim;

  document.addEventListener('keydown', e => {
    konamiSeq.push(e.keyCode);
    konamiSeq = konamiSeq.slice(-10);
    if (konamiSeq.join(',') === KONAMI.join(',')) {
      rainActive ? stopRain() : startRain();
    }
  });

  /* also: triple-click logo */
  let logoClicks = 0;
  document.addEventListener('click', e => {
    if (e.target.closest('.sb-logo')) {
      logoClicks++;
      if (logoClicks >= 3) { logoClicks = 0; rainActive ? stopRain() : startRain(); }
      setTimeout(() => { logoClicks = 0; }, 800);
    }
  });

  function startRain() {
    rainActive = true;
    rainCanvas = document.createElement('canvas');
    rainCanvas.style.cssText = 'position:fixed;inset:0;z-index:9997;pointer-events:none;opacity:.18';
    document.body.appendChild(rainCanvas);
    rainCtx = rainCanvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);

    const cols = Math.floor(rainCanvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = '01アイウエオカキクケコサシスセソabcdef{}[];=>+⚔️';

    function draw() {
      rainCtx.fillStyle = 'rgba(25,28,53,0.05)';
      rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
      rainCtx.font = '14px JetBrains Mono, monospace';
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const hue = Math.random() > .1 ? '#a855f7' : '#fff';
        rainCtx.fillStyle = hue;
        rainCtx.fillText(ch, i*16, y*16);
        if (y*16 > rainCanvas.height && Math.random() > .975) drops[i] = 0;
        drops[i]++;
      });
      rainAnim = requestAnimationFrame(draw);
    }
    draw();

    /* toast */
    showToast('🟢 Code Rain activated! Triple-click logo or Konami to stop', '#10b981');
  }

  function stopRain() {
    rainActive = false;
    cancelAnimationFrame(rainAnim);
    if (rainCanvas) { rainCanvas.remove(); rainCanvas = null; }
    window.removeEventListener('resize', resize);
    showToast('🔴 Code Rain deactivated', '#f43f5e');
  }

  function resize() {
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
  }
})();

/* ── 4. PROFILE CARD 3D TILT ──────────────────────────────── */
function init3DTilt() {
  document.querySelectorAll('.pc, .hero-card, .br').forEach(card => {
    card.style.transition = 'transform .15s ease, box-shadow .15s ease';
    card.style.willChange = 'transform';
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      const rx = (y / rect.height) * 16;
      const ry = -(x / rect.width) * 16;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
      card.style.boxShadow = `${-ry/2}px ${rx/2}px 40px rgba(124,58,237,.25)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ── 5. GLITCH TEXT EFFECT on hero name ──────────────────── */
function initGlitch() {
  const el = document.getElementById('heroNm');
  if (!el) return;
  el.style.cursor = 'pointer';
  el.title = 'Click me!';

  const glitchStyle = document.createElement('style');
  glitchStyle.textContent = `
    .glitching{position:relative;animation:glitchAnim .4s steps(2,end) forwards}
    @keyframes glitchAnim{
      0%{text-shadow:2px 0 #ec4899,-2px 0 #06b6d4;clip-path:inset(0 0 80% 0)}
      20%{text-shadow:-3px 0 #06b6d4,3px 0 #ec4899;clip-path:inset(20% 0 60% 0)}
      40%{text-shadow:3px 0 #fbbf24,-3px 0 #a855f7;clip-path:inset(40% 0 40% 0)}
      60%{text-shadow:-2px 0 #10b981,2px 0 #f43f5e;clip-path:inset(60% 0 20% 0)}
      80%{text-shadow:2px 0 #ec4899,-2px 0 #06b6d4;clip-path:inset(80% 0 0% 0)}
      100%{text-shadow:none;clip-path:none}
    }
  `;
  document.head.appendChild(glitchStyle);

  el.addEventListener('click', () => {
    el.classList.remove('glitching');
    void el.offsetWidth;
    el.classList.add('glitching');
    el.addEventListener('animationend', () => el.classList.remove('glitching'), {once:true});
  });
}

/* ── 6. CURSOR TRAIL ──────────────────────────────────────── */
function initCursorTrail() {
  const trail = [];
  const TRAIL_LEN = 18;
  const colors = ['#7c3aed','#a855f7','#ec4899','#f43f5e','#fbbf24'];

  for (let i = 0; i < TRAIL_LEN; i++) {
    const dot = document.createElement('div');
    const size = Math.max(4, 14 - i*0.7);
    dot.style.cssText = `
      position:fixed;pointer-events:none;z-index:9998;border-radius:50%;
      width:${size}px;height:${size}px;
      background:${colors[i % colors.length]};
      opacity:${(TRAIL_LEN - i) / TRAIL_LEN * 0.7};
      transform:translate(-50%,-50%);
      transition:left .05s,top .05s;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  (function animTrail() {
    trail.forEach((dot, i) => {
      const target = i === 0 ? {x: mouseX, y: mouseY} : trail[i-1];
      dot.x += (target.x - dot.x) * 0.4;
      dot.y += (target.y - dot.y) * 0.4;
      dot.el.style.left = dot.x + 'px';
      dot.el.style.top = dot.y + 'px';
    });
    requestAnimationFrame(animTrail);
  })();
}

/* ── 7. TOAST UTILITY ────────────────────────────────────── */
function showToast(msg, color = '#7c3aed') {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);
    background:${color};color:#fff;padding:10px 22px;border-radius:999px;
    font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;
    z-index:10000;opacity:0;transition:all .35s cubic-bezier(.34,1.56,.64,1);
    box-shadow:0 8px 32px rgba(0,0,0,.3);white-space:nowrap;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => t.remove(), 400);
  }, 3000);
}

/* ── 8. ANIMATED AVATAR SHOWCASE on login ────────────────── */
function initAvatarParticles() {
  const grid = document.getElementById('avGrid');
  if (!grid) return;
  grid.querySelectorAll('div').forEach(card => {
    card.addEventListener('mouseenter', () => {
      for (let i = 0; i < 6; i++) {
        const sp = document.createElement('div');
        const angle = Math.random() * 360;
        const dist = 30 + Math.random() * 40;
        sp.style.cssText = `
          position:absolute;width:6px;height:6px;border-radius:50%;
          background:${['#a855f7','#ec4899','#fbbf24','#06b6d4'][Math.floor(Math.random()*4)]};
          pointer-events:none;z-index:10;
          animation:spFly .7s ease forwards;
          --dx:${Math.cos(angle*Math.PI/180)*dist}px;
          --dy:${Math.sin(angle*Math.PI/180)*dist}px;
        `;
        card.style.position = 'relative';
        card.appendChild(sp);
        setTimeout(() => sp.remove(), 750);
      }
    });
  });

  if (!document.querySelector('#spFlyStyle')) {
    const s = document.createElement('style');
    s.id = 'spFlyStyle';
    s.textContent = '@keyframes spFly{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)}}';
    document.head.appendChild(s);
  }
}

/* ── 9. HOOK INTO EXISTING FUNCTIONS ─────────────────────── */
(function hookExisting() {
  /* override goArena to show intro first */
  const origGoArena = window.goArena;
  window.goArena = function() {
    const p1 = { em: user.emoji, name: user.name };
    const opponents = [
      { em: '🐉', name: 'DragonDev' },
      { em: '🧙', name: 'CodeWizard' },
      { em: '⚡', name: 'ByteStrike' }
    ];
    const p2 = opponents[Math.floor(Math.random() * opponents.length)];
    triggerBattleIntro(p1.name, p1.em, p2.name, p2.em, origGoArena);
  };

  /* override submitCode to trigger XP burst */
  const origSubmit = window.submitCode;
  window.submitCode = function() {
    origSubmit();
    setTimeout(() => {
      triggerXpBurst(Math.floor(Math.random()*200) + 80);
    }, 1800);
  };

  /* init everything once app is loaded */
  const origDoLogin = window.doLogin;
  window.doLogin = function() {
    origDoLogin();
    setTimeout(() => {
      init3DTilt();
      initGlitch();
      initCursorTrail();
      showToast('⚔️ Welcome to CodeBattle, ' + (document.getElementById('uname')?.value || 'Coder') + '!');
    }, 300);
  };

  initAvatarParticles();

  /* re-init tilt after nav */
  const origNav = window.nav;
  window.nav = function(page, el) {
    origNav(page, el);
    setTimeout(init3DTilt, 100);
  };
})();

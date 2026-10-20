/* Petit jeu de la page hors ligne : un curseur de souris qui court
   et doit sauter par-dessus des bugs et des pop-ups.
   Espace / flèche haut / clic / toucher pour sauter. */
(function () {
  'use strict';

  var canvas = document.getElementById('gameCanvas');
  var playBtn = document.getElementById('gamePlay');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var root = document.documentElement;
  var W = 0, H = 0, GROUND = 0;
  var colors = {};
  var state = 'ready'; // ready | running | over
  var player, obstacles, speed, distance, nextSpawn, lastTime, groundOffset, frame;
  var best = 0;
  try { best = parseInt(localStorage.getItem('gameBest'), 10) || 0; } catch (e) { /* stockage indisponible */ }

  // Écran tactile (téléphone, tablette) ou clavier : change uniquement le texte d'aide
  var isTouch = window.matchMedia('(pointer: coarse)').matches;
  // Textes du jeu en 3 langues (la langue est fixée par page-i18n.js)
  var GT = {
    fr: { jump: 'Sauter', replay: 'Rejouer', over: 'Partie terminée. Score : ', bestLbl: '. Meilleur score : ', hiscore: 'MEILLEUR ',
          intro: 'Évitez les bugs, sautez les pop-ups.', touchPlay: 'Touchez l’écran pour jouer et sauter', keyPlay: 'Barre espace pour jouer et sauter',
          crash: 'Bug en production !', record: ' · nouveau record', touch: 'touchez', key: 'barre espace', replayHint: ' pour rejouer' },
    nl: { jump: 'Springen', replay: 'Opnieuw', over: 'Spel voorbij. Score: ', bestLbl: '. Beste score: ', hiscore: 'RECORD ',
          intro: 'Ontwijk de bugs, spring over de pop-ups.', touchPlay: 'Tik op het scherm om te spelen en te springen', keyPlay: 'Spatiebalk om te spelen en te springen',
          crash: 'Bug in productie!', record: ' · nieuw record', touch: 'tik', key: 'spatiebalk', replayHint: ' om opnieuw te spelen' },
    en: { jump: 'Jump', replay: 'Play again', over: 'Game over. Score: ', bestLbl: '. Best score: ', hiscore: 'BEST ',
          intro: 'Dodge the bugs, jump the pop-ups.', touchPlay: 'Tap the screen to play and jump', keyPlay: 'Space bar to play and jump',
          crash: 'Bug in production!', record: ' · new record', touch: 'tap', key: 'space bar', replayHint: ' to play again' }
  };
  var G = GT[(document.documentElement.getAttribute('lang') || 'fr').slice(0, 2)] || GT.fr;

  var GRAVITY = 2600;     // px/s²
  var JUMP = -820;        // px/s
  var BG_WORDS = ['Lorem', 'ipsum', 'Figma', 'UX', 'pixel', 'grid', 'Aa', '#1E3AF5', 'H1', '16px'];
  var words = [];

  function readColors() {
    var cs = window.getComputedStyle(root);
    colors.ink = cs.getPropertyValue('--ink').trim();
    colors.muted = cs.getPropertyValue('--ink-muted').trim();
    colors.line = cs.getPropertyValue('--line').trim();
    colors.accent = cs.getPropertyValue('--accent').trim();
    colors.danger = cs.getPropertyValue('--danger').trim();
    colors.paper = cs.getPropertyValue('--paper-raised').trim();
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.parentNode.clientWidth;
    H = W < 600 ? 190 : 230;
    canvas.style.height = H + 'px';
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    GROUND = H - 34;
    if (player) player.y = Math.min(player.y, GROUND - player.h);
    if (state !== 'running') draw();
  }

  function reset() {
    player = { x: W < 600 ? 36 : 70, y: GROUND - 30, w: 22, h: 30, vy: 0, onGround: true };
    obstacles = [];
    speed = W < 600 ? 300 : 360;
    distance = 0;
    nextSpawn = 0.9;
    groundOffset = 0;
    frame = 0;
    words = [];
    for (var i = 0; i < 5; i++) words.push(makeWord(Math.random() * W));
  }

  function makeWord(x) {
    return {
      x: x,
      y: 20 + Math.random() * (GROUND - 90),
      text: BG_WORDS[Math.floor(Math.random() * BG_WORDS.length)],
      speedFactor: 0.15 + Math.random() * 0.2
    };
  }

  function score() { return Math.floor(distance / 12); }

  function spawn() {
    var s = score();
    var roll = Math.random();
    if (s > 300 && roll < 0.25) {
      // « 404 » volant, à hauteur de saut : il faut rester au sol
      obstacles.push({ type: 'fly', x: W + 20, y: GROUND - 74, w: 46, h: 22 });
    } else if (roll < 0.6) {
      obstacles.push({ type: 'bug', x: W + 20, y: GROUND - 18, w: 26, h: 18 });
    } else {
      var tall = Math.random() < 0.5;
      obstacles.push({ type: 'popup', x: W + 20, y: GROUND - (tall ? 46 : 34), w: tall ? 30 : 40, h: tall ? 46 : 34 });
    }
    // Plus on va vite, plus l'écart entre obstacles s'adapte pour rester jouable
    nextSpawn = 0.75 + Math.random() * 0.9 - Math.min(s / 3000, 0.3);
  }

  function jump() {
    if (state === 'ready' || state === 'over') { start(); return; }
    if (player.onGround) {
      player.vy = JUMP;
      player.onGround = false;
      if (navigator.vibrate) navigator.vibrate(5);
    }
  }

  function start() {
    reset();
    state = 'running';
    lastTime = null;
    if (playBtn) playBtn.textContent = G.jump;
    window.requestAnimationFrame(tick);
  }

  function gameOver() {
    state = 'over';
    var s = score();
    if (s > best) {
      best = s;
      try { localStorage.setItem('gameBest', String(best)); } catch (e) { /* stockage indisponible */ }
    }
    if (playBtn) playBtn.textContent = G.replay;
    if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    var live = document.getElementById('gameStatus');
    if (live) live.textContent = G.over + s + G.bestLbl + best + '.';
    draw();
  }

  function hit(a, b) {
    var pad = 4;
    return a.x + pad < b.x + b.w && a.x + a.w - pad > b.x && a.y + pad < b.y + b.h && a.y + a.h - pad > b.y;
  }

  function tick(t) {
    if (state !== 'running') return;
    if (lastTime === null) lastTime = t;
    var dt = Math.min((t - lastTime) / 1000, 0.05);
    lastTime = t;
    frame++;
    if (frame % 60 === 0) readColors();

    speed = Math.min(speed + 9 * dt, 820);
    distance += speed * dt;
    groundOffset = (groundOffset + speed * dt) % 24;

    // Joueur
    player.vy += GRAVITY * dt;
    player.y += player.vy * dt;
    if (player.y >= GROUND - player.h) {
      player.y = GROUND - player.h;
      player.vy = 0;
      player.onGround = true;
    }

    // Obstacles
    nextSpawn -= dt;
    if (nextSpawn <= 0) spawn();
    for (var i = obstacles.length - 1; i >= 0; i--) {
      var o = obstacles[i];
      o.x -= speed * dt;
      if (o.x + o.w < -20) { obstacles.splice(i, 1); continue; }
      if (hit(player, o)) { gameOver(); return; }
    }

    // Mots en arrière-plan (parallaxe)
    words.forEach(function (wd, idx) {
      wd.x -= speed * wd.speedFactor * dt;
      if (wd.x < -80) words[idx] = makeWord(W + Math.random() * 100);
    });

    draw();
    window.requestAnimationFrame(tick);
  }

  /* ---------- Dessin ---------- */
  function drawCursor(x, y) {
    ctx.save();
    ctx.translate(x, y);
    // Petite inclinaison pendant le saut
    if (!player.onGround) ctx.rotate(Math.max(-0.35, Math.min(0.35, player.vy / 2400)));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 26);
    ctx.lineTo(6.5, 20);
    ctx.lineTo(11, 30);
    ctx.lineTo(15, 28);
    ctx.lineTo(10.5, 18.5);
    ctx.lineTo(19, 18.5);
    ctx.closePath();
    ctx.fillStyle = colors.accent;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colors.paper;
    ctx.stroke();
    ctx.restore();
    // Jambes qui alternent quand il court
    if (player.onGround && state === 'running') {
      var step = Math.floor(distance / 18) % 2;
      ctx.fillStyle = colors.ink;
      ctx.fillRect(x + 2 + step * 5, GROUND - 1, 4, 2);
    }
  }

  function drawBug(o) {
    var cx = o.x + o.w / 2, cy = o.y + o.h / 2 + 2;
    ctx.strokeStyle = colors.danger;
    ctx.lineWidth = 1.6;
    var wiggle = Math.sin(frame * 0.4) * 2;
    for (var k = -1; k <= 1; k++) {
      ctx.beginPath();
      ctx.moveTo(cx + k * 6, cy);
      ctx.lineTo(cx + k * 8 - 2, o.y + o.h + (k === 0 ? wiggle : -wiggle));
      ctx.stroke();
    }
    ctx.fillStyle = colors.danger;
    ctx.beginPath();
    ctx.ellipse(cx, cy, o.w / 2, o.h / 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(o.x + o.w - 2, cy - 3, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(o.x + o.w, cy - 7);
    ctx.lineTo(o.x + o.w + 5, o.y - 2);
    ctx.stroke();
  }

  function drawPopup(o) {
    ctx.fillStyle = colors.paper;
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1.5;
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.strokeRect(o.x + 0.5, o.y + 0.5, o.w - 1, o.h - 1);
    ctx.fillStyle = colors.ink;
    ctx.fillRect(o.x, o.y, o.w, 8);
    ctx.fillStyle = colors.paper;
    ctx.font = '600 8px "IBM Plex Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('×', o.x + o.w - 3, o.y);
    ctx.fillStyle = colors.line;
    ctx.fillRect(o.x + 5, o.y + 14, o.w - 10, 3);
    ctx.fillRect(o.x + 5, o.y + 21, o.w - 16, 3);
  }

  function drawFly(o) {
    ctx.fillStyle = colors.accent;
    ctx.font = '600 20px Fraunces, Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('404', o.x, o.y + Math.sin(frame * 0.15) * 3);
  }

  function draw() {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);

    // Mots d'arrière-plan
    ctx.font = '12px "IBM Plex Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = colors.line;
    if (state === 'running') (words || []).forEach(function (wd) { ctx.fillText(wd.text, wd.x, wd.y); });

    // Sol en pointillés qui défile
    ctx.fillStyle = colors.muted;
    ctx.fillRect(0, GROUND, W, 1);
    for (var gx = -(groundOffset || 0); gx < W; gx += 24) ctx.fillRect(gx, GROUND + 8, 8, 1.5);

    (obstacles || []).forEach(function (o) {
      if (o.type === 'bug') drawBug(o);
      else if (o.type === 'popup') drawPopup(o);
      else drawFly(o);
    });

    if (player) drawCursor(player.x, player.y);

    // Score
    ctx.font = '500 13px "IBM Plex Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = colors.muted;
    var pad = function (n) { return ('00000' + n).slice(-5); };
    ctx.fillText(G.hiscore + pad(best) + '   ' + pad(player ? score() : 0), W - 14, 12);

    // Messages
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (state === 'ready') {
      ctx.fillStyle = colors.ink;
      ctx.font = '500 ' + (W < 600 ? 17 : 22) + 'px Fraunces, Georgia, serif';
      ctx.fillText(G.intro, W / 2, H / 2 - 22);
      ctx.fillStyle = colors.muted;
      ctx.font = '12px "IBM Plex Mono", monospace';
      ctx.fillText(isTouch ? G.touchPlay : G.keyPlay, W / 2, H / 2 + 6);
    } else if (state === 'over') {
      ctx.fillStyle = colors.danger;
      ctx.font = '600 ' + (W < 600 ? 20 : 26) + 'px Fraunces, Georgia, serif';
      ctx.fillText(G.crash, W / 2, H / 2 - 24);
      ctx.fillStyle = colors.muted;
      ctx.font = '12px "IBM Plex Mono", monospace';
      ctx.fillText('Score ' + score() + (score() >= best && score() > 0 ? G.record : '') + ' · ' + (isTouch ? G.touch : G.key) + G.replayHint, W / 2, H / 2 + 4);
    }
  }

  /* ---------- Commandes ---------- */
  function gameInView() {
    var r = canvas.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }
  function isJumpKey(e) {
    return e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowUp';
  }
  function typingInField() {
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    return /INPUT|TEXTAREA|SELECT/.test(tag);
  }
  // Barre espace (ou ↑) = sauter, tant que le jeu est à l'écran,
  // même si un autre bouton de la page a le focus
  document.addEventListener('keydown', function (e) {
    if (!isJumpKey(e) || typingInField() || !gameInView()) return;
    e.preventDefault();
    if (e.repeat) return; // garder la touche enfoncée ne relance pas la partie en boucle
    jump();
  });
  // Empêche aussi la barre espace d'« appuyer » sur le bouton qui a le focus (déclenché au relâchement)
  document.addEventListener('keyup', function (e) {
    if (isJumpKey(e) && !typingInField() && gameInView()) e.preventDefault();
  });
  // Écran tactile ou souris : toucher / cliquer le jeu = sauter
  canvas.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });
  if (playBtn) {
    playBtn.addEventListener('click', function () {
      jump();
      playBtn.blur(); // le focus quitte le bouton pour que la barre espace aille au jeu
    });
  }

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', function () { readColors(); draw(); });
  window.addEventListener('resize', resize);

  readColors();
  resize();
  reset();
  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();

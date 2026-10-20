/* Page 404 : un « 404 » géant fait de points qui fuient le curseur (ou le doigt)
   et explosent au clic, avant de revenir à leur place. */
(function () {
  'use strict';

  var root = document.documentElement;
  var canvas = document.querySelector('.e404-canvas');
  var stage = document.querySelector('.e404-stage');
  var pathEl = document.getElementById('e404Path');
  if (pathEl) pathEl.textContent = decodeURIComponent(window.location.pathname.replace(/^\/acvisuals/, '')) || '/';
  if (!canvas || !canvas.getContext) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var w = 0, h = 0, dots = [], colors = {};
  var pointer = { x: -9999, y: -9999, active: false };
  var lastInputAt = -Infinity;

  function readColors() {
    var cs = window.getComputedStyle(root);
    colors.ink = cs.getPropertyValue('--ink').trim();
    colors.accent = cs.getPropertyValue('--accent').trim();
    colors.danger = cs.getPropertyValue('--danger').trim();
  }

  function build() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = stage.offsetWidth;
    h = stage.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // On dessine la forme hors écran puis on échantillonne ses pixels pour placer les points
    var off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    var octx = off.getContext('2d');
    if (stage.getAttribute('data-shape') === 'wifi') {
      drawWifi(octx);
    } else {
      var size = Math.min(w * (w < 600 ? 0.58 : 0.42), h * 0.95);
      octx.font = '600 ' + size + 'px Fraunces, Georgia, serif';
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText('404', w / 2, h / 2);
    }
    var data = octx.getImageData(0, 0, w, h).data;
    var gap = stage.getAttribute('data-shape') === 'wifi' ? 5 : (w < 600 ? 6 : 8);

    var old = dots;
    dots = [];
    for (var y = 0; y < h; y += gap) {
      for (var x = 0; x < w; x += gap) {
        var p = (y * w + x) * 4;
        if (data[p + 3] > 128) {
          var prev = old[dots.length];
          dots.push({
            hx: x, hy: y,
            x: prev ? prev.x : Math.random() * w,
            y: prev ? prev.y : Math.random() * h,
            vx: 0, vy: 0,
            slash: data[p] > 128,           // pixels rouges = la barre du Wi-Fi
            accent: Math.random() < 0.12
          });
        }
      }
    }
    if (reduceMotion) dots.forEach(function (d) { d.x = d.hx; d.y = d.hy; });
  }

  // Icône Wi-Fi (3 arcs + un point) en noir, barrée d'un trait rouge
  function drawWifi(o) {
    var s = Math.min(w * (w < 600 ? 0.75 : 0.42), h * 0.82);
    var cx = w / 2;
    var cy = h * 0.45 + s * 0.3;
    var lw = s * 0.085;
    o.lineCap = 'round';
    o.lineWidth = lw;
    o.strokeStyle = o.fillStyle = '#000';
    [0.22, 0.42, 0.62].forEach(function (k) {
      o.beginPath();
      o.arc(cx, cy, s * k, Math.PI * 1.25, Math.PI * 1.75);
      o.stroke();
    });
    o.beginPath();
    o.arc(cx, cy, lw * 0.9, 0, Math.PI * 2);
    o.fill();
    // Un liseré « transparent » sépare la barre des arcs pour qu'elle se lise bien
    o.globalCompositeOperation = 'destination-out';
    o.lineWidth = lw * 2;
    o.beginPath();
    o.moveTo(cx - s * 0.42, cy - s * 0.66);
    o.lineTo(cx + s * 0.42, cy + s * 0.08);
    o.stroke();
    o.globalCompositeOperation = 'source-over';
    o.strokeStyle = '#f00';
    o.lineWidth = lw;
    o.beginPath();
    o.moveTo(cx - s * 0.42, cy - s * 0.66);
    o.lineTo(cx + s * 0.42, cy + s * 0.08);
    o.stroke();
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    var px = pointer.x, py = pointer.y;
    // Sans interaction, un « fantôme » balaie le chiffre pour montrer que c'est vivant
    if (!reduceMotion && t - lastInputAt > 3000) {
      px = w * (0.5 + 0.42 * Math.sin(t * 0.0006));
      py = h * (0.5 + 0.3 * Math.sin(t * 0.0011));
    }
    var radius = Math.max(70, w * 0.09);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var dx = d.x - px, dy = d.y - py;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dist < radius) {
        var force = (1 - dist / radius) * 2.4;
        d.vx += (dx / dist) * force;
        d.vy += (dy / dist) * force;
      }
      // Ressort vers la position d'origine + amortissement
      d.vx += (d.hx - d.x) * 0.045;
      d.vy += (d.hy - d.y) * 0.045;
      d.vx *= 0.86;
      d.vy *= 0.86;
      d.x += d.vx;
      d.y += d.vy;

      var speed = Math.abs(d.vx) + Math.abs(d.vy);
      ctx.fillStyle = d.slash ? colors.danger : (d.accent || speed > 1.5) ? colors.accent : colors.ink;
      ctx.globalAlpha = d.accent ? 1 : 0.85;
      var r = (w < 600 ? 1.6 : 2.1) + Math.min(speed * 0.15, 1.5);
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    draw(t);
    if (!reduceMotion) window.requestAnimationFrame(loop);
  }

  function trackPoint(clientX, clientY) {
    var r = stage.getBoundingClientRect();
    pointer.x = clientX - r.left;
    pointer.y = clientY - r.top;
    lastInputAt = performance.now();
  }

  // Clic ou tape : tous les points explosent depuis cet endroit
  function explode(clientX, clientY) {
    if (reduceMotion) return;
    var r = stage.getBoundingClientRect();
    var ox = clientX - r.left, oy = clientY - r.top;
    dots.forEach(function (d) {
      var dx = d.x - ox, dy = d.y - oy;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var power = 18 + Math.random() * 22;
      d.vx += (dx / dist) * power;
      d.vy += (dy / dist) * power;
    });
    if (navigator.vibrate) navigator.vibrate(15);
  }

  stage.addEventListener('pointermove', function (e) { trackPoint(e.clientX, e.clientY); });
  stage.addEventListener('pointerleave', function () { pointer.x = pointer.y = -9999; lastInputAt = -Infinity; });
  stage.addEventListener('touchmove', function (e) { trackPoint(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  stage.addEventListener('click', function (e) { explode(e.clientX, e.clientY); });

  var resizeTimer = null;
  var lastWidth = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (stage.offsetWidth !== lastWidth) { lastWidth = stage.offsetWidth; build(); if (reduceMotion) draw(0); }
    }, 150);
  });

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', function () { readColors(); if (reduceMotion) draw(0); });

  // Page hors ligne : bouton « Réessayer » + rechargement automatique au retour du réseau
  var retryBtn = document.getElementById('offlineRetry');
  if (retryBtn) retryBtn.addEventListener('click', function () { window.location.reload(); });
  if (stage.getAttribute('data-shape') === 'wifi') {
    window.addEventListener('online', function () { window.location.reload(); });
  }

  // On attend la police Fraunces pour que le « 404 » ait la bonne forme
  var start = function () {
    readColors();
    lastWidth = stage.offsetWidth;
    build();
    window.requestAnimationFrame(loop);
  };
  if (document.fonts && document.fonts.load) {
    document.fonts.load('600 100px Fraunces').then(start, start);
  } else {
    start();
  }
})();

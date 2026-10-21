/* ACVisuals — interactions (menu, apparitions, formulaire). Aucun outil externe. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');

  /* ---------- En-tête : bordure au défilement ---------- */
  var header = document.querySelector('.header');
  var mBar = document.querySelector('.m-bar');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (mBar) mBar.classList.toggle('show', y > (hero ? hero.offsetHeight * 0.6 : 300));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mMenu');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? burger.getAttribute('data-close') : burger.getAttribute('data-open'));
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('menu-open', open);
    if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1000) setMenu(false); });
  }

  /* ---------- Apparition au défilement ---------- */
  var items = document.querySelectorAll('.rv, .step');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Bandeau défilant : duplique le contenu pour une boucle continue ---------- */
  var track = document.querySelector('.band-track');
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- Formulaire (Web3Forms) ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var status = form.querySelector('.form-status');
    var msg = function (key, cls) { status.textContent = form.getAttribute('data-' + key) || ''; status.className = 'form-status ' + (cls || ''); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { msg('invalid', 'err'); form.reportValidity(); return; }
      if (form.querySelector('.hp').checked) return;
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      msg('sending');
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res && res.success) { form.reset(); msg('ok', 'ok'); } else { msg('error', 'err'); }
      }).catch(function () { msg('error', 'err'); }).then(function () { btn.disabled = false; });
    });
  }

  /* ---------- Année ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

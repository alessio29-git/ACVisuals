/* Chargé dans le <head> : applique le thème et prépare le rideau d'intro
   avant le premier affichage, pour éviter tout « flash ». */
(function () {
  'use strict';
  var root = document.documentElement;
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
  } catch (e) { /* stockage indisponible */ }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  root.classList.add('is-loading', 'is-intro');
  try {
    if (!sessionStorage.getItem('introSeen')) root.classList.add('show-loader');
  } catch (e) { /* stockage indisponible */ }
})();

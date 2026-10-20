/* Traduction des pages partagées (404 et hors connexion).
   GitHub Pages n'a qu'une seule page 404 pour tout le site, et la page hors connexion
   s'affiche à l'adresse demandée : on déduit donc la langue de l'adresse (/nl/… ou /en/…),
   puis du navigateur, et on remplace les textes marqués data-i18n.
   À charger juste avant script.js. */
(function () {
  'use strict';

  var path = window.location.pathname;
  var lang = /\/nl\//.test(path) ? 'nl' : /\/en\//.test(path) ? 'en' : null;
  if (!lang) {
    var nav = (navigator.language || '').slice(0, 2).toLowerCase();
    // Sur une adresse française (racine du site), on garde le français sauf navigateur NL/EN
    lang = (nav === 'nl' || nav === 'en') && !/\/(index|o-naturelle|belvantage|mentions-legales)\.html$/.test(path) ? nav : 'fr';
  }
  if (lang === 'fr') return;

  var D = {
    nl: {
      skip: 'Naar de hoofdinhoud',
      'nav-services': 'Diensten', 'nav-work': 'Projecten', 'nav-process': 'Werkwijze',
      'nav-about': 'Over mij', 'nav-faq': 'Vragen', 'nav-contact': 'Contact',
      'cta-contact': 'Contact opnemen',
      hint: 'Beweeg er met de muis (of je vinger) over. Klik om alles te laten ontploffen.',
      'e404-eyebrow': 'Fout 404',
      'e404-title': 'Deze gebruikersflow loopt dood.',
      'e404-lede': 'Als designer heb ik een hekel aan doodlopende wegen. Deze hou ik toch: hij is mooi. Maar geen zorgen, de uitgang staat hieronder.',
      'btn-home': 'Terug naar de homepage', 'btn-work': 'Bekijk mijn projecten',
      'report-title': 'Gebruikerstestrapport <span>#404</span>',
      'dt-task': 'Taak', 'dd-task': 'Naar <code id="e404Path">deze pagina</code> gaan',
      'dt-result': 'Resultaat', 'badge-fail': 'Mislukt',
      'dt-cause': 'Waarschijnlijke oorzaak', 'dd-cause': 'Kapotte link, verplaatste pagina of een kleine tikfout.',
      'dt-severity': 'Ernst', 'dd-severity': 'Laag. U bent er toch al, bekijk dan ook de rest.',
      'dt-culprit': 'Schuldige', 'dd-culprit': 'Zeker niet u. Bij design ligt het altijd aan de designer.',
      'report-foot': 'Denkt u dat het een echte bug is? <a href="index.html#contact">Laat het me weten</a>, dan los ik het op.',
      copyright: '© <span id="year"></span> acvisuals — Cino Alessio. Alle rechten voorbehouden.',
      colophon: 'België — Brussel.', legal: 'Juridische informatie &amp; privacy',
      'off-eyebrow': 'Geen verbinding',
      'off-title': 'Het internet neemt even koffiepauze.',
      'off-lede': 'Uw toestel is niet meer verbonden. Geen paniek: deze pagina laadt vanzelf opnieuw zodra de verbinding terug is. Verbeter intussen uw record in het minigame hierboven.',
      'off-retry': 'Opnieuw proberen', 'off-call': 'Bel me toch',
      'off-wait': 'In afwachting van het netwerk…', 'off-play': 'Spelen',
      'off-report-title': 'Gebruikerstestrapport <span>#offline</span>',
      'off-dd-task': 'De pagina laden', 'off-badge': 'Offline',
      'off-dd-cause': 'Geen wifi, geen mobiele data meer, of een tunnel.',
      'off-dd-severity': 'Tijdelijk. De site komt terug met het netwerk.',
      'off-dt-tip': 'Goed om weten', 'off-dd-tip': 'Mijn nummer werkt ook zonder internet: +32 485 03 72 94.',
      'off-foot': 'Pagina\'s die u al bezocht hebt, blijven offline beschikbaar.'
    },
    en: {
      skip: 'Skip to main content',
      'nav-services': 'Services', 'nav-work': 'Work', 'nav-process': 'Process',
      'nav-about': 'About', 'nav-faq': 'FAQ', 'nav-contact': 'Contact',
      'cta-contact': 'Get in touch',
      hint: 'Hover over it with your mouse (or finger). Click to make it all explode.',
      'e404-eyebrow': 'Error 404',
      'e404-title': 'This user flow leads to a dead end.',
      'e404-lede': 'As a designer, I hate dead ends. I\'m keeping this one though: it\'s pretty. Don\'t worry, the exit is right below.',
      'btn-home': 'Back to home', 'btn-work': 'See my work',
      'report-title': 'User test report <span>#404</span>',
      'dt-task': 'Task', 'dd-task': 'Open <code id="e404Path">this page</code>',
      'dt-result': 'Result', 'badge-fail': 'Failed',
      'dt-cause': 'Likely cause', 'dd-cause': 'Broken link, moved page or a small typo.',
      'dt-severity': 'Severity', 'dd-severity': 'Low. You\'re here anyway, might as well look around.',
      'dt-culprit': 'Culprit', 'dd-culprit': 'Definitely not you. In design, it\'s always the designer\'s fault.',
      'report-foot': 'Think it\'s a real bug? <a href="index.html#contact">Let me know</a> and I\'ll fix it.',
      copyright: '© <span id="year"></span> acvisuals — Cino Alessio. All rights reserved.',
      colophon: 'Belgium — Brussels.', legal: 'Legal notice &amp; privacy',
      'off-eyebrow': 'Offline',
      'off-title': 'The internet is on a coffee break.',
      'off-lede': 'Your device is no longer connected. Don\'t panic: this page will reload by itself as soon as the connection is back. Meanwhile, beat your high score in the mini-game above.',
      'off-retry': 'Try again', 'off-call': 'Call me anyway',
      'off-wait': 'While waiting for the network…', 'off-play': 'Play',
      'off-report-title': 'User test report <span>#offline</span>',
      'off-dd-task': 'Load the page', 'off-badge': 'Offline',
      'off-dd-cause': 'No Wi-Fi, out of mobile data, or a tunnel.',
      'off-dd-severity': 'Temporary. The site comes back with the network.',
      'off-dt-tip': 'Good to know', 'off-dd-tip': 'My phone number works without internet too: +32 485 03 72 94.',
      'off-foot': 'Pages you\'ve already visited remain available offline.'
    }
  };
  var TITLES = {
    nl: { e404: 'Pagina niet gevonden · acvisuals', offline: 'Geen verbinding · acvisuals' },
    en: { e404: 'Page not found · acvisuals', offline: 'Offline · acvisuals' }
  };

  var dict = D[lang];
  document.documentElement.setAttribute('lang', lang);
  var pageKey = document.body.getAttribute('data-page');
  if (pageKey && TITLES[lang][pageKey]) document.title = TITLES[lang][pageKey];

  Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
    var key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  // Les liens internes pointent vers les pages de la même langue
  Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
    var href = a.getAttribute('href');
    if (/^(index|mentions-legales|o-naturelle|belvantage)\.html/.test(href)) a.setAttribute('href', lang + '/' + href);
  });
})();

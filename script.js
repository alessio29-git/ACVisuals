(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Textes affichés par le JavaScript, en 3 langues ---------- */
  var STRINGS = {
    fr: {
      themeLight: 'Activer le thème clair', themeDark: 'Activer le thème sombre',
      menuOpen: 'Ouvrir le menu', menuClose: 'Fermer le menu',
      like: "J'aime", liked: 'Aimé !',
      emailIdle: 'Saisissez une adresse valide pour voir la validation en direct.',
      emailOk: 'Adresse e-mail valide.', emailBad: 'Format invalide — exemple : prenom@exemple.com',
      codeIdle: 'Saisissez un code à 4 chiffres pour voir la validation en direct.',
      codeOk: 'Code valide.', codeBad: 'Le code doit contenir exactement 4 chiffres.',
      loading: 'Chargement en cours…', done: 'Terminé !',
      formInvalid: 'Merci de compléter tous les champs correctement.',
      formNoKey: 'Formulaire non configuré : ajoutez votre clé Web3Forms dans index.html.',
      formSending: 'Envoi en cours…',
      formOk: 'Merci ! Votre message a bien été envoyé. Réponse sous 24h.',
      formFail: "L'envoi a échoué : ", formRetry: 'réessayez plus tard.',
      formOffline: 'Connexion impossible. Réessayez plus tard ou écrivez directement par e-mail.',
      formSubject: 'Nouveau message depuis acvisuals',
      loaderCity: 'Bruxelles', loaderLoading: 'Chargement', loaderRole: 'Studio de design', cursorView: 'Voir'
    },
    nl: {
      themeLight: 'Licht thema activeren', themeDark: 'Donker thema activeren',
      menuOpen: 'Menu openen', menuClose: 'Menu sluiten',
      like: 'Leuk', liked: 'Geliket!',
      emailIdle: 'Vul een geldig adres in om de live validatie te zien.',
      emailOk: 'Geldig e-mailadres.', emailBad: 'Ongeldig formaat — voorbeeld: naam@voorbeeld.be',
      codeIdle: 'Vul een code van 4 cijfers in om de live validatie te zien.',
      codeOk: 'Geldige code.', codeBad: 'De code moet precies 4 cijfers bevatten.',
      loading: 'Bezig met laden…', done: 'Klaar!',
      formInvalid: 'Gelieve alle velden correct in te vullen.',
      formNoKey: 'Formulier niet geconfigureerd: voeg je Web3Forms-sleutel toe.',
      formSending: 'Bezig met verzenden…',
      formOk: 'Bedankt! Uw bericht is goed verzonden. Antwoord binnen 24 uur.',
      formFail: 'Verzenden mislukt: ', formRetry: 'probeer later opnieuw.',
      formOffline: 'Geen verbinding. Probeer later opnieuw of stuur rechtstreeks een e-mail.',
      formSubject: 'Nieuw bericht via acvisuals (NL)',
      loaderCity: 'Brussel', loaderLoading: 'Laden', loaderRole: 'Designstudio', cursorView: 'Bekijk'
    },
    en: {
      themeLight: 'Switch to light theme', themeDark: 'Switch to dark theme',
      menuOpen: 'Open menu', menuClose: 'Close menu',
      like: 'Like', liked: 'Liked!',
      emailIdle: 'Type a valid address to see live validation.',
      emailOk: 'Valid email address.', emailBad: 'Invalid format — example: name@example.com',
      codeIdle: 'Type a 4-digit code to see live validation.',
      codeOk: 'Valid code.', codeBad: 'The code must contain exactly 4 digits.',
      loading: 'Loading…', done: 'Done!',
      formInvalid: 'Please fill in all fields correctly.',
      formNoKey: 'Form not configured: add your Web3Forms key.',
      formSending: 'Sending…',
      formOk: 'Thank you! Your message has been sent. I reply within 24 hours.',
      formFail: 'Sending failed: ', formRetry: 'please try again later.',
      formOffline: 'No connection. Please try again later or email me directly.',
      formSubject: 'New message from acvisuals (EN)',
      loaderCity: 'Brussels', loaderLoading: 'Loading', loaderRole: 'Design studio', cursorView: 'View'
    }
  };
  var lang = (root.getAttribute('lang') || 'fr').slice(0, 2);
  var T = STRINGS[lang] || STRINGS.fr;

  /* ---------- Thème clair / sombre ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var storedTheme = null;
  try { storedTheme = localStorage.getItem('theme'); } catch (e) { /* stockage indisponible */ }
  if (storedTheme === 'light' || storedTheme === 'dark') {
    root.setAttribute('data-theme', storedTheme);
  }
  updateThemeToggleLabel();

  themeToggle.addEventListener('click', function () {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* stockage indisponible */ }
    updateThemeToggleLabel();
  });

  function updateThemeToggleLabel() {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
    var isDark = current === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? T.themeLight : T.themeDark);
  }

  /* ---------- Menu mobile ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');

  function closeMobileMenu(returnFocus) {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', T.menuOpen);
    if (returnFocus) menuToggle.focus();
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? T.menuClose : T.menuOpen);
    if (isOpen) {
      var firstLink = mainNav.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }
  });

  mainNav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () { closeMobileMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
      closeMobileMenu(true);
    }
  });

  /* ---------- Scroll spy (surbrillance du lien actif) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var id = entry.target.getAttribute('id');
      var link = navLinks.find(function (l) { return l.getAttribute('href') === '#' + id; });
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(function (l) { l.classList.remove('is-active'); });
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(function (s) { spyObserver.observe(s); });

  /* ---------- Animation d'apparition au scroll ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var revealTargets = Array.prototype.slice.call(document.querySelectorAll(
    '.case-card, .research-card, .demo-card, .wireframe-box, .mockup-box, .value-item, .service-card, .process-step, .faq-item, ' +
    '.section-eyebrow, .section-title, .section-lede, .graphic-showcase, .video-showcase, ' +
    '.personality-quote, .contact-list, .social-links, .contact-form'
  )).filter(function (el) { return !el.closest('.hero'); });
  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
    // Décalage en cascade entre éléments frères (ex. les 4 valeurs)
    var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.classList[0] === el.classList[0];
    });
    var index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty('--reveal-delay', Math.min(index, 5) * 0.08 + 's');
  });

  var revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('section-eyebrow')) scramble(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Motion design ---------- */
  // Barre de progression de lecture
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);
  var progressTicking = false;
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    progressTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!progressTicking) { progressTicking = true; window.requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  // Bandeau d'outils en défilement continu (contenu dupliqué pour une boucle sans couture)
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack && !reduceMotion) {
    var viewport = document.createElement('div');
    viewport.className = 'marquee-viewport';
    marqueeTrack.parentNode.insertBefore(viewport, marqueeTrack);
    viewport.appendChild(marqueeTrack);
    var items = Array.prototype.slice.call(marqueeTrack.children);
    for (var copy = 0; copy < 3; copy++) {
      items.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        marqueeTrack.appendChild(clone);
      });
    }
    marqueeTrack.classList.add('is-looping');
  }

  if (finePointer && !reduceMotion) {
    // Boutons « magnétiques » : ils suivent légèrement le curseur
    document.querySelectorAll('.hero-ctas .btn, .contact-form .btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });

    // Visuels des études de cas : légère inclinaison 3D au survol
    document.querySelectorAll('.case-media').forEach(function (media) {
      media.addEventListener('pointermove', function (e) {
        var r = media.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        media.classList.add('is-tilting');
        media.style.transform = 'perspective(700px) rotateY(' + (px * 10) + 'deg) rotateX(' + (-py * 10) + 'deg) scale(1.03)';
      });
      media.addEventListener('pointerleave', function () {
        media.classList.remove('is-tilting');
        media.style.transform = '';
      });
    });
  }

  /* ---------- Bouton "retour en haut" ---------- */
  var scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 480) {
      scrollTopBtn.classList.add('is-visible');
    } else {
      scrollTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Liens non encore actifs (réseaux sociaux, vidéo à venir) ---------- */
  document.querySelectorAll('[data-placeholder="true"]').forEach(function (link) {
    link.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* ---------- Barres de statistiques animées (études de cas) ---------- */
  var barFills = Array.prototype.slice.call(document.querySelectorAll('.bar-fill'));
  if (barFills.length) {
    barFills.forEach(function (el) {
      var target = el.style.width;
      el.style.width = '0%';
      setTimeout(function () {
        el.style.transition = 'width 900ms ease';
        el.style.width = target;
      }, 100);
    });
  }

  /* ---------- Design visuel : onglets accessibles ---------- */
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
  var tabPanels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));

  function activateTab(tab) {
    tabButtons.forEach(function (btn) {
      var isActive = btn === tab;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    tabPanels.forEach(function (panel) {
      var shouldShow = panel.getAttribute('aria-labelledby') === tab.id;
      panel.hidden = !shouldShow;
      panel.classList.toggle('is-active', shouldShow);
    });
  }

  tabButtons.forEach(function (btn, index) {
    btn.addEventListener('click', function () { activateTab(btn); });
    btn.addEventListener('keydown', function (e) {
      var newIndex = null;
      if (e.key === 'ArrowRight') newIndex = (index + 1) % tabButtons.length;
      if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      if (e.key === 'Home') newIndex = 0;
      if (e.key === 'End') newIndex = tabButtons.length - 1;
      if (newIndex !== null) {
        e.preventDefault();
        tabButtons[newIndex].focus();
        activateTab(tabButtons[newIndex]);
      }
    });
  });

  /* ---------- Démo d'interaction : bouton "J'aime" ---------- */
  var likeBtn = document.getElementById('demoLikeBtn');
  var likeLabel = document.getElementById('demoLikeLabel');
  if (likeBtn && likeLabel) {
    likeBtn.addEventListener('click', function () {
      var isPressed = likeBtn.getAttribute('aria-pressed') === 'true';
      likeBtn.setAttribute('aria-pressed', String(!isPressed));
      likeLabel.textContent = isPressed ? (likeLabel.getAttribute('data-off') || T.like) : (likeLabel.getAttribute('data-on') || T.liked);
    });
  }

  /* ---------- Démo d'interaction : validation d'e-mail en direct ---------- */
  var demoEmail = document.getElementById('demoEmail');
  var demoEmailHint = document.getElementById('demoEmailHint');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (demoEmail && demoEmailHint) {
    demoEmail.addEventListener('input', function () {
      var value = demoEmail.value.trim();
      if (!value) {
        demoEmail.classList.remove('is-valid', 'is-invalid');
        demoEmailHint.textContent = T.emailIdle;
        demoEmailHint.className = 'demo-hint';
        return;
      }
      if (emailPattern.test(value)) {
        demoEmail.classList.add('is-valid');
        demoEmail.classList.remove('is-invalid');
        demoEmailHint.textContent = T.emailOk;
        demoEmailHint.className = 'demo-hint valid';
      } else {
        demoEmail.classList.add('is-invalid');
        demoEmail.classList.remove('is-valid');
        demoEmailHint.textContent = T.emailBad;
        demoEmailHint.className = 'demo-hint invalid';
      }
    });
  }

  /* ---------- Démo d'interaction : validation d'un code à 4 chiffres en direct ---------- */
  var demoCode = document.getElementById('demoCode');
  var demoCodeHint = document.getElementById('demoCodeHint');
  var codePattern = /^\d{4}$/;

  if (demoCode && demoCodeHint) {
    demoCode.addEventListener('input', function () {
      demoCode.value = demoCode.value.replace(/\D/g, '').slice(0, 4);
      var value = demoCode.value;
      if (!value) {
        demoCode.classList.remove('is-valid', 'is-invalid');
        demoCodeHint.textContent = T.codeIdle;
        demoCodeHint.className = 'demo-hint';
        return;
      }
      if (codePattern.test(value)) {
        demoCode.classList.add('is-valid');
        demoCode.classList.remove('is-invalid');
        demoCodeHint.textContent = T.codeOk;
        demoCodeHint.className = 'demo-hint valid';
      } else {
        demoCode.classList.add('is-invalid');
        demoCode.classList.remove('is-valid');
        demoCodeHint.textContent = T.codeBad;
        demoCodeHint.className = 'demo-hint invalid';
      }
    });
  }

  /* ---------- Démo d'interaction : interrupteur accessible ---------- */
  var demoSwitch = document.getElementById('demoSwitch');
  if (demoSwitch) {
    demoSwitch.addEventListener('click', function () {
      var isChecked = demoSwitch.getAttribute('aria-checked') === 'true';
      demoSwitch.setAttribute('aria-checked', String(!isChecked));
    });
  }

  /* ---------- Démo d'interaction : chargement progressif ---------- */
  var demoLoadBtn = document.getElementById('demoLoadBtn');
  var demoProgress = document.getElementById('demoProgress');
  var demoProgressBar = document.getElementById('demoProgressBar');
  var demoProgressStatus = document.getElementById('demoProgressStatus');
  var loadInterval = null;

  if (demoLoadBtn && demoProgress && demoProgressBar && demoProgressStatus) {
    demoLoadBtn.addEventListener('click', function () {
      if (loadInterval) clearInterval(loadInterval);
      var progress = 0;
      demoLoadBtn.disabled = true;
      demoProgressStatus.textContent = T.loading;

      loadInterval = setInterval(function () {
        progress += Math.random() * 18 + 8;
        if (progress >= 100) {
          progress = 100;
          clearInterval(loadInterval);
          demoLoadBtn.disabled = false;
          demoProgressStatus.textContent = T.done;
        }
        demoProgressBar.style.width = progress + '%';
        demoProgress.setAttribute('aria-valuenow', String(Math.round(progress)));
      }, 220);
    });
  }

  /* ---------- Formulaire de contact (envoi réel via Web3Forms) ---------- */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        formStatus.classList.add('is-error');
        formStatus.textContent = T.formInvalid;
        return;
      }

      var accessKey = contactForm.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey.indexOf('COLLEZ_VOTRE_CLE') === 0) {
        formStatus.classList.add('is-error');
        formStatus.textContent = T.formNoKey;
        return;
      }

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      formStatus.classList.remove('is-error');
      formStatus.textContent = T.formSending;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: contactForm.querySelector('input[name="subject"]').value,
          name: contactForm.querySelector('#name').value,
          email: contactForm.querySelector('#email').value,
          message: contactForm.querySelector('#message').value,
          botcheck: contactForm.querySelector('input[name="botcheck"]').checked
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            formStatus.classList.remove('is-error');
            formStatus.textContent = T.formOk;
            contactForm.reset();
          } else {
            formStatus.classList.add('is-error');
            formStatus.textContent = T.formFail + (data.message || T.formRetry);
          }
        })
        .catch(function () {
          formStatus.classList.add('is-error');
          formStatus.textContent = T.formOffline;
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  /* ---------- Texte qui se « décode » (petits titres de section) ---------- */
  function scramble(el) {
    if (reduceMotion || el.children.length) return;
    var finalText = el.textContent;
    var glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/';
    var start = null;
    el.setAttribute('aria-label', finalText);
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / 700, 1);
      var shown = Math.floor(p * finalText.length);
      var out = '';
      for (var i = 0; i < finalText.length; i++) {
        var ch = finalText.charAt(i);
        out += (i < shown || ch === ' ') ? ch : glyphs.charAt(Math.floor(Math.random() * glyphs.length));
      }
      el.textContent = out;
      if (p < 1) window.requestAnimationFrame(step);
      else el.removeAttribute('aria-label');
    }
    window.requestAnimationFrame(step);
  }

  /* ---------- Visuels révélés par un rideau ---------- */
  // On observe le parent : un élément entièrement masqué par clip-path est considéré
  // comme invisible par le navigateur, et ne se révélerait donc jamais.
  var clipObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.reveal-clip').forEach(function (el) { el.classList.add('is-visible'); });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.graphic-visual, .video-frame').forEach(function (el) {
    if (reduceMotion) return;
    el.classList.add('reveal-clip');
    clipObserver.observe(el.parentNode);
  });

  /* ---------- Titre de l'intro : mot par mot ---------- */
  var heroTitle = document.querySelector('.hero h1');
  if (heroTitle && !reduceMotion) {
    var wordIndex = 0;
    var makeWord = function (content, free) {
      var outer = document.createElement('span');
      outer.className = free ? 'word word--free' : 'word';
      var inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.style.setProperty('--i', wordIndex++);
      inner.appendChild(content);
      outer.appendChild(inner);
      return outer;
    };
    Array.prototype.slice.call(heroTitle.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else frag.appendChild(makeWord(document.createTextNode(part), false));
        });
        heroTitle.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        var placeholder = document.createComment('');
        heroTitle.replaceChild(placeholder, node);
        heroTitle.replaceChild(makeWord(node, true), placeholder);
      }
    });
    heroTitle.classList.add('is-split');
  }

  /* ---------- Écran d'intro & transitions entre les pages ---------- */
  var curtain = null;
  if (root.classList.contains('is-loading')) {
    curtain = document.createElement('div');
    curtain.className = 'page-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(curtain);
    root.classList.remove('is-loading');

    var liftCurtain = function () {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          curtain.classList.add('is-up');
          setTimeout(function () { root.classList.remove('is-intro'); }, 350);
          setTimeout(function () { curtain.innerHTML = ''; }, 1000);
        });
      });
    };

    if (root.classList.contains('show-loader') && document.querySelector('.hero')) {
      curtain.innerHTML =
        '<div class="loader-top"><span>Cino Alessio</span><span>' + T.loaderCity + ' — ' + new Date().getFullYear() + '</span></div>' +
        '<div><div class="loader-name"><span>acvisuals</span><span>' + T.loaderRole + '</span></div><div class="loader-bar"></div></div>' +
        '<div class="loader-bottom"><span>' + T.loaderLoading + '</span><span class="loader-count">0</span></div>';
      var countEl = curtain.querySelector('.loader-count');
      var barEl = curtain.querySelector('.loader-bar');
      var loaderStart = null;
      var countUp = function (t) {
        if (loaderStart === null) loaderStart = t;
        var p = Math.min((t - loaderStart) / 1500, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        countEl.textContent = Math.round(eased * 100);
        barEl.style.transform = 'scaleX(' + eased + ')';
        if (p < 1) window.requestAnimationFrame(countUp);
        else setTimeout(liftCurtain, 200);
      };
      window.requestAnimationFrame(countUp);
      try { sessionStorage.setItem('introSeen', '1'); } catch (e) { /* stockage indisponible */ }
    } else {
      liftCurtain();
    }

    // En quittant vers une autre page du site : le rideau remonte et recouvre l'écran
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      var url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (!/\.html$|\/$/.test(url.pathname)) return;
      e.preventDefault();
      curtain.classList.add('no-anim');
      curtain.classList.remove('is-up');
      curtain.classList.add('is-down');
      void curtain.offsetHeight;
      curtain.classList.remove('no-anim', 'is-down');
      setTimeout(function () { window.location.href = link.href; }, 750);
    });

    // Retour arrière (cache du navigateur) : on relève le rideau
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      curtain.classList.add('no-anim', 'is-up');
      void curtain.offsetHeight;
      curtain.classList.remove('no-anim');
    });
  }

  /* ---------- Fond interactif de l'intro : grille de points ---------- */
  var heroCanvas = document.querySelector('.hero-canvas');
  if (heroCanvas && heroCanvas.getContext) {
    var ctx = heroCanvas.getContext('2d');
    var heroEl = heroCanvas.parentNode;
    var cw = 0, ch = 0, dots = [], colors = {};
    var pointer = { x: -9999, y: -9999 };
    var heroVisible = true, loopRunning = false;

    var readColors = function () {
      var cs = window.getComputedStyle(root);
      colors.ink = cs.getPropertyValue('--ink-muted').trim();
      colors.accent = cs.getPropertyValue('--accent').trim();
    };
    var resizeCanvas = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = heroEl.offsetWidth;
      ch = heroEl.offsetHeight;
      heroCanvas.width = cw * dpr;
      heroCanvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      var gap = cw < 700 ? 24 : 30;
      for (var y = gap / 2; y < ch; y += gap) {
        for (var x = gap / 2; x < cw; x += gap) dots.push({ x: x, y: y, ox: x, oy: y });
      }
    };
    var drawDots = function (t) {
      ctx.clearRect(0, 0, cw, ch);
      var radius = 160;
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var dx = d.ox - pointer.x, dy = d.oy - pointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var tx = d.ox, ty = d.oy, near = 0;
        if (!reduceMotion) ty += Math.sin(t * 0.0012 + d.ox * 0.012 + d.oy * 0.008) * 2.5;
        if (dist < radius) {
          near = 1 - dist / radius;
          var push = near * near * 40;
          tx += (dx / dist) * push;
          ty += (dy / dist) * push;
        }
        d.x += (tx - d.x) * 0.12;
        d.y += (ty - d.y) * 0.12;
        ctx.globalAlpha = 0.3 + near * 0.7;
        ctx.fillStyle = near > 0.05 ? colors.accent : colors.ink;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.1 + near * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    // Sans souris ni doigt (téléphone, ou souris hors de l'écran), un « fantôme » se promène dans la grille
    var realPointer = { x: -9999, y: -9999 }, lastInputAt = -Infinity;
    var loop = function (t) {
      if (!heroVisible || document.hidden) { loopRunning = false; return; }
      var aim = realPointer;
      if (t - lastInputAt > 2500) {
        aim = { x: cw * (0.55 + 0.35 * Math.sin(t * 0.00045)), y: ch * (0.45 + 0.3 * Math.sin(t * 0.0007 + 1)) };
      }
      if (pointer.x < -5000) { pointer.x = aim.x; pointer.y = aim.y; }
      pointer.x += (aim.x - pointer.x) * 0.08;
      pointer.y += (aim.y - pointer.y) * 0.08;
      drawDots(t);
      window.requestAnimationFrame(loop);
    };
    var startLoop = function () {
      if (reduceMotion) { drawDots(0); return; }
      if (!loopRunning) { loopRunning = true; window.requestAnimationFrame(loop); }
    };

    readColors();
    resizeCanvas();
    dots.forEach(function (d) { d.x = d.ox; d.y = d.oy; });
    startLoop();

    // Sur téléphone, la barre d'adresse change la hauteur en scrollant : on ne reconstruit que si ça vaut la peine
    window.addEventListener('resize', function () {
      if (heroEl.offsetWidth !== cw || Math.abs(heroEl.offsetHeight - ch) > 120) { resizeCanvas(); startLoop(); }
    });
    var trackPoint = function (x, y) {
      var r = heroEl.getBoundingClientRect();
      realPointer.x = x - r.left;
      realPointer.y = y - r.top;
      lastInputAt = performance.now();
    };
    window.addEventListener('pointermove', function (e) { trackPoint(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener('touchstart', function (e) { trackPoint(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    window.addEventListener('touchmove', function (e) { trackPoint(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { lastInputAt = -Infinity; });
    themeToggle.addEventListener('click', function () { readColors(); startLoop(); });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { readColors(); startLoop(); });
    document.addEventListener('visibilitychange', startLoop);
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible) startLoop();
    }).observe(heroEl);
  }

  /* ---------- Curseur personnalisé ---------- */
  if (finePointer && !reduceMotion) {
    root.classList.add('has-cursor');
    var cursorDot = document.createElement('div');
    var cursorRing = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorRing.className = 'cursor-ring';
    cursorDot.setAttribute('aria-hidden', 'true');
    cursorRing.setAttribute('aria-hidden', 'true');
    cursorRing.innerHTML = '<span>' + T.cursorView + '</span>';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      root.classList.add('cursor-active');
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { root.classList.remove('cursor-active'); });
    document.addEventListener('pointerover', function (e) {
      var viewTarget = e.target.closest('.case-media');
      var hoverTarget = e.target.closest('a, button, input, textarea, select, label, video');
      root.classList.toggle('cursor-view', !!viewTarget);
      root.classList.toggle('cursor-hover', !viewTarget && !!hoverTarget);
    });
    (function followRing() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      window.requestAnimationFrame(followRing);
    })();
  }

  // Le visuel d'une étude de cas devient cliquable (même cible que « Voir le projet complet »)
  document.querySelectorAll('.case-card').forEach(function (card) {
    var media = card.querySelector('.case-media');
    var link = card.querySelector('a.case-toggle');
    if (!media || !link) return;
    media.style.cursor = 'pointer';
    media.addEventListener('click', function () { link.click(); });
  });

  /* ---------- Grand titre défilant, accéléré par le scroll ---------- */
  var bigTrack = document.querySelector('.big-marquee-track');
  if (bigTrack) {
    Array.prototype.slice.call(bigTrack.children).forEach(function (item) {
      bigTrack.appendChild(item.cloneNode(true));
    });
    if (!reduceMotion) {
      var bigPos = 0, lastScrollY = window.scrollY, speed = 0, direction = 1, bigVisible = false, bigRunning = false;
      var bigLoop = function () {
        if (!bigVisible) { bigRunning = false; return; }
        var dy = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        if (dy) direction = dy > 0 ? 1 : -1;
        speed += (Math.min(Math.abs(dy), 80) * 0.35 - speed) * 0.1;
        bigPos -= (0.7 + speed) * direction;
        var half = bigTrack.scrollWidth / 2;
        if (bigPos <= -half) bigPos += half;
        if (bigPos > 0) bigPos -= half;
        bigTrack.style.transform = 'translate3d(' + bigPos + 'px,0,0) skewX(' + (-speed * direction * 0.25) + 'deg)';
        window.requestAnimationFrame(bigLoop);
      };
      new IntersectionObserver(function (entries) {
        bigVisible = entries[0].isIntersecting;
        lastScrollY = window.scrollY;
        if (bigVisible && !bigRunning) { bigRunning = true; window.requestAnimationFrame(bigLoop); }
      }).observe(bigTrack.parentNode);
    }
  }

  /* ---------- Onde au toucher + petite vibration (téléphones Android) ---------- */
  if (!reduceMotion) {
    document.addEventListener('pointerdown', function (e) {
      var target = e.target.closest('.btn, .case-toggle');
      if (!target) return;
      var r = target.getBoundingClientRect();
      var size = Math.max(r.width, r.height) * 2.2;
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
      target.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 650);
      if (e.pointerType === 'touch' && navigator.vibrate) navigator.vibrate(8);
    });
  }

  /* ---------- Menu mobile : on bloque le scroll de la page pendant qu'il est ouvert ---------- */
  new MutationObserver(function () {
    root.classList.toggle('menu-open', mainNav.classList.contains('is-open'));
  }).observe(mainNav, { attributes: true, attributeFilter: ['class'] });

  /* ---------- Parallaxe au scroll sur les visuels (téléphone comme ordinateur) ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('.case-media-logo, .graphic-visual img'));
  if (parallaxEls.length && !reduceMotion) {
    var parallaxTicking = false;
    var updateParallax = function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var r = el.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 (haut) → 0.5 (bas)
        el.style.transform = 'translateY(' + (progress * -24) + 'px) scale(' + (1.06 - Math.abs(progress) * 0.06) + ')';
      });
      parallaxTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (!parallaxTicking) { parallaxTicking = true; window.requestAnimationFrame(updateParallax); }
    }, { passive: true });
    updateParallax();
  }

  /* ---------- Mode hors ligne (service worker, uniquement sur le site en ligne) ---------- */
  // sw.js est à la racine du site, même depuis /nl/ ou /en/ : on part de l'adresse de ce script
  var swUrl = new URL('sw.js', (document.currentScript && document.currentScript.src) || window.location.href).href;
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(swUrl).catch(function () { /* navigateur non compatible : le site marche quand même */ });
    });
  }

  /* ---------- Année dans le footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();

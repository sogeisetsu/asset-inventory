/* asset-inventory docs — shared language toggle + copy buttons.
   English is the default. Supported: en, zh, ja, ko, ru, ar, es.
   The choice is remembered in localStorage across pages.
   Arabic switches the document to RTL.

   Translations are grouped at runtime: consecutive same-tag/same-class siblings
   that each carry `data-lang` form one "slot". For each slot we show the chosen
   language, falling back to English when that language has no translation — so
   the frame stays in the chosen language while untranslated content shows in
   English instead of disappearing. */
(function () {
  var html = document.documentElement;
  var DEFAULT_LANG = 'en';
  var LANGS = ['en', 'zh', 'ja', 'ko', 'ru', 'ar', 'es'];
  var RTL = ['ar'];

  var parentSeq = 0;

  function signature(el) {
    var parent = el.parentNode;
    if (parent && parent.__i18nId === undefined) parent.__i18nId = (parentSeq += 1);
    return (parent ? parent.__i18nId : 0) + '|' + el.tagName + '|' + (el.className || '');
  }

  function markTranslations(lang) {
    var els = document.querySelectorAll('[data-lang]');
    var runs = [];
    for (var i = 0; i < els.length; i += 1) {
      var el = els[i];
      var sig = signature(el);
      var last = runs[runs.length - 1];
      if (last && last.sig === sig && last.lastEl.nextElementSibling === el) {
        last.els.push(el);
        last.lastEl = el;
      } else {
        runs.push({ sig: sig, els: [el], lastEl: el });
      }
    }
    for (var r = 0; r < runs.length; r += 1) {
      var group = runs[r].els;
      var pick = null;
      for (var a = 0; a < group.length; a += 1) {
        group[a].classList.remove('i18n-on');
        if (group[a].getAttribute('data-lang') === lang) pick = group[a];
      }
      if (!pick) {
        for (var b = 0; b < group.length; b += 1) {
          if (group[b].getAttribute('data-lang') === DEFAULT_LANG) { pick = group[b]; break; }
        }
      }
      if (!pick) pick = group[0];
      pick.classList.add('i18n-on');
    }
  }

  function apply(lang) {
    if (LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;
    html.setAttribute('data-show', lang);
    html.setAttribute('lang', lang);
    html.setAttribute('dir', RTL.indexOf(lang) !== -1 ? 'rtl' : 'ltr');
    LANGS.forEach(function (l) {
      var btn = document.getElementById('btn-' + l);
      if (btn) btn.setAttribute('aria-pressed', String(l === lang));
    });
    var t = document.body.getAttribute('data-title-' + lang)
      || document.body.getAttribute('data-title-' + DEFAULT_LANG);
    if (t) document.title = t;
    markTranslations(lang);
  }

  window.setLang = function (lang) {
    try { localStorage.setItem('lang', lang); } catch (e) {}
    apply(lang);
  };

  var saved = DEFAULT_LANG;
  try { saved = localStorage.getItem('lang') || DEFAULT_LANG; } catch (e) {}
  apply(saved);

  var COPIED = {
    en: 'Copied ✓', zh: '已复制 ✓', ja: 'コピーしました ✓', ko: '복사됨 ✓',
    ru: 'Скопировано ✓', ar: 'تم النسخ ✓', es: 'Copiado ✓'
  };
  document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-copy'));
      if (!el) return;
      var label = btn.textContent;
      var lang = html.getAttribute('data-show') || DEFAULT_LANG;
      navigator.clipboard.writeText(el.textContent.trim()).then(function () {
        btn.textContent = COPIED[lang] || COPIED.en;
        setTimeout(function () { btn.textContent = label; }, 1500);
      });
    });
  });
})();

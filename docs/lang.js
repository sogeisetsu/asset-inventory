/* asset-inventory docs — shared language toggle + copy buttons.
   English is the default. Supported: en, zh, ja, ko, ru, ar, es.
   The choice is remembered in localStorage across pages.
   Arabic switches the document to RTL. */
(function () {
  var html = document.documentElement;
  var DEFAULT_LANG = 'en';
  var LANGS = ['en', 'zh', 'ja', 'ko', 'ru', 'ar', 'es'];
  var RTL = ['ar'];

  function apply(lang) {
    if (LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;
    html.setAttribute('data-show', lang);
    html.setAttribute('lang', lang);
    html.setAttribute('dir', RTL.indexOf(lang) !== -1 ? 'rtl' : 'ltr');
    LANGS.forEach(function (l) {
      var btn = document.getElementById('btn-' + l);
      if (btn) btn.setAttribute('aria-pressed', String(l === lang));
    });
    var t = document.body.getAttribute('data-title-' + lang);
    if (t) document.title = t;
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

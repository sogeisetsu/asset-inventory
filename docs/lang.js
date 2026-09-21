/* asset-inventory docs — shared language toggle + copy buttons.
   English is the default; the user can switch to Chinese.
   The choice is remembered in localStorage across pages. */
(function () {
  var html = document.documentElement;
  var DEFAULT_LANG = 'en';

  function apply(lang) {
    html.setAttribute('data-show', lang);
    var zh = document.getElementById('btn-zh');
    var en = document.getElementById('btn-en');
    if (zh) zh.setAttribute('aria-pressed', String(lang === 'zh'));
    if (en) en.setAttribute('aria-pressed', String(lang === 'en'));
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

  document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-copy'));
      if (!el) return;
      var label = btn.textContent;
      // Feedback follows the active language, never a hardcoded string.
      var lang = html.getAttribute('data-show') || DEFAULT_LANG;
      var COPIED = { en: 'Copied ✓', zh: '已复制 ✓', ja: 'コピーしました ✓', ko: '복사됨 ✓', ru: 'Скопировано ✓', ar: 'تم النسخ ✓', es: 'Copiado ✓' };
      navigator.clipboard.writeText(el.textContent.trim()).then(function () {
        btn.textContent = COPIED[lang] || COPIED.en;
        setTimeout(function () { btn.textContent = label; }, 1500);
      });
    });
  });
})();

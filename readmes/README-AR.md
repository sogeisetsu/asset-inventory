<div align="center" dir="rtl">

<img src="../docs/assets/icon.svg" alt="asset-inventory icon" width="96" height="96">

# Asset Inventory

**اعرف بالضبط ما يمكن لبيئة OpenCode لديك استدعاؤه فعلاً — كل إضافة ومهارة وأمر وخادم MCP ووكيل وقدرة مضيفة، مع بيان المصدر.**

[![License: MIT](../docs/assets/badge-license.svg)](../LICENSE)
[![OpenCode Skill](../docs/assets/badge-opencode.svg)](#compatibility)

[English](../README.md) · [中文](../README-ZH.md) · [日本語](README-JA.md) · [한국어](README-KO.md) · [Русский](README-RU.md) · [العربية](README-AR.md) · [Español](README-ES.md)

<img src="../docs/assets/banner.svg" alt="asset-inventory banner" width="100%">

</div>

<div dir="rtl">

**asset-inventory** مهارة لـ OpenCode تجرد بيئتك في مرة واحدة — كل إضافة ومهارة وأمر وخادم MCP ووكيل وقدرة تطبيق خارجي على جهازك، مع **بيان المصدر** (من أين جاء). كل سطر يجيب عن ثلاثة أسئلة: **ما هو، ومن جاء به، وكيف يُستخدم**. 🎯

## 🚀 البدء السريع

```
/asset-inventory
```

ثبّت المهارة ثم استدعها — لا حاجة لأي إعداد. اكتب `/asset-inventory` (وفي TUI الخاص بـ OpenCode تجده أيضًا ضمن `/skills`)، أو اطلب بلغة طبيعية مثل «اعرض إضافاتي». أضف هدفًا لتغطية جزء فقط — `/asset-inventory mcp` أو `agents` أو `hosts` أو `skills` أو `diff` أو `usage` (يعمل أيضًا بعبارة طبيعية مثل «MCP فقط»). انظر [الأهداف](../docs/guides/how-it-works.md#targeting) لمعرفة ما يفحصه كل هدف وما يكتبه.

## 📦 التثبيت

> 🌍 **يُوصى بالتثبيت العام.** نسخة واحدة للتثبيت والتحديث، متاحة في كل مشروع.

```sh
git clone https://github.com/sogeisetsu/asset-inventory.git
cd asset-inventory
# انسخ SKILL.md و references/ فقط إلى مجلد skills
```

- **عام:** `~/.config/opencode/skills/asset-inventory/`
- **داخل المشروع:** `<project-root>/.opencode/skills/asset-inventory/`

### 🤖 التثبيت عبر الذكاء الاصطناعي

أرسل النص أدناه إلى الذكاء الاصطناعي وسيثبّته لك:

```
ثبّت مهارة OpenCode باسم "asset-inventory" من <https://github.com/sogeisetsu/asset-inventory>.

١. اسألني سؤالاً واحدًا فقط: التثبيت عامًّا أم داخل المشروع الحالي فقط.
٢. احصل على المستودع عبر `git clone https://github.com/sogeisetsu/asset-inventory.git` — إلزامي؛ لا تنتقل إلى تنزيل ZIP (قد يكون ZIP من صفحة Releases قديمًا).
٣. انسخ عنصرين تشغيليين فقط (SKILL.md و references/) إلى <target>/asset-inventory/ حيث إن <target> هو جذر skills:
   - <target> العام: ~/.config/opencode/skills/ (ويندوز: $env:USERPROFILE\.config\opencode\skills\)
   - <target> داخل المشروع: .opencode/skills/
   أنشئ <target>/asset-inventory/ إن لم يوجد. لا تنسخ README أو docs أو scripts.
٤. إن كان <target>/asset-inventory/ موجودًا فاستبدل محتواه (هذا تحديث)، ولا تسأل مرة ثانية.
٥. عند الانتهاء تحقق من وجود <target>/asset-inventory/SKILL.md واقرأ الإصدار من `metadata.version`.
٦. اعتبر المصدر للقراءة فقط ولا تعدّل أي محتوى. أبلغ فقط عن مسار التثبيت والإصدار.
```

📖 الخطوات الكاملة (كل الأنظمة) والتثبيت التلقائي بالذكاء الاصطناعي والتحديث ← **[التثبيت والتحديث](../docs/guides/install-and-update.md)**

## 📤 النواتج

```
your-project-root/
└── output/
    ├── inventory.md         # جرد من 7 جداول
    ├── usage-guide.md       # دليل «متى تستخدمه» حسب السيناريو والتكرار
    └── asset-inventory.json # صفوف مقروءة آليًا (المفتاح table + name)
```

👀 **أمثلة حقيقية:** 📄 [inventory.md](../docs/samples/inventory.md) · 🧭 [usage-guide.md](../docs/samples/usage-guide.md) · 🧾 [asset-inventory.json](../docs/samples/asset-inventory.json)

## ✨ المزايا

- 🧭 **تتبّع المصدر** — مدمج في OpenCode أو من إضافة أو من إنشائك أو محقون من التطبيق المضيف. المهارة التي تديرها إضافة تُنسب إلى الإضافة، لا تُوصف خطأً بـ«محلية».
- 🚦 **خمس حالات** — ✅متاح / ❌معطّل / 📦غير مثبّت / 🚫غير موجود / 🛑غير متاح
- 🔒 **قراءة فقط وإخفاء** — لا يغيّر أي إعداد، ويخفي المفاتيح والمسارات والأسماء الخاصة
- 🖥️ **واعٍ بالمضيف** — يفحص حزمة التطبيق ثنائيًا ليجد الأوامر المحقونة التي يفوتها grep
- 🔀 **وضع المقارنة** — الصق JSON السابق لتحصل على الإضافات والحذف فقط
- 🌐 **إخراج متعدد اللغات** — الناتج يتبع لغة المستخدم

## 📚 أدلة مفصّلة

| الدليل | المحتوى |
|---|---|
| 🧠 [كيف يعمل](../docs/guides/how-it-works.md) | الفكرة، الجداول السبعة، المصدر، الملفات الثلاثة |
| 📦 [التثبيت والتحديث](../docs/guides/install-and-update.md) | كل الأنظمة، التثبيت التلقائي، `update.ps1` |
| 🧭 [المستودع والمساهمة](../docs/guides/repository-and-contributing.md) | أي ملف تقرأ، البنية، المساهمة، الإصدارات |

## 🔗 روابط

- 🖥️ **صفحة الهبوط:** <https://sogeisetsu.github.io/asset-inventory/>
- 📝 **سجل التغييرات:** [CHANGELOG.md](../CHANGELOG.md)
- 🤝 **المساهمة:** [CONTRIBUTING.md](../CONTRIBUTING.md)

## ✅ التوافق

**النطاق: جُرّبت هذه المهارة في OpenCode فقط** (بما في ذلك التطبيقات التي تغلّف OpenCode مثل OpenChamber). لم تُجرّب في مساعدات برمجة أخرى (Claude Code، Cursor، Windsurf...).

تتطلب [OpenCode](https://opencode.ai) (تُحمّل المهارات عند الطلب عبر أداة `skill` الأصلية).

## 📄 الترخيص

MIT — راجع [LICENSE](../LICENSE).

</div>

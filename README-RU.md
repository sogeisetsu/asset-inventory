<div align="center">

<img src="assets/icon.svg" alt="asset-inventory icon" width="96" height="96">

# 🗃️ Asset Inventory

**Узнайте точно, что ваша среда OpenCode может реально вызвать — каждый плагин, навык, команда, MCP-сервер, агент и возможность хоста, с указанием происхождения.**

[![License: MIT](assets/badge-license.svg)](LICENSE)
[![OpenCode Skill](assets/badge-opencode.svg)](#compatibility)

[English](README.md) · [中文](README-ZH.md) · [日本語](README-JA.md) · [한국어](README-KO.md) · [Русский](README-RU.md) · [العربية](README-AR.md) · [Español](README-ES.md)

<img src="assets/banner.svg" alt="asset-inventory banner" width="100%">

</div>

**asset-inventory** — это навык OpenCode, который за один раз инвентаризует вашу среду: все плагины, навыки, команды, MCP-серверы, агенты и возможности внешнего приложения на этой машине, с **происхождением** (откуда пришло). Каждая строка отвечает на три вопроса: **что это, кто это принёс, как этим пользоваться**. 🎯

## 🚀 Быстрый старт

```
/asset-inventory
```

Установите навык и вызовите его. Настройка не требуется. Добавьте аргумент, чтобы охватить часть среды — `/asset-inventory mcp`, `agents`, `hosts`, `skills`, `diff`, `usage`.

## 📦 Установка

> 🌍 **Рекомендуется глобальная установка.** Одна копия для установки и обновления, доступна в любом проекте.

```sh
git clone https://github.com/sogeisetsu/asset-inventory.git
cd asset-inventory
# скопируйте только SKILL.md и references/ в каталог skills
```

- **Глобально:** `~/.config/opencode/skills/asset-inventory/`
- **В проект:** `<project-root>/.opencode/skills/asset-inventory/`

📖 Полные шаги (все платформы), автоустановка через ИИ и обновление → **[Установка и обновление](docs/guides/install-and-update.md)**

## 📤 Результат

```
your-project-root/
└── output/
    ├── inventory.md         # инвентаризация из 7 таблиц
    ├── usage-guide.md       # руководство «когда использовать» по сценариям и частоте
    └── asset-inventory.json # машиночитаемые строки (ключ table + name)
```

👀 **Реальные примеры:** 📄 [inventory.md](docs/samples/inventory.md) · 🧭 [usage-guide.md](docs/samples/usage-guide.md) · 🧾 [asset-inventory.json](docs/samples/asset-inventory.json)

## ✨ Особенности

- 🧭 **Прослеживаемость** — встроено в OpenCode, принесено плагином, создано вами или внедрено хостом. Навык, управляемый плагином, приписывается плагину, а не помечается как «локальный».
- 🚦 **Четыре состояния** — ✅доступно / ❌отключено / 📦только на полке / 🚫отсутствует
- 🔒 **Только чтение и маскирование** — не меняет конфиг; скрывает ключи, пути и приватные имена
- 🖥️ **Учёт хоста** — бинарный скан бандла приложения находит внедрённые команды, которые пропускает grep
- 🔀 **Режим diff** — вставьте прошлый JSON и получите только добавления и удаления
- 🌐 **Многоязычный вывод** — результат следует за языком пользователя

## 📚 Подробные руководства

| Руководство | Содержание |
|---|---|
| 🧠 [Как это работает](docs/guides/how-it-works.md) | Идея, 7 таблиц, происхождение, три файла |
| 📦 [Установка и обновление](docs/guides/install-and-update.md) | Все платформы, автоустановка ИИ, `update.ps1` |
| 🧭 [Репозиторий и участие](docs/guides/repository-and-contributing.md) | Что читать, структура, участие, версии |

## 🔗 Ссылки

- 🖥️ **Лендинг:** <https://sogeisetsu.github.io/asset-inventory/>
- 📝 **История изменений:** [CHANGELOG.md](CHANGELOG.md)
- 🤝 **Участие:** [CONTRIBUTING.md](CONTRIBUTING.md)

## ✅ Совместимость

**Область: навык проверен только в OpenCode** (включая внешние приложения, оборачивающие OpenCode, например OpenChamber). В других ИИ-ассистентах (Claude Code, Cursor, Windsurf и др.) он **не проверялся**.

Требуется [OpenCode](https://opencode.ai) (навыки загружаются по требованию через нативный инструмент `skill`).

## 📄 Лицензия

MIT — см. [LICENSE](LICENSE).

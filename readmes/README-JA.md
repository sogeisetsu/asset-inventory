<div align="center">

<img src="../docs/assets/icon.svg" alt="asset-inventory icon" width="96" height="96">

# Asset Inventory

**OpenCode 環境が実際に呼び出せるものを一目で — プラグイン、スキル、コマンド、MCP サーバー、エージェント、ホスト機能を、出所つきで。**

[![License: MIT](../docs/assets/badge-license.svg)](../LICENSE)
[![OpenCode Skill](../docs/assets/badge-opencode.svg)](#compatibility)

[English](../README.md) · [中文](../README-ZH.md) · [日本語](README-JA.md) · [한국어](README-KO.md) · [Русский](README-RU.md) · [العربية](README-AR.md) · [Español](README-ES.md)

<img src="../docs/assets/banner.svg" alt="asset-inventory banner" width="100%">

</div>

**asset-inventory** は OpenCode スキルで、環境を 1 回で棚卸しします — このマシンのすべてのプラグイン、スキル、コマンド、MCP サーバー、エージェント、外側アプリの機能を、**出所**（どこから来たか）つきで。各行は **何か・誰が持ち込んだか・どう使うか** の 3 問に答えます。🎯

## 🚀 クイックスタート

```
/asset-inventory
```

スキルを入れて呼び出すだけ。設定は不要です。`/asset-inventory` と入力する（OpenCode TUI では `/skills` セレクタからも選べます）、または自然言語で「プラグインを棚卸しして」と頼むだけ。対象を付ければ一部だけを棚卸しできます — `/asset-inventory mcp`、`agents`、`hosts`、`skills`、`diff`、`usage`（「MCP だけ」という自然言語でも可）。各対象が何を調べて何を書くかは[ターゲティング](../docs/guides/how-it-works.md#targeting)を参照。

## 📦 インストール

> 🌍 **グローバル推奨。** 1 つ入れて 1 つ更新すれば、どのプロジェクトでも使えます。

```sh
git clone https://github.com/sogeisetsu/asset-inventory.git
cd asset-inventory
# SKILL.md と references/ だけを skills ディレクトリへコピー
```

- **グローバル：** `~/.config/opencode/skills/asset-inventory/`
- **プロジェクト単位：** `<project-root>/.opencode/skills/asset-inventory/`

### 🤖 AI でインストール

下のテキストを AI に送れば、インストールしてくれます：

```
OpenCode スキル "asset-inventory" を <https://github.com/sogeisetsu/asset-inventory> からインストールしてください。

1. まず質問は 1 つだけ：グローバルに入れるか、今のプロジェクトだけか。
2. `git clone https://github.com/sogeisetsu/asset-inventory.git` でリポジトリを取得する——必須。ZIP ダウンロードへのフォールバックは不可（Releases ページの ZIP は古い可能性がある）。
3. 実行時に必要な 2 点（SKILL.md と references/）だけをコピー：
   - グローバル：~/.config/opencode/skills/asset-inventory/（Windows：$env:USERPROFILE\.config\opencode\skills\asset-inventory\）
   - プロジェクト単位：現在のプロジェクト内 .opencode/skills/asset-inventory/
   無ければ作成。README・docs・scripts はコピーしない。
4. 既に同名スキルがあれば上書き（更新）し、二度目は聞かない。
5. 完了後 <target>/asset-inventory/SKILL.md の存在を確認し、frontmatter の `metadata.version` を読む。
6. ソースは読み取り専用として扱い、内容を変更しない。報告はインストール先と版のみ。
```

📖 詳細手順（各プラットフォーム）・AI 自動インストール・更新 → **[インストールと更新](../docs/guides/install-and-update.md)**

## 📤 出力

```
your-project-root/
└── output/
    ├── inventory.md         # 7 表の棚卸し
    ├── usage-guide.md       # 場面と頻度で並べた「いつ使うか」ガイド
    └── asset-inventory.json # 機械可読な行（主キー table + name）
```

👀 **実例を見る：** 📄 [inventory.md](../docs/samples/inventory.md) · 🧭 [usage-guide.md](../docs/samples/usage-guide.md) · 🧾 [asset-inventory.json](../docs/samples/asset-inventory.json)

## ✨ 特長

- 🧭 **出所が追える** — OpenCode 組み込み、プラグイン提供、自作、外側アプリ注入。プラグイン管理のスキルはプラグインに帰属し、「ローカル」と誤記しません。
- 🚦 **5 状態ラベル** — ✅利用可 / ❌無効 / 📦未導入 / 🚫存在しない / 🛑利用不可
- 🔒 **読み取り専用・マスク** — 設定を変えず、鍵・パス・私有プロジェクト名を既定で伏せます
- 🖥️ **ホスト対応** — アプリのバンドルをバイナリ走査し、grep が拾えない注入コマンドを検出
- 🔀 **差分モード** — 前回の JSON を貼ると追加・削除だけを出力
- 🌐 **多言語出力** — 成果物はあなたの言語に従います

## 📚 詳細ガイド

| ガイド | 内容 |
|---|---|
| 🧠 [仕組み](../docs/guides/how-it-works.md) | 基本方針、7 表、出所、3 つの成果物 |
| 📦 [インストールと更新](../docs/guides/install-and-update.md) | 各プラットフォーム、AI 自動インストール、`update.ps1` |
| 🧭 [リポジトリと貢献](../docs/guides/repository-and-contributing.md) | 読むべきファイル、構成、貢献、バージョン規則 |

## 🔗 リンク

- 🖥️ **ランディングページ：** <https://sogeisetsu.github.io/asset-inventory/>
- 📝 **変更履歴：** [CHANGELOG.md](../CHANGELOG.md)
- 🤝 **貢献：** [CONTRIBUTING.md](../CONTRIBUTING.md)

## ✅ 互換性

**範囲：本スキルは OpenCode でのみ検証済み**（OpenCode を包む外側アプリ、例：OpenChamber を含む）。他の AI コーディングアシスタント（Claude Code、Cursor、Windsurf 等）では**未検証**です。

[OpenCode](https://opencode.ai) が必要です（スキルはネイティブの `skill` ツールでオンデマンドに読み込まれます）。

## 📄 ライセンス

MIT — [LICENSE](../LICENSE) を参照。

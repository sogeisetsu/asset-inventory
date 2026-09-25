<div align="center">

<img src="../docs/assets/icon.svg" alt="asset-inventory icon" width="96" height="96">

# Asset Inventory

**OpenCode 환경이 실제로 호출할 수 있는 것을 한눈에 — 모든 플러그인, 스킬, 명령, MCP 서버, 에이전트, 호스트 기능을 출처와 함께.**

[![License: MIT](../docs/assets/badge-license.svg)](../LICENSE)
[![OpenCode Skill](../docs/assets/badge-opencode.svg)](#compatibility)

[English](../README.md) · [中文](../README-ZH.md) · [日本語](README-JA.md) · [한국어](README-KO.md) · [Русский](README-RU.md) · [العربية](README-AR.md) · [Español](README-ES.md)

<img src="../docs/assets/banner.svg" alt="asset-inventory banner" width="100%">

</div>

**asset-inventory**는 OpenCode 스킬로, 환경을 한 번에 점검합니다 — 이 머신의 모든 플러그인, 스킬, 명령, MCP 서버, 에이전트, 외부 앱 기능을 **출처**(어디서 왔는지)와 함께. 각 행은 **무엇인지 · 누가 가져왔는지 · 어떻게 쓰는지** 세 가지에 답합니다. 🎯

## 🚀 빠른 시작

```
/asset-inventory
```

스킬을 설치하고 호출하면 끝. 설정이 필요 없습니다. `/asset-inventory`를 입력하거나(OpenCode TUI에서는 `/skills` 선택기에서 고를 수도 있음), 자연스럽게 "내 플러그인을 점검해줘"라고 말하면 됩니다. 대상을 붙이면 일부만 점검합니다 — `/asset-inventory mcp`, `agents`, `hosts`, `skills`, `diff`, `usage`("MCP만" 같은 자연 언어도 가능). 각 대상이 무엇을 점검하고 무엇을 쓰는지는[대상 지정](../docs/guides/how-it-works.md#targeting)을 참조하세요.

## 📦 설치

> 🌍 **전역 설치 권장.** 한 번 설치하고 한 번만 업데이트하면 어느 프로젝트에서나 쓸 수 있습니다.

```sh
git clone https://github.com/sogeisetsu/asset-inventory.git
cd asset-inventory
# SKILL.md와 references/만 skills 디렉터리로 복사
```

- **전역:** `~/.config/opencode/skills/asset-inventory/`
- **프로젝트:** `<project-root>/.opencode/skills/asset-inventory/`

### 🤖 AI로 설치

아래 텍스트를 AI에게 보내면 설치해 줍니다:

```
OpenCode 스킬 "asset-inventory"를 <https://github.com/sogeisetsu/asset-inventory> 에서 설치해 주세요.

1. 먼저 한 가지만 물어보세요: 전역 설치인지, 현재 프로젝트에만 설치인지.
2. `git clone https://github.com/sogeisetsu/asset-inventory.git` 으로 저장소를 확보 — 필수이며 ZIP 다운로드로 대체하지 말 것(Releases 페이지의 ZIP은 구버전일 수 있음).
3. 런타임 항목 두 개(SKILL.md와 references/)만 <target>/asset-inventory/ 에 복사. <target>은 skills 루트:
   - 전역 <target>: ~/.config/opencode/skills/ (Windows: $env:USERPROFILE\.config\opencode\skills\)
   - 프로젝트 <target>: 현재 프로젝트의 .opencode/skills/
   <target>/asset-inventory/ 가 없으면 생성. README·docs·scripts는 복사하지 않음.
4. <target>/asset-inventory/ 에 같은 스킬이 이미 있으면 덮어쓰기(업데이트)하고 두 번 묻지 않음.
5. 완료 후 <target>/asset-inventory/SKILL.md 존재를 확인하고 frontmatter의 `metadata.version`을 읽음.
6. 소스는 읽기 전용으로 취급하고 내용을 수정하지 않음. 보고는 설치 위치와 버전만.
```

📖 전체 단계(모든 플랫폼) · AI 자동 설치 · 업데이트 → **[설치 및 업데이트](../docs/guides/install-and-update.md)**

## 📤 산출물

```
your-project-root/
└── output/
    ├── inventory.md         # 7개 표 인벤토리
    ├── usage-guide.md       # 상황·빈도별 "언제 쓰는가" 안내
    └── asset-inventory.json # 기계가 읽는 행(기본 키 table + name)
```

👀 **실제 예시 보기:** 📄 [inventory.md](../docs/samples/inventory.md) · 🧭 [usage-guide.md](../docs/samples/usage-guide.md) · 🧾 [asset-inventory.json](../docs/samples/asset-inventory.json)

## ✨ 특징

- 🧭 **출처 추적** — OpenCode 내장, 플러그인 제공, 직접 작성, 호스트 주입. 플러그인 관리 스킬은 플러그인에 귀속되며 "로컬"로 오표기하지 않습니다.
- 🚦 **5가지 상태** — ✅사용 가능 / ❌비활성 / 📦미설치 / 🚫없음 / 🛑사용 불가
- 🔒 **읽기 전용·마스킹** — 설정을 바꾸지 않고 키·경로·비공개 프로젝트명을 가립니다
- 🖥️ **호스트 인식** — 앱 번들을 바이너리 스캔해 일반 grep이 놓치는 주입 명령을 찾습니다
- 🔀 **Diff 모드** — 이전 JSON을 붙이면 추가·삭제만 출력
- 🌐 **다국어 출력** — 산출물이 사용자의 언어를 따릅니다

## 📚 상세 가이드

| 가이드 | 내용 |
|---|---|
| 🧠 [작동 방식](../docs/guides/how-it-works.md) | 핵심 사상, 7개 표, 출처, 세 가지 산출물 |
| 📦 [설치 및 업데이트](../docs/guides/install-and-update.md) | 모든 플랫폼, AI 자동 설치, `update.ps1` |
| 🧭 [저장소와 기여](../docs/guides/repository-and-contributing.md) | 읽을 파일, 구조, 기여, 버전 규칙 |

## 🔗 링크

- 🖥️ **랜딩 페이지:** <https://sogeisetsu.github.io/asset-inventory/>
- 📝 **변경 이력:** [CHANGELOG.md](../CHANGELOG.md)
- 🤝 **기여:** [CONTRIBUTING.md](../CONTRIBUTING.md)

## ✅ 호환성

**범위: 이 스킬은 OpenCode에서만 검증되었습니다**(OpenCode를 감싸는 외부 앱, 예: OpenChamber 포함). 다른 AI 코딩 어시스턴트(Claude Code, Cursor, Windsurf 등)에서는 **검증되지 않았습니다**.

[OpenCode](https://opencode.ai)가 필요합니다(스킬은 네이티브 `skill` 도구로 필요할 때 로드됩니다).

## 📄 라이선스

MIT — [LICENSE](../LICENSE) 참조.

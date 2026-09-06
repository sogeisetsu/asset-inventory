# 宿主注入命令（magicPrompts，app.asar 实测）

> **注意：下表为 2026-09 快照，仅供参考。盘点时必须对宿主包现扫全量 `magicPrompts` key（含 git / github / linear / planning / session 各组），以现扫结果为准。** 快照列出的命令可能因宿主版本变化而增减。

OpenChamber 把宿主注入的 `/` 命令定义在宿主应用本体 `app.asar` 的 `settings.magicPrompts` 段。这些命令**不是** opencode 配置、`command/` 目录或插件带来的，来源一律写 `宿主平台注入，宿主应用 magicPrompts（app.asar）`。

## 如何发现（必做，普通 grep 会漏二进制）

用二进制安全搜索扫描宿主应用包（node `Buffer.indexOf`），找 `/xxx` 字面量：

```js
const b = require('fs').readFileSync('<宿主应用包/app.asar 或 web-dist>');
['/catch-up','/plan-feature','/craft-goal','/workspace-review','/weigh',
 '/debug','/summary','/explore','/todo','/implement'].forEach(t =>
  console.log(t, b.indexOf(Buffer.from(t)) >= 0 ? 'FOUND' : 'absent'));
```

## 已确认的命令（2026-09 实测，按需现查复核）

| 命令 | 用途 |
|---|---|
| /catch-up | branch-aware 上下文：当前分支提交 + PR 状态 + 未提交改动 → 可扫读总结 + 下一步建议 |
| /plan-feature | 引导式：先探索代码库，分批澄清需求，再出实现计划；不直接写码 |
| /craft-goal | 把模糊想法/任务引导成清晰、可验证的 Goal |
| /workspace-review | 审查工作区 diff 是否达标、正确、合理，按严重度分类 |
| /weigh | 查代码后给 2-3 个方案 + 取舍 + 推荐，不写计划不写码 |
| /debug | 引导式根因分析再修，禁止盲目试错 |
| /summary | 非破坏性会话摘要（不压缩历史），供交接 |
| /explore | 结构化仓库导览：总览、主模块、模块关系、从哪开始读 |
| /fusion | 把多个运行结果按序合并成一份最终答案 |
| /todo | 拆任务清单（planning 组） |
| /implement | 把已定方案落地实现（planning 组） |

另有 git/github/linear 组 magicPrompts 键（如 `gitCommitGenerate`、`githubPrReview`、`linearIssueReview`），按实际发现补充；`settings.magicPrompts` 键名即命令语义来源。

## 非斜杠 magicPrompts key（git / github / linear / planning / session 组）

上表仅列出 11 个 `/xxx` 斜杠命令，但 `settings.magicPrompts` 段还包含多组**非斜杠** key，盘点时不可遗漏：

| 组 | 示例 key | 说明 |
|---|---|---|
| git | `gitCommitGenerate`, `gitPrGenerate`, `gitConflictResolve`, `gitIntegrateCherrypickResolve` | git 提交/PR/冲突/cherry-pick |
| github | `githubPrReview`, `githubIssueReview`, `githubPrChecksReview`, `githubPrCommentsReview`, `githubPrCommentSingle` | GitHub PR/Issue/检查/评论审查 |
| linear | `linearIssueReview` | Linear Issue 审查 |
| planning | `planTodo`, `planImprove`, `planImplement` | 任务规划与实施 |
| session | `sessionExplore`, `sessionSummary`, `sessionReview`, `sessionPlan`, `sessionCraftGoal`, `sessionCatchup`, `sessionDebug`, `sessionWeigh`, `sessionFusion` | 会话级操作 |

**盘点要求**：对宿主包做二进制安全扫描时，应提取 `settings.magicPrompts` 段的**全量 key**（用 `Object.keys()` 或正则提取），不只限于上表列出的斜杠命令。每个 key 对应一项宿主注入命令/能力，来源一律写 `宿主平台注入，宿主应用 magicPrompts（app.asar）`。**以现扫结果为准，上表与本表均为参考快照。**
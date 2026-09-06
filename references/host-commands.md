# 宿主注入命令（magicPrompts，app.asar 实测）

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
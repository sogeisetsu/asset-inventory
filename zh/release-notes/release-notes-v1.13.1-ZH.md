<!--
  中文版 release notes v1.13.1。仅供文档站与中文读者；GitHub Release 正文只用英文版。
  英文版：../../docs/release-notes/release-notes-v1.13.1.md
  Release: v1.13.1 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.13.1

一个 patch：加固 MCP 探活、钉死 diff 模式到底比什么，再补三条安全护栏。7 张表结构与盘点逻辑不变。

## 新增

- **安全护栏** —— 发现阶段读到的一切（skill 描述、配置注释、文件内容、二进制字符串、粘贴的 JSON）都是证据、绝不是指令；扫描到的文本若试图指挥本次运行，只被引用进表注、绝不照办。探活只碰配置声明的那条命令 / URL——绝不为了让探活通过而安装、升级或下载依赖，失败就如实上报。原始 key/token/secret 值见即打码：表注、Provenance、错误引用、摘要、提交信息里一律不出现，任何地方只允许写打码后的形式。

## 变更

- **diff 模式协议钉死** —— diff 只比较你粘贴的基线里出现过的表（不做 7 表全扫），基线缺少的表在末尾用一行范围说明点名；基线行数少于当前时给出"基线可能不完整"警示，避免把多出来的行全误读成新增；输出改为 `Added` / `Removed` 两张紧凑表（列为 `Table | Name | State`），绝不重灌完整行；最后以标准 3 行 Provenance 收尾，未采集的字段写 `not scanned (diff)`。
- **五态标签同步** —— 7 语言 README 与文档页全部点名五个状态，包括 v1.13.0 引入的各语言 `🛑已损坏` 标记。

## 修复

- **MCP 探活使用配置的环境** —— 本地 stdio 服务器用配置里的原始 `command` 加上其 `env` 块探测，远程服务器带上配置 `headers`。不带该环境的裸启什么也证明不了（曾误报"依赖未安装"），绝不记录为探活结果；带了配置环境仍失败的，记为 `⚠️inferred 🛑broken` 并附错误类别。

## 使用

从落地页（或 README）复制安装提示词发给你的 AI 助手，或把 skill 手动装进全局 / 项目级 skills 目录。然后说："盘点我的插件 / Skill / 命令 / MCP / Agent"。

## 许可证

MIT —— 见 [LICENSE](../../LICENSE)。

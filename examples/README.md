# 使用示例（Examples）

本目录演示 **dsh-skill-mcp-panel** 支持的两种技能文件格式，供你参考或直接拿来试手。

## 两种格式怎么选

| 格式 | 结构 | 适用场景 | 添加命令 |
|---|---|---|---|
| 单文件 | `<名字>.md` | 简单的纯指令技能 | `dsh-panel skill add <路径>/<名字>.md` |
| 目录束 | `<名字>/SKILL.md` | 需要附带 references/scripts/assets 等资源 | `dsh-panel skill add <路径>/<名字>` |

两种格式的最小内容如下，可照抄到任意位置后添加。

**单文件**（`hello-skill-file.md`）：

```markdown
---
name: hello-skill-file
description: 一句话说明这个技能做什么、什么时候用
---

# Hello Skill File

在这里写技能正文（模型的指令）。
```

**目录束**（`hello-skill/SKILL.md`）：

```markdown
---
name: hello-skill
description: 一句话说明这个技能做什么、什么时候用
---

# Hello Skill

正文放在 SKILL.md；同目录下的 references/、scripts/、assets/ 会随技能一起被加载。
```

## 试手步骤

```bash
# 1. 添加目录束（<路径> 换成你放了 hello-skill/SKILL.md 的目录）
dsh-panel skill add <路径>/hello-skill

# 2. 添加单文件
dsh-panel skill add <路径>/hello-skill-file.md

# 3. 确认都注册成功（输出含状态、名字、来源与「全局 / 工作区」）
dsh-panel skill list

# 4. 玩够了删掉（需确认；加 --yes 跳过）
dsh-panel skill delete hello-skill
dsh-panel skill delete hello-skill-file
```

> 提示：不合规的文件（缺少 frontmatter、`name` 不是 kebab-case 等）会被拒绝并提示原因，可以故意改坏一个试试报错效果。
>
> `dsh-panel skill add` 默认添加到全局（`~/.dsh/skills`）；加 `--project` 放到当前项目根，或加 `--workspace <路径>` 指定工作区。若同名技能存在于多个作用域，`delete` / `enable` / `disable` 会要求用 `--global` / `--project` / `--workspace <路径>` 指明一个。

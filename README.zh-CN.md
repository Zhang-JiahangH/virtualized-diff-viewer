# react-virtualized-diff

为大文件而生的 React 虚拟化 diff 组件。

## 快速了解

- ⚡ **核心目标：** 面向 `10k+` 行大文件，保持渲染与滚动流畅。
- 🧩 **典型场景：** PR/MR 代码审查页嵌入、长列表 diff 页面、内部审查系统。
- 🧭 **定位细节：** [docs/positioning.md](./docs/positioning.md)。

## 产品定位

目标场景：超大文件（如 10k+ 行）、长列表滚动场景，以及代码审查页面（PR/MR Diff）嵌入，重点解决首屏渲染与滚动流畅度问题。

| 方案 | 性能（大文件） | 包体积 | 可定制性 | React 生态集成成本 |
| --- | --- | --- | --- | --- |
| `react-virtualized-diff` | 高（虚拟化渲染，适合 10k+ 行） | 中等偏小（聚焦 diff 核心能力） | 高（样式槽位、渲染器、交互回调） | 低（原生 React 组件 + TypeScript 友好） |
| 传统非虚拟化 diff 组件 | 中-低（大文件容易卡顿） | 中等 | 中（扩展点有限） | 低（接入快，但大文件需额外优化） |
| 自研 diff + 列表虚拟化方案 | 取决于实现（理论可高） | 不确定（常随业务膨胀） | 高（完全可控） | 高（开发与维护成本高） |

面向**大体量文本/代码文件**的高性能 React Diff 组件（虚拟滚动渲染）。

- 📦 npm：[`react-virtualized-diff`](https://www.npmjs.com/package/react-virtualized-diff)
- 🌐 在线 Demo：https://www.zhangjiahang.com/react-virtualized-diff
- 📊 Benchmark 报告：[benchmark-results/results.md](./benchmark-results/results.md)
- 🇬🇧 English README：[README.md](./README.md)
- 🧭 定位文档：[docs/positioning.md](./docs/positioning.md)

## 示例
![20260408-024125](https://github.com/user-attachments/assets/5345cbe4-04b1-4cfd-bcba-a68fcd7e82aa)

## 为什么做这个库

很多 diff 组件在小文件场景表现不错，但在 `10k+` 行后会出现明显卡顿。

`react-virtualized-diff` 重点是：

- **虚拟化渲染**，优先保证大文件性能
- **左右并排视图**，提升代码审阅效率
- **可折叠未变更区块**，支持上下文行配置
- **TypeScript 友好**，接入稳定

## 安装

```bash
pnpm add react-virtualized-diff
# 或 npm i react-virtualized-diff
# 或 yarn add react-virtualized-diff
```

## 快速开始

```tsx
import { SimpleDiffViewer } from 'react-virtualized-diff';

const original = `line 1\nline 2\nline 3`;
const modified = `line 1\nline 2 changed\nline 3\nline 4`;

export function App() {
  return (
    <SimpleDiffViewer
      original={original}
      modified={modified}
      contextLines={2}
      height={480}
    />
  );
}
```

## API

API 分层说明文档：[docs/api-tiering.md](./docs/api-tiering.md)。

### `SimpleDiffViewer`（推荐，覆盖 80% 场景）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `original` | `string` | - | 原始文本（左侧） |
| `modified` | `string` | - | 修改后文本（右侧） |
| `height` | `number \| string` | `500` | 虚拟列表可视区域高度 |
| `splitView` | `boolean` | `true` | `true` 为左右并排，`false` 为统一视图 |
| `showDiffOnly` | `boolean` | `true` | 仅展示变更块并折叠未变更区块 |
| `contextLines` | `number` | `2` | 每个变更块周围保留的未变更行数 |
| `hideLineNumbers` | `boolean` | `false` | 是否隐藏行号列 |
| `useDarkTheme` | `boolean` | `false` | 内置暗色主题 |
| `locale` | `DiffViewerLocale` | - | 组件文案本地化 |

### `DiffViewer` / `AdvancedDiffViewer`（高级定制）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `original` | `string` | - | 原始文本（新 API） |
| `modified` | `string` | - | 修改后文本（新 API） |
| `oldValue` | `string` | - | 兼容 API：等同 `original` |
| `newValue` | `string` | - | 兼容 API：等同 `modified` |
| `splitView` | `boolean` | `true` | `true` 为左右并排，`false` 为统一视图 |
| `showDiffOnly` | `boolean` | `true` | 仅展示变更块并折叠未变更区块 |
| `contextLines` | `number` | `2` | 每个变更块周围保留的未变更行数 |
| `extraLinesSurroundingDiff` | `number` | - | 兼容 API：`contextLines` 别名 |
| `hideLineNumbers` | `boolean` | `false` | 是否隐藏行号列 |
| `highlightLines` | `Array<'L-n' \| 'R-n' \| range>` | - | 高亮指定行（如 `L-3`、`R-5`、`L-10-15`） |
| `onLineNumberClick` | `(lineId) => void` | - | 点击行号回调 |
| `renderContent` | `(line: string) => ReactNode` | - | 自定义行内容渲染（语法高亮等） |
| `compareMethod` | `"CHARS" \| "WORDS" \| "WORDS_WITH_SPACE" \| "LINES" \| "TRIMMED_LINES" \| "SENTENCES" \| "CSS"` | `"LINES"` | Diff 比较策略 |
| `disableWordDiff` | `boolean` | `false` | 关闭词级高亮 |
| `leftTitle` | `ReactNode` | - | 左侧标题（并排模式） |
| `rightTitle` | `ReactNode` | - | 右侧标题（并排模式） |
| `linesOffset` | `number` | `0` | 行号显示偏移量 |
| `useDarkTheme` | `boolean` | `false` | 内置暗色主题 |
| `styles` | `Partial<DiffViewerStyles>` | - | 样式槽位覆盖 |
| `codeFoldMessageRenderer` | `({ hiddenCount, expanded }) => ReactNode` | - | 自定义折叠按钮文案渲染 |
| `height` | `number \| string` | `500` | 虚拟列表可视区域高度 |
| `locale` | `DiffViewerLocale` | - | 组件文案本地化 |
| `language` | `string` | - | 预留字段（未来语言相关扩展） |

### `DiffViewerLocale`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `collapse` | `string` | “收起”按钮文案 |
| `showMoreLines` | `(count: number) => string` | “展开隐藏行”文案生成函数 |

## Benchmark（性能基准）

内置 benchmark 对比：

- `react-virtualized-diff`
- `react-diff-viewer`
- `react-diff-viewer-continued`
- `react-diff-view`

数据规模：`1k / 10k / 50k / 100k` 行。

观测指标：

- FPS（自动滚动过程）
- 首次渲染时间
- 内存占用（`usedJSHeapSize`）

最新结果亮点（`2026-04-08T06:45:43.686Z`）：

- `10k` 行（`react-virtualized-diff`）：`60.8 FPS`，首渲染 `127.0 ms`，内存 `9.5 MB`。
- `50k/100k` 行：`react-diff-viewer` 与 `react-diff-viewer-continued` 均超时（单 case 超时 `60000 ms`）。
- `100k` 行：本库 `104.0 MB`，`react-diff-view` 为 `1297.0 MB`。

运行方式：

```bash
pnpm install
pnpm benchmark
```

## Demo

- 在线体验：https://www.zhangjiahang.com/react-virtualized-diff
- 本地运行：

```bash
pnpm install
pnpm dev
```

## 仓库结构

```text
apps/demo/       # Vite 演示应用
apps/benchmark/  # benchmark 应用
packages/react/  # npm 包源码
```

## 版本记录

详见 [CHANGELOG.md](./CHANGELOG.md)。

## License

MIT

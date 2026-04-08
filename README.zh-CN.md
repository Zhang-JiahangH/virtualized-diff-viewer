# react-virtualized-diff

面向**大体量文本/代码文件**的高性能 React Diff 组件（虚拟滚动渲染）。

- 📦 npm：[`react-virtualized-diff`](https://www.npmjs.com/package/react-virtualized-diff)
- 🌐 在线 Demo：https://www.zhangjiahang.com/react-virtualized-diff
- 📊 Benchmark 报告：[benchmark-results/results.md](./benchmark-results/results.md)
- 🇬🇧 English README：[README.md](./README.md)

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
import { DiffViewer } from 'react-virtualized-diff';

const original = `line 1\nline 2\nline 3`;
const modified = `line 1\nline 2 changed\nline 3\nline 4`;

export function App() {
  return (
    <DiffViewer
      original={original}
      modified={modified}
      contextLines={2}
      height={480}
    />
  );
}
```

## API

### `DiffViewer`

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `original` | `string` | - | 原始文本 |
| `modified` | `string` | - | 修改后文本 |
| `contextLines` | `number` | `2` | 每个变更块周围保留的未变更行数 |
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

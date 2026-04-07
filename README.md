# react-virtualized-diff

High-performance React diff viewer for **large text/code files** with virtualized rendering.

- 📦 npm: [`react-virtualized-diff`](https://www.npmjs.com/package/react-virtualized-diff)
- 🌐 Live Demo: https://www.zhangjiahang.com/react-virtualized-diff
- 📊 Benchmark report: [benchmark-results/results.md](./benchmark-results/results.md)
- 🇨🇳 中文文档: [README.zh-CN.md](./README.zh-CN.md)

## Why react-virtualized-diff

Most diff components are smooth for small files, but degrade heavily with 10k+ lines.

`react-virtualized-diff` is built for:

- **Virtualized rendering** for big-file performance
- **Side-by-side layout** for easy review
- **Collapsed unchanged blocks** with configurable context
- **TypeScript support** for predictable integration

## Installation

```bash
pnpm add react-virtualized-diff
# or npm i react-virtualized-diff
# or yarn add react-virtualized-diff
```

## Quick Start

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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `original` | `string` | - | Original text content |
| `modified` | `string` | - | Modified text content |
| `contextLines` | `number` | `2` | Number of unchanged lines kept around diff hunks |
| `height` | `number \| string` | `500` | Viewport height of the virtual list |
| `locale` | `DiffViewerLocale` | - | UI text localization |
| `language` | `string` | - | Reserved field for future language-related extensions |

### `DiffViewerLocale`

| Field | Type | Description |
| --- | --- | --- |
| `collapse` | `string` | Label for collapse button |
| `showMoreLines` | `(count: number) => string` | Label factory for “show hidden lines” |

## Benchmark

Included benchmark compares:

- `react-virtualized-diff`
- `react-diff-viewer`
- `react-diff-viewer-continued`
- `react-diff-view`

Dataset sizes: `1k / 10k / 50k / 100k` lines.

Metrics:

- FPS (during auto-scroll)
- initial render time
- memory usage (`usedJSHeapSize`)

Quick highlights from latest report:

- At `10k` lines: ~`60 FPS`, `187.2 ms` initial render, `9.5 MB` memory.
- At `50k/100k` lines: `react-diff-viewer` and `react-diff-viewer-continued` timeout.
- At `100k` lines: `141.1 MB` (`react-virtualized-diff`) vs `1297.0 MB` (`react-diff-view`).

Run benchmark:

```bash
pnpm install
pnpm benchmark
```

## Demo

- Hosted demo page: https://www.zhangjiahang.com/react-virtualized-diff
- Local demo:

```bash
pnpm install
pnpm dev
```

## Monorepo Structure

```text
apps/demo/       # Vite demo app
apps/benchmark/  # benchmark app
packages/react/  # npm package source
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT

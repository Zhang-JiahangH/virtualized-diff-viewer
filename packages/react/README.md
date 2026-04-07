# react-virtualized-diff

High-performance React diff viewer with virtualization for large text/code files.

- Demo: https://www.zhangjiahang.com/react-virtualized-diff
- Changelog: https://github.com/Zhang-JiahangH/react-virtualized-diff/blob/main/CHANGELOG.md
- Benchmark: https://github.com/Zhang-JiahangH/react-virtualized-diff/blob/main/benchmark-results/results.md

## Install

```bash
pnpm add react-virtualized-diff
# or npm i react-virtualized-diff
# or yarn add react-virtualized-diff
```

## Usage

```tsx
import { DiffViewer } from 'react-virtualized-diff';

export function App() {
  return (
    <DiffViewer
      original={'line 1\nline 2'}
      modified={'line 1\nline 2 changed'}
      contextLines={2}
      height={500}
    />
  );
}
```

## API

### `DiffViewer` props

- `original: string`
- `modified: string`
- `contextLines?: number` (default `2`)
- `height?: number | string` (default `500`)
- `locale?: DiffViewerLocale`
- `language?: string` (reserved for future use)

### `DiffViewerLocale`

- `collapse?: string`
- `showMoreLines?: (count: number) => string`

## License

MIT

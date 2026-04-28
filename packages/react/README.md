# react-virtualized-diff

High-performance React diff viewer with virtualization for large text/code files.

## At a glance

- Built for large files (`10k+` lines) and long diff lists.
- Designed for embedded code review UIs (PR/MR pages), internal review systems, and IDE plugin frontends.
- Positioning & personas: https://github.com/Zhang-JiahangH/react-virtualized-diff/blob/main/docs/positioning.md

## Positioning

| Option | Performance (large files) | Bundle size | Customizability | React integration cost |
| --- | --- | --- | --- | --- |
| `react-virtualized-diff` | High (virtualized rendering) | Small-to-medium | High | Low |
| Traditional non-virtualized diff components | Medium-to-low | Medium | Medium | Low |
| In-house diff + virtualization | Depends on implementation | Uncertain | High | High |

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
import { SimpleDiffViewer } from 'react-virtualized-diff';

export function App() {
  return (
    <SimpleDiffViewer
      original={'line 1\nline 2'}
      modified={'line 1\nline 2 changed'}
      contextLines={2}
      height={500}
    />
  );
}
```

## API

### `SimpleDiffViewer` props (recommended for 80% of cases)

- `original: string`
- `modified: string`
- `height?: number | string` (default `500`)
- `splitView?: boolean` (default `true`)
- `showDiffOnly?: boolean` (default `true`)
- `contextLines?: number` (default `2`)
- `hideLineNumbers?: boolean` (default `false`)
- `useDarkTheme?: boolean` (default `false`)
- `locale?: DiffViewerLocale`

### `DiffViewer` / `AdvancedDiffViewer` props

- `original?: string`
- `modified?: string`
- `oldValue?: string` (compatibility API)
- `newValue?: string` (compatibility API)
- `splitView?: boolean` (default `true`)
- `showDiffOnly?: boolean` (default `true`)
- `contextLines?: number` (default `2`)
- `extraLinesSurroundingDiff?: number` (compatibility alias)
- `hideLineNumbers?: boolean` (default `false`)
- `highlightLines?: Array<'L-n' | 'R-n' | range>`
- `onLineNumberClick?: (lineId) => void`
- `renderContent?: (line: string) => ReactNode`
- `compareMethod?: "CHARS" | "WORDS" | "WORDS_WITH_SPACE" | "LINES" | "TRIMMED_LINES" | "SENTENCES" | "CSS"`
- `disableWordDiff?: boolean`
- `leftTitle?: ReactNode`
- `rightTitle?: ReactNode`
- `linesOffset?: number` (default `0`)
- `useDarkTheme?: boolean`
- `styles?: Partial<DiffViewerStyles>`
- `codeFoldMessageRenderer?: ({ hiddenCount, expanded }) => ReactNode`
- `ref?.resetCodeBlocks(): void`
- `height?: number | string` (default `500`)
- `locale?: DiffViewerLocale`
- `language?: string` (reserved for future use)

### `DiffViewerLocale`

- `collapse?: string`
- `showMoreLines?: (count: number) => string`

## License

MIT

# API Tiering Guide

This document groups `react-virtualized-diff` APIs into usage tiers so teams can pick the right abstraction level quickly.

## Tier 1: Minimal API (`SimpleDiffViewer`)

**Best for**

- Product teams that need a reliable diff view fast.
- Typical PR/MR preview pages.
- Apps where defaults are good enough and maintainability matters more than customization.

**Use this when**

- You only need to pass two texts and a few basic display options.
- You want the smallest cognitive load for contributors.

**Primary API**

- `original`
- `modified`
- `height`
- `splitView`
- `showDiffOnly`
- `contextLines`
- `hideLineNumbers`
- `useDarkTheme`
- `locale`

### Minimal example 1: 基础对比

```tsx
import { SimpleDiffViewer } from 'react-virtualized-diff';

export function BasicDiffExample() {
  return (
    <SimpleDiffViewer
      original={'line 1\nline 2\nline 3'}
      modified={'line 1\nline 2 changed\nline 3'}
      height={360}
    />
  );
}
```

### Minimal example 2: 大文件虚拟化

```tsx
import { SimpleDiffViewer } from 'react-virtualized-diff';

function buildLargeText(size: number, changedAt: number) {
  return Array.from({ length: size }, (_, i) =>
    i === changedAt ? `line ${i + 1} (changed)` : `line ${i + 1}`,
  ).join('\n');
}

export function VirtualizedLargeFileExample() {
  const original = buildLargeText(50000, -1);
  const modified = buildLargeText(50000, 24567);

  return (
    <SimpleDiffViewer
      original={original}
      modified={modified}
      height={640}
      contextLines={1}
      showDiffOnly
    />
  );
}
```

## Tier 2: Advanced API (`DiffViewer` / `AdvancedDiffViewer`)

**Best for**

- Code review platforms with domain-specific behaviors.
- Teams needing tight design-system integration.
- Scenarios requiring interaction hooks and custom rendering.

**Use this when**

- You need custom line rendering (syntax highlighting, inline widgets).
- You need line-number gutter interactions.
- You need custom fold/collapse messaging or styling.

**Primary advanced extension points**

- 自定义行渲染: `renderContent`
- 语法高亮集成: `renderContent`
- 行号 gutter 交互: `onLineNumberClick`, `highlightLines`, `linesOffset`
- 折叠策略: `showDiffOnly`, `contextLines`, `extraLinesSurroundingDiff`, `codeFoldMessageRenderer`
- 深度样式定制: `styles`, `useDarkTheme`

### Minimal example 3: 可评论行组件嵌入

```tsx
import { DiffViewer } from 'react-virtualized-diff';

function CommentableLine({ line }: { line: string }) {
  return (
    <span style={{ display: 'inline-flex', gap: 8 }}>
      <span>{line}</span>
      <button type="button">Comment</button>
    </span>
  );
}

export function CommentableDiffExample() {
  return (
    <DiffViewer
      original={'const a = 1\nconst b = 2'}
      modified={'const a = 1\nconst b = 3'}
      renderContent={(line) => <CommentableLine line={line} />}
      onLineNumberClick={(lineId) => {
        // open comment panel by line id
        console.log('comment target:', lineId);
      }}
      height={420}
    />
  );
}
```

## Recommendation matrix

- Start with `SimpleDiffViewer` for most application pages.
- Move to `DiffViewer` (`AdvancedDiffViewer`) only after a concrete customization requirement appears.
- Keep one internal wrapper in your codebase if your product repeatedly uses the same advanced options.

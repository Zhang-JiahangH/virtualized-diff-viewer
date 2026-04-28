import type React from 'react';

/**
 * Diff line kind in rendered output.
 */
export type DiffType = 'added' | 'removed' | 'unchanged';

export type CompareMethod =
  | 'CHARS'
  | 'WORDS'
  | 'WORDS_WITH_SPACE'
  | 'LINES'
  | 'TRIMMED_LINES'
  | 'SENTENCES'
  | 'CSS';

export interface WordChunk {
  value: string;
  type: DiffType;
}

export interface DiffLine {
  leftLineNumber: number | null;
  rightLineNumber: number | null;
  leftContent: string;
  rightContent: string;
  type: DiffType;
  leftWordChunks?: WordChunk[];
  rightWordChunks?: WordChunk[];
}

export type RenderItem =
  | { type: 'line'; line: DiffLine }
  | {
      type: 'collapse';
      blockStart: number;
      blockEnd: number;
      hiddenCount: number;
      expanded: boolean;
    };

export interface DiffViewerLocale {
  collapse?: string;
  showMoreLines?: (count: number) => string;
}

export interface DiffViewerStyles {
  container: React.CSSProperties;
  titleRow: React.CSSProperties;
  titleCell: React.CSSProperties;
  line: React.CSSProperties;
  lineNumber: React.CSSProperties;
  marker: React.CSSProperties;
  code: React.CSSProperties;
  wordAdded: React.CSSProperties;
  wordRemoved: React.CSSProperties;
}

export type LineId = `L-${number}` | `R-${number}`;

export type HighlightToken = LineId | `${LineId}-${number}`;

/**
 * Render hook for custom line content (for example syntax-highlighted HTML/React nodes).
 *
 * @example
 * ```tsx
 * <DiffViewer
 *   original={before}
 *   modified={after}
 *   renderContent={(line) => <code>{line}</code>}
 * />
 * ```
 */
export type RenderContent = (source: string) => React.ReactNode;

/**
 * Imperative methods exposed via `ref`.
 *
 * @example
 * ```tsx
 * const ref = useRef<DiffViewerHandle>(null);
 *
 * <DiffViewer ref={ref} original={before} modified={after} />
 *
 * ref.current?.resetCodeBlocks();
 * ```
 */
export interface DiffViewerHandle {
  resetCodeBlocks: () => void;
}

export type CodeFoldMessageRenderer = (params: {
  hiddenCount: number;
  expanded: boolean;
}) => React.ReactNode;

/**
 * Full-featured API for deep customization (advanced tier).
 *
 * @example
 * ```tsx
 * <DiffViewer
 *   original={before}
 *   modified={after}
 *   renderContent={(line) => <MySyntaxLine line={line} />}
 *   onLineNumberClick={(lineId) => console.log(lineId)}
 *   codeFoldMessageRenderer={({ hiddenCount }) => <button>Expand {hiddenCount}</button>}
 * />
 * ```
 */
export interface DiffViewerProps {
  original?: string;
  modified?: string;
  oldValue?: string;
  newValue?: string;
  language?: string;
  contextLines?: number;
  extraLinesSurroundingDiff?: number;
  showDiffOnly?: boolean;
  splitView?: boolean;
  hideLineNumbers?: boolean;
  highlightLines?: HighlightToken[];
  onLineNumberClick?: (lineId: LineId) => void;
  renderContent?: RenderContent;
  compareMethod?: CompareMethod;
  disableWordDiff?: boolean;
  leftTitle?: React.ReactNode;
  rightTitle?: React.ReactNode;
  linesOffset?: number;
  useDarkTheme?: boolean;
  styles?: Partial<DiffViewerStyles>;
  codeFoldMessageRenderer?: CodeFoldMessageRenderer;
  height?: number | string;
  locale?: DiffViewerLocale;
}
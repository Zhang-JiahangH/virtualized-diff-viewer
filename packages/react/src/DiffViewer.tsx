import React, { useImperativeHandle, useMemo, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

const VirtuosoComponent = Virtuoso as unknown as React.ComponentType<any>;
import { buildRenderItems, buildVisibleMap, computeDiffLines } from './diff';
import { defaultLocale } from './locale';
import { getPrefix } from './style';
import type {
  DiffLine,
  DiffViewerProps,
  DiffViewerStyles,
  HighlightToken,
  LineId,
  WordChunk,
  DiffViewerHandle,
} from './types';

const lightStyles: DiffViewerStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily:
      'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  titleRow: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f8fafc',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  titleCell: {
    width: '50%',
    padding: '8px 12px',
    borderRight: '1px solid #e5e7eb',
  },
  line: {
    display: 'flex',
    borderBottom: '1px solid #f3f4f6',
  },
  lineNumber: {
    width: 48,
    textAlign: 'right',
    paddingRight: 12,
    color: '#6b7280',
    flexShrink: 0,
  },
  marker: {
    width: 24,
    textAlign: 'center',
    paddingRight: 12,
    color: '#6b7280',
    flexShrink: 0,
  },
  code: {
    margin: 0,
    flex: 1,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
  wordAdded: {
    backgroundColor: '#acf2bd',
  },
  wordRemoved: {
    backgroundColor: '#ffdce0',
  },
};

const darkStyles: DiffViewerStyles = {
  ...lightStyles,
  container: {
    ...lightStyles.container,
    border: '1px solid #374151',
    backgroundColor: '#111827',
    color: '#e5e7eb',
  },
  titleRow: {
    ...lightStyles.titleRow,
    backgroundColor: '#1f2937',
    borderBottom: '1px solid #374151',
    color: '#cbd5e1',
  },
  titleCell: {
    ...lightStyles.titleCell,
    borderRight: '1px solid #374151',
  },
  line: {
    ...lightStyles.line,
    borderBottom: '1px solid #1f2937',
  },
  lineNumber: {
    ...lightStyles.lineNumber,
    color: '#94a3b8',
  },
  marker: {
    ...lightStyles.marker,
    color: '#94a3b8',
  },
  wordAdded: {
    backgroundColor: '#144620',
  },
  wordRemoved: {
    backgroundColor: '#5b1a1a',
  },
};

function mergeStyles(useDarkTheme: boolean, styles?: Partial<DiffViewerStyles>): DiffViewerStyles {
  const base = useDarkTheme ? darkStyles : lightStyles;

  return {
    container: { ...base.container, ...styles?.container },
    titleRow: { ...base.titleRow, ...styles?.titleRow },
    titleCell: { ...base.titleCell, ...styles?.titleCell },
    line: { ...base.line, ...styles?.line },
    lineNumber: { ...base.lineNumber, ...styles?.lineNumber },
    marker: { ...base.marker, ...styles?.marker },
    code: { ...base.code, ...styles?.code },
    wordAdded: { ...base.wordAdded, ...styles?.wordAdded },
    wordRemoved: { ...base.wordRemoved, ...styles?.wordRemoved },
  };
}

function parseHighlightLines(tokens: HighlightToken[] | undefined): Set<string> {
  const highlighted = new Set<string>();

  if (!tokens) {
    return highlighted;
  }

  tokens.forEach((token) => {
    const single = token.match(/^([LR])-(\d+)$/);
    if (single) {
      highlighted.add(`${single[1]}-${single[2]}`);
      return;
    }

    const range = token.match(/^([LR])-(\d+)-(\d+)$/);
    if (!range) {
      return;
    }

    const side = range[1];
    const start = Number(range[2]);
    const end = Number(range[3]);

    if (Number.isNaN(start) || Number.isNaN(end) || start <= 0 || end <= 0) {
      return;
    }

    const low = Math.min(start, end);
    const high = Math.max(start, end);

    for (let lineNumber = low; lineNumber <= high; lineNumber += 1) {
      highlighted.add(`${side}-${lineNumber}`);
    }
  });

  return highlighted;
}

function applyLineOffset(lineNumber: number | null, linesOffset: number): number | null {
  if (lineNumber === null) {
    return null;
  }

  return lineNumber + linesOffset;
}

function getLineId(side: 'L' | 'R', lineNumber: number | null, linesOffset: number): LineId | null {
  const adjustedLineNumber = applyLineOffset(lineNumber, linesOffset);
  if (adjustedLineNumber === null) {
    return null;
  }

  return `${side}-${adjustedLineNumber}`;
}

function renderLineNumber(
  side: 'L' | 'R',
  lineNumber: number | null,
  hideLineNumbers: boolean,
  highlightedLineIds: Set<string>,
  onLineNumberClick: ((lineId: LineId) => void) | undefined,
  linesOffset: number,
  mergedStyles: DiffViewerStyles,
): React.JSX.Element | null {
  if (hideLineNumbers) {
    return null;
  }

  const lineId = getLineId(side, lineNumber, linesOffset);
  const adjustedLineNumber = applyLineOffset(lineNumber, linesOffset);
  const isHighlighted = lineId !== null && highlightedLineIds.has(lineId);

  if (lineId !== null && onLineNumberClick) {
    return (
      <button
        type="button"
        onClick={() => onLineNumberClick(lineId)}
        style={{
          ...mergedStyles.lineNumber,
          color: isHighlighted ? '#2563eb' : mergedStyles.lineNumber.color,
          background: 'transparent',
          border: 0,
          cursor: 'pointer',
          font: 'inherit',
        }}
      >
        {adjustedLineNumber}
      </button>
    );
  }

  return (
    <div
      style={{
        ...mergedStyles.lineNumber,
        color: isHighlighted ? '#2563eb' : mergedStyles.lineNumber.color,
      }}
    >
      {adjustedLineNumber ?? ''}
    </div>
  );
}

function renderWordChunks(chunks: WordChunk[] | undefined, mergedStyles: DiffViewerStyles): React.ReactNode {
  if (!chunks || chunks.length === 0) {
    return null;
  }

  return chunks.map((chunk, chunkIndex) => {
    const style =
      chunk.type === 'added'
        ? mergedStyles.wordAdded
        : chunk.type === 'removed'
          ? mergedStyles.wordRemoved
          : undefined;

    return (
      <span key={`${chunk.value}-${chunkIndex}`} style={style}>
        {chunk.value}
      </span>
    );
  });
}

function renderContentCell(
  content: string,
  renderContent: DiffViewerProps['renderContent'] | undefined,
  chunks: WordChunk[] | undefined,
  mergedStyles: DiffViewerStyles,
): React.ReactNode {
  if (renderContent) {
    return renderContent(content);
  }

  const chunkContent = renderWordChunks(chunks, mergedStyles);
  if (chunkContent !== null) {
    return chunkContent;
  }

  return content;
}

function getCellBackground(
  line: DiffLine,
  sideVisible: boolean,
  lineId: LineId | null,
  highlightedLineIds: Set<string>,
  useDarkTheme: boolean,
): string {
  if (lineId !== null && highlightedLineIds.has(lineId)) {
    return useDarkTheme ? '#3d3413' : '#fff7cc';
  }

  if (!sideVisible) {
    return useDarkTheme ? '#111827' : '#fff';
  }

  if (line.type === 'added') {
    return useDarkTheme ? '#0f2a1a' : '#e6ffed';
  }

  if (line.type === 'removed') {
    return useDarkTheme ? '#3a1515' : '#ffeef0';
  }

  return useDarkTheme ? '#111827' : '#fff';
}

export const DiffViewer = React.forwardRef<DiffViewerHandle, DiffViewerProps>(function DiffViewer({
  original,
  modified,
  oldValue,
  newValue,
  contextLines = 2,
  extraLinesSurroundingDiff,
  showDiffOnly = true,
  splitView = true,
  hideLineNumbers = false,
  highlightLines,
  onLineNumberClick,
  renderContent,
  compareMethod = 'LINES',
  disableWordDiff = false,
  leftTitle,
  rightTitle,
  linesOffset = 0,
  useDarkTheme = false,
  styles,
  codeFoldMessageRenderer,
  height = 500,
  locale,
}, ref): React.JSX.Element {
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>({});

  const mergedLocale = {
    ...defaultLocale,
    ...locale,
  };

  const mergedStyles = useMemo(
    () => mergeStyles(useDarkTheme, styles),
    [styles, useDarkTheme],
  );

  const sourceOriginal = original ?? oldValue ?? '';
  const sourceModified = modified ?? newValue ?? '';
  const surroundingLines = extraLinesSurroundingDiff ?? contextLines;

  const highlightedLineIds = useMemo(
    () => parseHighlightLines(highlightLines),
    [highlightLines],
  );

  const diffLinesData = useMemo(() => {
    return computeDiffLines(sourceOriginal, sourceModified, compareMethod, disableWordDiff);
  }, [sourceOriginal, sourceModified, compareMethod, disableWordDiff]);

  const visibleMap = useMemo(() => {
    return buildVisibleMap(diffLinesData, surroundingLines, showDiffOnly);
  }, [diffLinesData, showDiffOnly, surroundingLines]);

  const renderItems = useMemo(() => {
    return buildRenderItems(diffLinesData, visibleMap, expandedBlocks);
  }, [diffLinesData, visibleMap, expandedBlocks]);

  function toggleBlock(blockStart: number): void {
    setExpandedBlocks((prev) => ({
      ...prev,
      [blockStart]: !prev[blockStart],
    }));
  }

  useImperativeHandle(
    ref,
    () => ({
      resetCodeBlocks: () => {
        setExpandedBlocks({});
      },
    }),
    [],
  );

  return (
    <div style={mergedStyles.container}>
      {(leftTitle !== undefined || rightTitle !== undefined) && splitView ? (
        <div style={mergedStyles.titleRow}>
          <div style={mergedStyles.titleCell}>{leftTitle}</div>
          <div style={{ ...mergedStyles.titleCell, borderRight: 0 }}>{rightTitle}</div>
        </div>
      ) : null}

      <VirtuosoComponent
        style={{ height }}
        totalCount={renderItems.length}
        itemContent={(index: number) => {
          const item = renderItems[index];

          if (item.type === 'line') {
            const { line } = item;
            const leftId = getLineId('L', line.leftLineNumber, linesOffset);
            const rightId = getLineId('R', line.rightLineNumber, linesOffset);

            if (!splitView) {
              const inlineContent =
                line.rightLineNumber !== null ? line.rightContent : line.leftContent;
              const unifiedHighlight =
                (leftId !== null && highlightedLineIds.has(leftId)) ||
                (rightId !== null && highlightedLineIds.has(rightId));
              const inlineChunks = line.rightWordChunks ?? line.leftWordChunks;

              return (
                <div
                  style={{
                    ...mergedStyles.line,
                    backgroundColor: unifiedHighlight
                      ? useDarkTheme
                        ? '#3d3413'
                        : '#fff7cc'
                      : getCellBackground(
                          line,
                          line.leftLineNumber !== null || line.rightLineNumber !== null,
                          null,
                          highlightedLineIds,
                          useDarkTheme,
                        ),
                  }}
                >
                  {hideLineNumbers ? null : (
                    <div
                      style={{
                        display: 'flex',
                        flexShrink: 0,
                        borderRight: useDarkTheme ? '1px solid #374151' : '1px solid #e5e7eb',
                        backgroundColor: useDarkTheme ? '#1f2937' : 'rgba(248, 250, 252, 0.9)',
                      }}
                    >
                      {renderLineNumber(
                        'L',
                        line.leftLineNumber,
                        false,
                        highlightedLineIds,
                        onLineNumberClick,
                        linesOffset,
                        mergedStyles,
                      )}
                      {renderLineNumber(
                        'R',
                        line.rightLineNumber,
                        false,
                        highlightedLineIds,
                        onLineNumberClick,
                        linesOffset,
                        mergedStyles,
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      ...mergedStyles.marker,
                      width: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: useDarkTheme ? '1px solid #374151' : '1px solid #e5e7eb',
                    }}
                  >
                    {getPrefix(
                      line.type,
                      line.leftLineNumber !== null || line.rightLineNumber !== null,
                    )}
                  </div>

                  <pre
                    style={{
                      ...mergedStyles.code,
                      padding: '4px 10px',
                    }}
                  >
                    {renderContentCell(inlineContent, renderContent, inlineChunks, mergedStyles)}
                  </pre>
                </div>
              );
            }

            return (
              <div style={mergedStyles.line}>
                <div
                  style={{
                    width: '50%',
                    display: 'flex',
                    padding: '4px 8px',
                    boxSizing: 'border-box',
                    backgroundColor: getCellBackground(
                      line,
                      line.leftLineNumber !== null,
                      leftId,
                      highlightedLineIds,
                      useDarkTheme,
                    ),
                  }}
                >
                  {renderLineNumber(
                    'L',
                    line.leftLineNumber,
                    hideLineNumbers,
                    highlightedLineIds,
                    onLineNumberClick,
                    linesOffset,
                    mergedStyles,
                  )}
                  <div style={mergedStyles.marker}>{getPrefix(line.type, line.leftLineNumber !== null)}</div>
                  <pre style={mergedStyles.code}>
                    {renderContentCell(
                      line.leftContent,
                      renderContent,
                      line.leftWordChunks,
                      mergedStyles,
                    )}
                  </pre>
                </div>

                <div
                  style={{
                    width: '50%',
                    display: 'flex',
                    padding: '4px 8px',
                    boxSizing: 'border-box',
                    backgroundColor: getCellBackground(
                      line,
                      line.rightLineNumber !== null,
                      rightId,
                      highlightedLineIds,
                      useDarkTheme,
                    ),
                  }}
                >
                  {renderLineNumber(
                    'R',
                    line.rightLineNumber,
                    hideLineNumbers,
                    highlightedLineIds,
                    onLineNumberClick,
                    linesOffset,
                    mergedStyles,
                  )}
                  <div style={mergedStyles.marker}>{getPrefix(line.type, line.rightLineNumber !== null)}</div>
                  <pre style={mergedStyles.code}>
                    {renderContentCell(
                      line.rightContent,
                      renderContent,
                      line.rightWordChunks,
                      mergedStyles,
                    )}
                  </pre>
                </div>
              </div>
            );
          }

          return (
            <button
              type="button"
              onClick={() => toggleBlock(item.blockStart)}
              style={{
                width: '100%',
                border: 0,
                borderBottom: useDarkTheme ? '1px solid #374151' : '1px solid #e5e7eb',
                backgroundColor: useDarkTheme ? '#1f2937' : '#f9fafb',
                padding: '8px 12px',
                cursor: 'pointer',
                color: useDarkTheme ? '#cbd5e1' : '#374151',
                fontStyle: 'italic',
              }}
            >
              {codeFoldMessageRenderer
                ? codeFoldMessageRenderer({
                    hiddenCount: item.hiddenCount,
                    expanded: item.expanded,
                  })
                : item.expanded
                  ? mergedLocale.collapse
                  : mergedLocale.showMoreLines(item.hiddenCount)}
            </button>
          );
        }}
      />
    </div>
  );
});

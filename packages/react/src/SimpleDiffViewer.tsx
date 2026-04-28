import React from 'react';
import { DiffViewer } from './DiffViewer';
import type { DiffViewerHandle, DiffViewerLocale } from './types';

/**
 * Minimal API for the most common usage scenarios.
 *
 * @example
 * ```tsx
 * import { SimpleDiffViewer } from 'react-virtualized-diff';
 *
 * <SimpleDiffViewer
 *   original={before}
 *   modified={after}
 *   height={420}
 * />
 * ```
 */
export interface SimpleDiffViewerProps {
  /** Original text content (left side). */
  original: string;
  /** Modified text content (right side). */
  modified: string;
  /**
   * Virtualized viewport height.
   * @default 500
   */
  height?: number | string;
  /**
   * Side-by-side (split) or unified (inline) view.
   * @default true
   */
  splitView?: boolean;
  /**
   * Show only changed blocks with unchanged context collapsed.
   * @default true
   */
  showDiffOnly?: boolean;
  /**
   * Number of unchanged lines to keep around each change block.
   * @default 2
   */
  contextLines?: number;
  /**
   * Hide line number columns.
   * @default false
   */
  hideLineNumbers?: boolean;
  /**
   * Use built-in dark color palette.
   * @default false
   */
  useDarkTheme?: boolean;
  /** Localized text labels. */
  locale?: DiffViewerLocale;
}

/**
 * Recommended entry for 80% of scenarios.
 * Keeps the API intentionally small while still using the same rendering engine.
 */
export const SimpleDiffViewer = React.forwardRef<DiffViewerHandle, SimpleDiffViewerProps>(
  function SimpleDiffViewer(
    {
      original,
      modified,
      height,
      splitView,
      showDiffOnly,
      contextLines,
      hideLineNumbers,
      useDarkTheme,
      locale,
    },
    ref,
  ): React.JSX.Element {
    return (
      <DiffViewer
          ref={ref}
          original={original}
          modified={modified}
          height={height}
          splitView={splitView}
          showDiffOnly={showDiffOnly}
          contextLines={contextLines}
          hideLineNumbers={hideLineNumbers}
          useDarkTheme={useDarkTheme}
          locale={locale}
        />
    );
  },
);

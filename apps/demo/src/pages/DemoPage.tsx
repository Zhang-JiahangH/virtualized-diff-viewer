import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import PlaygroundControls, { type DemoState } from '../components/PlaygroundControls';
import MetricsBar from '../components/MetricsBar';
import { generateDiffText, getDatasetByKey } from '../data/presets';
import benchmarkPayload from '../../../../benchmark-results/results.json';

import { DiffViewer, type DiffViewerHandle, type DiffViewerProps, type LineId } from '../../../../packages/react/src';
import { useSeo } from '../utils/seo';

const INITIAL_STATE: DemoState = {
  dataset: 'medium',
  contextLines: 3,
  height: 560,
  splitView: true,
  showDiffOnly: true,
  hideLineNumbers: false,
  useCompatApi: false,
  enableRenderContent: false,
  enableHighlight: false,
  compareMethod: 'LINES',
  disableWordDiff: false,
  useDarkTheme: false,
  linesOffset: 0,
  useCustomFoldRenderer: false,
};

type PerfMetrics = {
  prepareTime: number | null;
  commitTime: number | null;
  totalTime: number | null;
};

type BenchmarkRow = {
  lib: string;
  lines: number;
  initialRenderTimeMs: number | null;
  averageFps: number | null;
  memoryBytes: number | null;
  status: 'ok' | 'timeout';
};

type BenchmarkPayload = {
  generatedAt: string;
  perCaseTimeoutMs: number;
  results: BenchmarkRow[];
};

const benchmarkData = benchmarkPayload as BenchmarkPayload;

const renderContent: NonNullable<DiffViewerProps['renderContent']> = (line) => {
  return `🧪 ${line.replace(/const/g, 'CONST').replace(/process/g, 'PROCESS')}`;
};

function formatDuration(ms: number | null) {
  return ms == null ? 'N/A' : `${ms.toFixed(1)} ms`;
}

function formatFps(fps: number | null) {
  return fps == null ? 'N/A' : `${fps.toFixed(1)} FPS`;
}

function formatMemory(bytes: number | null) {
  if (bytes == null) {
    return 'N/A';
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DemoPage() {
  useSeo({
    title: 'Interactive Demo | react-virtualized-diff',
    description:
      'Benchmark and explore a virtualized React diff viewer with live controls across 1k to 100k line datasets for large-scale code and text comparison.',
    canonicalPath: '/demo',
  });

  const [state, setState] = useState<DemoState>(INITIAL_STATE);
  const [isPreparing, setIsPreparing] = useState(false);
  const [metrics, setMetrics] = useState<PerfMetrics>({
    prepareTime: null,
    commitTime: null,
    totalTime: null,
  });
  const [lastClickedLineId, setLastClickedLineId] = useState<LineId | null>(null);
  const diffViewerRef = useRef<DiffViewerHandle | null>(null);

  const interactionStartRef = useRef<number | null>(null);
  const prepareEndRef = useRef<number | null>(null);

  const dataset = useMemo(() => getDatasetByKey(state.dataset), [state.dataset]);

  const [diffData, setDiffData] = useState(() => {
    const initialDataset = getDatasetByKey(INITIAL_STATE.dataset);
    return generateDiffText(initialDataset.lines);
  });

  const benchmarkSummary = useMemo(() => {
    const findEntry = (lib: string, lines: number) =>
      benchmarkData.results.find((item) => item.lib === lib && item.lines === lines);

    const target10k = findEntry('react-virtualized-diff', 10000);
    const target100k = findEntry('react-virtualized-diff', 100000);
    const compare100k = findEntry('react-diff-view', 100000);

    const timeoutCount = benchmarkData.results.filter((item) => item.status === 'timeout').length;

    let memoryRatio: string | null = null;
    if (target100k?.memoryBytes && compare100k?.memoryBytes) {
      memoryRatio = `${(compare100k.memoryBytes / target100k.memoryBytes).toFixed(1)}x`;
    }

    return {
      target10k,
      target100k,
      compare100k,
      timeoutCount,
      memoryRatio,
      generatedAt: new Date(benchmarkData.generatedAt).toLocaleString(),
      timeoutMs: benchmarkData.perCaseTimeoutMs,
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const prepareStart = performance.now();

    setIsPreparing(true);

    const timer = window.setTimeout(() => {
      const data = generateDiffText(dataset.lines);
      const prepareEnd = performance.now();

      if (cancelled) {
        return;
      }

      prepareEndRef.current = prepareEnd;
      setDiffData(data);
      setMetrics((previous) => ({
        ...previous,
        prepareTime: prepareEnd - prepareStart,
      }));
      setIsPreparing(false);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [dataset.lines]);

  const updateStateWithPerfStart = (nextState: DemoState) => {
    interactionStartRef.current = performance.now();
    prepareEndRef.current = null;
    setMetrics({
      prepareTime: null,
      commitTime: null,
      totalTime: null,
    });
    setState(nextState);
  };

  useLayoutEffect(() => {
    if (isPreparing) {
      return;
    }

    const interactionStart = interactionStartRef.current;

    if (interactionStart === null) {
      return;
    }

    const commitMoment = performance.now();
    const prepareEnd = prepareEndRef.current;

    setMetrics((previous) => ({
      ...previous,
      commitTime: prepareEnd === null ? null : commitMoment - prepareEnd,
      totalTime: commitMoment - interactionStart,
    }));
  }, [diffData, state, isPreparing]);

  useEffect(() => {
    if (interactionStartRef.current === null) {
      interactionStartRef.current = performance.now();
    }
  }, []);

  const viewerProps: DiffViewerProps = {
    height: state.height,
    splitView: state.splitView,
    showDiffOnly: state.showDiffOnly,
    contextLines: state.contextLines,
    extraLinesSurroundingDiff: state.contextLines,
    hideLineNumbers: state.hideLineNumbers,
    renderContent: state.enableRenderContent ? renderContent : undefined,
    highlightLines: state.enableHighlight ? ['R-1', 'R-24', 'L-98', 'R-212'] : undefined,
    onLineNumberClick: (lineId) => {
      setLastClickedLineId(lineId);
    },
    compareMethod: state.compareMethod,
    disableWordDiff: state.disableWordDiff,
    useDarkTheme: state.useDarkTheme,
    linesOffset: state.linesOffset,
    leftTitle: 'Original',
    rightTitle: 'Modified',
    codeFoldMessageRenderer: state.useCustomFoldRenderer
      ? ({ hiddenCount, expanded }) =>
          expanded ? 'Collapse unchanged block' : `Show ${hiddenCount} hidden lines (custom)`
      : undefined,
  };

  if (state.useCompatApi) {
    viewerProps.oldValue = diffData.oldText;
    viewerProps.newValue = diffData.newText;
  } else {
    viewerProps.original = diffData.oldText;
    viewerProps.modified = diffData.newText;
  }

  return (
    <div className="site-page">
      <SiteHeader />

      <main className="page-shell demo-page">
        <div className="section-heading section-heading--compact">
          <h1>Interactive demo</h1>
          <p>
            Switch dataset size and toggle compatibility APIs (`oldValue/newValue`, `splitView`,
            `showDiffOnly`, `renderContent`, `highlightLines`, `compareMethod`, `useDarkTheme`) to verify behavior quickly.
          </p>
        </div>

        <section className="benchmark-strip">
          <div className="benchmark-strip__header">
            <h2>Benchmark snapshot</h2>
            <p>Loaded from <code>benchmark-results/results.json</code> · Updated at {benchmarkSummary.generatedAt}</p>
          </div>

          <div className="benchmark-strip__grid">
            <article className="benchmark-pill">
              <span>10k lines</span>
              <strong>{formatFps(benchmarkSummary.target10k?.averageFps ?? null)}</strong>
              <small>{formatDuration(benchmarkSummary.target10k?.initialRenderTimeMs ?? null)}</small>
            </article>
            <article className="benchmark-pill">
              <span>100k lines memory</span>
              <strong>{formatMemory(benchmarkSummary.target100k?.memoryBytes ?? null)}</strong>
              <small>react-virtualized-diff</small>
            </article>
            <article className="benchmark-pill">
              <span>Memory advantage</span>
              <strong>{benchmarkSummary.memoryRatio ?? 'N/A'}</strong>
              <small>vs react-diff-view @100k</small>
            </article>
            <article className="benchmark-pill">
              <span>Timeout cases</span>
              <strong>{benchmarkSummary.timeoutCount}</strong>
              <small>{benchmarkSummary.timeoutMs} ms per case</small>
            </article>
          </div>
        </section>

        <div className="demo-layout">
          <PlaygroundControls
            value={state}
            onChange={updateStateWithPerfStart}
            onRunStressTest={() =>
              updateStateWithPerfStart({
                dataset: 'huge',
                contextLines: 2,
                height: 720,
                splitView: true,
                showDiffOnly: true,
                hideLineNumbers: false,
                useCompatApi: true,
                enableRenderContent: false,
                enableHighlight: false,
                compareMethod: 'LINES',
                disableWordDiff: false,
                useDarkTheme: false,
                linesOffset: 0,
                useCustomFoldRenderer: false,
              })
            }
          />

          <section className="demo-viewer-card">
            <div className="demo-viewer-card__header">
              <div>
                <h2>Viewer</h2>
                <p>
                  Current dataset: <strong>{dataset.label}</strong>
                </p>
                <p>
                  Last clicked line id: <strong>{lastClickedLineId ?? 'None'}</strong>
                </p>
                {state.enableRenderContent ? (
                  <p>
                    `renderContent` active: each line is prefixed with <strong>🧪</strong>.
                  </p>
                ) : null}
                {state.enableHighlight ? (
                  <p>
                    Highlight preset active: <strong>R-1, R-24, L-98, R-212</strong>.
                  </p>
                ) : null}
                <p>
                  Compare: <strong>{state.compareMethod}</strong> · Word diff:{' '}
                  <strong>{state.disableWordDiff ? 'off' : 'on'}</strong> · Offset:{' '}
                  <strong>{state.linesOffset}</strong>
                </p>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => diffViewerRef.current?.resetCodeBlocks()}
                >
                  Reset folded blocks (ref API)
                </button>
              </div>
            </div>

            <div className="demo-viewer-card__body demo-viewer-card__body--relative">
              <DiffViewer ref={diffViewerRef} {...viewerProps} />
              {isPreparing ? (
                <div className="viewer-loading viewer-loading--overlay" aria-live="polite">
                  <span className="viewer-loading__spinner" aria-hidden />
                  <p className="viewer-loading__title">Preparing diff data…</p>
                  <p className="viewer-loading__text">
                    Large datasets like 100k lines can take a while. The viewer will update
                    automatically when preparation is complete.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <MetricsBar
          lineCount={dataset.lines}
          contextLines={state.contextLines}
          height={state.height}
          prepareTime={metrics.prepareTime}
          commitTime={metrics.commitTime}
          totalTime={metrics.totalTime}
        />
      </main>
    </div>
  );
}

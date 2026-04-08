import { DATASET_OPTIONS, type DatasetKey } from '../data/presets';

export type DemoState = {
  dataset: DatasetKey;
  contextLines: number;
  height: number;
  splitView: boolean;
  showDiffOnly: boolean;
  hideLineNumbers: boolean;
  useCompatApi: boolean;
  enableRenderContent: boolean;
  enableHighlight: boolean;
  compareMethod: 'LINES' | 'WORDS' | 'CHARS';
  disableWordDiff: boolean;
  useDarkTheme: boolean;
  linesOffset: number;
  useCustomFoldRenderer: boolean;
};

type PlaygroundControlsProps = {
  value: DemoState;
  onChange: (nextValue: DemoState) => void;
  onRunStressTest: () => void;
};

export default function PlaygroundControls(props: PlaygroundControlsProps) {
  const { value, onChange, onRunStressTest } = props;

  return (
    <aside className="control-panel">
      <div className="control-panel__section">
        <label className="field-label" htmlFor="dataset">
          Dataset
        </label>
        <select
          id="dataset"
          className="field-input"
          value={value.dataset}
          onChange={(event) =>
            onChange({
              ...value,
              dataset: event.target.value as DatasetKey,
            })
          }
        >
          {DATASET_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-panel__section">
        <label className="field-label" htmlFor="contextLines">
          Context lines: {value.contextLines}
        </label>
        <input
          id="contextLines"
          className="field-range"
          type="range"
          min={0}
          max={20}
          step={1}
          value={value.contextLines}
          onChange={(event) =>
            onChange({
              ...value,
              contextLines: Number(event.target.value),
            })
          }
        />
      </div>

      <div className="control-panel__section">
        <label className="field-label" htmlFor="height">
          Viewer height: {value.height}px
        </label>
        <input
          id="height"
          className="field-range"
          type="range"
          min={240}
          max={960}
          step={40}
          value={value.height}
          onChange={(event) =>
            onChange({
              ...value,
              height: Number(event.target.value),
            })
          }
        />
      </div>

      <div className="control-panel__section">
        <label className="toggle-row" htmlFor="splitView">
          <input
            id="splitView"
            type="checkbox"
            checked={value.splitView}
            onChange={(event) =>
              onChange({
                ...value,
                splitView: event.target.checked,
              })
            }
          />
          <span>Split view (`splitView`)</span>
        </label>

        <label className="toggle-row" htmlFor="showDiffOnly">
          <input
            id="showDiffOnly"
            type="checkbox"
            checked={value.showDiffOnly}
            onChange={(event) =>
              onChange({
                ...value,
                showDiffOnly: event.target.checked,
              })
            }
          />
          <span>Show diff only (`showDiffOnly`)</span>
        </label>

        <label className="toggle-row" htmlFor="hideLineNumbers">
          <input
            id="hideLineNumbers"
            type="checkbox"
            checked={value.hideLineNumbers}
            onChange={(event) =>
              onChange({
                ...value,
                hideLineNumbers: event.target.checked,
              })
            }
          />
          <span>Hide line numbers (`hideLineNumbers`)</span>
        </label>

        <label className="toggle-row" htmlFor="useCompatApi">
          <input
            id="useCompatApi"
            type="checkbox"
            checked={value.useCompatApi}
            onChange={(event) =>
              onChange({
                ...value,
                useCompatApi: event.target.checked,
              })
            }
          />
          <span>Use legacy `oldValue/newValue` props</span>
        </label>

        <label className="toggle-row" htmlFor="enableRenderContent">
          <input
            id="enableRenderContent"
            type="checkbox"
            checked={value.enableRenderContent}
            onChange={(event) =>
              onChange({
                ...value,
                enableRenderContent: event.target.checked,
              })
            }
          />
          <span>Enable `renderContent` formatter</span>
        </label>

        <label className="toggle-row" htmlFor="enableHighlight">
          <input
            id="enableHighlight"
            type="checkbox"
            checked={value.enableHighlight}
            onChange={(event) =>
              onChange({
                ...value,
                enableHighlight: event.target.checked,
              })
            }
          />
          <span>Enable `highlightLines` preset</span>
        </label>
      </div>


      <div className="control-panel__section">
        <label className="field-label" htmlFor="compareMethod">
          Compare method
        </label>
        <select
          id="compareMethod"
          className="field-input"
          value={value.compareMethod}
          onChange={(event) =>
            onChange({
              ...value,
              compareMethod: event.target.value as DemoState['compareMethod'],
            })
          }
        >
          <option value="LINES">LINES</option>
          <option value="WORDS">WORDS</option>
          <option value="CHARS">CHARS</option>
        </select>

        <label className="toggle-row" htmlFor="disableWordDiff">
          <input
            id="disableWordDiff"
            type="checkbox"
            checked={value.disableWordDiff}
            onChange={(event) =>
              onChange({
                ...value,
                disableWordDiff: event.target.checked,
              })
            }
          />
          <span>Disable word diff (`disableWordDiff`)</span>
        </label>

        <label className="toggle-row" htmlFor="useDarkTheme">
          <input
            id="useDarkTheme"
            type="checkbox"
            checked={value.useDarkTheme}
            onChange={(event) =>
              onChange({
                ...value,
                useDarkTheme: event.target.checked,
              })
            }
          />
          <span>Use dark theme (`useDarkTheme`)</span>
        </label>

        <label className="toggle-row" htmlFor="useCustomFoldRenderer">
          <input
            id="useCustomFoldRenderer"
            type="checkbox"
            checked={value.useCustomFoldRenderer}
            onChange={(event) =>
              onChange({
                ...value,
                useCustomFoldRenderer: event.target.checked,
              })
            }
          />
          <span>Custom fold renderer (`codeFoldMessageRenderer`)</span>
        </label>

        <label className="field-label" htmlFor="linesOffset">
          Line offset: {value.linesOffset}
        </label>
        <input
          id="linesOffset"
          className="field-range"
          type="range"
          min={0}
          max={200}
          step={1}
          value={value.linesOffset}
          onChange={(event) =>
            onChange({
              ...value,
              linesOffset: Number(event.target.value),
            })
          }
        />
      </div>

      <button type="button" className="button button--primary button--block" onClick={onRunStressTest}>
        Run 100k stress test
      </button>
    </aside>
  );
}
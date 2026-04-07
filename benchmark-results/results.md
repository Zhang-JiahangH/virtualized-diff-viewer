# Benchmark Results

Generated at: 2026-04-07T05:08:36.114Z

Per-case timeout: 60000 ms

> Memory usage comes from `performance.memory.usedJSHeapSize` and is only available in Chromium-based browsers.

| Library | Lines | Status | Initial Render (ms) | FPS | Memory | Note |
| --- | ---: | --- | ---: | ---: | ---: | --- |
| virtualized-diff-viewer | 1,000 | ok | 135.20 | 60.40 | 9.5 MB |  |
| virtualized-diff-viewer | 10,000 | ok | 187.20 | 60.40 | 9.5 MB |  |
| virtualized-diff-viewer | 50,000 | ok | 2961.70 | 60.40 | 23.4 MB |  |
| virtualized-diff-viewer | 100,000 | ok | 15242.30 | 60.40 | 141.1 MB |  |
| react-diff-viewer | 1,000 | ok | 152.50 | 60.40 | 11.3 MB |  |
| react-diff-viewer | 10,000 | ok | 1316.00 | 56.80 | 64.8 MB |  |
| react-diff-viewer | 50,000 | timeout | N/A | N/A | N/A | Did not finish within 60000 ms |
| react-diff-viewer | 100,000 | timeout | N/A | N/A | N/A | Did not finish within 60000 ms |
| react-diff-viewer-continued | 1,000 | ok | 208.60 | 60.40 | 11.3 MB |  |
| react-diff-viewer-continued | 10,000 | ok | 1309.90 | 58.80 | 64.8 MB |  |
| react-diff-viewer-continued | 50,000 | timeout | N/A | N/A | N/A | Did not finish within 60000 ms |
| react-diff-viewer-continued | 100,000 | timeout | N/A | N/A | N/A | Did not finish within 60000 ms |
| react-diff-view | 1,000 | ok | 265.80 | 60.40 | 18.4 MB |  |
| react-diff-view | 10,000 | ok | 1438.50 | 60.40 | 132.6 MB |  |
| react-diff-view | 50,000 | ok | 7487.70 | 13.20 | 631.3 MB |  |
| react-diff-view | 100,000 | ok | 16738.40 | 5.60 | 1297.0 MB |  |


# Benchmark Results

Generated at: 2026-04-08T06:45:43.686Z

Per-case timeout: 60000 ms

> Memory usage comes from `performance.memory.usedJSHeapSize` and is only available in Chromium-based browsers.

| Library | Lines | Status | Initial Render (ms) | FPS | Memory | Note |
| --- | ---: | --- | ---: | ---: | ---: | --- |
| react-virtualized-diff | 1,000 | ok | 128.10 | 60.40 | 9.5 MB |  |
| react-virtualized-diff | 10,000 | ok | 127.00 | 60.80 | 9.5 MB |  |
| react-virtualized-diff | 50,000 | ok | 1536.20 | 60.40 | 23.4 MB |  |
| react-virtualized-diff | 100,000 | ok | 7490.10 | 60.40 | 104.0 MB |  |
| react-diff-viewer | 1,000 | ok | 155.40 | 60.40 | 11.3 MB |  |
| react-diff-viewer | 10,000 | ok | 1307.50 | 57.60 | 64.8 MB |  |
| react-diff-viewer | 50,000 | timeout | N/A | N/A | N/A | Did not finish within 60000 ms |
| react-diff-viewer | 100,000 | timeout | N/A | N/A | N/A | Did not finish within 60000 ms |
| react-diff-viewer-continued | 1,000 | ok | 213.10 | 60.40 | 11.3 MB |  |
| react-diff-viewer-continued | 10,000 | ok | 1303.90 | 58.00 | 64.8 MB |  |
| react-diff-viewer-continued | 50,000 | timeout | N/A | N/A | N/A | Did not finish within 60000 ms |
| react-diff-viewer-continued | 100,000 | timeout | N/A | N/A | N/A | Did not finish within 60000 ms |
| react-diff-view | 1,000 | ok | 289.00 | 60.40 | 18.4 MB |  |
| react-diff-view | 10,000 | ok | 1434.40 | 60.40 | 132.6 MB |  |
| react-diff-view | 50,000 | ok | 7613.40 | 12.80 | 631.3 MB |  |
| react-diff-view | 100,000 | ok | 16987.60 | 6.00 | 1297.0 MB |  |


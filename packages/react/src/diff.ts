import {
  diffChars,
  diffCss,
  diffLines,
  diffSentences,
  diffTrimmedLines,
  diffWords,
  diffWordsWithSpace,
} from 'diff';
import type { CompareMethod, DiffLine, RenderItem, WordChunk } from './types';

type DiffPart = { value: string; added?: boolean; removed?: boolean };
type DiffFn = (oldValue: string, newValue: string) => DiffPart[];


const DIFF_CACHE_LIMIT = 12;
const WORD_DIFF_LINE_LIMIT = 4000;
const diffCache = new Map<string, DiffLine[]>();

function buildCacheKey(
  original: string,
  modified: string,
  compareMethod: CompareMethod,
  disableWordDiff: boolean,
): string {
  const originalHead = original.slice(0, 80);
  const originalTail = original.slice(-80);
  const modifiedHead = modified.slice(0, 80);
  const modifiedTail = modified.slice(-80);

  return [
    compareMethod,
    disableWordDiff ? '1' : '0',
    original.length,
    modified.length,
    originalHead,
    originalTail,
    modifiedHead,
    modifiedTail,
  ].join('|');
}

function readDiffCache(key: string): DiffLine[] | undefined {
  const cached = diffCache.get(key);
  if (!cached) {
    return undefined;
  }

  diffCache.delete(key);
  diffCache.set(key, cached);
  return cached;
}

function writeDiffCache(key: string, value: DiffLine[]): void {
  if (diffCache.has(key)) {
    diffCache.delete(key);
  }

  diffCache.set(key, value);

  if (diffCache.size > DIFF_CACHE_LIMIT) {
    const oldestKey = diffCache.keys().next().value;
    if (oldestKey) {
      diffCache.delete(oldestKey);
    }
  }
}

function pickCompareMethod(compareMethod: CompareMethod): DiffFn {
  switch (compareMethod) {
    case 'CHARS':
      return diffChars as DiffFn;
    case 'WORDS':
      return diffWords as DiffFn;
    case 'WORDS_WITH_SPACE':
      return diffWordsWithSpace as DiffFn;
    case 'TRIMMED_LINES':
      return diffTrimmedLines as DiffFn;
    case 'SENTENCES':
      return diffSentences as DiffFn;
    case 'CSS':
      return diffCss as DiffFn;
    case 'LINES':
    default:
      return diffLines as DiffFn;
  }
}

function computeWordChunks(left: string, right: string): { left: WordChunk[]; right: WordChunk[] } {
  const result = diffWordsWithSpace(left, right);
  const leftChunks: WordChunk[] = [];
  const rightChunks: WordChunk[] = [];

  result.forEach((part) => {
    if (part.added) {
      rightChunks.push({ value: part.value, type: 'added' });
      return;
    }

    if (part.removed) {
      leftChunks.push({ value: part.value, type: 'removed' });
      return;
    }

    leftChunks.push({ value: part.value, type: 'unchanged' });
    rightChunks.push({ value: part.value, type: 'unchanged' });
  });

  return { left: leftChunks, right: rightChunks };
}

function attachWordChunks(lines: DiffLine[]): DiffLine[] {
  const nextLines = [...lines];

  for (let index = 0; index < nextLines.length; index += 1) {
    if (nextLines[index].type !== 'removed') {
      continue;
    }

    let removedCursor = index;
    let addedCursor = index;

    while (removedCursor < nextLines.length && nextLines[removedCursor].type === 'removed') {
      removedCursor += 1;
    }

    while (addedCursor < nextLines.length && nextLines[addedCursor].type !== 'added') {
      if (nextLines[addedCursor].type === 'unchanged') {
        break;
      }
      addedCursor += 1;
    }

    if (addedCursor >= nextLines.length || nextLines[addedCursor].type !== 'added') {
      continue;
    }

    const removedCount = removedCursor - index;
    let addedEnd = addedCursor;

    while (addedEnd < nextLines.length && nextLines[addedEnd].type === 'added') {
      addedEnd += 1;
    }

    const pairCount = Math.min(removedCount, addedEnd - addedCursor);

    for (let pairIndex = 0; pairIndex < pairCount; pairIndex += 1) {
      const removedLine = nextLines[index + pairIndex];
      const addedLine = nextLines[addedCursor + pairIndex];
      const chunks = computeWordChunks(removedLine.leftContent, addedLine.rightContent);

      removedLine.leftWordChunks = chunks.left;
      addedLine.rightWordChunks = chunks.right;
    }
  }

  return nextLines;
}

export function computeDiffLines(
  original: string,
  modified: string,
  compareMethod: CompareMethod = 'LINES',
  disableWordDiff = false,
): DiffLine[] {
  const cacheKey = buildCacheKey(original, modified, compareMethod, disableWordDiff);
  const cached = readDiffCache(cacheKey);
  if (cached) {
    return cached;
  }

  const method = pickCompareMethod(compareMethod);
  const diffResult: DiffPart[] = method(original, modified);
  const diffLinesArray: DiffLine[] = [];

  let leftLineNum = 1;
  let rightLineNum = 1;

  diffResult.forEach((part: DiffPart) => {
    const lines = part.value
      .split('\n')
      .filter((line: string, index: number, arr: string[]) => !(index === arr.length - 1 && line === ''));

    if (part.added) {
      lines.forEach((line: string) => {
        diffLinesArray.push({
          leftLineNumber: null,
          rightLineNumber: rightLineNum,
          leftContent: '',
          rightContent: line,
          type: 'added',
        });
        rightLineNum += 1;
      });
      return;
    }

    if (part.removed) {
      lines.forEach((line: string) => {
        diffLinesArray.push({
          leftLineNumber: leftLineNum,
          rightLineNumber: null,
          leftContent: line,
          rightContent: '',
          type: 'removed',
        });
        leftLineNum += 1;
      });
      return;
    }

    lines.forEach((line) => {
      diffLinesArray.push({
        leftLineNumber: leftLineNum,
        rightLineNumber: rightLineNum,
        leftContent: line,
        rightContent: line,
        type: 'unchanged',
      });
      leftLineNum += 1;
      rightLineNum += 1;
    });
  });

  let result = diffLinesArray;

  if (!disableWordDiff && diffLinesArray.length <= WORD_DIFF_LINE_LIMIT) {
    result = attachWordChunks(diffLinesArray);
  }

  writeDiffCache(cacheKey, result);
  return result;
}

export function buildVisibleMap(
  lines: DiffLine[],
  contextLines: number,
  showDiffOnly: boolean,
): boolean[] {
  const total = lines.length;
  if (!showDiffOnly) {
    return new Array<boolean>(total).fill(true);
  }

  const visible = new Array<boolean>(total).fill(false);

  lines.forEach((line, index) => {
    if (line.type !== 'unchanged') {
      const start = Math.max(0, index - contextLines);
      const end = Math.min(total - 1, index + contextLines);

      for (let i = start; i <= end; i += 1) {
        visible[i] = true;
      }
    }
  });

  if (!visible.some(Boolean)) {
    return new Array<boolean>(total).fill(true);
  }

  return visible;
}

export function buildRenderItems(
  lines: DiffLine[],
  visibleMap: boolean[],
  expandedBlocks: Record<number, boolean>,
): RenderItem[] {
  const items: RenderItem[] = [];
  const total = lines.length;
  let index = 0;

  while (index < total) {
    if (visibleMap[index]) {
      items.push({ type: 'line', line: lines[index] });
      index += 1;
      continue;
    }

    const blockStart = index;
    while (index < total && !visibleMap[index]) {
      index += 1;
    }

    const blockEnd = index - 1;
    const hiddenCount = blockEnd - blockStart + 1;
    const expanded = expandedBlocks[blockStart] === true;

    if (expanded) {
      for (let i = blockStart; i <= blockEnd; i += 1) {
        items.push({ type: 'line', line: lines[i] });
      }
      items.push({
        type: 'collapse',
        blockStart,
        blockEnd,
        hiddenCount: 0,
        expanded: true,
      });
      continue;
    }

    items.push({
      type: 'collapse',
      blockStart,
      blockEnd,
      hiddenCount,
      expanded: false,
    });
  }

  return items;
}
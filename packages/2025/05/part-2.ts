import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseInput } from "./index.js";

type Range = {
  start: number;
  end: number;
};

function mergeRanges(ranges: Range[]): Range[] {
  if (ranges.length === 0) {
    return [];
  }

  // Sort ranges by start position
  const sorted = [...ranges].sort((a, b) => a.start - b.start);

  const merged: Range[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    // Check if ranges overlap or are adjacent
    if (current.start <= last.end + 1) {
      // Merge by extending the end if needed
      last.end = Math.max(last.end, current.end);
    } else {
      // No overlap, add as new range
      merged.push(current);
    }
  }

  return merged;
}

function countFreshIds(ranges: Range[]): number {
  const merged = mergeRanges(ranges);

  return merged.reduce((sum, range) => {
    // Range is inclusive, so count is (end - start + 1)
    return sum + (range.end - range.start + 1);
  }, 0);
}

async function main(): Promise<void> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const inputPath = join(currentDir, "input.txt");

  const { ranges } = await parseInput(inputPath);
  const totalFreshIds = countFreshIds(ranges);

  console.log(`password: ${totalFreshIds}`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && scriptPath === process.argv[1]) {
  void main();
}

export { mergeRanges, countFreshIds, main };

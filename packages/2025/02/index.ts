import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Range = {
  start: number;
  end: number;
};

async function parseRanges(filePath: string): Promise<Range[]> {
  const text = await readFile(filePath, "utf8");
  return text
    .trim()
    .split(",")
    .filter((entry) => entry.length > 0)
    .map((entry) => {
      const [startStr, endStr] = entry.split("-");
      const start = Number(startStr);
      const end = Number(endStr);
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        throw new Error(`Invalid range: ${entry}`);
      }
      return { start, end };
    });
}

function generateRepeatedTwice(maxHalfLength: number): number[] {
  const values: number[] = [];
  for (let halfLen = 1; halfLen <= maxHalfLength; halfLen += 1) {
    const base = 10 ** (halfLen - 1);
    const limit = 10 ** halfLen;
    for (let prefix = base; prefix < limit; prefix += 1) {
      const repeated = prefix * limit + prefix; // concat prefix with itself
      values.push(repeated);
    }
  }
  return values;
}

function sumInvalidIds(ranges: Range[], candidates: number[]): number {
  let total = 0;
  const seen = new Set<number>();

  for (const value of candidates) {
    for (const range of ranges) {
      if (value >= range.start && value <= range.end) {
        if (!seen.has(value)) {
          seen.add(value);
          total += value;
        }
        break; // already in a range
      }
    }
  }

  return total;
}

async function main(): Promise<void> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const inputPath = join(currentDir, "input.txt");

  const ranges = await parseRanges(inputPath);
  const maxVal = Math.max(...ranges.map((r) => r.end));
  const maxDigits = String(maxVal).length;
  const maxHalfLength = Math.floor(maxDigits / 2);

  const candidates = generateRepeatedTwice(maxHalfLength);
  const total = sumInvalidIds(ranges, candidates);

  console.log(`password: ${total}`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && scriptPath === process.argv[1]) {
  void main();
}

export { parseRanges, generateRepeatedTwice, sumInvalidIds, main };

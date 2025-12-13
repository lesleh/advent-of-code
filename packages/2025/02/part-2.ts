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

function generateRepeatedAtLeastTwice(maxDigits: number): number[] {
  const out = new Set<number>();
  for (let baseLen = 1; baseLen <= Math.floor(maxDigits / 2); baseLen += 1) {
    const minPrefix = 10 ** (baseLen - 1);
    const maxPrefix = 10 ** baseLen;
    for (let repeats = 2; baseLen * repeats <= maxDigits; repeats += 1) {
      const multiplier = 10 ** baseLen;
      for (let prefix = minPrefix; prefix < maxPrefix; prefix += 1) {
        let value = 0;
        for (let i = 0; i < repeats; i += 1) {
          value = value * multiplier + prefix;
        }
        out.add(value);
      }
    }
  }
  return Array.from(out);
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
        break;
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

  const candidates = generateRepeatedAtLeastTwice(maxDigits);
  const total = sumInvalidIds(ranges, candidates);

  console.log(`password: ${total}`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && scriptPath === process.argv[1]) {
  void main();
}

export { parseRanges, generateRepeatedAtLeastTwice, sumInvalidIds, main };

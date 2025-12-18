import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

type Range = {
  start: number;
  end: number;
};

type ParsedInput = {
  ranges: Range[];
  ingredientIds: number[];
};

async function parseInput(filePath: string): Promise<ParsedInput> {
  const text = await readFile(filePath, "utf8");
  const lines = text.trimEnd().split("\n");

  // Find the blank line that separates ranges from ingredient IDs
  const blankLineIndex = lines.findIndex((line) => line.trim().length === 0);

  if (blankLineIndex === -1) {
    throw new Error("No blank line found separating ranges from ingredient IDs");
  }

  // Parse ranges (before blank line)
  const rangeLines = lines.slice(0, blankLineIndex);
  const ranges: Range[] = rangeLines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const [start, end] = line.split("-").map(Number);
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        throw new Error(`Invalid range: ${line}`);
      }
      return { start, end };
    });

  // Parse ingredient IDs (after blank line)
  const ingredientLines = lines.slice(blankLineIndex + 1);
  const ingredientIds: number[] = ingredientLines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const id = Number(line.trim());
      if (!Number.isFinite(id)) {
        throw new Error(`Invalid ingredient ID: ${line}`);
      }
      return id;
    });

  return { ranges, ingredientIds };
}

function isFresh(ingredientId: number, ranges: Range[]): boolean {
  return ranges.some(
    (range) => ingredientId >= range.start && ingredientId <= range.end
  );
}

function countFreshIngredients(
  ranges: Range[],
  ingredientIds: number[]
): number {
  return ingredientIds.filter((id) => isFresh(id, ranges)).length;
}

async function main(): Promise<void> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const inputPath = join(currentDir, "input.txt");

  const { ranges, ingredientIds } = await parseInput(inputPath);
  const freshCount = countFreshIngredients(ranges, ingredientIds);

  console.log(`password: ${freshCount}`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && scriptPath === process.argv[1]) {
  void main();
}

export { parseInput, isFresh, countFreshIngredients, main };

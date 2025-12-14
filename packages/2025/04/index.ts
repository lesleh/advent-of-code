import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Grid = string[];

type Position = {
  row: number;
  col: number;
};

async function parseGrid(filePath: string): Promise<Grid> {
  const text = await readFile(filePath, "utf8");
  const lines = text
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  const width = lines[0].length;
  for (const line of lines) {
    if (line.length !== width) {
      throw new Error("Input grid is not rectangular");
    }
  }

  return lines;
}

function countAdjacentRolls(grid: Grid, position: Position): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let adjacent = 0;

  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) {
        continue;
      }
      const nr = position.row + dr;
      const nc = position.col + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
        continue;
      }
      if (grid[nr][nc] === "@") {
        adjacent += 1;
      }
    }
  }

  return adjacent;
}

function countAccessibleRolls(grid: Grid): number {
  if (grid.length === 0) {
    return 0;
  }

  let accessible = 0;
  for (let row = 0; row < grid.length; row += 1) {
    for (let col = 0; col < grid[row].length; col += 1) {
      if (grid[row][col] !== "@") {
        continue;
      }
      const neighbors = countAdjacentRolls(grid, { row, col });
      if (neighbors < 4) {
        accessible += 1;
      }
    }
  }

  return accessible;
}

async function main(): Promise<void> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const inputPath = join(currentDir, "input.txt");
  const grid = await parseGrid(inputPath);
  const accessible = countAccessibleRolls(grid);
  console.log(`password: ${accessible}`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && scriptPath === process.argv[1]) {
  void main();
}

export { parseGrid, countAccessibleRolls, countAdjacentRolls, main };

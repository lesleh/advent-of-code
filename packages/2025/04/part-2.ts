import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseGrid } from "./index.js";

type Grid = string[];

type MutableGrid = string[][];

type Position = {
  row: number;
  col: number;
};

function toMutableGrid(grid: Grid): MutableGrid {
  return grid.map((row) => row.split(""));
}

function computeAdjacencyCounts(grid: MutableGrid): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const counts = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (grid[row][col] !== "@") {
        continue;
      }
      let adjacent = 0;
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          if (dr === 0 && dc === 0) {
            continue;
          }
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
            continue;
          }
          if (grid[nr][nc] === "@") {
            adjacent += 1;
          }
        }
      }
      counts[row][col] = adjacent;
    }
  }

  return counts;
}

function totalRemovableRolls(grid: Grid): number {
  if (grid.length === 0) {
    return 0;
  }

  const mutable = toMutableGrid(grid);
  const rows = mutable.length;
  const cols = mutable[0].length;
  const counts = computeAdjacencyCounts(mutable);
  const inQueue = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue: Position[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (mutable[row][col] === "@" && counts[row][col] < 4) {
        queue.push({ row, col });
        inQueue[row][col] = true;
      }
    }
  }

  let removed = 0;

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }
    const { row, col } = current;
    inQueue[row][col] = false;

    if (mutable[row][col] !== "@") {
      continue;
    }
    if (counts[row][col] >= 4) {
      continue;
    }

    mutable[row][col] = ".";
    removed += 1;

    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr === 0 && dc === 0) {
          continue;
        }
        const nr = row + dr;
        const nc = col + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
          continue;
        }
        if (mutable[nr][nc] !== "@") {
          continue;
        }
        counts[nr][nc] -= 1;
        if (counts[nr][nc] < 4 && !inQueue[nr][nc]) {
          queue.push({ row: nr, col: nc });
          inQueue[nr][nc] = true;
        }
      }
    }
  }

  return removed;
}

async function main(): Promise<void> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const inputPath = join(currentDir, "input.txt");
  const grid = await parseGrid(inputPath);
  const total = totalRemovableRolls(grid);
  console.log(`password: ${total}`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && scriptPath === process.argv[1]) {
  void main();
}

export { main, totalRemovableRolls, computeAdjacencyCounts, toMutableGrid };

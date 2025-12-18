import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

type Problem = {
  numbers: number[];
  operator: '+' | '*';
};

async function parseInput(filePath: string): Promise<string[]> {
  const text = await readFile(filePath, "utf8");
  return text.trimEnd().split("\n");
}

function isColumnAllSpaces(lines: string[], colIndex: number): boolean {
  for (const line of lines) {
    if (colIndex < line.length && line[colIndex] !== ' ') {
      return false;
    }
  }
  return true;
}

function findProblemRanges(lines: string[]): Array<{ start: number; end: number }> {
  if (lines.length === 0) {
    return [];
  }

  const maxLength = Math.max(...lines.map((line) => line.length));
  const ranges: Array<{ start: number; end: number }> = [];
  let inProblem = false;
  let problemStart = 0;

  for (let col = 0; col <= maxLength; col++) {
    const isSpace = isColumnAllSpaces(lines, col);

    if (!inProblem && !isSpace) {
      // Start of a new problem
      inProblem = true;
      problemStart = col;
    } else if (inProblem && (isSpace || col === maxLength)) {
      // End of current problem
      ranges.push({ start: problemStart, end: col });
      inProblem = false;
    }
  }

  return ranges;
}

function extractProblem(lines: string[], start: number, end: number): Problem {
  const numbers: number[] = [];
  let operator: '+' | '*' | undefined;

  // Process each line within the column range
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const substring = line.slice(start, end).trim();

    if (substring.length === 0) {
      continue;
    }

    // Last line contains the operator
    if (i === lines.length - 1) {
      if (substring === '+' || substring === '*') {
        operator = substring;
      } else {
        throw new Error(`Invalid operator: ${substring}`);
      }
    } else {
      // Other lines contain numbers
      const num = Number(substring);
      if (Number.isFinite(num)) {
        numbers.push(num);
      }
    }
  }

  if (!operator) {
    throw new Error('No operator found');
  }

  return { numbers, operator };
}

function solveProblem(problem: Problem): number {
  if (problem.numbers.length === 0) {
    return 0;
  }

  if (problem.operator === '+') {
    return problem.numbers.reduce((sum, num) => sum + num, 0);
  } else {
    return problem.numbers.reduce((product, num) => product * num, 1);
  }
}

function solveWorksheet(lines: string[]): number {
  const ranges = findProblemRanges(lines);
  let grandTotal = 0;

  for (const range of ranges) {
    const problem = extractProblem(lines, range.start, range.end);
    const answer = solveProblem(problem);
    grandTotal += answer;
  }

  return grandTotal;
}

async function main(): Promise<void> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const inputPath = join(currentDir, "input.txt");

  const lines = await parseInput(inputPath);
  const grandTotal = solveWorksheet(lines);

  console.log(`password: ${grandTotal}`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && scriptPath === process.argv[1]) {
  void main();
}

export {
  parseInput,
  isColumnAllSpaces,
  findProblemRanges,
  extractProblem,
  solveProblem,
  solveWorksheet,
  main,
};

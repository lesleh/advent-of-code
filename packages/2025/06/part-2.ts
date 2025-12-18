import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseInput, findProblemRanges } from "./index.js";

type Problem = {
  numbers: number[];
  operator: '+' | '*';
};

function extractProblemRightToLeft(lines: string[], start: number, end: number): Problem {
  const numbers: number[] = [];
  let operator: '+' | '*' | undefined;

  // Read columns from right to left (end-1 down to start)
  for (let col = end - 1; col >= start; col--) {
    let digits = '';

    // Read top to bottom within this column (excluding last row which has operator)
    for (let row = 0; row < lines.length - 1; row++) {
      const line = lines[row];
      if (col < line.length) {
        const char = line[col];
        if (char !== ' ') {
          digits += char;
        }
      }
    }

    // If we got any digits, convert to number
    if (digits.length > 0) {
      numbers.push(Number(digits));
    }
  }

  // Get operator from last row (any column in the range should work)
  const lastRow = lines[lines.length - 1];
  for (let col = start; col < end; col++) {
    if (col < lastRow.length) {
      const char = lastRow[col];
      if (char === '+' || char === '*') {
        operator = char;
        break;
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
    const problem = extractProblemRightToLeft(lines, range.start, range.end);
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
  extractProblemRightToLeft,
  solveProblem,
  solveWorksheet,
  main,
};

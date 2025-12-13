import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Bank = string;

type ParsedInput = Bank[];

async function parseInput(filePath: string): Promise<ParsedInput> {
  const text = await readFile(filePath, "utf8");
  return text
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function maxTwoDigitFromBank(bank: Bank): number {
  if (bank.length < 2) {
    throw new Error(`Bank too short: ${bank}`);
  }

  let best = -1;
  let maxRightDigit = Number(bank[bank.length - 1]);

  for (let i = bank.length - 2; i >= 0; i -= 1) {
    const leftDigit = Number(bank[i]);
    const candidate = leftDigit * 10 + maxRightDigit;
    if (candidate > best) {
      best = candidate;
    }
    const rightDigit = Number(bank[i]);
    if (rightDigit > maxRightDigit) {
      maxRightDigit = rightDigit;
    }
  }

  return best;
}

function totalMaxJoltage(banks: ParsedInput): number {
  return banks.reduce((sum, bank) => sum + maxTwoDigitFromBank(bank), 0);
}

async function main(): Promise<void> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const inputPath = join(currentDir, "input.txt");
  const banks = await parseInput(inputPath);
  const total = totalMaxJoltage(banks);
  console.log(`password: ${total}`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && scriptPath === process.argv[1]) {
  void main();
}

export { parseInput, maxTwoDigitFromBank, totalMaxJoltage, main };

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseInput } from "./index.js";

type Bank = string;

type ParsedInput = Bank[];

function selectMaxSubsequence(bank: Bank, selectionLength = 12): string {
  if (bank.length < selectionLength) {
    throw new Error(`Bank too short for selection: ${bank}`);
  }

  const stack: string[] = [];
  let remaining = bank.length;

  for (const digit of bank) {
    remaining -= 1;
    while (
      stack.length > 0 &&
      stack[stack.length - 1] < digit &&
      stack.length + remaining >= selectionLength
    ) {
      stack.pop();
    }
    if (stack.length < selectionLength) {
      stack.push(digit);
    }
  }

  if (stack.length !== selectionLength) {
    throw new Error(
      `Failed to select ${selectionLength} digits from bank: ${bank}`,
    );
  }

  return stack.join("");
}

function maxTwelveDigitFromBank(bank: Bank): bigint {
  const best = selectMaxSubsequence(bank, 12);
  return BigInt(best);
}

function totalMaxJoltage(banks: ParsedInput): bigint {
  return banks.reduce((sum, bank) => sum + maxTwelveDigitFromBank(bank), 0n);
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

export { main, maxTwelveDigitFromBank, selectMaxSubsequence, totalMaxJoltage };

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

type Rotation = {
  dir: "L" | "R";
  dist: number;
};

async function parseInput(filePath: string): Promise<Rotation[]> {
  const text = await readFile(filePath, "utf8");
  return text
    .trimEnd()
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const dir = line[0];
      const dist = Number(line.slice(1));
      if (dir !== "L" && dir !== "R") {
        throw new Error(`Invalid direction ${dir} in line ${line}`);
      }
      if (!Number.isFinite(dist)) {
        throw new Error(`Invalid distance in line ${line}`);
      }
      return { dir, dist } as Rotation;
    });
}

function simulateDial(rotations: Rotation[], debug: boolean): number {
  let position = 50;
  let zeroHits = 0;

  rotations.forEach((rotation, index) => {
    const step = rotation.dir === "R" ? 1 : -1;
    let rotationHits = 0;
    for (let i = 0; i < rotation.dist; i += 1) {
      position = (position + step + 100) % 100; // advance one click, wrap 0-99
      if (position === 0) {
        zeroHits += 1;
        rotationHits += 1;
      }
    }
    if (debug) {
      // Debug line: step number, instruction, new position, hits this move, running zero count
      console.log(
        `step ${index + 1}: ${rotation.dir}${
          rotation.dist
        } -> pos ${position} hitsThis ${rotationHits} zeros ${zeroHits}`,
      );
    }
  });

  return zeroHits;
}

async function main(): Promise<void> {
  const debug = process.argv.includes("--debug");
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const inputPath = join(currentDir, "input.txt");

  const rotations = await parseInput(inputPath);
  const password = simulateDial(rotations, debug);

  console.log(`password: ${password}`);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && scriptPath === process.argv[1]) {
  void main();
}

export { parseInput, simulateDial, main };

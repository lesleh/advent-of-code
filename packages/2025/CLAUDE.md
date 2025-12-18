# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Advent of Code solutions repository organized as a pnpm workspace. Each year's solutions are in separate packages (e.g., `packages/2025/` for 2025 solutions). The repository is designed to accommodate solutions from multiple years.

## Architecture

**Package Manager**: pnpm (not npm/yarn)
- Workspace-based monorepo with root at `/Users/leslie/projects/advent-of-code/`
- Each year has its own package (e.g., `packages/2025/` for 2025 solutions)
- Currently contains: 2025

**TypeScript Configuration**:
- ES2022 target with NodeNext module system
- Strict mode enabled with `isolatedModules: true`
- Uses `.js` extensions in imports (required for ESM even though files are `.ts`)
- Type checking with `pnpm run check` (does not emit files)

**Test Framework**: Jest v30 with ESM support
- Requires `NODE_OPTIONS='--experimental-vm-modules'` flag
- Uses ts-jest with `useESM: true`
- Test files use `.test.ts` suffix
- Globals (`describe`, `it`, `expect`) are available without explicit imports
- Module name mapper transforms `.js` imports to work with `.ts` files

## Daily Solution Structure

Within each year's package, each day's puzzle is in its own directory (e.g., `01/`, `02/`, `06/`):
- `index.ts` - Part 1 solution with exported functions and `main()`
- `part-2.ts` - Part 2 solution (when applicable), often imports from `index.js`
- `index.test.ts` - Part 1 tests
- `part-2.test.ts` - Part 2 tests (when applicable)
- `input.txt` - Puzzle input data
- Additional test fixtures as needed

**Solution Pattern**:
```typescript
// Import with .js extension (not .ts)
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Type definitions
type SomeType = { /* ... */ };

// Parsing function
async function parseInput(filePath: string): Promise<SomeType> { /* ... */ }

// Core logic functions (exported for testing)
function solveLogic(/* ... */): number { /* ... */ }

// Main entry point
async function main(): Promise<void> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const inputPath = join(currentDir, "input.txt");
  const result = await parseInput(inputPath);
  console.log(`password: ${result}`);
}

// Self-execution check
const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && scriptPath === process.argv[1]) {
  void main();
}

// Export functions for testing
export { parseInput, solveLogic, main };
```

**Test Pattern**:
```typescript
import { parseInput, solveLogic } from './index.js'; // Note .js extension
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day XX: Title', () => {
  describe('functionName', () => {
    it('should handle basic case', () => {
      // Unit tests
    });
  });

  describe('integration test', () => {
    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const result = await parseInput(inputPath);
      expect(result).toBe(expectedAnswer); // Include verified answer
    });
  });
});
```

## Commands

**Running Solutions**:
```bash
pnpm run day01        # Run day 1 part 1
pnpm run day02:part2  # Run day 2 part 2
# Pattern: dayXX or dayXX:part2
```

**Testing**:
```bash
pnpm test                    # Run all tests
pnpm test 01/                # Test specific day
pnpm test 01/index.test.ts   # Test specific file
pnpm test:watch              # Watch mode
pnpm test:coverage           # Coverage report
```

**Type Checking**:
```bash
pnpm run check  # Type check without emitting files
```

## Key Conventions

1. **Imports must use `.js` extension** even for TypeScript files (ESM requirement)
2. **Part 2 solutions often import from Part 1** using `import { func } from './index.js'`
3. **Test files must include verified puzzle answers** in integration tests
4. **Console output uses `password:` prefix** for consistency
5. **File paths use `import.meta.url`** for ESM-compatible resolution
6. **Package.json scripts added incrementally** as new days are solved

## Adding New Days

When adding a new day (e.g., day 07):
1. Create directory: `mkdir 07`
2. Create `07/index.ts` following the solution pattern above
3. Create `07/index.test.ts` following the test pattern above
4. Add script to `package.json`: `"day07": "tsx 07/index.ts"`
5. Add `input.txt` with puzzle input
6. Run solution: `pnpm run day07`
7. Update test with verified answer
8. For part 2: create `07/part-2.ts` and `07/part-2.test.ts`, add `"day07:part2"` script

## Git Commit Convention

Commits use conventional commit format with year scope:
- `feat(YYYY): add Day XX Part Y solution`
- `test(YYYY): add comprehensive test suites for days XX-XX`
- Examples: `feat(2025): add Day 06 Part 2 solution`
- Include co-authorship footer for Claude Code contributions

## Adding New Years

To add a new year (e.g., 2026):
1. Create year package directory: `mkdir -p packages/2026`
2. Copy structure from existing year: `cp packages/2025/{package.json,tsconfig.json,jest.config.ts,README.md} packages/2026/`
3. Update package name in `package.json` to `@lesleh/advent-of-code-YYYY`
4. Follow daily solution pattern for each day's puzzles

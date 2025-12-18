import { parseInput } from './index.js';
import { mergeRanges, countFreshIds } from './part-2.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { writeFile } from 'node:fs/promises';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day 05 Part 2: Count All Fresh IDs', () => {
  describe('mergeRanges', () => {
    it('should return empty array for empty input', () => {
      const result = mergeRanges([]);
      expect(result).toEqual([]);
    });

    it('should return single range unchanged', () => {
      const ranges = [{ start: 5, end: 10 }];
      const result = mergeRanges(ranges);
      expect(result).toEqual([{ start: 5, end: 10 }]);
    });

    it('should merge overlapping ranges', () => {
      const ranges = [
        { start: 3, end: 5 },
        { start: 4, end: 8 }
      ];
      const result = mergeRanges(ranges);
      expect(result).toEqual([{ start: 3, end: 8 }]);
    });

    it('should merge adjacent ranges', () => {
      const ranges = [
        { start: 1, end: 3 },
        { start: 4, end: 6 }
      ];
      const result = mergeRanges(ranges);
      // Adjacent ranges (3 and 4) should merge
      expect(result).toEqual([{ start: 1, end: 6 }]);
    });

    it('should not merge disjoint ranges', () => {
      const ranges = [
        { start: 1, end: 3 },
        { start: 5, end: 7 }
      ];
      const result = mergeRanges(ranges);
      expect(result).toEqual([
        { start: 1, end: 3 },
        { start: 5, end: 7 }
      ]);
    });

    it('should handle ranges given in random order', () => {
      const ranges = [
        { start: 10, end: 15 },
        { start: 1, end: 5 },
        { start: 20, end: 25 }
      ];
      const result = mergeRanges(ranges);
      expect(result).toEqual([
        { start: 1, end: 5 },
        { start: 10, end: 15 },
        { start: 20, end: 25 }
      ]);
    });

    it('should merge multiple overlapping ranges', () => {
      const ranges = [
        { start: 3, end: 5 },
        { start: 10, end: 14 },
        { start: 16, end: 20 },
        { start: 12, end: 18 }
      ];
      const result = mergeRanges(ranges);
      // 3-5 stays separate
      // 10-14 and 12-18 overlap -> merge to 10-18
      // 10-18 and 16-20 overlap -> merge to 10-20
      expect(result).toEqual([
        { start: 3, end: 5 },
        { start: 10, end: 20 }
      ]);
    });

    it('should handle complete overlap', () => {
      const ranges = [
        { start: 1, end: 10 },
        { start: 3, end: 7 }
      ];
      const result = mergeRanges(ranges);
      expect(result).toEqual([{ start: 1, end: 10 }]);
    });

    it('should handle ranges with same start', () => {
      const ranges = [
        { start: 5, end: 10 },
        { start: 5, end: 15 }
      ];
      const result = mergeRanges(ranges);
      expect(result).toEqual([{ start: 5, end: 15 }]);
    });

    it('should handle ranges with same end', () => {
      const ranges = [
        { start: 5, end: 10 },
        { start: 8, end: 10 }
      ];
      const result = mergeRanges(ranges);
      expect(result).toEqual([{ start: 5, end: 10 }]);
    });
  });

  describe('countFreshIds', () => {
    it('should count IDs in single range', () => {
      const ranges = [{ start: 5, end: 10 }];
      const count = countFreshIds(ranges);
      // 5, 6, 7, 8, 9, 10 = 6 IDs
      expect(count).toBe(6);
    });

    it('should count IDs in example ranges', () => {
      const ranges = [
        { start: 3, end: 5 },
        { start: 10, end: 14 },
        { start: 16, end: 20 },
        { start: 12, end: 18 }
      ];
      const count = countFreshIds(ranges);
      // After merging: 3-5 (3 IDs), 10-20 (11 IDs) = 14 total
      expect(count).toBe(14);
    });

    it('should return 0 for empty ranges', () => {
      const count = countFreshIds([]);
      expect(count).toBe(0);
    });

    it('should count IDs in non-overlapping ranges', () => {
      const ranges = [
        { start: 1, end: 3 },
        { start: 5, end: 7 },
        { start: 10, end: 12 }
      ];
      const count = countFreshIds(ranges);
      // 3 + 3 + 3 = 9
      expect(count).toBe(9);
    });

    it('should handle single ID range', () => {
      const ranges = [{ start: 5, end: 5 }];
      const count = countFreshIds(ranges);
      expect(count).toBe(1);
    });

    it('should correctly count after merging adjacent ranges', () => {
      const ranges = [
        { start: 1, end: 3 },
        { start: 4, end: 6 }
      ];
      const count = countFreshIds(ranges);
      // After merging: 1-6 = 6 IDs
      expect(count).toBe(6);
    });

    it('should handle large ranges', () => {
      const ranges = [
        { start: 1, end: 1000 },
        { start: 500, end: 1500 }
      ];
      const count = countFreshIds(ranges);
      // After merging: 1-1500 = 1500 IDs
      expect(count).toBe(1500);
    });
  });

  describe('integration test', () => {
    it('should solve the example', async () => {
      const exampleInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;
      const testPath = join(currentDir, 'test-part2-example.txt');
      await writeFile(testPath, exampleInput);

      const { ranges } = await parseInput(testPath);
      const result = countFreshIds(ranges);

      expect(result).toBe(14);
    });

    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const { ranges } = await parseInput(inputPath);
      const result = countFreshIds(ranges);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(result).toBe(345821388687084);
    });
  });
});

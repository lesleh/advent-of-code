import { parseInput, isFresh, countFreshIngredients } from './index.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day 05 Part 1: Cafeteria Ingredient Freshness', () => {
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

  describe('parseInput', () => {
    it('should parse example input correctly', async () => {
      const testPath = join(currentDir, 'test-example.txt');
      await writeFile(testPath, exampleInput);

      const { ranges, ingredientIds } = await parseInput(testPath);

      expect(ranges).toHaveLength(4);
      expect(ranges[0]).toEqual({ start: 3, end: 5 });
      expect(ranges[1]).toEqual({ start: 10, end: 14 });
      expect(ranges[2]).toEqual({ start: 16, end: 20 });
      expect(ranges[3]).toEqual({ start: 12, end: 18 });

      expect(ingredientIds).toHaveLength(6);
      expect(ingredientIds).toEqual([1, 5, 8, 11, 17, 32]);
    });

    it('should handle ranges and IDs with whitespace', async () => {
      const input = `1-5\n\n  10  \n  20  `;
      const testPath = join(currentDir, 'test-whitespace.txt');
      await writeFile(testPath, input);

      const { ranges, ingredientIds } = await parseInput(testPath);

      expect(ranges).toHaveLength(1);
      expect(ingredientIds).toEqual([10, 20]);
    });

    it('should throw error when no blank line found', async () => {
      const input = `1-5\n10`;
      const testPath = join(currentDir, 'test-no-blank.txt');
      await writeFile(testPath, input);

      await expect(parseInput(testPath)).rejects.toThrow(
        'No blank line found'
      );
    });

    it('should throw error for invalid range format', async () => {
      const input = `1-x\n\n10`;
      const testPath = join(currentDir, 'test-invalid-range.txt');
      await writeFile(testPath, input);

      await expect(parseInput(testPath)).rejects.toThrow('Invalid range');
    });

    it('should throw error for invalid ingredient ID', async () => {
      const input = `1-5\n\nabc`;
      const testPath = join(currentDir, 'test-invalid-id.txt');
      await writeFile(testPath, input);

      await expect(parseInput(testPath)).rejects.toThrow('Invalid ingredient ID');
    });
  });

  describe('isFresh', () => {
    const ranges = [
      { start: 3, end: 5 },
      { start: 10, end: 14 },
      { start: 16, end: 20 },
      { start: 12, end: 18 }
    ];

    it('should return false for ID below all ranges', () => {
      expect(isFresh(1, ranges)).toBe(false);
    });

    it('should return true for ID in first range', () => {
      expect(isFresh(5, ranges)).toBe(true);
      expect(isFresh(3, ranges)).toBe(true);
      expect(isFresh(4, ranges)).toBe(true);
    });

    it('should return false for ID between ranges', () => {
      expect(isFresh(8, ranges)).toBe(false);
    });

    it('should return true for ID in middle range', () => {
      expect(isFresh(11, ranges)).toBe(true);
      expect(isFresh(13, ranges)).toBe(true);
    });

    it('should return true for ID in overlapping ranges', () => {
      // 17 is in both 16-20 and 12-18
      expect(isFresh(17, ranges)).toBe(true);
    });

    it('should return false for ID above all ranges', () => {
      expect(isFresh(32, ranges)).toBe(false);
    });

    it('should return true for ID at range boundaries', () => {
      expect(isFresh(3, ranges)).toBe(true);  // Start of 3-5
      expect(isFresh(5, ranges)).toBe(true);  // End of 3-5
      expect(isFresh(10, ranges)).toBe(true); // Start of 10-14
      expect(isFresh(14, ranges)).toBe(true); // End of 10-14
    });

    it('should return false for empty ranges', () => {
      expect(isFresh(5, [])).toBe(false);
    });

    it('should handle single range', () => {
      const singleRange = [{ start: 10, end: 20 }];
      expect(isFresh(15, singleRange)).toBe(true);
      expect(isFresh(5, singleRange)).toBe(false);
      expect(isFresh(25, singleRange)).toBe(false);
    });
  });

  describe('countFreshIngredients', () => {
    const ranges = [
      { start: 3, end: 5 },
      { start: 10, end: 14 },
      { start: 16, end: 20 },
      { start: 12, end: 18 }
    ];

    it('should count fresh ingredients from example', () => {
      const ingredientIds = [1, 5, 8, 11, 17, 32];
      const count = countFreshIngredients(ranges, ingredientIds);
      // Fresh: 5, 11, 17 = 3
      expect(count).toBe(3);
    });

    it('should return 0 when all ingredients are spoiled', () => {
      const ingredientIds = [1, 2, 6, 7, 8, 9];
      const count = countFreshIngredients(ranges, ingredientIds);
      expect(count).toBe(0);
    });

    it('should count all when all ingredients are fresh', () => {
      const ingredientIds = [3, 4, 5, 11, 17];
      const count = countFreshIngredients(ranges, ingredientIds);
      expect(count).toBe(5);
    });

    it('should return 0 for empty ingredient list', () => {
      const count = countFreshIngredients(ranges, []);
      expect(count).toBe(0);
    });

    it('should return 0 for empty ranges', () => {
      const ingredientIds = [1, 5, 10];
      const count = countFreshIngredients([], ingredientIds);
      expect(count).toBe(0);
    });

    it('should handle duplicate ingredient IDs', () => {
      const ingredientIds = [5, 5, 5, 11];
      const count = countFreshIngredients(ranges, ingredientIds);
      // All 4 are fresh (even duplicates are counted)
      expect(count).toBe(4);
    });
  });

  describe('integration test', () => {
    it('should solve the example', async () => {
      const testPath = join(currentDir, 'test-integration.txt');
      await writeFile(testPath, exampleInput);

      const { ranges, ingredientIds } = await parseInput(testPath);
      const result = countFreshIngredients(ranges, ingredientIds);

      expect(result).toBe(3);
    });

    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const { ranges, ingredientIds } = await parseInput(inputPath);
      const result = countFreshIngredients(ranges, ingredientIds);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(result).toBe(733);
    });
  });
});

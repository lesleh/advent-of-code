import { parseRanges, generateRepeatedAtLeastTwice, sumInvalidIds } from './part-2.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day 02 Part 2: Repeated At Least Twice', () => {
  describe('parseRanges', () => {
    it('should parse ranges from file', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const ranges = await parseRanges(inputPath);

      expect(ranges).toBeDefined();
      expect(Array.isArray(ranges)).toBe(true);
      expect(ranges.length).toBeGreaterThan(0);
    });
  });

  describe('generateRepeatedAtLeastTwice', () => {
    it('should generate numbers with 2-digit patterns', () => {
      const result = generateRepeatedAtLeastTwice(4);
      // 2x repetition: 11, 22, ..., 99
      expect(result).toContain(11);
      expect(result).toContain(99);
    });

    it('should generate numbers with 3x repetition', () => {
      const result = generateRepeatedAtLeastTwice(6);
      // 3x repetition: 111, 222, ..., 999
      expect(result).toContain(111);
      expect(result).toContain(222);
      expect(result).toContain(999);
    });

    it('should generate numbers with 4x repetition', () => {
      const result = generateRepeatedAtLeastTwice(8);
      // 4x repetition: 1111, 2222, ..., 9999
      expect(result).toContain(1111);
      expect(result).toContain(9999);
    });

    it('should include patterns repeated exactly 2 times', () => {
      const result = generateRepeatedAtLeastTwice(4);
      // 12 repeated 2 times = 1212
      expect(result).toContain(1212);
      // 23 repeated 2 times = 2323
      expect(result).toContain(2323);
    });

    it('should deduplicate results', () => {
      const result = generateRepeatedAtLeastTwice(6);
      const uniqueResults = new Set(result);
      expect(result.length).toBe(uniqueResults.size);
    });

    it('should return empty array for maxDigits less than 2', () => {
      const result = generateRepeatedAtLeastTwice(1);
      expect(result).toEqual([]);
    });

    it('should include more numbers than generateRepeatedTwice', () => {
      // Part 2 includes patterns repeated 2+ times, not just exactly 2
      const result = generateRepeatedAtLeastTwice(6);
      // Should include 11 (1 repeated 2x), 111 (1 repeated 3x), etc.
      expect(result).toContain(11);
      expect(result).toContain(111);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('sumInvalidIds', () => {
    it('should sum candidates that fall within ranges', () => {
      const ranges = [{ start: 10, end: 20 }, { start: 30, end: 40 }];
      const candidates = [11, 15, 35];
      const result = sumInvalidIds(ranges, candidates);
      expect(result).toBe(11 + 15 + 35);
    });

    it('should deduplicate candidates', () => {
      const ranges = [{ start: 10, end: 20 }];
      const candidates = [11, 11, 11];
      const result = sumInvalidIds(ranges, candidates);
      expect(result).toBe(11);
    });

    it('should handle empty arrays', () => {
      const ranges = [{ start: 10, end: 20 }];
      const candidates: number[] = [];
      const result = sumInvalidIds(ranges, candidates);
      expect(result).toBe(0);
    });
  });

  describe('integration test', () => {
    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const ranges = await parseRanges(inputPath);
      const candidates = generateRepeatedAtLeastTwice(12);
      const result = sumInvalidIds(ranges, candidates);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(result).toBe(44143124633);
    });
  });
});

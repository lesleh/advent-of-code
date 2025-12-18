import { parseRanges, generateRepeatedTwice, sumInvalidIds } from './index.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day 02 Part 1: Range and Repeated Numbers', () => {
  describe('parseRanges', () => {
    it('should parse ranges from file', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const ranges = await parseRanges(inputPath);

      expect(ranges).toBeDefined();
      expect(Array.isArray(ranges)).toBe(true);
      expect(ranges.length).toBeGreaterThan(0);
    });

    it('should parse ranges with correct start and end properties', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const ranges = await parseRanges(inputPath);

      ranges.forEach((range) => {
        expect(range).toHaveProperty('start');
        expect(range).toHaveProperty('end');
        expect(typeof range.start).toBe('number');
        expect(typeof range.end).toBe('number');
        expect(range.start).toBeLessThanOrEqual(range.end);
      });
    });
  });

  describe('generateRepeatedTwice', () => {
    it('should generate numbers with maxHalfLength 1', () => {
      const result = generateRepeatedTwice(1);
      expect(result).toContain(11);
      expect(result).toContain(22);
      expect(result).toContain(99);
      expect(result.length).toBe(9); // 11, 22, ..., 99
    });

    it('should generate numbers with maxHalfLength 2', () => {
      const result = generateRepeatedTwice(2);
      // Should include 11, 22, ..., 99 (length 1)
      // And 1111, 1212, 1313, ..., 9999 (length 2)
      expect(result).toContain(11);
      expect(result).toContain(1111);
      expect(result).toContain(1212);
      expect(result).toContain(9999);
      expect(result.length).toBeGreaterThan(9);
    });

    it('should generate repeated patterns correctly', () => {
      const result = generateRepeatedTwice(2);
      // 1212 has pattern "12" repeated twice
      expect(result).toContain(1212);
      // 2323 has pattern "23" repeated twice
      expect(result).toContain(2323);
    });

    it('should return empty array for maxHalfLength 0', () => {
      const result = generateRepeatedTwice(0);
      expect(result).toEqual([]);
    });
  });

  describe('sumInvalidIds', () => {
    it('should sum candidates that fall within ranges', () => {
      const ranges = [{ start: 10, end: 20 }, { start: 30, end: 40 }];
      const candidates = [11, 15, 35];
      const result = sumInvalidIds(ranges, candidates);
      expect(result).toBe(11 + 15 + 35);
    });

    it('should exclude candidates outside ranges', () => {
      const ranges = [{ start: 10, end: 20 }];
      const candidates = [5, 15, 25];
      const result = sumInvalidIds(ranges, candidates);
      expect(result).toBe(15); // Only 15 is in range
    });

    it('should deduplicate candidates', () => {
      const ranges = [{ start: 10, end: 20 }];
      const candidates = [11, 11, 11];
      const result = sumInvalidIds(ranges, candidates);
      expect(result).toBe(11); // Should only count once
    });

    it('should handle empty candidates array', () => {
      const ranges = [{ start: 10, end: 20 }];
      const candidates: number[] = [];
      const result = sumInvalidIds(ranges, candidates);
      expect(result).toBe(0);
    });

    it('should handle empty ranges array', () => {
      const ranges: Array<{ start: number; end: number }> = [];
      const candidates = [11, 22, 33];
      const result = sumInvalidIds(ranges, candidates);
      expect(result).toBe(0);
    });

    it('should handle overlapping ranges', () => {
      const ranges = [{ start: 10, end: 20 }, { start: 15, end: 25 }];
      const candidates = [11, 18, 22];
      const result = sumInvalidIds(ranges, candidates);
      // 11 matches first range, 18 matches both, 22 matches second
      expect(result).toBe(11 + 18 + 22);
    });
  });

  describe('integration test', () => {
    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const ranges = await parseRanges(inputPath);
      const candidates = generateRepeatedTwice(6);
      const result = sumInvalidIds(ranges, candidates);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(result).toBe(23560874270);
    });
  });
});

import { parseInput, maxTwoDigitFromBank, totalMaxJoltage } from './index.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day 03 Part 1: Bank Joltage', () => {
  describe('parseInput', () => {
    it('should parse banks from file', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const banks = await parseInput(inputPath);

      expect(banks).toBeDefined();
      expect(Array.isArray(banks)).toBe(true);
      expect(banks.length).toBeGreaterThan(0);
    });

    it('should parse non-empty strings', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const banks = await parseInput(inputPath);

      banks.forEach((bank) => {
        expect(typeof bank).toBe('string');
        expect(bank.length).toBeGreaterThan(0);
      });
    });
  });

  describe('maxTwoDigitFromBank', () => {
    it('should find maximum 2-digit number from simple bank', () => {
      // "123" -> max is 23 (2 followed by 3)
      expect(maxTwoDigitFromBank('123')).toBe(23);
    });

    it('should handle descending order', () => {
      // "321" -> scans right-to-left, max is 32 (3 followed by 2)
      expect(maxTwoDigitFromBank('321')).toBe(32);
    });

    it('should handle all same digits', () => {
      // "555" -> max is 55
      expect(maxTwoDigitFromBank('555')).toBe(55);
    });

    it('should handle exactly 2 digits', () => {
      expect(maxTwoDigitFromBank('42')).toBe(42);
      expect(maxTwoDigitFromBank('99')).toBe(99);
      expect(maxTwoDigitFromBank('10')).toBe(10);
    });

    it('should use greedy approach - pick digit with max to right', () => {
      // "1923" -> could be 19, 92, 23
      // Greedy: position 0 (1) pairs with max to right (9) = 19
      // But position 1 (9) pairs with max to right (3) = 93
      // Position 2 (2) pairs with 3 = 23
      // Max should be 93
      expect(maxTwoDigitFromBank('1923')).toBe(93);
    });

    it('should handle longer banks', () => {
      // "987654321" -> max should be 98
      expect(maxTwoDigitFromBank('987654321')).toBe(98);
    });

    it('should handle banks with zeros', () => {
      expect(maxTwoDigitFromBank('102')).toBe(12);
      expect(maxTwoDigitFromBank('900')).toBe(90);
    });
  });

  describe('totalMaxJoltage', () => {
    it('should sum max joltages from multiple banks', () => {
      const banks = ['123', '321', '555'];
      // 23 + 32 + 55 = 110
      expect(totalMaxJoltage(banks)).toBe(110);
    });

    it('should handle single bank', () => {
      expect(totalMaxJoltage(['42'])).toBe(42);
    });

    it('should return 0 for empty array', () => {
      expect(totalMaxJoltage([])).toBe(0);
    });

    it('should handle banks with varying lengths', () => {
      const banks = ['12', '123', '1234'];
      const result = totalMaxJoltage(banks);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('integration test', () => {
    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const banks = await parseInput(inputPath);
      const result = totalMaxJoltage(banks);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(result).toBe(17142);
    });
  });
});

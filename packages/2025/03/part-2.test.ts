import { parseInput } from './index.js';
import { selectMaxSubsequence, maxTwelveDigitFromBank, totalMaxJoltage } from './part-2.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day 03 Part 2: Maximum Subsequence Selection', () => {
  describe('selectMaxSubsequence', () => {
    it('should select maximum subsequence from simple bank', () => {
      // "987654321098" with length 6 -> greedy selects "987698"
      const result = selectMaxSubsequence('987654321098', 6);
      expect(result).toBe('987698');
    });

    it('should use greedy algorithm for selection', () => {
      // "54321" with length 3 -> should select "543"
      const result = selectMaxSubsequence('54321', 3);
      expect(result).toBe('543');
    });

    it('should handle bank equal to selection length', () => {
      const result = selectMaxSubsequence('123456', 6);
      expect(result).toBe('123456');
    });

    it('should select lexicographically maximum subsequence', () => {
      // "52341" with length 3 -> should select "541" (not "523" or "534")
      const result = selectMaxSubsequence('52341', 3);
      expect(result).toBe('541');
    });

    it('should work with different selection lengths', () => {
      const bank = '987654321';
      expect(selectMaxSubsequence(bank, 3)).toBe('987');
      expect(selectMaxSubsequence(bank, 5)).toBe('98765');
      expect(selectMaxSubsequence(bank, 9)).toBe('987654321');
    });

    it('should handle banks with repeated digits', () => {
      const result = selectMaxSubsequence('11111', 3);
      expect(result).toBe('111');
    });

    it('should throw error when bank is too short', () => {
      expect(() => selectMaxSubsequence('12', 5)).toThrow();
    });

    it('should handle complex patterns', () => {
      // "91283746" with length 4 -> greedy should select "9876" or similar max
      const result = selectMaxSubsequence('91283746', 4);
      expect(result.length).toBe(4);
      // Should start with 9 (highest digit)
      expect(result[0]).toBe('9');
    });
  });

  describe('maxTwelveDigitFromBank', () => {
    it('should return BigInt', () => {
      const result = maxTwelveDigitFromBank('123456789012345');
      expect(typeof result).toBe('bigint');
    });

    it('should select 12 digits', () => {
      const result = maxTwelveDigitFromBank('123456789012345');
      const resultStr = result.toString();
      expect(resultStr.length).toBe(12);
    });

    it('should convert selected subsequence to BigInt', () => {
      const bank = '999999999999000';
      const result = maxTwelveDigitFromBank(bank);
      // Should select twelve 9s
      expect(result).toBe(999999999999n);
    });
  });

  describe('totalMaxJoltage', () => {
    it('should sum BigInt values from multiple banks', () => {
      const banks = ['100000000000000', '100000000000000'];
      const result = totalMaxJoltage(banks);
      expect(typeof result).toBe('bigint');
      expect(result).toBeGreaterThan(0n);
    });

    it('should handle single bank', () => {
      const result = totalMaxJoltage(['123456789012345']);
      expect(typeof result).toBe('bigint');
      expect(result).toBeGreaterThan(0n);
    });

    it('should return 0n for empty array', () => {
      const result = totalMaxJoltage([]);
      expect(result).toBe(0n);
    });

    it('should properly add BigInt values', () => {
      // Create banks that will generate known values
      const banks = ['999999999999000', '111111111111000'];
      const result = totalMaxJoltage(banks);
      expect(result).toBe(999999999999n + 111111111111n);
    });
  });

  describe('integration test', () => {
    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const banks = await parseInput(inputPath);
      const result = totalMaxJoltage(banks);

      expect(typeof result).toBe('bigint');
      expect(result).toBeGreaterThan(0n);
      expect(result).toBe(169935154100102n);
    });
  });
});

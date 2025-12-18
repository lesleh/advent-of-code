import {
  parseInput,
  isColumnAllSpaces,
  findProblemRanges,
  extractProblem,
  solveProblem,
  solveWorksheet,
} from './index.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { writeFile } from 'node:fs/promises';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day 06: Trash Compactor Math Worksheet', () => {
  const exampleInput = `123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +  `;

  describe('parseInput', () => {
    it('should parse lines from file', async () => {
      const testPath = join(currentDir, 'test-parse.txt');
      await writeFile(testPath, exampleInput);

      const lines = await parseInput(testPath);

      expect(lines).toHaveLength(4);
      expect(lines[0]).toBe('123 328  51 64');
      expect(lines[3]).toBe('*   +   *   +');
    });
  });

  describe('isColumnAllSpaces', () => {
    const lines = [
      '123 328',
      ' 45 64 ',
      '  6 98 ',
    ];

    it('should return false for column with non-space characters', () => {
      expect(isColumnAllSpaces(lines, 0)).toBe(false); // '1', ' ', ' '
      expect(isColumnAllSpaces(lines, 2)).toBe(false); // '3', '5', '6'
    });

    it('should return true for column with only spaces', () => {
      expect(isColumnAllSpaces(lines, 3)).toBe(true); // ' ', ' ', ' '
    });

    it('should handle column beyond line length', () => {
      expect(isColumnAllSpaces(lines, 100)).toBe(true);
    });
  });

  describe('findProblemRanges', () => {
    it('should find problem ranges in example', () => {
      const lines = exampleInput.split('\n');
      const ranges = findProblemRanges(lines);

      expect(ranges.length).toBeGreaterThanOrEqual(4);
      expect(ranges[0].start).toBe(0);
      // First problem is columns 0-2 (123, 45, 6)
      expect(ranges[0].end).toBe(3);
    });

    it('should handle single problem', () => {
      const lines = ['123', '456', '*  '];
      const ranges = findProblemRanges(lines);

      expect(ranges).toHaveLength(1);
      expect(ranges[0].start).toBe(0);
    });

    it('should return empty array for empty input', () => {
      const ranges = findProblemRanges([]);
      expect(ranges).toEqual([]);
    });

    it('should handle problems separated by single space column', () => {
      const lines = [
        '12 34',
        '56 78',
        '*  + ',
      ];
      const ranges = findProblemRanges(lines);

      expect(ranges).toHaveLength(2);
      expect(ranges[0]).toEqual({ start: 0, end: 2 });
      expect(ranges[1]).toEqual({ start: 3, end: 5 });
    });
  });

  describe('extractProblem', () => {
    it('should extract problem with multiplication', () => {
      const lines = [
        '123',
        ' 45',
        '  6',
        '*  ',
      ];
      const problem = extractProblem(lines, 0, 3);

      expect(problem.numbers).toEqual([123, 45, 6]);
      expect(problem.operator).toBe('*');
    });

    it('should extract problem with addition', () => {
      const lines = [
        '328',
        ' 64',
        ' 98',
        '  +',
      ];
      const problem = extractProblem(lines, 0, 3);

      expect(problem.numbers).toEqual([328, 64, 98]);
      expect(problem.operator).toBe('+');
    });

    it('should handle numbers with leading spaces', () => {
      const lines = [
        ' 51',
        '387',
        '215',
        '* ',
      ];
      const problem = extractProblem(lines, 0, 3);

      expect(problem.numbers).toEqual([51, 387, 215]);
      expect(problem.operator).toBe('*');
    });

    it('should throw error for invalid operator', () => {
      const lines = [
        '123',
        '456',
        '- ',
      ];

      expect(() => extractProblem(lines, 0, 3)).toThrow('Invalid operator');
    });

    it('should handle empty rows', () => {
      const lines = [
        '123',
        '   ',
        '456',
        '*  ',
      ];
      const problem = extractProblem(lines, 0, 3);

      expect(problem.numbers).toEqual([123, 456]);
      expect(problem.operator).toBe('*');
    });
  });

  describe('solveProblem', () => {
    it('should multiply numbers', () => {
      const problem = { numbers: [123, 45, 6], operator: '*' as const };
      const result = solveProblem(problem);

      expect(result).toBe(33210);
    });

    it('should add numbers', () => {
      const problem = { numbers: [328, 64, 98], operator: '+' as const };
      const result = solveProblem(problem);

      expect(result).toBe(490);
    });

    it('should handle single number with addition', () => {
      const problem = { numbers: [42], operator: '+' as const };
      const result = solveProblem(problem);

      expect(result).toBe(42);
    });

    it('should handle single number with multiplication', () => {
      const problem = { numbers: [42], operator: '*' as const };
      const result = solveProblem(problem);

      expect(result).toBe(42);
    });

    it('should return 0 for empty numbers with addition', () => {
      const problem = { numbers: [], operator: '+' as const };
      const result = solveProblem(problem);

      expect(result).toBe(0);
    });

    it('should return 0 for empty numbers with multiplication', () => {
      const problem = { numbers: [], operator: '*' as const };
      const result = solveProblem(problem);

      expect(result).toBe(0);
    });
  });

  describe('solveWorksheet', () => {
    it('should solve example worksheet', () => {
      const lines = exampleInput.split('\n');
      const grandTotal = solveWorksheet(lines);

      // 123 * 45 * 6 = 33210
      // 328 + 64 + 98 = 490
      // 51 * 387 * 215 = 4243455
      // 64 + 23 + 314 = 401
      // Total: 33210 + 490 + 4243455 + 401 = 4277556
      expect(grandTotal).toBe(4277556);
    });

    it('should handle single problem', () => {
      const lines = [
        '10',
        '20',
        '+ ',
      ];
      const grandTotal = solveWorksheet(lines);

      expect(grandTotal).toBe(30);
    });

    it('should handle multiple addition problems', () => {
      const lines = [
        '10 20',
        '5  10',
        '+  + ',
      ];
      const grandTotal = solveWorksheet(lines);

      // 10 + 5 = 15, 20 + 10 = 30, total = 45
      expect(grandTotal).toBe(45);
    });

    it('should handle empty worksheet', () => {
      const grandTotal = solveWorksheet([]);
      expect(grandTotal).toBe(0);
    });
  });

  describe('integration test', () => {
    it('should solve the example', async () => {
      const testPath = join(currentDir, 'test-integration.txt');
      await writeFile(testPath, exampleInput);

      const lines = await parseInput(testPath);
      const result = solveWorksheet(lines);

      expect(result).toBe(4277556);
    });

    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const lines = await parseInput(inputPath);
      const result = solveWorksheet(lines);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(result).toBe(6209956042374);
    });
  });
});

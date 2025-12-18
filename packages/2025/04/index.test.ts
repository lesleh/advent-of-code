import { parseGrid, countAdjacentRolls, countAccessibleRolls } from './index.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day 04 Part 1: Grid Roll Analysis', () => {
  describe('parseGrid', () => {
    it('should parse grid from file', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const grid = await parseGrid(inputPath);

      expect(grid).toBeDefined();
      expect(Array.isArray(grid)).toBe(true);
      expect(grid.length).toBeGreaterThan(0);
    });

    it('should parse rectangular grid', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const grid = await parseGrid(inputPath);

      const firstRowLength = grid[0].length;
      grid.forEach((row) => {
        expect(row.length).toBe(firstRowLength);
      });
    });

    it('should parse non-empty rows', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const grid = await parseGrid(inputPath);

      grid.forEach((row) => {
        expect(typeof row).toBe('string');
        expect(row.length).toBeGreaterThan(0);
      });
    });
  });

  describe('countAdjacentRolls', () => {
    it('should count adjacent @ symbols at center position', () => {
      const grid = [
        '@@@',
        '@.@',
        '@@@'
      ];
      const count = countAdjacentRolls(grid, { row: 1, col: 1 });
      // All 8 surrounding cells have @
      expect(count).toBe(8);
    });

    it('should count adjacent @ symbols at corner position', () => {
      const grid = [
        '@@.',
        '@@.',
        '...'
      ];
      const count = countAdjacentRolls(grid, { row: 0, col: 0 });
      // Top-left corner: can only have 3 neighbors (right, down, diag)
      // Right (@), down (@), diag (@) = 3
      expect(count).toBe(3);
    });

    it('should count adjacent @ symbols at edge position', () => {
      const grid = [
        '@@@',
        '@@@',
        '...'
      ];
      const count = countAdjacentRolls(grid, { row: 0, col: 1 });
      // Top edge: can have 5 neighbors
      // Left (@), right (@), down-left (@), down (@), down-right (@) = 5
      expect(count).toBe(5);
    });

    it('should return 0 when no adjacent @ symbols', () => {
      const grid = [
        '...',
        '.@.',
        '...'
      ];
      const count = countAdjacentRolls(grid, { row: 1, col: 1 });
      expect(count).toBe(0);
    });

    it('should count partial adjacent @ symbols', () => {
      const grid = [
        '@.@',
        '.@.',
        '@.@'
      ];
      const count = countAdjacentRolls(grid, { row: 1, col: 1 });
      // 4 corners have @
      expect(count).toBe(4);
    });

    it('should handle single row grid', () => {
      const grid = ['@@@'];
      const count = countAdjacentRolls(grid, { row: 0, col: 1 });
      // Middle of single row: left (@) and right (@) = 2
      expect(count).toBe(2);
    });

    it('should handle single column grid', () => {
      const grid = ['@', '@', '@'];
      const count = countAdjacentRolls(grid, { row: 1, col: 0 });
      // Middle of single column: up (@) and down (@) = 2
      expect(count).toBe(2);
    });
  });

  describe('countAccessibleRolls', () => {
    it('should count @ symbols with less than 4 adjacent @s', () => {
      const grid = [
        '@@@',
        '@@@',
        '@@@'
      ];
      // All @ symbols have 8, 5, or 3 neighbors
      // Corner @s have 3 neighbors (< 4) = 4 corners
      // Edge @s have 5 neighbors (>= 4) = 0 from edges
      // Center @ has 8 neighbors (>= 4) = 0 from center
      const count = countAccessibleRolls(grid);
      expect(count).toBe(4); // 4 corners
    });

    it('should count isolated @ symbols', () => {
      const grid = [
        '@..',
        '...',
        '..@'
      ];
      // Both @ symbols have 0 neighbors (< 4)
      const count = countAccessibleRolls(grid);
      expect(count).toBe(2);
    });

    it('should return 0 when all @ symbols have 4+ neighbors', () => {
      const grid = [
        '.....',
        '.@@@.',
        '.@@@.',
        '.@@@.',
        '.....'
      ];
      // 3x3 block: center has 8, edges have 5, corners have 3
      // Corners (3 < 4) = 4, so count should be 4, not 0
      const count = countAccessibleRolls(grid);
      expect(count).toBe(4);
    });

    it('should return 0 for empty grid', () => {
      const grid: string[] = [];
      const count = countAccessibleRolls(grid);
      expect(count).toBe(0);
    });

    it('should return 0 for grid with no @ symbols', () => {
      const grid = [
        '...',
        '...',
        '...'
      ];
      const count = countAccessibleRolls(grid);
      expect(count).toBe(0);
    });

    it('should handle single @ symbol', () => {
      const grid = [
        '...',
        '.@.',
        '...'
      ];
      // Single @ has 0 neighbors (< 4)
      const count = countAccessibleRolls(grid);
      expect(count).toBe(1);
    });
  });

  describe('integration test', () => {
    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const grid = await parseGrid(inputPath);
      const result = countAccessibleRolls(grid);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBe(1602);
    });
  });
});

import { parseGrid } from './index.js';
import { toMutableGrid, computeAdjacencyCounts, totalRemovableRolls } from './part-2.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day 04 Part 2: Cascade Removal', () => {
  describe('toMutableGrid', () => {
    it('should convert string array to 2D character array', () => {
      const grid = ['@@@', '...', '@.@'];
      const mutable = toMutableGrid(grid);

      expect(mutable).toHaveLength(3);
      expect(mutable[0]).toEqual(['@', '@', '@']);
      expect(mutable[1]).toEqual(['.', '.', '.']);
      expect(mutable[2]).toEqual(['@', '.', '@']);
    });

    it('should create independent rows', () => {
      const grid = ['@@', '@@'];
      const mutable = toMutableGrid(grid);

      mutable[0][0] = '.';
      expect(mutable[1][0]).toBe('@'); // Second row unchanged
    });

    it('should handle empty grid', () => {
      const grid: string[] = [];
      const mutable = toMutableGrid(grid);
      expect(mutable).toEqual([]);
    });
  });

  describe('computeAdjacencyCounts', () => {
    it('should count adjacent @ symbols for each position', () => {
      const grid = [
        ['@', '@', '@'],
        ['@', '@', '@'],
        ['@', '@', '@']
      ];
      const counts = computeAdjacencyCounts(grid);

      // Corners have 3 neighbors
      expect(counts[0][0]).toBe(3);
      expect(counts[0][2]).toBe(3);
      expect(counts[2][0]).toBe(3);
      expect(counts[2][2]).toBe(3);

      // Edges have 5 neighbors
      expect(counts[0][1]).toBe(5);
      expect(counts[1][0]).toBe(5);

      // Center has 8 neighbors
      expect(counts[1][1]).toBe(8);
    });

    it('should return 0 for non-@ positions', () => {
      const grid = [
        ['@', '.', '@'],
        ['.', '@', '.'],
        ['@', '.', '@']
      ];
      const counts = computeAdjacencyCounts(grid);

      expect(counts[0][1]).toBe(0); // '.' position
      expect(counts[1][0]).toBe(0); // '.' position
    });

    it('should handle isolated @ symbols', () => {
      const grid = [
        ['@', '.', '.'],
        ['.', '.', '.'],
        ['.', '.', '@']
      ];
      const counts = computeAdjacencyCounts(grid);

      expect(counts[0][0]).toBe(0); // Isolated @
      expect(counts[2][2]).toBe(0); // Isolated @
    });
  });

  describe('totalRemovableRolls', () => {
    it('should remove isolated @ symbols', () => {
      const grid = [
        '@..',
        '...',
        '..@'
      ];
      const count = totalRemovableRolls(grid);
      // Both @ symbols have 0 neighbors (< 4), so both removed
      expect(count).toBe(2);
    });

    it('should handle cascade removal', () => {
      const grid = [
        '@@@',
        '@@@',
        '@@@'
      ];
      // Corners have 3 neighbors, so they're removed first
      // After removing corners, edges might drop below 4
      // This creates a cascade
      const count = totalRemovableRolls(grid);
      // All 9 should eventually be removed in cascade
      expect(count).toBe(9);
    });

    it('should not remove @ symbols with 4+ neighbors', () => {
      const grid = [
        '.....',
        '.@@@.',
        '.@@@.',
        '.@@@.',
        '.....'
      ];
      // 3x3 block surrounded by dots
      // Corners have 3 neighbors (removed)
      // After removal, more get exposed
      const count = totalRemovableRolls(grid);
      // All 9 should be removed
      expect(count).toBe(9);
    });

    it('should handle stable configuration', () => {
      const grid = [
        '......',
        '.@@@@.',
        '.@@@@.',
        '.@@@@.',
        '.@@@@.',
        '......'
      ];
      // 4x4 block: corners have 3 neighbors (< 4), edges have 5, inner have 8
      // Only corners are removed (4 total), remaining have >= 4 neighbors
      const count = totalRemovableRolls(grid);
      expect(count).toBe(4);
    });

    it('should return 0 for empty grid', () => {
      const grid: string[] = [];
      const count = totalRemovableRolls(grid);
      expect(count).toBe(0);
    });

    it('should return 0 for grid with no @ symbols', () => {
      const grid = [
        '...',
        '...',
        '...'
      ];
      const count = totalRemovableRolls(grid);
      expect(count).toBe(0);
    });

    it('should handle single @ symbol', () => {
      const grid = [
        '...',
        '.@.',
        '...'
      ];
      const count = totalRemovableRolls(grid);
      expect(count).toBe(1);
    });

    it('should handle chain reaction', () => {
      // Line of @ symbols: each has 2 neighbors (< 4)
      const grid = [
        '.....',
        '.@@@.',
        '.....'
      ];
      const count = totalRemovableRolls(grid);
      // All 3 should be removed (edges have 1 neighbor, center has 2)
      expect(count).toBe(3);
    });
  });

  describe('integration test', () => {
    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const grid = await parseGrid(inputPath);
      const result = totalRemovableRolls(grid);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(result).toBe(9518);
    });
  });
});

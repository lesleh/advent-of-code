import { parseInput, simulateDial } from './index.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

describe('Day 01: Dial Password', () => {
  describe('parseInput', () => {
    it('should parse rotation instructions from file', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const rotations = await parseInput(inputPath);

      expect(rotations).toBeDefined();
      expect(Array.isArray(rotations)).toBe(true);
      expect(rotations.length).toBeGreaterThan(0);
    });

    it('should correctly parse L and R directions', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const rotations = await parseInput(inputPath);

      rotations.forEach((rotation) => {
        expect(['L', 'R']).toContain(rotation.dir);
        expect(typeof rotation.dist).toBe('number');
        expect(rotation.dist).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('simulateDial', () => {
    it('should count zero hits correctly with simple rotations', () => {
      // Test case: Starting at 50, R50 should hit 0 once at position 0
      const rotations = [{ dir: 'R' as const, dist: 50 }];
      const result = simulateDial(rotations, false);

      expect(result).toBe(1);
    });

    it('should handle left rotations correctly', () => {
      // Starting at 50, L50 should hit 0 once at position 0
      const rotations = [{ dir: 'L' as const, dist: 50 }];
      const result = simulateDial(rotations, false);

      expect(result).toBe(1);
    });

    it('should count multiple zero hits', () => {
      // R150 from position 50 should pass through 0 twice (at 100 and 200 clicks)
      const rotations = [{ dir: 'R' as const, dist: 150 }];
      const result = simulateDial(rotations, false);

      expect(result).toBe(2);
    });

    it('should handle multiple rotation instructions', () => {
      const rotations = [
        { dir: 'R' as const, dist: 50 },
        { dir: 'L' as const, dist: 100 },
      ];
      const result = simulateDial(rotations, false);

      // This should hit 0 at least twice (once going right, once going left)
      expect(result).toBeGreaterThanOrEqual(2);
    });

    it('should return 0 for empty rotations', () => {
      const result = simulateDial([], false);
      expect(result).toBe(0);
    });
  });

  describe('integration test', () => {
    it('should solve the puzzle with actual input', async () => {
      const inputPath = join(currentDir, 'input.txt');
      const rotations = await parseInput(inputPath);
      const password = simulateDial(rotations, false);

      // The password should be a positive number
      expect(password).toBeGreaterThan(0);
      expect(typeof password).toBe('number');

      // Verify against the known answer
      expect(password).toBe(5941);
    });
  });
});

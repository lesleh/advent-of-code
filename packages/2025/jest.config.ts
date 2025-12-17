import type { Config } from 'jest';

const config: Config = {
  // Treat .ts files as ESM
  extensionsToTreatAsEsm: ['.ts'],

  // TypeScript transformation with ESM support
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  // Module name mapping for proper ESM resolution
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Test file patterns (includes .test.ts and .spec.ts)
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.test.ts',
    '!**/*.spec.ts',
    '!**/node_modules/**',
    '!jest.config.ts',
  ],

  // Use Node environment for testing
  testEnvironment: 'node',
};

export default config;

export default {
    preset: 'ts-jest',
    testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'], // Match test files
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jsdom', // Default for frontend tests
    testEnvironmentOptions: {
      url: 'http://localhost',
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1', // Alias support
    },
    collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!**/dist/**'],
    coverageDirectory: 'coverage',
    projects: [
      {
        displayName: 'frontend',
        testEnvironment: 'jsdom',
        testMatch: ['<rootDir>/__tests__/frontend/**/*.test.tsx'],
      },
      {
        displayName: 'backend',
        testEnvironment: 'node',
        testMatch: ['<rootDir>/__tests__/backend/**/*.test.ts'],
      },
    ],
  }
  
import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
  // Basic config
  verbose: true,
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  
  // File patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  // Module file extensions
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  
  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Coverage config
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  
  // Module name mapper for aliases and static assets
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/test/__mocks__/fileMock.js'
  },
  
  // Test environment setup
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  
  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  
  // Reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'coverage/junit',
      outputName: 'junit.xml',
      classNameTemplate: '{filepath}',
      titleTemplate: '{title}',
    }]
  ],
};

export default config;

const { pathsToModuleNameMapper } = require('ts-jest/utils');

const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  bail: true,
  clearMocks: true,
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: '.tmp/coverage',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src',
  }),

  coverageReporters: ['json', 'lcov'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/config/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.(ts|js)',

    '!src/main.ts',
    '!src/entrypoint.ts',
    '!src/start/loaders/sentry-loader.ts',

    '!src/@types/**/*',
    '!src/app/canvas/**/*',
    '!src/app/arguments/**/*',
  ],

  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};

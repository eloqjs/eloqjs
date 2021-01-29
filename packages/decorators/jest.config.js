/* eslint-disable import/no-extraneous-dependencies */
const { pathsToModuleNameMapper } = require('ts-jest/utils')
// Load the config which holds the path aliases.
const { compilerOptions } = require('../../tsconfig.json')

module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    // This has to match the baseUrl defined in tsconfig.json.
    prefix: '<rootDir>/../../'
  }),
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/index.ts'],
  clearMocks: true
}

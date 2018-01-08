module.exports = {
  setupTestFrameworkScriptFile: "<rootDir>/src/test/init.ts",
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/test', '<rootDir>/src/test'],
  mapCoverage: true,
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
}

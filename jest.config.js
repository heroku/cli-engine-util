module.exports = {
  setupTestFrameworkScriptFile: "<rootDir>/src/__test__/init.ts",
  globalSetup: "<rootDir>/src/__test__/setup.js",
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/__test__'],
  mapCoverage: true,
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
}

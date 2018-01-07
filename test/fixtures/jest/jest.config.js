module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': '<rootDir>/../../../node_modules/ts-jest/preprocessor.js',
  },
}

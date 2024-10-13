module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,}"],
  testPathIgnorePatterns: ['dist'],
  coveragePathIgnorePatterns: ['src/Types'],
  reporters: [
    'default',
    './dist/TestUtils/customReporter.js'
  ],
  coverageProvider: 'v8',
  coverageReporters: ['text', 'json-summary'],
};
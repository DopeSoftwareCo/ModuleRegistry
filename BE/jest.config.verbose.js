module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,}"],
  testPathIgnorePatterns: ['dist','src/Providers/ModEval/Assets'],
  coveragePathIgnorePatterns: ['src/Types','src/Providers/ModEval/Assets'],
  reporters: ['default'],
  coverageProvider: 'v8',
  coverageReporters: ['text', 'json-summary'],
};
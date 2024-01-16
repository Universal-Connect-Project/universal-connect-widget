module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/config/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'json-summary'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/utils/Test.js',
    '<rootDir>/src/config/',
  ],
  transformIgnorePatterns: ['node_modules/(?!(@kyper)/)'],
  transform: {
    '^.+\\.[t|j]s?$': 'babel-jest',
  },
}

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/config/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'json-summary'],

  transformIgnorePatterns: ['/node_modules/(?!(@kyper)/).*/'],
}

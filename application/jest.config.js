module.exports = {
  coverageProvider: 'babel',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/config/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'json-summary'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/utils/Test.js',
    '<rootDir>/src/config/',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@kyper)/).*/'
  ],
  transform: {
    '^.+\\.[t|j]s?$': 'babel-jest',
  },
  moduleNameMapper: {
    "^axios$": "axios/dist/axios.js",
    // "^@kyper/(.*)$": "@kyper/$1/lib/index.js"
  }
}

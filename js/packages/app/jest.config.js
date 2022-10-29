module.exports = {
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/?(*.)+(spec).[jt]s?(x)"],
  modulePathIgnorePatterns: ['wrappers'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};

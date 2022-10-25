module.exports = {
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/?(*.)+(spec).[jt]s?(x)"],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};

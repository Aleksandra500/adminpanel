module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
      useESM: true
    }
  },

  testMatch: ['**/*.test.ts'],
};

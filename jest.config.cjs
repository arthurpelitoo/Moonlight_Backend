/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm', // Preset específico para ESM
  testEnvironment: 'node',
  rootDir: "./",
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // Isso remove a extensão .js dos imports para o Jest encontrar o arquivo .ts
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // Configura o ts-jest para usar ESM durante a transformação
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
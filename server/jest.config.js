module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['dist/'],
  bail: true,
  clearMocks: true,
  restoreMocks: true,
  notify: false,
  globalSetup: '<rootDir>/test/global-setup.ts',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: {
    '@/(.+)': '<rootDir>/server/$1',
  },
}

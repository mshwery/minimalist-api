module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['dist/'],
  bail: true,
  clearMocks: true,
  restoreMocks: true,
  notify: false,
  globalSetup: '<rootDir>/test/global-setup.js',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: {
    '@/(.+)': '<rootdir>/../../server/$1',
  },
}

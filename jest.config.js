module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['dist/'],
  bail: true,
  clearMocks: true,
  restoreMocks: true,
  notify: true,
  setupFiles: ['<rootDir>/test/test-helper.ts'],
  moduleNameMapper: {
    '@/(.+)': '<rootdir>/../../app/$1'
  }
}

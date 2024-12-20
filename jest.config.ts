export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/src/setupTests.ts'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: {
        ignoreCodes: [6133, 6196, 2307] // Ignorar warnings específicos de TS
      }
    }]
  },
  testPathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['node_modules', 'src']
};

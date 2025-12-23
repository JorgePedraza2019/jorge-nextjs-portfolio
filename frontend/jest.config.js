// jest.config.js
const config = {
  testEnvironment: 'jest-environment-jsdom', // Set the test environment to JSDOM
  setupFilesAfterEnv: ['@testing-library/jest-dom'], // Add custom matchers for testing
  testMatch: ['**/*.test.js'], // Only read files that end with .test.js
};

export default config; // Export the configuration
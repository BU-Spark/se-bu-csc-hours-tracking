// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // path to your Next.js app
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  // Add any custom configuration as needed
};

module.exports = createJestConfig(customJestConfig);

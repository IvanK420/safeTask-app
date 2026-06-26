module.exports = {
    testEnvironment: 'node',
    setupFiles: ['./tests/setup.js'],
    testMatch: ['**/tests/**/*.test.js'],
    runInBand: true,
    forceExit: true,
    verbose: true,
};

module.exports = {
  setupFiles: ['dotenv-flow/config'],
  ...require('@config/jest-config'),
  testEnvironment: 'node',
}

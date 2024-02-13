/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['examples/**', 'node_modules/**', 'dist/**'],
  extends: ['@refastdev/eslint-config'],
};

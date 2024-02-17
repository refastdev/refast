/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['dist/**'],
  extends: ['@refastdev/eslint-config'],
  parser: '@typescript-eslint/parser',
};

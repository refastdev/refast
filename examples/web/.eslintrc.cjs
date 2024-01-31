/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['node_modules/**', 'dist/**'],
  extends: ['./node_modules/@refastdev/refast-dev/eslint-config.js']
}

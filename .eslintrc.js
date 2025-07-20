module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
  ],
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  globals: {
    'D1Database': 'readonly',
    'DispatchNamespace': 'readonly',
    'RequestInit': 'readonly',
    'fetch': 'readonly',
    'Response': 'readonly',
    'Request': 'readonly',
    'Headers': 'readonly',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    'no-unused-vars': 'off', // Turn off base rule in favor of TypeScript version
    'no-undef': 'off', // Turn off in favor of TypeScript checking
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js'],
};
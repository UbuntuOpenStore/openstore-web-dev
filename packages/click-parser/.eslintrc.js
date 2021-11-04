module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  extends: [
    'eslint-config-bhdouglass',
  ],
  'env': {
    'browser': false,
    'node': true,
    'mocha': true
  },
  'rules': {
    'no-console': ['error', { allow: ['error', 'log'] }],
    'no-param-reassign': 0,
  },
}

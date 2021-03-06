module.exports = {
  root: true,
  parserOptions: {
    parser: require.resolve('@babel/eslint-parser'),
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended'
  ]
}
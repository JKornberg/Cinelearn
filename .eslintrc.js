// .eslintrc.js example
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules:{
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-extra-semi': 'off',
  }
};

module.exports = {
  extends: ["plugin:prettier/recommended"],
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  singleQuote: true,
  "prettier/prettier": [
    "error",
    {},
    {
      "usePrettierrc": false
    }
  ]
};

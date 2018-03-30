// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-multi-spaces"              : ["off"],
    "key-spacing"                  : ["off"],
    "camelcase"                    : ["off"],
    "standard/no-callback-literal" : ["off"],
    "semi"                         : ["warn"],
    "no-tabs"                      : ["warn"],
    "no-irregular-whitespace"      : ["warn"],
    "new-cap"                      : ["warn"],
    "keyword-spacing"              : ["warn"],
    "brace-style"                  : ["warn"],
    "comma-spacing"                : ["warn"],
    "spaced-comment"               : ["warn"],
    "no-mixed-spaces-and-tabs"     : ["warn"],
    "arrow-spacing"                : ["warn"],
    "space-unary-ops"              : ["warn"],
    "eol-last"                     : ["warn"],
    "comma-dangle"                 : ["warn"],
    "space-infix-ops"              : ["warn"],
    "no-trailing-spaces"           : ["warn"],
    "no-multiple-empty-lines"      : ["warn"],
    "space-in-parens"              : ["warn"],
    "space-before-function-paren"  : ["warn"],
    "space-before-blocks"          : ["warn"],
    "padded-blocks"                : ["warn"],
    "indent"                       : ["warn"]
  }
}

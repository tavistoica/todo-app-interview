// Patch avoids manual peerDependencies installs in the projects and fixes IDE issues with resolving paths to plugins
// More info about the issue and the patch in the thread: https://github.com/eslint/eslint/issues/3458#issuecomment-516666620
require("@rushstack/eslint-patch/modern-module-resolution");

const {
  parser,
  settings,
  pluginsTypeScript,
  pluginsPromise,
  pluginsJest,
  extendsTypeScript,
  extendsPromise,
  extendsJest,
  extendsPrettier,
  rules,
  overridesJson,
  overridesGraphql,
} = require("./common");

const pluginsSecurity = ["security", "security-node"];
const extendsSecurity = [
  "plugin:security/recommended",
  "plugin:security-node/recommended",
];

const overrides = {
  files: "**/*.ts",
  parser,
  settings,
  plugins: [
    ...pluginsSecurity,
    ...pluginsTypeScript,
    ...pluginsPromise,
    ...pluginsJest,
  ],
  parserOptions: {
    project: true,
  },
  extends: [
    "airbnb-base",
    ...extendsSecurity,
    ...extendsTypeScript,
    ...extendsPromise,
    ...extendsJest,
    ...extendsPrettier,
  ],
  rules: {
    ...rules,
    // No imports with file extensions
    "import/extensions": 0,
    "arrow-body-style": "off",
    // Allow logging in Node applications
    "no-console": [2, { allow: ["log", "error", "warn", "debug"] }],
    // Allow sequential async iterations
    "no-await-in-loop": 0,
    "lines-between-class-members": "off",
    "no-useless-constructor": "off",
    // We need synchronous async iterations which can be accomplished with `for..of` and `for`
    // To avoid workarounds with excessive `for` construct it makes more sense to remove `ForOfStatement` error
    "no-restricted-syntax": [
      2,
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],
    quotes: [2, "single", { avoidEscape: true, allowTemplateLiterals: false }],
    "@typescript-eslint/no-floating-promises": "error",
    // can be used to ignore no-floating-promises rule for promises which are not meant to be awaited
    "no-void": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
  },
};

module.exports = {
  env: {
    node: true,
    jest: true,
  },
  overrides: [overrides, overridesJson, overridesGraphql],
};

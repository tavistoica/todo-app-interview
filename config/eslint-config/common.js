const namingConventionRules = require("./naming-convention.js");

const parser = "@typescript-eslint/parser";

const settings = {
  "import/resolver": {
    // Use 'eslint-import-resolver-typescript' to resolve paths
    typescript: {},
  },
};

const pluginsTypeScript = ["@typescript-eslint"];

const pluginsPromise = ["promise"];

const pluginsJest = ["jest", "jest-dom"];

const pluginsCypress = ["cypress", "chai-friendly"];

const pluginsGraphql = ["graphql"];

const extendsTypeScript = ["plugin:@typescript-eslint/recommended"];

const extendsPromise = ["plugin:promise/recommended"];

const extendsJest = [
  "plugin:jest/recommended",
  "plugin:jest/style",
  "plugin:jest-dom/recommended",
];

const extendsCypress = [
  "plugin:cypress/recommended",
  "plugin:chai-friendly/recommended",
];

const extendsPrettier = ["prettier"];

const rules = {
  // TODO Investigate/Remove - failing in CI..
  "import/no-unresolved": 0,
  // Fix `no-shadow` false positives
  "no-shadow": 0,
  "@typescript-eslint/no-shadow": [2],
  // Allow empty functions mainly for default function arguments
  "@typescript-eslint/no-empty-function": 0,
  // Fix `no-use-before-define` false positives
  "no-use-before-define": 0,
  "@typescript-eslint/no-use-before-define": [2, { functions: false }],
  // Enforce type-only imports
  "@typescript-eslint/consistent-type-imports": [
    2,
    {
      prefer: "type-imports",
      disallowTypeAnnotations: true,
    },
  ],
  // Allow named exports when module exports only a single declaration
  "import/prefer-default-export": 0,
  // No imports with file extensions
  "import/extensions": 0,
  // Force trailing comma only for multiline
  "comma-dangle": [2, "always-multiline"],
  // Enforce ES2017 async/await syntax
  "promise/prefer-await-to-then": 2,
  "promise/prefer-await-to-callbacks": 2,
  "import/no-extraneous-dependencies": [
    2,
    {
      devDependencies: ["**/*.test.{ts,tsx}", "**/__tests__/**"],
      optionalDependencies: false,
    },
  ],
  "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  "security/detect-object-injection": 0,
  "@next/next/no-script-component-in-head": "off",
  ...namingConventionRules,
};

const overridesJson = {
  files: "**/**.json",
  plugins: ["json-files"],
  rules: {
    "json-files/no-branch-in-dependencies": 2,
    "json-files/restrict-ranges": [2, { versionHint: "pin" }],
    "json-files/sort-package-json": 2,
  },
};

module.exports = {
  parser,
  settings,
  pluginsTypeScript,
  pluginsPromise,
  pluginsJest,
  pluginsCypress,
  pluginsGraphql,
  extendsTypeScript,
  extendsPromise,
  extendsJest,
  extendsCypress,
  extendsPrettier,
  rules,
  overridesJson,
};

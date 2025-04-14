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

const pluginsSecurity = ["no-unsanitized"];
const rulesSecurity = {
  // Prevent usage of dangerous JSX properties
  "react/no-danger": 2,
  // Prevent unsanitized assignments to potentially dangerous properties (innerHTML, outerHTML)
  "no-unsanitized/property": [
    "error",
    {
      escape: {
        methods: ["sanitizeHTML"],
      },
    },
  ],
  // Prevent unsanitized calls to potentially dangerous methods (insertAdjacentHTML, write, writeln),
  "no-unsanitized/method": [
    "error",
    {
      escape: {
        methods: ["sanitizeHTML"],
      },
    },
  ],
};

const overrides = {
  files: "**/*.{js,jsx,ts,tsx}",
  parser,
  settings,
  plugins: [
    ...pluginsSecurity,
    ...pluginsTypeScript,
    ...pluginsPromise,
    ...pluginsJest,
  ],
  extends: [
    "airbnb",
    "airbnb/hooks",
    ...extendsTypeScript,
    ...extendsPromise,
    ...extendsJest,
    ...extendsPrettier,
  ],
  rules: {
    ...rules,
    ...rulesSecurity,
    // Allow only error logging in client-side applications
    "no-console": [2, { allow: ["error"] }],
    // JSX must be allowed in files with `.tsx` extension
    "react/jsx-filename-extension": [2, { extensions: [".tsx"] }],
    // No `propTypes` because we use TypeScript to define props
    "react/prop-types": 0,
    // No `defaultProps` because we set default property values
    "react/require-default-props": 0,
    // Skip importing React, as for version 17 it's not required anymore
    "react/react-in-jsx-scope": 0,
    // Allow a Class Component's state to be initialized as a class property
    "react/state-in-constructor": 0,
    // Allow props spreading since it's used a lot
    "react/jsx-props-no-spreading": 0,
    // Allow array indexes as react keys since it's used a lot
    "react/no-array-index-key": 0,
    // Ban unwanted imports
    "no-restricted-imports": [
      "error",
      {
        name: "react",
        importNames: ["default"],
        message: "Skip `React` import as it's not needed for v17+.",
      },
    ],
    // Ban global React, use granular imports for features you need from React.
    "no-restricted-globals": [
      "error",
      {
        name: "React",
        message: "Use granular imports for features you need from `React`.",
      },
    ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          FC: "Use `ReactElement` instead.",
          FunctionComponent: "Use `ReactElement` instead.",
          "JSX.Element": "Use `ReactElement` instead.",
        },
      },
    ],
    "react/button-has-type": [
      "error",
      {
        reset: true,
      },
    ],
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
    // Allow dangling underscore for `_meta` and `__typename` only.
    "no-underscore-dangle": [
      "error",
      {
        allow: ["_meta", "__typename"],
      },
    ],
  },
};

module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  overrides: [overrides, overridesJson, overridesGraphql],
};

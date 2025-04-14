import { FlatConfigComposer } from "eslint-flat-config-utils";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import pluginSecurity from "eslint-plugin-security";
import pluginSecurityNode from "eslint-plugin-security-node";
import pluginPromise from "eslint-plugin-promise";
import pluginJest from "eslint-plugin-jest";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";

const composer = new FlatConfigComposer();

const config = composer.append(
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json", // Point this to your tsconfig.json
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      security: pluginSecurity,
      "security-node": pluginSecurityNode,
      promise: pluginPromise,
      jest: pluginJest,
      import: pluginImport,
      prettier: pluginPrettier,
    },
    rules: {
      "import/extensions": 0,
      "arrow-body-style": "off",
      "no-console": [2, { allow: ["log", "error", "warn", "debug"] }],
      "no-await-in-loop": 0,
      "lines-between-class-members": "off",
      "no-useless-constructor": "off",
      "no-restricted-syntax": [
        2,
        {
          selector: "ForInStatement",
          message:
            "for..in loops iterate over the entire prototype chain. Use Object.{keys,values,entries} instead.",
        },
        {
          selector: "LabeledStatement",
          message: "Labels are a form of GOTO; avoid using them.",
        },
        {
          selector: "WithStatement",
          message: "`with` is disallowed in strict mode.",
        },
      ],
      quotes: [
        2,
        "single",
        { avoidEscape: true, allowTemplateLiterals: false },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "no-void": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
    },
    ignores: ["dist/*"], // Ignore compiled files in dist/ folder
  },
  {
    files: ["**/*.json"],
  }
);

// Just export the config array
export default config;

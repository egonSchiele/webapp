import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

// Rules from docs/dev/contributing/coding-standards.md and anti-patterns.md.
// Each selector carries the message shown when it fires.
const RESTRICTED_SYNTAX = [
  {
    selector: "ImportExpression",
    message: "Use a static import instead of a dynamic import().",
  },
  {
    selector: "NewExpression[callee.name='Map']",
    message: "Use a plain object (Record<K, V>) instead of a Map.",
  },
  {
    selector: "CatchClause > BlockStatement[body.length=0]",
    message: "Log or rethrow the error instead of silently swallowing it.",
  },
  {
    selector: "SpreadElement > ConditionalExpression",
    message: "Do not spread a conditional object. Assign the field directly.",
  },
  {
    selector: "TSTypeAliasDeclaration TSTypeLiteral TSTypeLiteral",
    message: "Break nested object types out into separate named types.",
  },
];

const TEST_FILES = ["**/*.test.{ts,tsx}"];

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["dist/", "src/frontend/generated/"] },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { settings: { react: { version: "detect" } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-restricted-types": [
        "error",
        { types: { Map: "Use a plain object (Record<K, V>) instead." } },
      ],
      "no-restricted-syntax": ["error", ...RESTRICTED_SYNTAX],
      "prefer-const": "error",
      "max-lines-per-function": [
        "error",
        { max: 150, skipBlankLines: true, skipComments: true },
      ],
      "max-lines": [
        "error",
        { max: 1250, skipBlankLines: true, skipComments: true },
      ],
      "max-depth": ["error", 5],
      "no-nested-ternary": "error",
      curly: ["error", "all"],
    },
  },
  {
    files: TEST_FILES,
    rules: {
      "max-lines-per-function": "off",
      "max-lines": "off",
      "max-depth": "off",
    },
  },
];

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import * as path from 'path';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "src/lf-pair-support-service-lambda/webpack.config.js",
      "src/lf-pair-support-service-lambda/babel.config.js",
      "src/lf-pair-support-service-lambda/dist/*",
      "**/*.config.js",
      "!**/eslint.config.js"
    ]
  },
  {
    rules: {
      "no-unused-disable-directive": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    }
  },
  {
    files: ["**/*.ts", "**/*.js"],
    linterOptions: {
      reportUnusedDisableDirectives: false
    }
  }
];

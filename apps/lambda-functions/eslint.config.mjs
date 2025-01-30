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
      "src/lf-pair-support-service-lambda/app.js",
      "src/lf-chatgpt-player/webpack.config.js",
      "src/lf-chatgpt-player/babel.config.js",
      "src/lf-chatgpt-player/dist/*",
      "src/lf-chatgpt-player/app.js",
      "**/*.config.js",
      "!**/eslint.config.js"
    ]
  },
  {
    rules: {
      "no-useless-escape": "off",
      "no-unused-disable-directive": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    }
  },
  {
    files: ["**/*.ts"],
    linterOptions: {
      reportUnusedDisableDirectives: false
    }
  }
];

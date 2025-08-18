import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import prettier from "eslint-plugin-prettier"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default tseslint.config([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js, prettier },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json", "./packages/*/tsconfig.json", "./apps/*/tsconfig.json"],
      },
    },
    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
])

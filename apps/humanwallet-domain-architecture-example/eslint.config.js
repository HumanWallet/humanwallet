import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import prettier from "eslint-plugin-prettier"

export default tseslint.config(
  { ignores: ["node_modules", "github", "packages"] }, // Ignores everything except "apps"
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["apps/**/*.{ts,tsx}"], // Only lint files inside "apps"
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "prettier/prettier": "warn",
      "react-refresh/only-export-components": "off",
    },
  },
)

import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import prettier from "eslint-plugin-prettier"
import eslintConfigPrettier from "eslint-config-prettier/flat"

export default tseslint.config([
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    ignores: [
      "eslint.config.js",
      "**/tsup.config.ts",
      "**/vitest-setup.ts",
      "**/vitest.config.ts",
      "node_modules",
      "dist",
      "build",
      "coverage",
      "public",
      "public/**",
      "public/**/*",
      "public/**/*.*",
      // Generated bundle files
      "**/bundle-*.js",
      "**/chunk-*.js",
      "**/*-[A-Z0-9]*.js",
      // Large minified files
      "**/*esm*.js",
      "**/ccip-*.js",
      "**/secp256k1-*.js",
      // TypeScript declaration files
      "**/*.d.ts",
    ],
    plugins: { js, prettier },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ["./packages/*/tsconfig.json", "./examples/*/tsconfig*.json"],
      },
    },
    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
  eslintConfigPrettier,
])


import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/coverage/**",
            "**/.git/**"
        ]
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",

            globals: {
                ...globals.browser,
                ...globals.node
            },

            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },

        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            "no-console": "warn"
        }
    }
];

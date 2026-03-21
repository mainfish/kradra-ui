import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'

export default [
    js.configs.recommended,

    // React preset for the new JSX transform (React 17+ / Vite)
    react.configs.flat['jsx-runtime'],

    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,

            // IMPORTANT: count JSX tags as “used” vars (fixes false no-unused-vars on <Routes />, etc.)
            'react/jsx-uses-vars': 'error',

            // We don’t use PropTypes in this codebase
            'react/prop-types': 'off',

            // Vite HMR best practice
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },

    // Put Prettier LAST so it can override other configs
    prettier,
]
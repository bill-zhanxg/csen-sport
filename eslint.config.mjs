import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import reactCompiler from 'eslint-plugin-react-compiler';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
	tseslint.configs.recommended,
	{
		extends: [...nextCoreWebVitals],
	},
	{
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
			},
		},
		plugins: {
			'react-compiler': reactCompiler,
			'@typescript-eslint': typescriptEslint,
		},
		rules: {
			'react-compiler/react-compiler': 'error',
			'@typescript-eslint/consistent-type-imports': 'warn',

			'prefer-const': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	},
);

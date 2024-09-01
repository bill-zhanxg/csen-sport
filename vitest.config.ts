import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/cypress/**',
			'**/.{idea,git,cache,output,temp}/**',
			'**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',

			// Exclude playwright tests
			'tests/**',
		],
		alias: {
			'@/': new URL('./', import.meta.url).pathname,
		},
		globals: true,
		environment: 'jsdom',
		setupFiles: 'vitest.setup.ts',

		// browser: {
		// 	provider: 'playwright',
		// 	enabled: !process.env.CI,
		// 	name: 'chromium',
		// },
	},
});

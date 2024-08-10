import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		alias: {
			'@/': new URL('./', import.meta.url).pathname,
		},
		globals: true,
		environment: 'jsdom',
		setupFiles: 'vitest.setup.ts',
	},
});

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv-flow';
dotenv.config({ default_node_env: 'development' });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: process.env.CI ? 'blob' : 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: process.env.BASE_URL || 'http://localhost:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'retain-on-failure',
	},

	// 10 Minutes
	timeout: 20 * 60 * 1000,
	globalSetup: require.resolve('./global-setup'),

	/* Configure projects for major browsers */
	projects: [
		{ name: 'setup', testMatch: /.*\.setup\.ts/ },

		{
			name: 'chromium',
			dependencies: ['setup'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'firefox',
			dependencies: ['setup'],
			use: { ...devices['Desktop Firefox'] },
		},

		{
			name: 'webkit',
			dependencies: ['setup'],
			use: { ...devices['Desktop Safari'] },
		},

		/* Test against mobile viewports. */
		{
			name: 'Mobile Chrome',
			dependencies: ['setup'],
			use: { ...devices['Pixel 5'] },
		},
		{
			name: 'Mobile Safari',
			dependencies: ['setup'],
			use: { ...devices['iPhone 12'] },
		},

		/* Test against branded browsers. */
		{
			name: 'Microsoft Edge',
			dependencies: ['setup'],
			use: { ...devices['Desktop Edge'], channel: 'msedge' },
		},
		{
			name: 'Google Chrome',
			dependencies: ['setup'],
			use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		},
	],

	/* Run your local dev server before starting the tests */
	webServer:
		!process.env.BASE_URL || process.env.BASE_URL.includes('localhost')
			? {
					command: 'npm run start:default',
					url: 'http://localhost:3000',
					reuseExistingServer: !process.env.CI,
			  }
			: undefined,
});

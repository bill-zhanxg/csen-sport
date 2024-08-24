import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
	const { baseURL } = config.projects[0].use;
	const browser = await chromium.launch();
	const page = await browser.newPage();
    // Skip when debugging with VSCode
	if (baseURL) {
		await page.goto(baseURL);

		// Make sure the website is deployed and restarted before running the tests
		page.waitForURL(baseURL + '/login');
	}

	await browser.close();
}

export default globalSetup;

import { test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test('Login Page', async ({ page }) => {
	await page.goto('/login');
	await page.waitForURL('/', { timeout: 30 * 1000 });
});

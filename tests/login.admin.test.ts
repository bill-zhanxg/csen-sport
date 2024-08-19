import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test('Login Page', async ({ page, baseURL }) => {
	await page.goto('/login');
	expect(page.url()).toBe(baseURL + '/');
});

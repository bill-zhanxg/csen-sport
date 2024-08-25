import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/blocked.json' });

test('navigation', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading')).toContainText(
		"Sorry but you've been blocked from accessing this site. Click here",
	);
	await expect(page.getByRole('heading', { name: "Sorry but you've been blocked" })).toBeVisible();
	await expect(page.getByRole('img', { name: 'Sad' })).toBeVisible();
});

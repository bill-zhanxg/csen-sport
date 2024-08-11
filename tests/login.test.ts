import { expect, test } from '@playwright/test';

test('Login Page', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Login with Microsoft' })).toBeVisible();
});

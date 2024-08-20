import { test } from '@playwright/test';
import { Navigation } from './navigation';

test.use({ storageState: 'playwright/.auth/admin.json' });

// test('test', async ({ page }) => {
// 	await page.goto('/');
// 	await expect(page.locator('#weekly-sport-btn')).toContainText('Weekly Sport');
// 	await expect(page.getByRole('link', { name: 'Weekly Sport' })).toBeVisible();
// 	await expect(page.getByRole('link', { name: 'Tickets' })).toBeVisible();
// 	await expect(page.getByRole('link', { name: 'CSEN' })).toBeVisible();
// 	await expect(page.locator('#admin-control-btn')).toBeVisible();
// 	await page.locator('#admin-control-btn').click();
// 	await expect(page.getByRole('link', { name: 'Users' })).toBeVisible();
// 	await expect(page.getByRole('link', { name: 'Teams' })).toBeVisible();
// 	await expect(page.getByRole('link', { name: 'Venues' })).toBeVisible();
// 	await expect(page.getByRole('link', { name: 'Bulk Action' })).toBeVisible();
// 	await expect(page.getByRole('link', { name: 'Import Timetable' })).toBeVisible();
// 	await expect(page.getByRole('link', { name: 'Create Timetable' })).toBeVisible();
// 	await page.getByRole('link', { name: 'Weekly Sport' }).click();
// 	await expect(page.getByRole('img', { name: 'User Avatar' })).toBeVisible();
// 	await page.getByRole('img', { name: 'User Avatar' }).click();
// 	await page.getByRole('img', { name: 'User Avatar' }).click();
// 	await expect(page.getByRole('img', { name: 'User Avatar' })).toBeVisible();
// });

test.describe('navigation mobile', () => {
	test.use({ viewport: { height: 900, width: 375 } });

	test('navigation', async ({ page }) => {
		const navigation = new Navigation(page);
		await navigation.navigate(true, true);
	});
});

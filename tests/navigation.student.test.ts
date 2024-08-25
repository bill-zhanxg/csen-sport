import { test } from '@playwright/test';
import { Navigation } from './navigation';

test.use({ storageState: 'playwright/.auth/student.json' });

test.describe('navigation mobile', () => {
	test.use({ viewport: { height: 900, width: 375 } });

	test('navigation', async ({ page }) => {
		const navigation = new Navigation(page);
		await navigation.navigate(true, false);
	});
});

test.describe('navigation desktop', () => {
	test.use({ viewport: { height: 900, width: 1024 } });

	test('navigation', async ({ page }) => {
		const navigation = new Navigation(page);
		await navigation.navigate(false, false);
	});
});

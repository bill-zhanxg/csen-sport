import { type Page, expect } from '@playwright/test';

const menus = [
	{ name: 'Weekly Sport', url: '/weekly-sport/timetable' },
	{ name: 'Tickets', url: '/tickets' },
	{ name: 'Users', url: '/users', admin: true },
	{ name: 'Teams', url: '/teams', admin: true },
	{ name: 'Venues', url: '/venues', admin: true },
	{ name: 'Bulk Action', url: '/bulk', admin: true },
	{ name: 'Import Timetable', url: '/weekly-sport/import', admin: true },
	{ name: 'Create Timetable', url: '/weekly-sport/create', admin: true },
];

const profileMenus = [
	{ name: 'User Settings', url: '/settings' },
	{ name: 'Changelogs', url: '/changelog' },
];

export class Navigation {
	constructor(public readonly page: Page) {}

	async _goto() {
		await this.page.goto('/');
	}

	async navigate(mobile: boolean, admin: boolean) {
		await this._goto();

		if (mobile) {
			// Check if the mobile menu closes when it is clicked again
			await this.page.locator('label').first().click();
			expect(this.page.locator('#mobile-menu')).toBeVisible();
			await this.page.locator('label').first().click();
			expect(this.page.locator('#mobile-menu')).not.toBeVisible();

			// Check if the mobile menu closes when clicked outside
			await this.page.locator('label').first().click();
			expect(this.page.locator('#mobile-menu')).toBeVisible();
			await this.page.locator('body').click();
			expect(this.page.locator('#mobile-menu')).not.toBeVisible();
		}

		// Check if the profile menu will hide on clicked again
		await this.page.getByRole('img', { name: 'User Avatar' }).first().click();
		await expect(this.page.getByText('User SettingsChangelogsSubmit')).toBeVisible();
		await this.page.getByRole('img', { name: 'User Avatar' }).first().click();
		await expect(this.page.getByText('User SettingsChangelogsSubmit')).not.toBeVisible();

		// Check if the profile menu will hide on clicked outside
		await this.page.getByRole('img', { name: 'User Avatar' }).first().click();
		await expect(this.page.getByText('User SettingsChangelogsSubmit')).toBeVisible();
		await this.page.locator('body').click();
		await expect(this.page.getByText('User SettingsChangelogsSubmit')).not.toBeVisible();

		for (const menu of menus) {
			if (menu.admin && !admin) continue;

			if (mobile) await this.page.locator('label').first().click();
			if (menu.admin && !mobile) await this.page.locator('#admin-control-btn').click();
			// Give a little time for the menu to appear
			await this.page.waitForTimeout(10);
			await this.page.getByRole('link', { name: menu.name }).click();
			// Check if the mobile menu closes when a menu item is clicked
			if (mobile) expect(this.page.locator('#mobile-menu')).not.toBeVisible();
			if (menu.admin && !mobile)
				expect(this.page.getByRole('group').getByText('UsersTeamsVenuesBulk')).not.toBeVisible();
			await this.page.waitForURL(menu.url);
		}

		await expect(this.page.getByRole('img', { name: 'User Avatar' }).first()).toBeVisible();

		for (const menu of profileMenus) {
			await this.page.getByRole('img', { name: 'User Avatar' }).first().click();
			await this.page.getByRole('link', { name: menu.name }).click();
			// Check if the mobile menu closes when a menu item is clicked
			await expect(this.page.getByText('User SettingsChangelogsSubmit')).not.toBeVisible();
			await this.page.waitForURL(menu.url);
		}

		// Test feedback button
		await this.page.getByRole('img', { name: 'User Avatar' }).first().click();
		await this.page.getByRole('button', { name: 'Submit a Bug / Feedback' }).click();
		await expect(this.page.locator('#feedback-dialog')).toHaveAttribute('open');
		await this.page.getByRole('button', { name: 'Close' }).click();
		await expect(this.page.locator('#feedback-dialog')).not.toHaveAttribute('open');

		// Navigate back to home
		await this.page.locator('#home-btn').click();
		await this.page.waitForURL('/');
	}
}

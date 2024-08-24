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

export class Navigation {
	constructor(public readonly page: Page) {}

	async _goto() {
		await this.page.goto('/');
	}

	async navigate(mobile: boolean, admin: boolean) {
		await this._goto();

		if (mobile) {
			await this.page.locator('label').first().click();
			expect(this.page.locator('#mobile-menu')).toBeVisible();
			// Check if the mobile menu closes when it is clicked again
			await this.page.locator('label').first().click();
			expect(this.page.locator('#mobile-menu')).not.toBeVisible();

			await this.page.locator('label').first().click();
			expect(this.page.locator('#mobile-menu')).toBeVisible();
			// Check if the mobile menu closes when clicked outside
			await this.page.locator('body').click();
			expect(this.page.locator('#mobile-menu')).not.toBeVisible();
		}

		for (const menu of menus) {
			if (menu.admin && !admin) continue;

			if (mobile) await this.page.locator('label').first().click();
			if (menu.admin && !mobile) await this.page.locator('#admin-control-btn').click();
			await this.page.getByRole('link', { name: menu.name }).click();
			// Check if the mobile menu closes when a menu item is clicked
			if (mobile) expect(this.page.locator('#mobile-menu')).not.toBeVisible();
			if (menu.admin && !mobile)
				expect(this.page.getByRole('group').getByText('UsersTeamsVenuesBulk')).not.toBeVisible();
			await this.page.waitForURL(menu.url);
		}
		// TODO: test pfp clicks
	}
}

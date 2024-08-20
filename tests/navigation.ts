import type { Page } from '@playwright/test';

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

	async _clickMobileLabel() {
		await this.page.locator('label').first().click();
	}

	async navigate(mobile: boolean, admin: boolean) {
		await this._goto();
		for (const menu of menus) {
			if (menu.admin && !admin) continue;

			if (mobile) await this._clickMobileLabel();
			await this.page.getByRole('link', { name: menu.name }).click();
			await this.page.waitForURL(menu.url);
		}
	}
}

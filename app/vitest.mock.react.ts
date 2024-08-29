import { Usable } from 'react';

export function mockReact() {
	vi.mock('react', async (importOriginal) => {
		const testUse = async <T extends (...args: Array<Usable<unknown>>) => unknown>(func: T) => await func;
		const originalModule = await importOriginal<typeof import('react')>();
		return {
			...originalModule,
			use: testUse,
		};
	});

	vi.mock('react', async (importOriginal) => {
		const testCache = <T extends (...args: Array<unknown>) => unknown>(func: T) => func;
		const originalModule = await importOriginal<typeof import('react')>();
		return {
			...originalModule,
			cache: testCache,
		};
	});
}

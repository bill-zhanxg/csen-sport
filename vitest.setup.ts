import '@testing-library/jest-dom/vitest';
import { Usable } from 'react';

// Mocking EventSource
Object.defineProperty(window, 'EventSource', {
	writable: true,
	value: vi.fn().mockImplementation(() => ({
		close: vi.fn(() => {}),
		addEventListener: vi.fn((_event: string, _callback: (_message: MessageEvent) => {}) => {}),
	})),
});

vi.mock('react', async (importOriginal) => {
	const testUse = async <T extends (...args: Array<Usable<unknown>>) => unknown>(func: T) => await func;
	const testCache = <T extends (...args: Array<unknown>) => unknown>(func: T) => func;
	const originalModule = await importOriginal<typeof import('react')>();
	return {
		...originalModule,
		use: testUse,
		cache: testCache,
	};
});

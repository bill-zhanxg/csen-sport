import '@testing-library/jest-dom/vitest';

// Mocking EventSource
Object.defineProperty(window, 'EventSource', {
	writable: true,
	value: vi.fn().mockImplementation(() => ({
		close: vi.fn(() => {}),
		addEventListener: vi.fn((_event: string, _callback: (_message: MessageEvent) => {}) => {}),
	})),
});

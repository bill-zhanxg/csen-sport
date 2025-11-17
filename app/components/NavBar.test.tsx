import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

import { NavBar } from './NavBar';

import type { Session } from 'next-auth';

// Mock the toast
vi.mock('sonner', () => ({
	toast: {
		error: vi.fn(),
	},
	Toaster: () => null,
}));

// Mock the useTawkStatus hook
vi.mock('./useTawkStatus', () => ({
	useTawkStatus: vi.fn(() => ({
		status: 'loading',
		isLoaded: false,
		isFailed: false,
		isLoading: true,
	})),
}));

// Mock tawk-react
vi.mock('tawk-react', () => ({
	TawkEvent: {
		onBeforeLoad: 'tawkBeforeLoad',
		onLoad: 'tawkLoad',
	},
	useTawkAction: () => ({
		start: vi.fn(),
		toggle: vi.fn(),
		login: vi.fn(),
	}),
	useTawkEvent: vi.fn(),
}));
describe('NavBar', () => {
	const session: Session = {
		user: {
			id: '1',
			name: 'John Doe',
			email: 'john@example.com',
		},
		expires: '',
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders home button', () => {
		render(
			<NavBar session={session} tawkHash="test-hash">
				<div>Test Children</div>
			</NavBar>,
		);
		const homeButton = document.querySelector('a[href="/"]');
		expect(homeButton).toBeInTheDocument();
	});

	test('shows error toast when support button is clicked and tawk failed to load', async () => {
		const { useTawkStatus } = await import('./useTawkStatus');
		// Mock failed state
		vi.mocked(useTawkStatus).mockReturnValue({
			status: 'failed',
			isLoaded: false,
			isFailed: true,
			isLoading: false,
		});

		render(
			<NavBar session={session} tawkHash="test-hash">
				<div>Test Children</div>
			</NavBar>,
		);

		const supportButton = screen.getByRole('button', { name: /support/i });
		fireEvent.click(supportButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				expect.stringContaining('Support widget failed to load'),
				expect.any(Object),
			);
		});
	});
});

import { render } from '@testing-library/react';
import { Session } from 'next-auth';
import { NavBar } from './NavBar';
import { mockReact } from '../vitest.mock.react';

describe('NavBar', () => {
	const session: Session = {
		user: {
			id: '1',
			name: 'John Doe',
			email: 'john@example.com',
		},
		expires: '',
	};

	const ticketUnread = vi.fn(() => Promise.resolve(false));
	const logout = vi.fn(() => Promise.resolve());

	beforeEach(() => {
		mockReact();
		render(<NavBar session={session} initUnread={ticketUnread()} ticketUnread={ticketUnread} logout={logout} />);
	});

	test('renders home button', () => {
		const homeButton = document.querySelector('#home-btn');
		expect(homeButton).toBeInTheDocument();
	});
});

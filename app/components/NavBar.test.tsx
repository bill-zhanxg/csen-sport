import { render } from '@testing-library/react';

import { NavBar } from './NavBar';

import type { Session } from 'next-auth';
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
		render(
			<NavBar session={session} tawkHash="test-hash">
				<div>Test Children</div>
			</NavBar>,
		);
	});

	test('renders home button', () => {
		const homeButton = document.querySelector('a[href="/"]');
		expect(homeButton).toBeInTheDocument();
	});
});

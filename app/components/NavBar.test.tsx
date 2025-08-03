import { render } from '@testing-library/react';
import { Session } from 'next-auth';
import { NavBar } from './NavBar';

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
			<NavBar session={session}>
				<div>Test Children</div>
			</NavBar>,
		);
	});

	test('renders home button', () => {
		const homeButton = document.querySelector('a[href="/"]');
		expect(homeButton).toBeInTheDocument();
	});
});

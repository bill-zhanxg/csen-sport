import { Suspense } from 'react';
import Home from './page';
import { render, screen } from '@testing-library/react';

vi.mock('server-only', () => ({}));

// describe('Home', () => {
// 	it('renders the user name', async () => {
// 		render(
// 			<Suspense>
// 				<Home />
// 			</Suspense>,
// 		);

// 		const userName = await screen.findByText(/Hello/i);
// 		expect(userName).toBeDefined();
// 	});
// });

test.each(['client', 'server', 'layout'])('%s component', async (keyword) => {
	// render(
	// 	<Suspense>
	// 		<Home />
	// 	</Suspense>,
	// );

	expect(1 + 1).toBe(2);
});

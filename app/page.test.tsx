import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
	it('Work in progress', () => {
		expect(true).toBe(true);
	});
	// it('renders the user name', async () => {
	// 	// Mock the auth function
	// 	const mockAuth = jest.fn().mockResolvedValue({ user: { name: 'John Doe' } });
	// 	jest.mock('@/libs/auth', () => ({ auth: mockAuth }));

	// 	render(<Home />);

	// 	// Wait for the component to finish rendering
	// 	await screen.findByText('Hello John Doe');

	// 	expect(screen.getByText('Hello John Doe')).toBeInTheDocument();
	// });

	// it('renders the upcoming weekly sport schedule', async () => {
	// 	// Mock the auth function
	// 	const mockAuth = jest.fn().mockResolvedValue({ user: { name: 'John Doe', team: { id: 'team-1' } } });
	// 	jest.mock('@/libs/auth', () => ({ auth: mockAuth }));

	// 	// Mock the getXataClient function
	// 	const mockGetXataClient = jest.fn().mockResolvedValue({
	// 		db: {
	// 			games: {
	// 				select: jest.fn().mockReturnThis(),
	// 				sort: jest.fn().mockReturnThis(),
	// 				filter: jest.fn().mockReturnThis(),
	// 				getMany: jest.fn().mockResolvedValue([]),
	// 			},
	// 		},
	// 	});
	// 	jest.mock('@/libs/xata', () => ({ getXataClient: mockGetXataClient }));

	// 	render(<Home />);

	// 	// Wait for the component to finish rendering
	// 	await screen.findByText('Here is your upcoming weekly sport schedule');

	// 	expect(screen.getByText('Here is your upcoming weekly sport schedule')).toBeInTheDocument();
	// });

	// Add more tests as needed...
});
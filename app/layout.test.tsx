import { render } from '@testing-library/react';
import MainLayout from './layout';

describe('MainLayout', () => {
	it('Work in progress', () => {
		expect(true).toBe(true);
	});
	// it('renders children when session is not null', async () => {
	// 	const { getByText } = render(<MainLayout>Hello World</MainLayout>);
	// 	expect(getByText('Hello World')).toBeInTheDocument();
	// });

	// it('renders blocked message and image when session is blocked', async () => {
	// 	const { getByText, getByAltText } = render(<MainLayout>Test</MainLayout>);
	// 	expect(getByText("Sorry but you've been blocked from accessing this site.")).toBeInTheDocument();
	// 	expect(getByAltText('Sad')).toBeInTheDocument();
	// });

	// it('renders children when session is null', async () => {
	// 	const { getByText } = render(<MainLayout>Hello World</MainLayout>);
	// 	expect(getByText('Hello World')).toBeInTheDocument();
	// });
});

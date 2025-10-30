import type { DateWithGames } from '@/libs/tableHelpers';
import { render } from '@testing-library/react';

import { WeeklySportView } from './WeeklySportView';

describe('Weekly Sport View Component', () => {
	/**
	 * @type {DateWithGames}
	 */
	const date = {
		date: '29/08/2024',
		rawDate: new Date(1724919156966),
		games: [
			{
				id: '1',
				team: {
					isJunior: true,
					name: 'Team A',
				},
				isHome: true,
				opponent: 'Team B',
				venue: 'Casey Stadium',
				teacher: {
					id: 'teacher-1',
					name: 'John Doe',
				},
				transportation: 'Car',
				out_of_class: new Date(1724919156966),
				start: new Date(1724919156966),
				notes: 'Some notes',
				xata: {
					updatedAt: new Date(1724919156966),
				},
			},
		],
	};

	const teachers = [
		{
			id: 'teacher-1',
			name: 'John Doe',
		},
	];

	const lastVisit = new Date();
	const timezone = 'Australia/Sydney';

	let rendered: ReturnType<typeof render>;

	beforeEach(() => {
		rendered = render(
			<WeeklySportView
				date={date as DateWithGames}
				teachers={teachers}
				isTeacher={true}
				lastVisit={lastVisit}
				timezone={timezone}
			/>,
		);
	});

	test('renders Weekly Sport View component', () => {
		const { getByText, getAllByText } = rendered;

		expect(getByText('Weekly Sport 29/08/2024')).toBeInTheDocument();

		expect(getByText('Group')).toBeInTheDocument();
		expect(getByText('Team')).toBeInTheDocument();
		expect(getByText('Position')).toBeInTheDocument();
		expect(getByText('Opponent')).toBeInTheDocument();
		expect(getByText('Venue')).toBeInTheDocument();
		expect(getByText('Teacher')).toBeInTheDocument();
		expect(getByText('Transportation')).toBeInTheDocument();
		expect(getByText('Out of Class')).toBeInTheDocument();
		expect(getByText('Start time')).toBeInTheDocument();
		expect(getByText('Confirmed')).toBeInTheDocument();
		expect(getByText('Notes')).toBeInTheDocument();

		expect(getByText('Junior (Y7-8)')).toBeInTheDocument();
		expect(getByText('Team A')).toBeInTheDocument();
		expect(getByText('Home')).toBeInTheDocument();
		expect(getByText('Team B')).toBeInTheDocument();
		expect(getAllByText('Casey Stadium')[0]).toBeInTheDocument();
		expect(getByText('John Doe')).toBeInTheDocument();
		expect(getByText('Car')).toBeInTheDocument();
		expect(getAllByText('6:12 PM')[0]).toBeInTheDocument();
		expect(getAllByText('6:12 PM')[1]).toBeInTheDocument();
		expect(getByText('Some notes')).toBeInTheDocument();
	});
});

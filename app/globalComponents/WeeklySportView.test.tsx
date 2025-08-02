import { DateWithGames } from '@/libs/tableHelpers';
import { render, screen } from '@testing-library/react';
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

	beforeEach(() => {
		render(
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
		expect(screen.getByText('Weekly Sport 29/08/2024')).toBeInTheDocument();

		expect(screen.getByText('Group')).toBeInTheDocument();
		expect(screen.getByText('Team')).toBeInTheDocument();
		expect(screen.getByText('Position')).toBeInTheDocument();
		expect(screen.getByText('Opponent')).toBeInTheDocument();
		expect(screen.getByText('Venue')).toBeInTheDocument();
		expect(screen.getByText('Teacher')).toBeInTheDocument();
		expect(screen.getByText('Transportation')).toBeInTheDocument();
		expect(screen.getByText('Out of Class')).toBeInTheDocument();
		expect(screen.getByText('Start time')).toBeInTheDocument();
		expect(screen.getByText('Confirmed')).toBeInTheDocument();
		expect(screen.getByText('Notes')).toBeInTheDocument();

		expect(screen.getByText('Junior (Y7-8)')).toBeInTheDocument();
		expect(screen.getByText('Team A')).toBeInTheDocument();
		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Team B')).toBeInTheDocument();
		expect(screen.getAllByText('Stadium')[0]).toBeInTheDocument();
		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Car')).toBeInTheDocument();
		expect(screen.getAllByText('6:12 PM')[0]).toBeInTheDocument();
		expect(screen.getAllByText('6:12 PM')[1]).toBeInTheDocument();
		expect(screen.getByText('Some notes')).toBeInTheDocument();
	});
});

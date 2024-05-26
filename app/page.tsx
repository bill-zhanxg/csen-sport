import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { getRawTeachers } from '@/libs/tableData';
import { gamesToDates, getLastVisitDate } from '@/libs/tableHelpers';
import { getXataClient } from '@/libs/xata';
import Link from 'next/link';
import { WeeklySportView } from './globalComponents/WeeklySportView';

export default async function Home() {
	const session = await auth();
	const isTeacherBool = isTeacher(session);
	const lastVisit = getLastVisitDate(session);

	const filter = {
		// The date in the database is 12 noon in the imported timezone, so we need to minus 12 hours to the current date
		date: { $ge: new Date(new Date().getTime() - 12 * 60 * 60 * 1000) },
		...(isTeacherBool
			? {
					$any: {
						teacher: session?.user.id,
						extra_teachers: { $includes: session?.user.id },
					},
			  }
			: session?.user.team
			? { team: session.user.team.id }
			: {}),
	};

	const games = await getXataClient()
		.db.games.select(['*', 'team.*', 'venue.*', 'teacher.*'])
		.sort('date', 'asc')
		.filter(filter)
		.getMany({
			consistency: 'eventual',
			pagination: { size: 30 },
		});

	const dates = gamesToDates(games, isTeacherBool);
	const teachers = await getRawTeachers();

	return (
		<div className="flex flex-col items-center w-full py-6 p-1 sm:p-6 gap-4">
			<h1 className="text-2xl font-bold text-center">
				Hello <span className="text-primary">{session?.user.name}</span>
			</h1>
			<h2 className="text-xl text-center max-w-3xl">
				{!isTeacherBool && !session?.user.team ? (
					<>
						<span className="text-error">You are currently not in a team, showing all upcoming weekly sport games</span>
						<br />
						<Link className="link link-secondary" href="/settings#team-preferences">
							Click here to select your team
						</Link>
					</>
				) : (
					'Here is your upcoming weekly sport schedule'
				)}
			</h2>
			<main className="flex flex-col items-center gap-4 pt-0 p-1 sm:p-4 w-full">
				{dates.length < 1 ? (
					<div>Nothing Here</div>
				) : (
					<>
						{dates.map((date) => (
							<WeeklySportView
								key={date.date}
								date={date}
								teachers={teachers}
								isTeacher={isTeacherBool}
								lastVisit={lastVisit}
								showRelative
								timezone={session?.user.timezone ?? ''}
							/>
						))}
					</>
				)}
			</main>
		</div>
	);
}

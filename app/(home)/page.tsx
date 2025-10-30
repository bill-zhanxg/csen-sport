import Link from 'next/link';

import { authC } from '@/app/cache';
import { isTeacher } from '@/libs/checkPermission';
import { getRawTeachers } from '@/libs/tableData';
import { gamesToDates, getLastVisitDate } from '@/libs/tableHelpers';
import { getXataClient } from '@/libs/xata';

import { WeeklySportCardView } from '../globalComponents/WeeklySportCardView';

export default async function Home() {
	const session = await authC();
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
		.db.games.select(['*', 'team.*', 'teacher.*'])
		.sort('date', 'asc')
		.sort('team.name', 'asc')
		.filter(filter)
		.getMany({
			consistency: 'eventual',
			pagination: { size: 30 },
		});

	const dates = gamesToDates(games, isTeacherBool, session?.user.timezone);
	const teachers = await getRawTeachers();

	return (
		<div className="flex flex-col items-center w-full py-6 px-4 sm:px-6 gap-6">
			<div className="text-center max-w-4xl">
				<h1 className="text-3xl sm:text-4xl font-bold mb-4">
					Hello <span className="text-primary">{session?.user.name}</span>
				</h1>
				<h2 className="text-lg sm:text-xl text-base-content/80">
					{!isTeacherBool && !session?.user.team ? (
						<>
							<span className="text-error font-medium">
								You are currently not in a team, showing all upcoming weekly sport games
							</span>
							<br />
							<Link className="link link-secondary" href="/settings#team-preferences">
								Click here to select your team
							</Link>
						</>
					) : (
						'Here is your upcoming weekly sport schedule'
					)}
				</h2>
			</div>
			<main className="flex flex-col items-center w-full max-w-7xl">
				{dates.length < 1 ? (
					<div className="flex flex-col items-center gap-6 py-16 text-center">
						<div className="text-8xl opacity-80">🏀</div>
						<div>
							<h3 className="text-2xl font-bold text-base-content/80 mb-2">No upcoming games</h3>
							<p className="text-base-content/60">Check back later for your weekly sport schedule</p>
						</div>
					</div>
				) : (
					<>
						{dates.map((date, index) => (
							<div key={date.date} className="w-full">
								<WeeklySportCardView
									date={date}
									teachers={teachers}
									isTeacher={isTeacherBool}
									lastVisit={lastVisit}
									showRelative
									timezone={session?.user.timezone ?? ''}
								/>
								{index < dates.length - 1 && <div className="divider my-8"></div>}
							</div>
						))}
					</>
				)}
			</main>
		</div>
	);
}

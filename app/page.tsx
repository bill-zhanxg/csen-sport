import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { gamesToDates } from '@/libs/gamesToDates';
import { getXataClient } from '@/libs/xata';
import { WeeklySportView } from './globalComponents/WeeklySportView';

export default async function Home() {
	const session = await auth();
	const isTeacherBool = isTeacher(session);

	const filter = {
		date: { $ge: new Date() },
		...(isTeacherBool ? { teacher: session?.user.id } : session?.user.team ? { team: session.user.team.id } : {}),
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

	return (
		<div className="flex flex-col items-center w-full p-6 gap-4">
			<h1 className="text-2xl font-bold text-center">
				Hello <span className="text-primary">{session?.user.name}</span>
			</h1>
			<h2 className="text-xl text-secondary text-center max-w-2xl">
				{!isTeacherBool && !session?.user.team ? (
					<>
						<span className="text-error">You are current not in a team, showing all upcoming weekly sport games</span>
						<br />
						(To select a team, click your profile and you can select your team under user settings)
					</>
				) : (
					`Here is your upcoming weekly sport games ${isTeacherBool ? 'to manage' : 'for your team'}`
				)}
			</h2>
			<main className="flex flex-col items-center gap-4 pt-0 p-4 w-full">
				{dates.length < 1 ? (
					<div>Nothing Here</div>
				) : (
					<>
						{dates.map((date) => (
							<WeeklySportView key={date.date} date={date} isTeacher={isTeacherBool} showRelative />
						))}
					</>
				)}
			</main>
		</div>
	);
}

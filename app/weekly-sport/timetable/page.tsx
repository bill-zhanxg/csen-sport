import { PaginationMenu } from '@/app/globalComponents/PaginationMenu';
import { Tabs } from '@/app/globalComponents/Tabs';
import { WeeklySportStudent } from '@/app/globalComponents/WeeklySportStudent';
import { WeeklySportTeacher } from '@/app/globalComponents/WeeklySportTeacher';
import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { gamesToDates } from '@/libs/gamesToDates';
import { serializeGames } from '@/libs/serializeData';
import { getRawTeachers, getRawTeams, getRawVenues } from '@/libs/tableData';
import { getXataClient } from '@/libs/xata';
import Link from 'next/link';

const xata = getXataClient();

export default async function WeeklySport({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const session = await auth();
	const itemsPerPage = 100;
	// Convert all array search params to string and return new object
	for (const key in searchParams) {
		if (Array.isArray(searchParams[key])) searchParams[key] = searchParams[key]?.[0];
	}
	const { filter, page, edit } = searchParams;
	const isPast = filter === 'past';
	const isEdit = edit === 'true';
	const isTeacherVar = isTeacher(session);

	const total = (
		await xata.db.games.summarize({
			consistency: 'eventual',
			filter: {
				date: isPast ? { $lt: new Date() } : { $ge: new Date() },
			},
			summaries: {
				total: { count: '*' },
			},
		})
	).summaries[0].total;
	const games = await getXataClient()
		.db.games.select(['*', 'team.*', 'venue.*', 'teacher.*'])
		.getPaginated({
			consistency: 'eventual',
			sort: [{ date: isPast ? 'desc' : 'asc' }],
			filter: {
				date: isPast ? { $lt: new Date().toISOString() } : { $ge: new Date().toISOString() },
			},
			pagination: {
				size: itemsPerPage,
				offset: page ? (parseInt(page as string) - 1) * itemsPerPage : 0,
			},
		});

	const dates = gamesToDates(games);
	const teams = isTeacherVar ? await getRawTeams() : [];
	const teachers = isTeacherVar ? await getRawTeachers() : [];
	const venues = isTeacherVar ? await getRawVenues() : [];

	return (
		<div className="flex flex-col items-center w-full p-4 gap-4">
			<h1 className="text-2xl font-bold">Weekly Sport Timetable</h1>
			<div className="flex gap-4">
				<Tabs>
					<Link
						href={`/weekly-sport/timetable?edit=${edit}`}
						role="tab"
						className={`tab ${isPast ? '' : 'tab-active text-primary'}`}
					>
						Upcoming Games
					</Link>
					<Link
						href={`/weekly-sport/timetable?filter=past&edit=${edit}`}
						role="tab"
						className={`tab ${isPast ? 'tab-active text-primary' : ''}`}
					>
						Past Games
					</Link>
				</Tabs>
				{isTeacherVar && (
					<Tabs>
						<Link
							href={`/weekly-sport/timetable?edit=false&filter=${filter}&page=${page}`}
							role="tab"
							className={`tab ${isEdit ? '' : 'tab-active text-primary'}`}
						>
							Viewing
						</Link>
						<Link
							href={`/weekly-sport/timetable?edit=true&filter=${filter}&page=${page}`}
							role="tab"
							className={`tab ${isEdit ? 'tab-active text-primary' : ''}`}
						>
							Editing
						</Link>
					</Tabs>
				)}
			</div>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				{dates.length < 1 ? (
					<div>Nothing Here</div>
				) : (
					<>
						{dates.map((date) =>
							isTeacherVar && isEdit ? (
								<WeeklySportTeacher
									date={{
										...date,
										games: serializeGames(date.games),
									}}
									key={date.date}
									teams={teams}
									teachers={teachers}
									venues={venues}
								/>
							) : (
								<WeeklySportStudent date={date} key={date.date} />
							),
						)}
						<PaginationMenu totalPages={Math.ceil(total / itemsPerPage)} />
					</>
				)}
			</main>
		</div>
	);
}

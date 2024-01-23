import { PaginationMenu } from '@/app/globalComponents/PaginationMenu';
import { WeeklySportStudent } from '@/app/globalComponents/WeeklySportStudent';
import { WeeklySportTeacher } from '@/app/globalComponents/WeeklySportTeacher';
import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { serializeGames } from '@/libs/serializeData';
import { getRawTeachers, getRawTeams, getRawVenues } from '@/libs/tableData';
import { GamesRecord, getXataClient } from '@/libs/xata';
import { SelectedPick } from '@xata.io/client';
import Link from 'next/link';

const xata = getXataClient();

export default async function WeeklySport({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const session = await auth();
	const itemsPerPage = 100;
	const { filter, page } = searchParams;
	const past = filter === 'past';
	const isTeacherVar = isTeacher(session);

	const total = (
		await xata.db.games.summarize({
			consistency: 'eventual',
			filter: {
				date: past ? { $lt: new Date() } : { $ge: new Date() },
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
			sort: [{ date: past ? 'desc' : 'asc' }],
			filter: {
				date: past ? { $lt: new Date().toISOString() } : { $ge: new Date().toISOString() },
			},
			pagination: {
				size: itemsPerPage,
				offset: page ? (parseInt(page[0]) - 1) * itemsPerPage : 0,
			},
		});

	const dates: {
		date: string;
		games: SelectedPick<GamesRecord, ('*' | 'team.*' | 'venue.*' | 'teacher.*')[]>[];
	}[] = [];
	let datesArrayIndex = 0;
	for (const game of games.records) {
		if (!game.date) continue;
		const date = game.date.toLocaleDateString();
		if (!dates[datesArrayIndex]) dates[datesArrayIndex] = { date, games: [] };
		if (dates[datesArrayIndex].date !== date) datesArrayIndex++;
		if (!dates[datesArrayIndex]) dates[datesArrayIndex] = { date, games: [] };
		dates[datesArrayIndex].games.push(game);
	}

	const teams = isTeacherVar ? await getRawTeams() : [];
	const teachers = isTeacherVar ? await getRawTeachers() : [];
	const venues = isTeacherVar ? await getRawVenues() : [];

	return (
		<div className="flex flex-col items-center w-full p-4 gap-4">
			<h1 className="text-2xl font-bold">Weekly Sport Timetable</h1>
			<div role="tablist" className="tabs tabs-bordered tabs-lg">
				<Link href="/weekly-sport/timetable" role="tab" className={`tab ${past ? '' : 'tab-active text-primary'}`}>
					Upcoming Games
				</Link>
				<Link
					href="/weekly-sport/timetable?filter=past"
					role="tab"
					className={`tab ${past ? 'tab-active text-primary' : ''}`}
				>
					Past Games
				</Link>
			</div>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				{dates.length < 1 ? (
					<div>Nothing Here</div>
				) : (
					<>
						{dates.map((date) =>
							isTeacherVar ? (
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

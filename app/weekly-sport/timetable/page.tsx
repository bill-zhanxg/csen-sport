import { PaginationMenu } from '@/app/globalComponents/PaginationMenu';
import { Tabs } from '@/app/globalComponents/Tabs';
import { WeeklySportEdit } from '@/app/globalComponents/WeeklySportEdit';
import { WeeklySportView } from '@/app/globalComponents/WeeklySportView';
import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { getDateStart, stringifySearchParam } from '@/libs/formatValue';
import { serializeGames } from '@/libs/serializeData';
import { getRawTeachers, getRawTeams, getRawVenues } from '@/libs/tableData';
import { gamesToDates, getLastVisitDate } from '@/libs/tableHelpers';
import { SearchParams } from '@/libs/types';
import { getXataClient } from '@/libs/xata';
import Link from 'next/link';

const xata = getXataClient();

export default async function WeeklySport({ searchParams }: { searchParams: SearchParams }) {
	const session = await auth();
	const itemsPerPage = 50;
	const { filter, page, edit } = stringifySearchParam(searchParams);
	const isPast = filter === 'past';
	const isEdit = edit === 'true';
	const isTeacherBool = isTeacher(session);
	const lastVisit = getLastVisitDate(session, true);

	const dbFilter = {
		date: isPast ? { $lt: getDateStart() } : { $ge: getDateStart() },
	};

	const total = (
		await xata.db.games.summarize({
			consistency: 'eventual',
			filter: dbFilter,
			summaries: {
				total: { count: '*' },
			},
		})
	).summaries[0].total;
	const games = await xata.db.games
		.select(['*', 'team.*', 'venue.*', 'teacher.*'])
		.filter(dbFilter)
		.getPaginated({
			consistency: 'eventual',
			sort: [{ date: isPast ? 'desc' : 'asc' }, { 'team.name': 'asc' }],
			pagination: {
				size: itemsPerPage,
				offset: page ? (parseInt(page) - 1) * itemsPerPage : 0,
			},
		});

	const dates = gamesToDates(games, isTeacherBool);
	const teams = isTeacherBool ? await getRawTeams() : [];
	const teachers = await getRawTeachers();
	const venues = await getRawVenues();

	return (
		<div className="flex flex-col items-center w-full sm:p-4 gap-4">
			<h1 className="text-2xl font-bold text-center">Weekly Sport Timetable</h1>
			<div className="flex flex-col sm:flex-row gap-4 py-2 px-1 sm:px-4 w-full sm:w-auto">
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
				{isTeacherBool && (
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
			<main className="flex flex-col items-center gap-4 pt-0 p-1 sm:p-4 w-full">
				{dates.length < 1 ? (
					<div>Nothing Here</div>
				) : (
					<>
						{dates.map((date) =>
							isTeacherBool && isEdit ? (
								<WeeklySportEdit
									date={{
										...date,
										games: serializeGames(date.games, isTeacherBool),
									}}
									key={date.date}
									teams={teams}
									teachers={teachers}
									venues={venues}
								/>
							) : (
								<WeeklySportView
									key={date.date}
									date={date}
									teachers={teachers}
									isTeacher={isTeacherBool}
									lastVisit={lastVisit}
									timezone={session?.user.timezone ?? ''}
								/>
							),
						)}
						<PaginationMenu totalPages={Math.ceil(total / itemsPerPage)} />
					</>
				)}
			</main>
		</div>
	);
}

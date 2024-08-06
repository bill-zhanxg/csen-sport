import { PaginationMenu } from '@/app/globalComponents/PaginationMenu';
import { Tabs } from '@/app/globalComponents/Tabs';
import { WeeklySportView } from '@/app/globalComponents/WeeklySportView';
import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { getDateStart, stringifySearchParam } from '@/libs/formatValue';
import { serializeGames } from '@/libs/serializeData';
import { getRawTeachers, getRawTeams, getRawVenues } from '@/libs/tableData';
import { gamesToDates, getLastVisitDate } from '@/libs/tableHelpers';
import { SearchParams } from '@/libs/types';
import { getXataClient } from '@/libs/xata';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const WeeklySportEdit = dynamic(() => import('@/app/globalComponents/WeeklySportEdit'), { ssr: false });

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

	const totalPromise = async () => {
		return (
			await xata.db.games.summarize({
				consistency: 'eventual',
				filter: dbFilter,
				summaries: {
					total: { count: '*' },
				},
			})
		).summaries[0].total;
	};
	const gamesPromise = xata.db.games
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

	const teamsPromise = isTeacherBool ? getRawTeams() : [];
	const teachersPromise = getRawTeachers();
	const venuesPromise = getRawVenues();

	const [total, games, teams, teachers, venues] = await Promise.all([
		totalPromise(),
		gamesPromise,
		teamsPromise,
		teachersPromise,
		venuesPromise,
	]);

	const dates = gamesToDates(games, isTeacherBool);

	function buildSearchParam(props?: { edit?: string; filter?: string; page?: string }) {
		const { edit, filter, page } = props ?? {};

		const baseUri = '/weekly-sport/timetable';
		const searchParams = new URLSearchParams();

		if (edit) searchParams.set('edit', edit);
		if (filter) searchParams.set('filter', filter);
		if (page) searchParams.set('page', page);

		return `${baseUri}?${searchParams.toString()}`;
	}

	return (
		<div className="flex flex-col items-center w-full sm:p-4 gap-4">
			<h1 className="text-2xl font-bold text-center">Weekly Sport Timetable</h1>
			<div className="flex flex-col sm:flex-row gap-4 py-2 px-1 sm:px-4 w-full sm:w-auto">
				<Tabs>
					<Link
						href={buildSearchParam({ edit })}
						role="tab"
						className={`tab ${isPast ? '' : 'tab-active text-primary'}`}
					>
						Upcoming Games
					</Link>
					<Link
						href={buildSearchParam({ edit, filter: 'past' })}
						role="tab"
						className={`tab ${isPast ? 'tab-active text-primary' : ''}`}
					>
						Past Games
					</Link>
				</Tabs>
				{isTeacherBool && (
					<Tabs>
						<Link
							href={buildSearchParam({ filter, page })}
							role="tab"
							className={`tab ${isEdit ? '' : 'tab-active text-primary'}`}
						>
							Viewing
						</Link>
						<Link
							href={buildSearchParam({ edit: 'true', filter, page })}
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
									timezone={session?.user.timezone ?? ''}
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

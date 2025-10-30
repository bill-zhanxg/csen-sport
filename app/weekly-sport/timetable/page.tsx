import Link from 'next/link';

import { authC } from '@/app/cache';
import { PaginationMenu } from '@/app/globalComponents/PaginationMenu';
import { Tabs } from '@/app/globalComponents/Tabs';
import { WeeklySportEdit } from '@/app/globalComponents/WeeklySportEdit';
import { WeeklySportView } from '@/app/globalComponents/WeeklySportView';
import { isTeacher } from '@/libs/checkPermission';
import { dayjs } from '@/libs/dayjs';
import { getDateStart, stringifySearchParam } from '@/libs/formatValue';
import { serializeGames } from '@/libs/serializeData';
import { getRawTeachers, getRawTeams } from '@/libs/tableData';
import { gamesToDates, getLastVisitDate } from '@/libs/tableHelpers';
import { getXataClient } from '@/libs/xata';

import type { SearchParams } from '@/libs/types';
import type { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'Timetable',
};

const xata = getXataClient();

export default async function WeeklySport(props0: { searchParams: SearchParams }) {
	const searchParams = await props0.searchParams;
	const session = await authC();
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
		.select(['*', 'team.*', 'teacher.*'])
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

	const [total, games, teams, teachers] = await Promise.all([
		totalPromise(),
		gamesPromise,
		teamsPromise,
		teachersPromise,
	]);

	const dates = gamesToDates(games, isTeacherBool, session?.user.timezone);

	function buildSearchParam(props?: {
		edit?: string;
		filter?: string;
		page?: string;
	}): __next_route_internal_types__.RouteImpl<string> {
		const { edit, filter, page } = props ?? {};

		const baseUri = '/weekly-sport/timetable';
		const searchParams = new URLSearchParams();

		if (edit) searchParams.set('edit', edit);
		if (filter) searchParams.set('filter', filter);
		if (page) searchParams.set('page', page);

		return `${baseUri}?${searchParams.toString()}`;
	}

	return (
		<div className="flex flex-col items-center w-full py-6 p-1 sm:p-4 gap-4">
			<h1 className="text-2xl font-bold text-center">
				Weekly Sport Timetable{' '}
				<span className="text-primary">
					(Refreshed at {dayjs.tz(dayjs(), session?.user.timezone ?? '').format('HH:mm:ss')})
				</span>
			</h1>
			<div className="flex flex-col sm:flex-row gap-4 py-2 px-1 sm:px-4 w-full sm:w-auto">
				<Tabs>
					<Link
						href={buildSearchParam({ edit })}
						role="tab"
						className={`tab ${isPast ? '' : 'tab-active text-primary'}`}
						prefetch={false}
					>
						Upcoming Games
					</Link>
					<Link
						href={buildSearchParam({ edit, filter: 'past' })}
						role="tab"
						className={`tab ${isPast ? 'tab-active text-primary' : ''}`}
						prefetch={false}
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
							prefetch={false}
						>
							Viewing
						</Link>
						<Link
							href={buildSearchParam({ edit: 'true', filter, page })}
							role="tab"
							className={`tab ${isEdit ? 'tab-active text-primary' : ''}`}
							prefetch={false}
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

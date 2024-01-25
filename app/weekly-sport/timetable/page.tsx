import { PaginationMenu } from '@/app/globalComponents/PaginationMenu';
import { Tabs } from '@/app/globalComponents/Tabs';
import { WeeklySportEdit } from '@/app/globalComponents/WeeklySportEdit';
import { WeeklySportView } from '@/app/globalComponents/WeeklySportView';
import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { stringifySearchParam } from '@/libs/formatValue';
import { gamesToDates } from '@/libs/gamesToDates';
import { serializeGames } from '@/libs/serializeData';
import { getRawTeachers, getRawTeams, getRawVenues } from '@/libs/tableData';
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
				offset: page ? (parseInt(page) - 1) * itemsPerPage : 0,
			},
		});

	const dates = gamesToDates(games, isTeacherBool);
	const teams = isTeacherBool ? await getRawTeams() : [];
	const teachers = isTeacherBool ? await getRawTeachers() : [];
	const venues = isTeacherBool ? await getRawVenues() : [];

	return (
		<div className="flex flex-col items-center w-full p-4 gap-4">
			<h1 className="text-2xl font-bold">Weekly Sport Timetable</h1>
			<div className="flex flex-col sm:flex-row gap-4 py-2 px-4 w-full sm:w-auto">
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
			<main className="flex flex-col items-center gap-4 pt-0 p-4 overflow-x-auto w-full">
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
								<WeeklySportView key={date.date} date={date} isTeacher={isTeacherBool} />
							),
						)}
						<PaginationMenu totalPages={Math.ceil(total / itemsPerPage)} />
					</>
				)}
			</main>
		</div>
	);
}

import { PaginationMenu } from '@/app/globalComponents/PaginationMenu';
import { GamesRecord, getXataClient } from '@/libs/xata';
import { SelectedPick } from '@xata.io/client';
import Link from 'next/link';

export default async function WeeklySport({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const itemsPerPage = 100;
	const { filter, page } = searchParams;
	const past = filter === 'past';

	const total = (
		await getXataClient().db.games.summarize({
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
						{dates.map((date) => (
							<div className="w-full" key={date.date}>
								<h2 className="text-xl text-center text-primary">Weekly Sport {date.date}</h2>
								<div className="w-full">
									<table className="table">
										<thead>
											<tr>
												<th>Group</th>
												<th>Team</th>
												<th>Opponent</th>
												<th>Venue</th>
												<th>Teacher</th>
												<th>Transportation</th>
												<th>Out of Class</th>
												<th>Start time</th>
											</tr>
										</thead>
										<tbody>
											{date.games.map((game) => (
												<tr key={game.id}>
													<td>{game?.team?.isJunior !== undefined ? game.team.isJunior ? 'Junior' : 'Intermediate' : '---'}</td>
													<td>{game?.team?.name || '---'}</td>
													<td>{game?.opponent || '---'}</td>
													<td>{game?.venue?.name || '---'}</td>
													<td>{game?.teacher?.name || '---'}</td>
													<td>{game?.transportation || '---'}</td>
													<td>{game?.out_of_class?.toLocaleTimeString() || '---'}</td>
													<td>{game?.start?.toLocaleTimeString() || '---'}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						))}
						<PaginationMenu totalPages={Math.ceil(total / itemsPerPage)} />
					</>
				)}
			</main>
		</div>
	);
}

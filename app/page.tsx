import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';

const xata = getXataClient();

export default async function Home({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const session = await auth();
	const itemsPerPage = 100;
	const { page } = searchParams;

	const filter = {
		date: { $ge: new Date() },
		...(isTeacher(session) ? { teacher: session?.user.id } : session?.user.team ? { team: session.user.team.id } : {}),
	};

	const total = (
		await xata.db.games.summarize({
			consistency: 'eventual',
			filter,
			summaries: {
				total: { count: '*' },
			},
		})
	).summaries[0].total;
	const games = await getXataClient()
		.db.games.select(['*', 'team.*', 'venue.*', 'teacher.*'])
		.getPaginated({
			consistency: 'eventual',
			sort: [{ date: 'asc' }],
			filter: filter as any,
			pagination: {
				size: itemsPerPage,
				offset: page ? (parseInt(page[0]) - 1) * itemsPerPage : 0,
			},
		});

	console.log(games.records);

	return <h1>Unfinished</h1>;

	// return (
	// 	<>
	// 		<main className="flex flex-col p-4 w-full">
	// 			<h1>Your upcoming events:</h1>
	// 			{dates ? (
	// 				dates.length < 1 ? (
	// 					<div>Nothing Here</div>
	// 				) : (
	// 					dates.map((date) => (
	// 						<div className="w-full" key={date.day}>
	// 							<h2 className="text-xl text-center text-primary">{new Date(date.day).toLocaleDateString()}</h2>
	// 							<div className="w-full">
	// 								<table className="table">
	// 									<thead>
	// 										<tr>
	// 											<th>Team</th>
	// 											<th>Opponent</th>
	// 											<th>Venue</th>
	// 											<th>Teacher</th>
	// 											<th>Transportation</th>
	// 											<th>Out of Class</th>
	// 											<th>Start time</th>
	// 										</tr>
	// 									</thead>
	// 									<tbody>
	// 										{date.game.length > 0 ? (
	// 											date.game.map((game) => (
	// 												<tr key={game.$id}>
	// 													<td>{game.team?.team || '---'}</td>
	// 													<td>{game.opponent}</td>
	// 													<td>{game.venue || '---'}</td>
	// 													{/* TODO: Make teacher interactive */}
	// 													<td>{game.teacher?.name || '---'}</td>
	// 													<td>{game.transportation || '---'}</td>
	// 													<td>
	// 														{game['out-of-class'] ? new Date(game['out-of-class']).toLocaleTimeString() : '---'}
	// 													</td>
	// 													<td>{game.start ? new Date(game.start).toLocaleTimeString() : '---'}</td>
	// 												</tr>
	// 											))
	// 										) : (
	// 											<tr>
	// 												<td>---</td>
	// 												<td>---</td>
	// 												<td>---</td>
	// 												<td>---</td>
	// 												<td>---</td>
	// 												<td>---</td>
	// 												<td>---</td>
	// 											</tr>
	// 										)}
	// 									</tbody>
	// 								</table>
	// 							</div>
	// 						</div>
	// 					))
	// 				)
	// 			) : (
	// 				<SkeletonBlock />
	// 			)}
	// 		</main>
	// 		{alert &&
	// 			(alert.type === 'success' ? (
	// 				<Success message={alert.message} setAlert={setAlert} />
	// 			) : (
	// 				<Error message={alert.message} setAlert={setAlert} />
	// 			))}
	// 	</>
	// );
}

export default function Home() {
	return <h1>Unfinished</h1>
	// const [dates, setDates] = useState<DateInterface[]>();
	// const [alert, setAlert] = useState<{
	// 	type: 'success' | 'error';
	// 	message: string;
	// } | null>(null);

	// // TODO: Handle no permission to view the data by removing user from Admin Team
	// useEffect(() => {
	// 	database
	// 		.getMyGames()
	// 		.then((games) => {
	// 			const filteredGames = games.filter((game) => {
	// 				if (!game.date) return false;
	// 				const now = new Date();
	// 				const gameDate = new Date(game.date.day);
	// 				return gameDate > now;
	// 			});
	// 			const gamesByDate: DateInterface[] = [];
	// 			for (const game of filteredGames) {
	// 				const gameDate = new Date(game.date!.day);
	// 				const gameDateString = gameDate.toString();
	// 				const index = gamesByDate.findIndex((date) => date.day === gameDateString);
	// 				if (index !== -1) gamesByDate[index].game.push(game);
	// 				else
	// 					gamesByDate.push({
	// 						day: gameDateString,
	// 						game: [game],
	// 					});
	// 			}
	// 			gamesByDate.sort((a, b) => {
	// 				const aDate = new Date(a.day);
	// 				const bDate = new Date(b.day);
	// 				return aDate.getTime() - bDate.getTime();
	// 			});
	// 			setDates(gamesByDate);
	// 		})
	// 		.catch((err: AppwriteException) => {
	// 			setAlert({
	// 				type: 'error',
	// 				message: `Failed to load game list: ${err.message}`,
	// 			});
	// 		});
	// }, []);

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

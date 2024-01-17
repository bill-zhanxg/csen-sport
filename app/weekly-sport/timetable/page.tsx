
import { auth } from '@/libs/auth';
import { DateInterfaceDocument } from '../../../libs/appwrite/Interface/Weekly-sport';
import { Error, Success } from '../../components/Alert';

export default async  function WeeklySport() {
	const session = await auth();
	if (!session) return <h1>Unauthenticated</h1>;

	return <h1>Unfinished</h1>
	// return (
	// 	<>
	// 		<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
	// 			{dates ? (
	// 				dates.length < 1 ? (
	// 					<div>Nothing Here</div>
	// 				) : (
	// 					dates.map((date) => (
	// 						<div className="w-full" key={date.$id}>
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
	// 													{/* <td>{game.opponent}</td> */}
	// 													{/* <td>{game.venue || '---'}</td> */}
	// 													{/* TODO: Make teacher interactive */}
	// 													<td>{game.teacher?.name || '---'}</td>
	// 													{/* <td>{game.transportation || '---'}</td> */}
	// 													<td>
	// 														{game.out_of_class ? new Date(game.out_of_class).toLocaleTimeString() : '---'}
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

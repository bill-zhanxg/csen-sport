'use client';

import { AppwriteException } from 'appwrite';
import { useEffect, useState } from 'react';

import { database } from '../../libs/appwrite';
import { DateInterfaceDocument } from '../../libs/appwrite/Interface/Weekly-sport';
import { Error, Success } from '../components/Alert';
import { SkeletonBlock } from '../components/SkeletonBlock';

export default function WeeklySport() {
	const [dates, setDates] = useState<DateInterfaceDocument[]>();
	const [alert, setAlert] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	useEffect(() => {
		database
			.getDates()
			.then(setDates)
			.catch((err: AppwriteException) => {
				setAlert({
					type: 'error',
					message: `Failed to load game list: ${err.message}`,
				});
			});
	}, []);

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				{dates ? (
					dates.length < 1 ? (
						<div>Nothing Here</div>
					) : (
						dates.map((date) => (
							<div className="w-full" key={date.$id}>
								<h2 className="text-xl text-center text-primary">{new Date(date.day).toLocaleDateString()}</h2>
								<div className="w-full">
									<table className="table">
										<thead>
											<tr>
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
											{date.game.length > 0 ? (
												date.game.map((game) => (
													<tr key={game.$id}>
														<td>{game.team?.team || '---'}</td>
														<td>{game.opponent}</td>
														<td>{game.venue || '---'}</td>
														{/* TODO: Make teacher interactive */}
														<td>{game.teacher?.name || '---'}</td>
														<td>{game.transportation || '---'}</td>
														<td>
															{game['out-of-class'] ? new Date(game['out-of-class']).toLocaleTimeString() : '---'}
														</td>
														<td>{game.start ? new Date(game.start).toLocaleTimeString() : '---'}</td>
													</tr>
												))
											) : (
												<tr>
													<td>---</td>
													<td>---</td>
													<td>---</td>
													<td>---</td>
													<td>---</td>
													<td>---</td>
													<td>---</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						))
					)
				) : (
					<SkeletonBlock />
				)}
			</main>
			{alert &&
				(alert.type === 'success' ? (
					<Success message={alert.message} setAlert={setAlert} />
				) : (
					<Error message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}

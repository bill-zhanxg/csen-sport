import { dayjs } from '@/libs/dayjs';
import { DateWithGames } from '@/libs/tableHelpers';
import Link from 'next/link';
import { FaInfoCircle, FaRegEye } from 'react-icons/fa';
import { FaLocationDot, FaPen } from 'react-icons/fa6';
import { SideBySide } from './SideBySide';

export function WeeklySportView({
	date,
	showRelative = false,
	isTeacher,
	hideGroup = false,
	lastVisit,
}: {
	date: DateWithGames;
	showRelative?: boolean;
	isTeacher: boolean;
	hideGroup?: boolean;
	lastVisit: Date;
}) {
	return (
		<div className="w-full bg-base-200 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4 overflow-auto">
			<Link
				href={`/date/${date.rawDate.valueOf()}`}
				className="block sticky left-0 text-xl text-center link link-primary"
			>
				Weekly Sport {date.rawDate.toLocaleDateString()}
				{showRelative && ` (${dayjs(date.rawDate).fromNow()})`}
			</Link>
			<div className="w-full mt-2">
				<table className="table">
					<thead>
						<tr>
							{hideGroup || <th>Group</th>}
							<th>Team</th>
							<th>Opponent</th>
							<th>Venue</th>
							<th>Teacher</th>
							<th>Transportation</th>
							<th>Out of Class</th>
							<th>Start time</th>
							{isTeacher && <th>Notes</th>}
						</tr>
					</thead>
					<tbody>
						{date.games.map((game) => (
							<tr
								key={game.id}
								className={`border-base-300${lastVisit < game.xata.updatedAt ? ' bg-info/20' : ''}`}
							>
								{hideGroup || (
									<td>
										{game?.team?.isJunior !== undefined ? (game.team.isJunior ? 'Junior' : 'Intermediate') : '---'}
									</td>
								)}
								<td>{game?.team?.name || '---'}</td>
								<td>{game?.opponent || '---'}</td>
								<td>
									{game?.venue?.name ? (
										<div className="flex gap-2 items-center justify-between w-full">
											{game.venue.name}
											<label htmlFor={game.venue.id} className="cursor-pointer">
												<FaInfoCircle size={18} />
											</label>

											<input type="checkbox" id={game.venue.id} className="modal-toggle" />
											<div className="modal" role="dialog">
												<div className="flex flex-col modal-box gap-2">
													<h3 className="font-bold text-2xl">Venue Information</h3>
													<SideBySide title="Name:" value={game.venue.name ?? '---'} />
													<SideBySide title="Address:" value={game.venue.address ?? '---'} />
													<SideBySide title="Court / Field Number:" value={game.venue.court_field_number ?? '---'} />
													<div className="modal-action flex-col sm:flex-row gap-2">
														<Link
															href={`https://www.google.com/maps/place/${game.venue.address?.replaceAll(' ', '+')}`}
															target="_blank"
															className="btn btn-primary"
														>
															<FaLocationDot size={16} /> Open in Google Map
														</Link>
														<label htmlFor={game.venue.id} className="btn w-full sm:w-auto !ml-0">
															Close
														</label>
													</div>
												</div>
											</div>
										</div>
									) : (
										'---'
									)}
								</td>
								<td>
									{game?.teacher?.name ? (
										<Link href={`/users/${game.teacher.id}`} className="link link-primary">
											{game.teacher.name}
										</Link>
									) : (
										'---'
									)}
								</td>
								<td>{game?.transportation || '---'}</td>
								<td>{game?.out_of_class?.toLocaleTimeString() || '---'}</td>
								<td>{game?.start?.toLocaleTimeString() || '---'}</td>
								{isTeacher && <td>{game?.notes || '---'}</td>}
								<td>
									<div className="flex gap-2 justify-end w-full">
										<Link className="btn btn-active" href={`/game/${game.id}`}>
											{isTeacher ? <FaPen /> : <FaRegEye />}
										</Link>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

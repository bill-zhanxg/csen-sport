import { dayjs } from '@/libs/dayjs';
import { formatIsHome, formatIsJunior } from '@/libs/formatValue';
import { RawTeacher } from '@/libs/tableData';
import { DateWithGames } from '@/libs/tableHelpers';
import Link from 'next/link';
import { FaInfoCircle, FaRegEye } from 'react-icons/fa';
import { FaCirclePlus, FaLocationDot, FaPen } from 'react-icons/fa6';
import { SideBySide } from './SideBySide';
import { UserAvatar } from './UserAvatar';

export function WeeklySportView({
	date,
	teachers,
	showRelative = false,
	isTeacher,
	hideGroup = false,
	lastVisit,
	timezone,
}: {
	date: DateWithGames;
	teachers: RawTeacher[];
	showRelative?: boolean;
	isTeacher: boolean;
	hideGroup?: boolean;
	lastVisit: Date;
	timezone: string;
}) {
	return (
		<div className="w-full bg-base-200 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4 overflow-auto">
			<Link
				href={`/date/${date.rawDate.valueOf()}`}
				className="block sticky left-0 text-xl text-center link link-primary"
			>
				Weekly Sport {dayjs.tz(date.rawDate, timezone).format('DD/MM/YYYY')}
				{showRelative && ` (${dayjs.tz(date.games[0]?.start ?? date.rawDate, timezone).fromNow()})`}
			</Link>
			<div className="w-full mt-2">
				<table className="table">
					<thead>
						<tr>
							{hideGroup || <th>Group</th>}
							<th>Team</th>
							<th>Position</th>
							<th>Opponent</th>
							<th>Venue</th>
							<th>Teacher</th>
							<th>Transportation</th>
							<th>Out of Class</th>
							<th>Start time</th>
							{isTeacher && <th>Confirmed</th>}
							{isTeacher && <th>Notes</th>}
						</tr>
					</thead>
					<tbody>
						{date.games.map((game) => (
							<tr key={game.id} className={`border-base-300${lastVisit < game.xata.updatedAt ? ' bg-info/20' : ''}`}>
								{hideGroup || <td>{game?.team?.isJunior !== null ? formatIsJunior(game.team?.isJunior) : '---'}</td>}
								<td>{game?.team?.name || '---'}</td>
								<td>{game.isHome !== null ? formatIsHome(game.isHome) : '---'}</td>
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
									<div className="flex gap-2 items-center justify-between w-full">
										{game?.teacher?.name ? (
											<Link href={`/users/${game.teacher.id}`} className="link link-primary">
												{game.teacher.name}
											</Link>
										) : (
											'---'
										)}
										{game.extra_teachers && (
											<>
												<label htmlFor={game.id + '-extra-teacher'} className="cursor-pointer">
													<FaCirclePlus size={18} />
												</label>

												<input type="checkbox" id={game.id + '-extra-teacher'} className="modal-toggle" />
												<div className="modal" role="dialog">
													<div className="flex flex-col modal-box gap-2">
														<h3 className="font-bold text-2xl">Extra Teachers</h3>
														{game.extra_teachers.map((teacherId) => {
															const teacher = teachers.find((teacher) => teacher.id === teacherId);
															return teacher ? (
																<Link
																	key={teacherId}
																	href={`/users/${teacherId}`}
																	className="flex items-center gap-3 bg-base-200 p-2 rounded-lg cursor-pointer hover:bg-base-300 transition"
																>
																	<div className="avatar">
																		<div className="mask mask-squircle w-12 h-12">
																			<UserAvatar user={teacher} />
																		</div>
																	</div>
																	<div className="text-xl font-bold">{teacher.name}</div>
																</Link>
															) : (
																'---'
															);
														})}
														<div className="modal-action flex-col sm:flex-row gap-2">
															<label htmlFor={game.id + '-extra-teacher'} className="btn w-full sm:w-auto !ml-0">
																Close
															</label>
														</div>
													</div>
												</div>
											</>
										)}
									</div>
								</td>
								<td>{game?.transportation || '---'}</td>
								<td>{game?.out_of_class ? dayjs.tz(game?.out_of_class, timezone).format('LT') : '---'}</td>
								<td>{game?.start ? dayjs.tz(game?.start, timezone).format('LT') : '---'}</td>
								{isTeacher && (
									<td>
										<input
											type="checkbox"
											disabled
											className="checkbox checkbox-primary !opacity-80 !cursor-default"
											checked={game.confirmed}
										/>
									</td>
								)}
								{isTeacher && <td>{game?.notes || '---'}</td>}
								<td>
									<div className="flex gap-2 justify-end w-full">
										<Link className="btn btn-active" href={`/game/${game.id}`} prefetch={false}>
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

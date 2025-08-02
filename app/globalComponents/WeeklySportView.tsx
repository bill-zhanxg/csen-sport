import { dayjs } from '@/libs/dayjs';
import { formatIsHome, formatIsJunior } from '@/libs/formatValue';
import { serializeGame } from '@/libs/serializeData';
import { RawTeacher } from '@/libs/tableData';
import { DateWithGames } from '@/libs/tableHelpers';
import { getXataClient } from '@/libs/xata';
import Link from 'next/link';
import { FaRegEye } from 'react-icons/fa';
import { FaCirclePlus, FaLocationDot, FaPen } from 'react-icons/fa6';
import { UserAvatar } from './UserAvatar';
import { Checkbox } from './WeeklySportViewComponents/Checkbox';

export function WeeklySportView({
	date,
	teachers,
	showRelative = false,
	isTeacher,
	lastVisit,
	timezone,
}: {
	date: DateWithGames;
	teachers: RawTeacher[];
	showRelative?: boolean;
	isTeacher: boolean;
	lastVisit: Date;
	timezone: string;
}) {
	async function updateConfirmed(id: any, checked: any) {
		'use server';
		if (!isTeacher || typeof id !== 'string' || typeof checked !== 'boolean') return false;
		return getXataClient()
			.db.games.update(id, { confirmed: checked })
			.then(() => true)
			.catch(() => false);
	}

	return (
		<div className="w-full bg-base-200 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4 overflow-auto">
			<Link
				href={`/date/${date.rawDate.valueOf()}`}
				className="block sticky left-0 text-xl text-center link link-primary"
			>
				Weekly Sport {date.date}
				{showRelative && ` (${dayjs.tz(date.games[0]?.start ?? date.rawDate, timezone).fromNow()})`}
			</Link>
			<div className="w-full mt-2">
				<table className="table">
					<thead>
						<tr>
							<th>Group</th>
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
								<td>{game?.team?.isJunior !== null ? formatIsJunior(game.team?.isJunior) : '---'}</td>
								<td>{game?.team?.name || '---'}</td>
								<td>{game.isHome !== null ? formatIsHome(game.isHome) : '---'}</td>
								<td>{game?.opponent || '---'}</td>
								<td>
									{game.venue ? (
										<Link
											href={`https://www.google.com/maps/search/${game.venue.replaceAll(' ', '+')}`}
											target="_blank"
											className="link link-primary"
											rel="noopener noreferrer"
										>
											<FaLocationDot size={16} className="inline" /> {game.venue}
										</Link>
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
										{game.extra_teachers && game.extra_teachers.length > 0 && (
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
															<label htmlFor={game.id + '-extra-teacher'} className="btn w-full sm:w-auto ml-0!">
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
										<Checkbox game={serializeGame(game, isTeacher)} updateConfirmed={updateConfirmed} />
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

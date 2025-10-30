import Link from 'next/link';
import { FaBus, FaChalkboardTeacher, FaClock, FaRegEye, FaUsers } from 'react-icons/fa';
import { FaCirclePlus, FaLocationDot, FaPen } from 'react-icons/fa6';

import { dayjs } from '@/libs/dayjs';
import { formatIsHome, formatIsJunior } from '@/libs/formatValue';
import { serializeGame } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';

import { UserAvatar } from './UserAvatar';
import { Checkbox } from './WeeklySportViewComponents/Checkbox';

import type { RawTeacher } from '@/libs/tableData';
import type { GamesRecord} from '@/libs/xata';
import type { SelectedPick } from '@xata.io/client';
type GameCardProps = {
	game: SelectedPick<GamesRecord, ('*' | 'team.*' | 'teacher.*')[]>;
	teachers: RawTeacher[];
	isTeacher: boolean;
	lastVisit: Date;
	timezone: string;
};

export function GameCard({ game, teachers, isTeacher, lastVisit, timezone }: GameCardProps) {
	async function updateConfirmed(id: any, checked: any) {
		'use server';
		if (!isTeacher || typeof id !== 'string' || typeof checked !== 'boolean') return false;
		return getXataClient()
			.db.games.update(id, { confirmed: checked })
			.then(() => true)
			.catch(() => false);
	}

	const isNewUpdate = lastVisit < game.xata.updatedAt;

	return (
		<div
			className={`card w-full min-w-0 bg-base-100 shadow-lg border-2 ${
				isNewUpdate ? 'border-info bg-info/5' : 'border-base-300'
			} hover:shadow-xl transition-all duration-200 relative overflow-hidden`}
		>
			<div className="card-body p-3 sm:p-4 min-w-0 overflow-hidden">
				{/* Header with team and group info */}
				<div className="flex flex-col gap-2 mb-3">
					<div className="flex items-center gap-3">
						<div className="min-w-0 flex-1">
							<h3 className="text-xl font-bold break-words">{game?.team?.name || 'Unknown Team'}</h3>
							<div className="flex items-center gap-2 text-sm opacity-70 flex-wrap">
								{game?.team?.isJunior !== null && (
									<span className="badge badge-outline badge-sm flex-shrink-0">
										{formatIsJunior(game.team?.isJunior)}
									</span>
								)}
								{game.isHome !== null && (
									<span
										className={`badge badge-sm flex-shrink-0 ${
											game.isHome ? 'badge-success text-success-content' : 'badge-info text-info-content'
										}`}
									>
										{formatIsHome(game.isHome)}
									</span>
								)}
							</div>
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex gap-2 justify-end">
						{isTeacher && (
							<div className="flex items-center">
								<Checkbox game={serializeGame(game, isTeacher)} updateConfirmedAction={updateConfirmed} />
							</div>
						)}
						<Link className="btn btn-primary btn-sm" href={`/game/${game.id}`} prefetch={false}>
							{isTeacher ? <FaPen className="w-4 h-4" /> : <FaRegEye className="w-4 h-4" />}
							<span className="hidden sm:inline">{isTeacher ? 'Edit' : 'View'}</span>
						</Link>
					</div>
				</div>

				{/* Game details grid */}
				<div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2 sm:gap-3 min-w-0">
					{/* Opponent */}
					<div className="flex items-center gap-2 p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors min-w-0">
						<FaUsers className="text-primary w-4 h-4 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<div className="text-xs opacity-70">Opponent</div>
							<div className="font-medium text-sm break-words">{game?.opponent || '---'}</div>
						</div>
					</div>

					{/* Venue */}
					<div className="flex items-center gap-2 p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors min-w-0">
						<FaLocationDot className="text-primary w-4 h-4 flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<div className="text-xs opacity-70">Venue</div>
							{game.venue ? (
								<Link
									href={`https://www.google.com/maps/search/${game.venue.replaceAll(' ', '+')}`}
									target="_blank"
									className="link link-primary font-medium break-words block text-sm"
									rel="noopener noreferrer"
								>
									{game.venue}
								</Link>
							) : (
								<div className="font-medium text-sm">---</div>
							)}
						</div>
					</div>

					{/* Start Time */}
					<div className="flex items-center gap-2 p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors min-w-0">
						<FaClock className="text-primary w-4 h-4 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<div className="text-xs opacity-70">Start Time</div>
							<div className="font-medium text-sm break-words">
								{game?.start ? dayjs.tz(game?.start, timezone).format('LT') : '---'}
							</div>
						</div>
					</div>

					{/* Out of Class */}
					<div className="flex items-center gap-2 p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors min-w-0">
						<FaClock className="text-warning w-4 h-4 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<div className="text-xs opacity-70">Out of Class</div>
							<div className="font-medium text-sm break-words">
								{game?.out_of_class ? dayjs.tz(game?.out_of_class, timezone).format('LT') : '---'}
							</div>
						</div>
					</div>

					{/* Transportation */}
					<div className="flex items-center gap-2 p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors min-w-0">
						<FaBus className="text-primary w-4 h-4 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<div className="text-xs opacity-70">Transportation</div>
							<div className="font-medium text-sm break-words">{game?.transportation || '---'}</div>
						</div>
					</div>

					{/* Teacher */}
					<div className="flex items-center gap-2 p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors min-w-0">
						<FaChalkboardTeacher className="text-primary w-4 h-4 flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<div className="text-xs opacity-70">Teacher</div>
							<div className="flex items-center gap-2 min-w-0">
								{game?.teacher?.name ? (
									<Link
										href={`/users/${game.teacher.id}`}
										className="link link-primary font-medium text-sm break-words"
									>
										{game.teacher.name}
									</Link>
								) : (
									<span className="font-medium text-sm">---</span>
								)}
								{game.extra_teachers && game.extra_teachers.length > 0 && (
									<>
										<label
											htmlFor={game.id + '-extra-teacher'}
											className="cursor-pointer tooltip tooltip-top"
											data-tip="Extra teachers"
										>
											<FaCirclePlus className="w-4 h-4 text-accent hover:text-accent-focus transition-colors" />
										</label>

										<input type="checkbox" id={game.id + '-extra-teacher'} className="modal-toggle" />
										<div className="modal" role="dialog">
											<div className="modal-box max-w-md">
												<h3 className="font-bold text-xl mb-4">Extra Teachers</h3>
												<div className="space-y-2 max-h-60 overflow-y-auto">
													{game.extra_teachers.map((teacherId) => {
														const teacher = teachers.find((teacher) => teacher.id === teacherId);
														return teacher ? (
															<Link
																key={teacherId}
																href={`/users/${teacherId}`}
																className="flex items-center gap-3 bg-base-200 p-3 rounded-lg cursor-pointer hover:bg-base-300 transition-colors"
															>
																<div className="avatar">
																	<div className="mask mask-squircle w-10 h-10">
																		<UserAvatar user={teacher} />
																	</div>
																</div>
																<div className="font-medium">{teacher.name}</div>
															</Link>
														) : (
															<div key={teacherId} className="p-3 bg-base-200 rounded-lg opacity-50">
																Unknown Teacher
															</div>
														);
													})}
												</div>
												<div className="modal-action">
													<label htmlFor={game.id + '-extra-teacher'} className="btn btn-sm">
														Close
													</label>
												</div>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Notes section for teachers */}
				{isTeacher && game?.notes && (
					<div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-lg">
						<div className="text-xs opacity-70 mb-1">Notes</div>
						<div className="text-xs">{game.notes}</div>
					</div>
				)}

				{/* Update indicator */}
				{isNewUpdate && (
					<div className="absolute top-3 right-3">
						<div className="badge badge-info badge-sm">Updated</div>
					</div>
				)}
			</div>
		</div>
	);
}

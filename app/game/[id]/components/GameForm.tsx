'use client';

import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaRegCheckCircle, FaStickyNote } from 'react-icons/fa';
import { toast } from 'sonner';

import { TeachersMultiSelect } from '@/app/globalComponents/TeachersMultiSelect';
import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import { isTeacher } from '@/libs/checkPermission';
import { dayjs } from '@/libs/dayjs';
import { formatIsJunior } from '@/libs/formatValue';

import { updateGame } from '../actions';

import type { SerializedGame, SerializedTeam } from '@/libs/serializeData';
import type { RawTeacher } from '@/libs/tableData';
import type { FormState } from '@/libs/types';
import type { Session } from 'next-auth';
export function GameForm({
	session,
	game,
	teams,
	teachers,
}: {
	session: Session | null;
	game: SerializedGame;
	teams: SerializedTeam[];
	teachers: RawTeacher[];
}) {
	const [state, formAction] = useActionState<FormState, FormData>(updateGame, null);
	const isTeacherBool = isTeacher(session);
	const [extraTeachers, setExtraTeachers] = useState<string[]>(game.extra_teachers ?? []);

	const prevState = useRef(state);
	useEffect(() => {
		if (prevState.current !== state && state) {
			if (state.success) {
				toast.success(state.message);
			} else {
				toast.error(state.message);
			}
			prevState.current = state;
		}
	}, [state]);

	return (
		<div>
			{/* Header */}
			<div className="bg-gradient-to-r from-primary/90 to-primary/80 text-primary-content p-6 rounded-t-2xl">
				<h1 className="text-2xl font-bold flex items-center gap-3">
					<div className="w-8 h-8 bg-primary-content/20 rounded-lg flex items-center justify-center">
						<FaCalendarAlt className="w-4 h-4" />
					</div>
					Game Information
				</h1>
				<p className="text-primary-content/80 mt-2">
					{isTeacherBool ? 'Edit game details and schedule information' : 'View game information'}
				</p>
			</div>

			{/* Teacher Edit Form */}
			{isTeacherBool ? (
				<form
					className="bg-base-100 rounded-b-2xl shadow-xl border border-base-300"
					onSubmit={(e) => {
						e.preventDefault();
						startTransition(() => formAction(new FormData(e.currentTarget)));
					}}
				>
					<input type="hidden" name="id" value={game.id} />
					<input type="hidden" name="timezone" value={dayjs.tz.guess()} />

					<div className="p-6 space-y-8">
						{/* Basic Information Section */}
						<div>
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
								<FaCalendarAlt className="w-4 h-4" />
								Basic Information
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<fieldset className="fieldset">
									<legend className="fieldset-legend">Date</legend>
									<input
										type="date"
										defaultValue={game.date ? dayjs(game.date).format('YYYY-MM-DD') : ''}
										name="date"
										className="input focus:input-primary transition-colors w-full"
									/>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-legend">Team</legend>
									<select
										defaultValue={game.team?.id ?? ''}
										className="select focus:select-primary transition-colors w-full"
										name="team"
									>
										<option disabled value="">
											Pick one
										</option>
										{teams.map((team) => (
											<option key={team.id} value={team.id}>
												[{formatIsJunior(team.isJunior)}] {team.name}
											</option>
										))}
									</select>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-legend">Position</legend>
									<select
										defaultValue={
											game.isHome === undefined || game.isHome === null ? '' : game.isHome ? 'home' : 'away'
										}
										className="select focus:select-primary transition-colors w-full"
										name="position"
									>
										<option disabled value="">
											Pick one
										</option>
										<option value="home">Home</option>
										<option value="away">Away</option>
									</select>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-legend">Opponent</legend>
									<input
										type="text"
										placeholder="Enter opponent name"
										defaultValue={game.opponent ?? ''}
										name="opponent"
										className="input focus:input-primary transition-colors w-full"
									/>
								</fieldset>
							</div>
						</div>

						{/* Location & Staff Section */}
						<div>
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-secondary">
								<FaMapMarkerAlt className="w-4 h-4" />
								Location & Staff
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<fieldset className="fieldset">
									<legend className="fieldset-legend">Venue</legend>
									<input
										type="text"
										placeholder="Enter venue location"
										defaultValue={game.venue ?? ''}
										name="venue"
										className="input focus:input-primary transition-colors w-full"
									/>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-legend">Primary Teacher</legend>
									<select
										defaultValue={game.teacher?.id ?? ''}
										className="select focus:select-primary transition-colors w-full"
										name="teacher"
									>
										<option disabled value="">
											Pick one
										</option>
										{teachers.map((teacher) => (
											<option key={teacher.id} value={teacher.id}>
												{teacher.name}
											</option>
										))}
									</select>
								</fieldset>

								<fieldset className="fieldset md:col-span-2">
									<legend className="fieldset-legend">Additional Teachers</legend>
									<div className="space-y-2">
										{TeachersMultiSelect({
											className: '[&>div]:[--rmsc-radius:var(--rounded-btn,0.5rem)]',
											teachers,
											value: extraTeachers,
											actualDisabled: false,
											onChange: (e) => {
												setExtraTeachers(e.target.value);
											},
										})}
										<input type="hidden" name="extra_teachers" value={extraTeachers.join(',')} />
										<span className="label text-base-content/70">
											Select additional teachers who will supervise this game
										</span>
									</div>
								</fieldset>
							</div>
						</div>

						{/* Schedule & Transportation Section */}
						<div>
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent">
								<FaClock className="w-4 h-4" />
								Schedule & Transportation
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<fieldset className="fieldset">
									<legend className="fieldset-legend">Out of Class</legend>
									<input
										type="time"
										defaultValue={game.out_of_class ? dayjs(game.out_of_class).format('HH:mm') : ''}
										name="out_of_class"
										className="input focus:input-primary transition-colors w-full"
									/>
									<span className="label text-base-content/70">When students leave class</span>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-legend">Game Start</legend>
									<input
										type="time"
										defaultValue={game.start ? dayjs(game.start).format('HH:mm') : ''}
										name="start"
										className="input focus:input-primary transition-colors w-full"
									/>
									<span className="label text-base-content/70">Official game start time</span>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-legend">Transportation</legend>
									<input
										type="text"
										placeholder="Bus, walk, etc."
										defaultValue={game.transportation ?? ''}
										name="transportation"
										className="input focus:input-primary transition-colors w-full"
									/>
									<span className="label text-base-content/70">How students will travel</span>
								</fieldset>
							</div>
						</div>

						{/* Notes Section */}
						<div>
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-info">
								<FaStickyNote className="w-4 h-4" />
								Additional Information
							</h2>
							<fieldset className="fieldset">
								<legend className="fieldset-legend">Notes</legend>
								<textarea
									placeholder="Enter any additional notes or special instructions..."
									defaultValue={game.notes ?? ''}
									name="notes"
									rows={3}
									className="textarea textarea-bordered focus:textarea-primary transition-colors w-full resize-none"
								/>
								<span className="label text-base-content/70">Internal notes visible to staff only</span>
							</fieldset>
						</div>

						{/* Status Section */}
						<div>
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-success">
								<FaRegCheckCircle className="w-4 h-4" />
								Game Status
							</h2>
							<fieldset className="border border-base-300 rounded-lg p-4">
								<legend className="text-sm font-medium px-2">Confirmation</legend>
								<label className="label cursor-pointer justify-start gap-3">
									<input
										type="checkbox"
										defaultChecked={game.confirmed}
										name="confirmed"
										className="checkbox checkbox-primary"
									/>
									<div className="flex flex-col">
										<span className="label-text font-medium">Mark as confirmed</span>
										<div className="text-sm text-base-content/70">
											Check when all details are finalized and confirmed
										</div>
									</div>
								</label>
							</fieldset>
						</div>
					</div>

					{/* Sticky Submit Button */}
					<div className="sticky bottom-0 bg-base-100/80 backdrop-blur-sm border-t border-base-300 p-6 rounded-b-2xl">
						<div className="flex justify-end">
							<Submit isTeacher={isTeacherBool} />
						</div>
					</div>
				</form>
			) : (
				/* Student/Non-Teacher View */
				<div className="bg-base-100 rounded-b-2xl shadow-xl border border-base-300">
					<div className="p-6 space-y-8">
						{/* Basic Information Section */}
						<div>
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
								<FaCalendarAlt className="w-4 h-4" />
								Basic Information
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<dt className="text-sm font-medium text-base-content/70">Date</dt>
									<dd className="text-base font-medium">
										{game.date ? dayjs(game.date).format('dddd, MMMM D, YYYY') : 'Not set'}
									</dd>
								</div>

								<div className="space-y-2">
									<dt className="text-sm font-medium text-base-content/70">Team</dt>
									<dd className="text-base font-medium">
										{game.team ? `[${formatIsJunior(game.team.isJunior)}] ${game.team.name}` : 'Not assigned'}
									</dd>
								</div>

								<div className="space-y-2">
									<dt className="text-sm font-medium text-base-content/70">Position</dt>
									<dd className="text-base font-medium">
										{game.isHome === true ? 'Home' : game.isHome === false ? 'Away' : 'Not set'}
									</dd>
								</div>

								<div className="space-y-2">
									<dt className="text-sm font-medium text-base-content/70">Opponent</dt>
									<dd className="text-base font-medium">{game.opponent || 'Not set'}</dd>
								</div>
							</div>
						</div>

						{/* Location & Staff Section */}
						<div>
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-secondary">
								<FaMapMarkerAlt className="w-4 h-4" />
								Location & Staff
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<dt className="text-sm font-medium text-base-content/70">Venue</dt>
									<dd className="text-base font-medium">{game.venue || 'Not set'}</dd>
								</div>

								<div className="space-y-2">
									<dt className="text-sm font-medium text-base-content/70">Primary Teacher</dt>
									<dd className="text-base font-medium">
										{game.teacher?.name ? (
											<a
												href={`/users/${game.teacher.id}`}
												className="link link-primary hover:link-secondary transition-colors flex items-center gap-3"
											>
												<div className="avatar">
													<div className="mask mask-squircle w-8 h-8">
														<UserAvatar user={game.teacher} className="w-8 h-8" />
													</div>
												</div>
												{game.teacher.name}
											</a>
										) : (
											'Not assigned'
										)}
									</dd>
								</div>

								{game.extra_teachers && game.extra_teachers.length > 0 && (
									<div className="space-y-2 md:col-span-2">
										<dt className="text-sm font-medium text-base-content/70">Additional Teachers</dt>
										<dd className="text-base font-medium">
											<div className="flex flex-wrap gap-2">
												{teachers
													.filter((teacher) => game.extra_teachers?.includes(teacher.id))
													.map((teacher) => (
														<a
															key={teacher.id}
															href={`/users/${teacher.id}`}
															className="link link-primary hover:link-secondary transition-colors flex items-center gap-3 bg-base-200 rounded-lg px-3 py-2 hover:bg-base-300"
														>
															<div className="avatar">
																<div className="mask mask-squircle w-8 h-8">
																	<UserAvatar user={teacher} className="w-8 h-8" />
																</div>
															</div>
															{teacher.name || 'Unknown'}
														</a>
													))}
											</div>
										</dd>
									</div>
								)}
							</div>
						</div>

						{/* Schedule & Transportation Section */}
						<div>
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent">
								<FaClock className="w-4 h-4" />
								Schedule & Transportation
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="space-y-2">
									<dt className="text-sm font-medium text-base-content/70">Out of Class</dt>
									<dd className="text-base font-medium">
										{game.out_of_class ? dayjs(game.out_of_class).format('h:mm A') : 'Not set'}
									</dd>
								</div>

								<div className="space-y-2">
									<dt className="text-sm font-medium text-base-content/70">Game Start</dt>
									<dd className="text-base font-medium">
										{game.start ? dayjs(game.start).format('h:mm A') : 'Not set'}
									</dd>
								</div>

								<div className="space-y-2">
									<dt className="text-sm font-medium text-base-content/70">Transportation</dt>
									<dd className="text-base font-medium">{game.transportation || 'Not set'}</dd>
								</div>
							</div>
						</div>

						{/* Game Status */}
						<div>
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-success">
								<FaRegCheckCircle className="w-4 h-4" />
								Game Status
							</h2>
							<div className="flex items-center gap-3">
								<div className={`badge ${game.confirmed ? 'badge-success' : 'badge-warning'} gap-2`}>
									<FaRegCheckCircle className="w-3 h-3" />
									{game.confirmed ? 'Confirmed' : 'Pending Confirmation'}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function Submit({ isTeacher }: { isTeacher: boolean }) {
	const { pending } = useFormStatus();

	return (
		<button type="submit" disabled={pending || !isTeacher} className="btn btn-primary btn-sm sm:btn-lg gap-2 min-h-10 sm:min-h-12 text-sm sm:text-base">
			{pending ? (
				<>
					<span className="loading loading-spinner loading-sm"></span>
					<span className="hidden sm:inline">Updating Game...</span>
					<span className="sm:hidden">Updating...</span>
				</>
			) : (
				<>
					<FaRegCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
					<span className="hidden sm:inline">Update Game Information</span>
					<span className="sm:hidden">Update Game</span>
				</>
			)}
		</button>
	);
}

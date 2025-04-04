'use client';

import { Box } from '@/app/globalComponents/Box';
import { TeachersMultiSelect } from '@/app/globalComponents/TeachersMultiSelect';
import { isTeacher } from '@/libs/checkPermission';
import { dayjs } from '@/libs/dayjs';
import { formatIsJunior } from '@/libs/formatValue';
import { SerializedGame, SerializedTeam, SerializedVenue } from '@/libs/serializeData';
import { RawTeacher } from '@/libs/tableData';
import { FormState } from '@/libs/types';
import { Session } from 'next-auth';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { updateGame } from '../actions';

export function GameForm({
	session,
	game,
	teams,
	venues,
	teachers,
}: {
	session: Session | null;
	game: SerializedGame;
	teams: SerializedTeam[];
	venues: SerializedVenue[];
	teachers: RawTeacher[];
}) {
	const [state, formAction] = useActionState<FormState, FormData>(updateGame, null);
	const isTeacherBool = isTeacher(session);

	const [extraTeachers, setExtraTeachers] = useState<string[]>(game.extra_teachers ?? []);

	return (
		<form className="flex flex-col gap-4 w-full p-4" action={formAction}>
			<Box>
				<input type="hidden" name="id" value={game.id} />
				<input type="hidden" name="timezone" value={dayjs.tz.guess()} />
				<h1 className="font-bold px-4">Game Information</h1>
				<div className="divider m-0"></div>
				<div className="flex justify-center flex-col basis-3/4 w-full">
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">Date</span>
						</div>
						<input
							type="date"
							disabled={!isTeacherBool}
							defaultValue={game.date ? dayjs(game.date).format('YYYY-MM-DD') : ''}
							name="date"
							className="input input-bordered text-base-content!"
						/>
					</label>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">Team</span>
						</div>
						<select
							disabled={!isTeacherBool}
							defaultValue={game.team?.id ?? ''}
							className="select select-bordered opacity-100 text-base-content!"
							name="team"
						>
							<option disabled value="">
								Pick one
							</option>
							{isTeacherBool ? (
								teams.map((team) => (
									<option key={team.id} value={team.id} className="text-base-content">
										[{formatIsJunior(team.isJunior)}] {team.name}
									</option>
								))
							) : (
								<option value={game.team?.id} className="text-base-content">
									[{formatIsJunior(game.team?.isJunior)}] {game.team?.name}
								</option>
							)}
						</select>
					</label>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">Position</span>
						</div>
						<select
							disabled={!isTeacherBool}
							defaultValue={game.isHome === undefined || game.isHome === null ? '' : game.isHome ? 'home' : 'away'}
							className="select select-bordered opacity-100 text-base-content!"
							name="position"
						>
							<option value="">Pick one</option>
							<option value="home">Home</option>
							<option value="away">Away</option>
						</select>
					</label>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">Opponent</span>
						</div>
						<input
							type="text"
							placeholder="Type here"
							disabled={!isTeacherBool}
							defaultValue={game.opponent ?? ''}
							name="opponent"
							className="input input-bordered text-base-content!"
						/>
					</label>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">Venue</span>
						</div>
						<select
							disabled={!isTeacherBool}
							defaultValue={game.venue?.id ?? ''}
							className="select select-bordered opacity-100 text-base-content!"
							name="venue"
						>
							<option disabled value="">
								Pick one
							</option>
							{isTeacherBool ? (
								venues.map((venue) => (
									<option key={venue.id} value={venue.id} className="text-base-content">
										{venue.name} ({venue.court_field_number})
									</option>
								))
							) : (
								<option value={game.venue?.id} className="text-base-content">
									{game.venue?.name} ({game.venue?.court_field_number})
								</option>
							)}
						</select>
					</label>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">Teacher</span>
						</div>
						<select
							disabled={!isTeacherBool}
							defaultValue={game.teacher?.id ?? ''}
							className="select select-bordered opacity-100 text-base-content!"
							name="teacher"
						>
							<option disabled value="">
								Pick one
							</option>
							{isTeacherBool ? (
								teachers.map((teacher) => (
									<option key={teacher.id} value={teacher.id} className="text-base-content">
										{teacher.name}
									</option>
								))
							) : (
								<option value={game.teacher?.id} className="text-base-content">
									{game.teacher?.name}
								</option>
							)}
						</select>
					</label>
					<div className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">Extra Teachers</span>
						</div>
						{TeachersMultiSelect({
							className: `[&>div]:[--rmsc-radius:var(--rounded-btn,0.5rem)]${
								!isTeacherBool ? ' [&>div]:[--rmsc-bg:var(--color-base-200)]' : ''
							}`,
							teachers,
							value: extraTeachers,
							actualDisabled: !isTeacherBool,
							onChange: (e) => {
								setExtraTeachers(e.target.value);
							},
						})}
						<input type="hidden" name="extra_teachers" value={extraTeachers.join(',')} />
					</div>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">Transportation</span>
						</div>
						<input
							type="text"
							placeholder="Type here"
							disabled={!isTeacherBool}
							defaultValue={game.transportation ?? ''}
							name="transportation"
							className="input input-bordered text-base-content!"
						/>
					</label>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">Out of Class</span>
						</div>
						<input
							type="time"
							disabled={!isTeacherBool}
							defaultValue={game.out_of_class ? dayjs(game.out_of_class).format('HH:mm') : ''}
							name="out_of_class"
							className="input input-bordered text-base-content!"
						/>
					</label>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">Start</span>
						</div>
						<input
							type="time"
							disabled={!isTeacherBool}
							defaultValue={game.start ? dayjs(game.start).format('HH:mm') : ''}
							name="start"
							className="input input-bordered text-base-content!"
						/>
					</label>
					{isTeacherBool && (
						<label className="form-control w-full">
							<div className="label">
								<span className="label-text text-md font-bold">Notes</span>
							</div>
							<input
								type="text"
								placeholder="Type here"
								disabled={!isTeacherBool}
								defaultValue={game.notes ?? ''}
								name="notes"
								className="input input-bordered text-base-content!"
							/>
						</label>
					)}
					{isTeacherBool && (
						<label className="form-control flex-row justify-between items-center w-full mt-4">
							<div className="label">
								<span className="label-text text-md font-bold">Confirmed</span>
							</div>
							<input
								type="checkbox"
								placeholder="Type here"
								disabled={!isTeacherBool}
								defaultChecked={game.confirmed}
								name="confirmed"
								className="checkbox checkbox-primary opacity-80!"
							/>
						</label>
					)}
				</div>
			</Box>
			{state && (
				<div role="alert" className={`alert ${state.success ? 'alert-success' : 'alert-error'} mt-2`}>
					{state.success ? <FaRegCheckCircle size={20} /> : <FaRegTimesCircle size={20} />}
					<span>{state?.message}</span>
				</div>
			)}
			{isTeacherBool && <Submit isTeacher={isTeacherBool} />}
		</form>
	);
}

function Submit({ isTeacher }: { isTeacher: boolean }) {
	const { pending } = useFormStatus();

	return (
		<button type="submit" disabled={pending || !isTeacher} className="btn btn-primary">
			Update Game
		</button>
	);
}

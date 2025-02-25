'use client';

import { isTeacher } from '@/libs/checkPermission';
import { dayjs } from '@/libs/dayjs';
import { SerializedTeam } from '@/libs/serializeData';
import { FormState } from '@/libs/types';
import { Session } from 'next-auth';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { Box } from '../../globalComponents/Box';
import { updateProfile } from '../actions';
import { Preferences } from './Preferences';
import { ProfilePicture } from './ProfilePicture';

export function SettingsForm({ session, teams }: { session: Session; teams: SerializedTeam[] }) {
	const [state, formAction] = useActionState<FormState, FormData>(updateProfile, null);
	const [autoTimezone, setAutoTimezone] = useState(session.user.auto_timezone ?? true);
	const [supportedTimezones, setSupportedTimezones] = useState<string[] | undefined | null>(undefined);

	useEffect(() => {
		setSupportedTimezones(typeof Intl.supportedValuesOf === 'undefined' ? null : Intl.supportedValuesOf('timeZone'));
	}, []);

	const prevState = useRef(state);
	useEffect(() => {
		if (prevState.current !== state) {
			window.scrollTo({
				top: document.body.scrollHeight,
			});
			prevState.current = state;
		}
	}, [state]);

	return (
		<form className="flex flex-col gap-4 w-full" action={formAction}>
			<Box>
				<h1 className="font-bold px-4">Profile Settings</h1>
				<div className="divider m-0"></div>
				<div className="flex flex-col sm:flex-row justify-center w-full gap-4 items-center pt-0 p-4">
					{/* Input Name */}
					<div className="flex justify-center flex-col basis-3/4 w-full">
						<label className="form-control w-full">
							<div className="label">
								<span className="label-text text-md font-bold">Name</span>
							</div>
							<input
								type="text"
								placeholder="Type here"
								disabled={!isTeacher(session)}
								defaultValue={session.user.name ?? ''}
								name="name"
								className="input input-bordered w-full"
							/>
						</label>
						<label className="form-control w-full">
							<div className="label">
								<span className="label-text text-md font-bold">Email</span>
							</div>
							<input
								type="email"
								placeholder="Type here"
								disabled={!isTeacher(session)}
								defaultValue={session.user.email ?? ''}
								name="email"
								className="input input-bordered w-full"
							/>
						</label>
					</div>

					{/* Add profile upload */}
					<div className="flex justify-center items-center basis-1/4 h-full">
						<label className="relative! form-control mt-4">
							<div className="label">
								<span className="label-text text-md font-bold text-center">Profile picture</span>
							</div>
							<ProfilePicture user={session.user} />
						</label>
					</div>
				</div>
			</Box>

			<Box id="team-preferences">
				<h1 className="font-bold px-4 pt-4">Team Preferences</h1>
				<div className="divider m-0"></div>
				<div className="flex flex-col sm:flex-row justify-center w-full gap-4 items-center pt-0 p-4">
					<Preferences teams={teams} session={session} />
				</div>
			</Box>

			<Box>
				<h1 className="font-bold px-4 pt-4">Others</h1>
				<div className="divider m-0"></div>
				<div className="flex flex-col sm:flex-row justify-center w-full gap-4 items-center pt-0 p-4">
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text text-md font-bold">
								Choose when changed game since last time visit (highlighted as blue) will be marked as read
							</span>
						</div>
						<div>
							{/* file deepcode ignore ReactControlledUncontrolledFormElement: Intended */}
							<div className="form-control">
								<label className="label cursor-pointer">
									<span className="label-text">
										When visited Home, Weekly Sport page, or any weekly sport schedule page (default)
									</span>
									<input
										type="radio"
										name="reset_only_after_visit_weekly_sport"
										value="false"
										className="radio"
										defaultChecked={!session.user.reset_only_after_visit_weekly_sport}
									/>
								</label>
							</div>
							<div className="form-control">
								<label className="label cursor-pointer">
									<span className="label-text">
										Only when navigated to Weekly Sport page (to prevent unseen data from being marked as read)
									</span>
									<input
										type="radio"
										name="reset_only_after_visit_weekly_sport"
										value="true"
										className="radio"
										defaultChecked={!!session.user.reset_only_after_visit_weekly_sport}
									/>
								</label>
							</div>
						</div>
					</label>
				</div>
			</Box>

			<Box>
				<h1 className="font-bold px-4 pt-4">Timezone</h1>
				<div className="divider m-0"></div>
				<div className="flex flex-col sm:flex-row justify-center w-full gap-4 items-center pt-0 p-4">
					<label className="form-control w-full">
						<div className="form-control max-w-72">
							<label className="label cursor-pointer gap-2">
								<input
									type="checkbox"
									name="auto_timezone"
									checked={autoTimezone}
									className="checkbox"
									onChange={(e) => setAutoTimezone(e.target.checked)}
								/>
								<span className="label-text">Automatically detect timezone (default)</span>
							</label>
						</div>
						<div className="label">
							<span className="label-text">Pick Your Timezone</span>
						</div>
						<select
							name="timezone"
							className="select select-bordered"
							defaultValue={session.user.timezone ?? dayjs.tz.guess()}
							disabled={autoTimezone || supportedTimezones === undefined}
						>
							{supportedTimezones === undefined ? (
								<option key="loading">Loading...</option>
							) : supportedTimezones === null ? (
								<option key="unsupported">
									Your browser does not support timezone detection, please update your browser
								</option>
							) : (
								supportedTimezones.map((tz) => (
									<option key={tz} value={tz}>
										{tz}
									</option>
								))
							)}
						</select>
					</label>
				</div>
			</Box>

			{state && (
				<div role="alert" className={`alert ${state.success ? 'alert-success' : 'alert-error'} mt-2`}>
					{state.success ? <FaRegCheckCircle size={20} /> : <FaRegTimesCircle size={20} />}
					<span>{state?.message}</span>
				</div>
			)}
			<Submit />
		</form>
	);
}

function Submit() {
	const { pending } = useFormStatus();

	return (
		<button type="submit" disabled={pending} className="sticky bottom-2 btn btn-primary">
			Update Profile
		</button>
	);
}

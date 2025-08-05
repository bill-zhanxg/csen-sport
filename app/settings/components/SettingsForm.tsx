'use client';
import { isTeacher } from '@/libs/checkPermission';
import { dayjs } from '@/libs/dayjs';
import { SerializedTeam } from '@/libs/serializeData';
import { FormState } from '@/libs/types';
import { Session } from 'next-auth';
import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { FaBell, FaClock, FaRegCheckCircle, FaUsers } from 'react-icons/fa';
import { toast } from 'sonner';
import { updateProfile } from '../actions';
import { Preferences } from './Preferences';
import { ProfilePicture } from './ProfilePicture';

export function SettingsForm({ session, teams }: { session: Session; teams: SerializedTeam[] }) {
	const [state, formAction] = useActionState<FormState, FormData>(updateProfile, null);
	const [autoTimezone, setAutoTimezone] = useState(session.user.auto_timezone ?? true);
	const [selectedTimezone, setSelectedTimezone] = useState(session.user.timezone ?? dayjs.tz.guess());
	const [supportedTimezones, setSupportedTimezones] = useState<string[] | undefined | null>(undefined);

	useEffect(() => {
		setSupportedTimezones(typeof Intl.supportedValuesOf === 'undefined' ? null : Intl.supportedValuesOf('timeZone'));
	}, []);

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
		<form
			className="flex flex-col w-full"
			// We use onSubmit instead of action to prevent resetting the form state and mismatching the react states
			onSubmit={(e) => {
				e.preventDefault();
				startTransition(() => formAction(new FormData(e.currentTarget)));
			}}
		>
			<div id="profile-settings" className="p-6 border-b border-base-300">
				<h2 className="text-xl font-bold mb-6 flex items-center gap-3">
					<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
						<FaRegCheckCircle className="w-4 h-4 text-primary" />
					</div>
					Profile Settings
				</h2>
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
					{/* Input Fields */}
					<div className="lg:col-span-3">
						<fieldset className="fieldset">
							<legend className="fieldset-legend">Full Name</legend>
							<input
								type="text"
								placeholder="Enter your full name"
								disabled={!isTeacher(session)}
								defaultValue={session.user.name ?? ''}
								name="name"
								className="input focus:input-primary transition-colors w-full"
							/>
							{!isTeacher(session) && <p className="label text-warning">Only teachers can edit profile information</p>}
						</fieldset>

						<fieldset className="fieldset">
							<legend className="fieldset-legend">Email Address</legend>
							<input
								type="email"
								placeholder="Enter your email address"
								disabled={!isTeacher(session)}
								defaultValue={session.user.email ?? ''}
								name="email"
								className="input focus:input-primary transition-colors w-full"
							/>
							{!isTeacher(session) && <p className="label text-warning">Only teachers can edit profile information</p>}
						</fieldset>
					</div>

					{/* Profile Picture */}
					<div className="lg:col-span-1 flex flex-col items-center">
						<label className="form-control">
							<div className="label">
								<span className="label-text font-semibold text-center w-full">Profile Picture</span>
							</div>
							<div className="flex justify-center">
								<ProfilePicture user={session.user} />
							</div>
						</label>
					</div>
				</div>
			</div>

			<div id="team-preferences" className="p-6 border-b border-base-300">
				<h2 className="text-xl font-bold mb-6 flex items-center gap-3">
					<div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
						<FaUsers className="w-4 h-4 text-secondary" />
					</div>
					Team Preferences
				</h2>
				<div className="w-full">
					<Preferences teams={teams} session={session} />
				</div>
			</div>

			<div id="notifications" className="p-6 border-b border-base-300">
				<h2 className="text-xl font-bold mb-6 flex items-center gap-3">
					<div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
						<FaBell className="w-4 h-4 text-accent" />
					</div>
					Notification Preferences
				</h2>
				<div className="space-y-4">
					<div className="form-control">
						<label className="label cursor-pointer justify-start gap-3">
							<input
								type="radio"
								name="reset_only_after_visit_weekly_sport"
								value="false"
								className="radio radio-primary"
								defaultChecked={!session.user.reset_only_after_visit_weekly_sport}
							/>
							<div>
								<span className="label-text font-medium">Mark changes as read automatically</span>
								<div className="text-sm text-base-content/70 mt-1">
									When visiting Home, Weekly Sport page, or any schedule page (default)
								</div>
							</div>
						</label>
					</div>
					<div className="form-control">
						<label className="label cursor-pointer justify-start gap-3">
							<input
								type="radio"
								name="reset_only_after_visit_weekly_sport"
								value="true"
								className="radio radio-primary"
								defaultChecked={!!session.user.reset_only_after_visit_weekly_sport}
							/>
							<div>
								<span className="label-text font-medium">Mark changes as read manually</span>
								<div className="text-sm text-base-content/70 mt-1">
									Only when navigating to Weekly Sport page (prevents unseen data from being marked as read)
								</div>
							</div>
						</label>
					</div>
				</div>
			</div>

			<div id="timezone" className="p-6">
				<h2 className="text-xl font-bold mb-6 flex items-center gap-3">
					<div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
						<FaClock className="w-4 h-4 text-info" />
					</div>
					Timezone Settings
				</h2>
				<div className="space-y-6">
					<fieldset className="border border-base-300 rounded-lg p-4">
						<legend className="text-sm font-medium px-2">Auto Detection</legend>
						<label className="label cursor-pointer justify-start gap-3">
							<input
								type="checkbox"
								name="auto_timezone"
								checked={autoTimezone}
								disabled={supportedTimezones === undefined}
								className="checkbox checkbox-primary"
								onChange={(e) => setAutoTimezone(e.target.checked)}
							/>
							<div className="flex flex-col">
								<span className="label-text font-medium">Automatically detect timezone</span>
								<div className="text-sm text-base-content/70">Use your device's timezone setting (recommended)</div>
							</div>
						</label>
					</fieldset>

					<fieldset className="border border-base-300 rounded-lg p-4">
						<legend className="text-sm font-medium px-2">Manual Selection</legend>
						<div className="space-y-3">
							<select
								name="timezone"
								className="select select-bordered focus:select-primary transition-colors w-full"
								value={selectedTimezone}
								onChange={(e) => {
									// Only set the timezone if supported and not loading
									if (!!supportedTimezones) setSelectedTimezone(e.target.value);
								}}
								disabled={autoTimezone || supportedTimezones === undefined}
							>
								{supportedTimezones === undefined ? (
									<option key="loading">Loading timezones...</option>
								) : supportedTimezones === null ? (
									<option key="unsupported">
										Browser doesn't support timezone detection - please update your browser
									</option>
								) : (
									supportedTimezones.map((tz) => (
										<option key={tz} value={tz}>
											{tz.replace(/_/g, ' ')}
										</option>
									))
								)}
							</select>
							{!autoTimezone && supportedTimezones && (
								<div className="text-sm text-info font-medium">
									Current time: {dayjs().tz(selectedTimezone).format('YYYY-MM-DD HH:mm:ss')}
								</div>
							)}
						</div>
					</fieldset>
				</div>
			</div>

			{/* Submit Button - Sticky */}
			<div className="sticky bottom-0 z-10 p-6 bg-base-200/50 backdrop-blur-sm border-t border-base-300 shadow-lg rounded-b-2xl">
				<Submit />
			</div>
		</form>
	);
}

function Submit() {
	const { pending } = useFormStatus();

	return (
		<div className="flex justify-end">
			<button type="submit" disabled={pending} className="btn btn-primary btn-lg min-w-40 shadow-lg">
				{pending ? (
					<>
						<span className="loading loading-spinner loading-sm"></span>
						Updating...
					</>
				) : (
					<>
						<FaRegCheckCircle className="w-4 h-4" />
						Update Profile
					</>
				)}
			</button>
		</div>
	);
}

'use client';

import { isTeacher } from '@/libs/checkPermission';
import { Session } from 'next-auth/types';
import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from '../actions';
import { Box } from './Box';
import { Preferences } from './Preferences';
import { ProfilePicture } from './ProfilePicture';
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';

export type SettingState = null | {
	success: boolean;
	message: string;
};

export function SettingsForm({
	session,
	teams,
}: {
	session: Session;
	teams: {
		id: string;
		name?: string | null;
		isJunior?: boolean | null;
	}[];
}) {
	const [state, formAction] = useFormState<SettingState, FormData>(updateProfile, null);

	return (
		<form className="flex flex-col gap-4 w-full" action={formAction}>
			<Box>
				<h1 className="font-bold px-4">User Settings</h1>
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
                                name='name'
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
                                name='email'
								className="input input-bordered w-full"
							/>
						</label>
					</div>

					{/* Add profile upload */}
					<div className="flex justify-center items-center basis-1/4 h-full">
						<label className="!relative form-control mt-4">
							<div className="label">
								<span className="label-text text-md font-bold text-center">Profile picture</span>
							</div>
							<ProfilePicture user={session.user} />
						</label>
					</div>
				</div>
			</Box>

			<Box>
				<h1 className="font-bold px-4 pt-4">Preferences</h1>
				<div className="divider m-0"></div>
				<div className="flex flex-col sm:flex-row justify-center w-full gap-4 items-center pt-0 p-4">
					<Preferences teams={teams} />
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
		<button type="submit" disabled={pending} className="btn btn-primary">
			Update Profile
		</button>
	);
}

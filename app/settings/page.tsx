import { auth } from '@/libs/auth';
import { getXataClient } from '@/libs/xata';
import { UserAvatar } from '../globalComponents/UserAvatar';
import { Box } from './components/Box';
import { Preferences } from './components/Preferences';
import { ProfilePicture } from './components/ProfilePicture';

export default async function Profile() {
	const session = await auth();
	if (!session) return <h1>Not Logged In</h1>;

	const teams = await getXataClient().db.teams.getAll();

	return (
		<div className="flex justify-center w-full">
			<div className="w-full max-w-[50rem] m-4 flex gap-8 flex-col">
				<Box className="flex-row p-2 items-center">
					<div className="avatar p-4">
						<div className="avatar w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
							<UserAvatar user={session.user} />
						</div>
					</div>
					<div>
						<h1 className="font-bold">{session.user.name}</h1>
						<p>{session.user.email}</p>
					</div>
				</Box>
				<form className="flex flex-col gap-4 w-full">
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
										defaultValue={session.user.name ?? ''}
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
										defaultValue={session.user.email ?? ''}
										className="input input-bordered w-full"
									/>
								</label>
							</div>

							{/* Add profile upload */}
							<div className="flex justify-center items-center basis-1/4 h-full">
								<label className="form-control mt-4">
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
							<Preferences teams={teams.map(({ id, name, isJunior }) => ({ id, name, isJunior }))} />
						</div>
					</Box>
					<button type='submit' className="btn btn-primary mt-2">Update Profile</button>
				</form>
			</div>
		</div>
	);
}

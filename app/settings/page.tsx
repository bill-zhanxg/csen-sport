import { auth } from '@/libs/auth';
import { serializeTeams } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { Box } from '../globalComponents/Box';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { UserAvatar } from '../globalComponents/UserAvatar';
import { SettingsForm } from './components/SettingsForm';

export default async function Profile() {
	const session = await auth();
	if (!session) return Unauthorized();

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
				<SettingsForm session={session} teams={serializeTeams(teams)} />
			</div>
		</div>
	);
}

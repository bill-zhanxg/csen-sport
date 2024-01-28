import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { serializeTeams } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { TeamTable } from './components/TeamTable';

export default async function Teams() {
	const session = await auth();
	if (!isTeacher(session)) return Unauthorized();

	const teams = await getXataClient().db.teams.getAll();

	return <TeamTable teams={serializeTeams(teams)} />;
}

import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { serializeTeams } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { VenueTable } from './components/VenueTable';

export default async function Teams() {
	const session = await auth();
	if (!isTeacher(session)) return <h1>Unauthorized</h1>;

	const teams = await getXataClient().db.teams.getAll();

	return <VenueTable teams={serializeTeams(teams)} />;
}

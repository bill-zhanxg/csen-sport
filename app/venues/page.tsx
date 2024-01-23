import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { serializeTeams, serializeVenues } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { VenueTable } from './components/VenueTable';

export default async function Teams() {
	const session = await auth();
	if (!isTeacher(session)) return <h1>Unauthorized</h1>;

	const venues = await getXataClient().db.venues.getAll();

	return <VenueTable teams={serializeVenues(venues)} />;
}

import { auth } from '@/libs/auth';
import { isAdmin, isTeacher } from '@/libs/checkPermission';
import { serializeVenues } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { VenueTable } from './components/VenueTable';

export default async function Teams() {
	const session = await auth();
	if (!isAdmin(session)) return Unauthorized();

	const venues = await getXataClient().db.venues.getAll();

	return <VenueTable teams={serializeVenues(venues)} />;
}

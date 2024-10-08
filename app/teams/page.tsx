import { authC } from '@/app/cache';
import { isAdmin } from '@/libs/checkPermission';
import { serializeTeams } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { Metadata } from 'next';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { TeamTable } from './components/TeamTable';

export const metadata: Metadata = {
	title: 'Teams',
};

export default async function Teams() {
	const session = await authC();
	if (!isAdmin(session)) return Unauthorized();

	const teams = await getXataClient().db.teams.getAll();

	return <TeamTable teams={serializeTeams(teams)} />;
}

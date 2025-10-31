import { serializeTeams } from './serializeData';
import { getXataClient } from './xata';

export type RawTeam = {
	id: string;
	name?: string | null;
	isJunior?: boolean | null;
};

export type RawTeacher = {
	id: string;
	name?: string | null;
};

const xata = getXataClient();

export async function getRawTeams(): Promise<RawTeam[]> {
	const teamsRecords = await xata.db.teams.select(['name', 'isJunior']).getAll();
	return serializeTeams(teamsRecords);
}

export async function getRawTeachers(): Promise<RawTeacher[]> {
	const teachersRecords = await xata.db.nextauth_users
		.filter({
			role: { $any: ['teacher', 'admin'] },
		})
		.select(['name', 'image'])
		.getAll();
	return teachersRecords.map(({ id, name, image }) => ({ id, name, image }));
}

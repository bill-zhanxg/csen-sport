import { serializeTeams, serializeVenues } from './serializeData';
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

export type RawVenue = {
	id: string;
	name?: string | null;
	address?: string | null;
	court_field_number?: string | null;
};

const xata = getXataClient();

export async function getRawTeams(): Promise<RawTeam[]> {
	const teamsRecords = await xata.db.teams.select(['name', 'isJunior']).getAll();
	return serializeTeams(teamsRecords);
}

export async function getRawTeachers(): Promise<RawTeacher[]> {
	const teachersRecords = await xata.db.nextauth_users.select(['name']).getAll();
	return teachersRecords.map(({ id, name }) => ({ id, name }));
}

export async function getRawVenues(): Promise<RawVenue[]> {
	const venuesRecords = await xata.db.venues.select(['name', 'address', 'court_field_number']).getAll();
	return serializeVenues(venuesRecords);
}

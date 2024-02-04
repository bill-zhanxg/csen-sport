import { SelectedPick } from '@xata.io/client';
import { RawTeam, RawVenue } from './tableData';
import { GamesRecord, TeamsRecord, VenuesRecord } from './xata';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type SerializedTeam = RawTeam;
type TeamRecord = SelectedPick<TeamsRecord, ['name', 'isJunior']>;

export function serializeTeams(teams: TeamRecord[]): SerializedTeam[] {
	return teams.map((team) => serializeTeam(team));
}
export function serializeTeam({ id, name, isJunior }: TeamRecord): SerializedTeam {
	return {
		id,
		name,
		isJunior,
	};
}

export type SerializedVenue = RawVenue;
type VenueRecord = SelectedPick<VenuesRecord, ['name', 'address', 'court_field_number']>;

export function serializeVenues(venues: VenueRecord[]): SerializedVenue[] {
	return venues.map((venue) => serializeVenue(venue));
}
export function serializeVenue({ id, name, address, court_field_number }: VenueRecord): SerializedVenue {
	return {
		id,
		name,
		address,
		court_field_number,
	};
}

export type SerializedGame = {
	id: string;
	date?: Date | null;
	opponent?: string | null;
	team?: PartialBy<SerializedTeam, 'id'> | null;
	venue?: PartialBy<SerializedVenue, 'id'> | null;
	teacher?: {
		id?: string;
		name?: string | null;
	} | null;
	extra_teachers?: string[] | null;
	transportation?: string | null;
	out_of_class?: Date | null;
	start?: Date | null;
	notes?: string | null;
};

export type SerializedGameWithId = {
	id: string;
	date?: Date | null;
	opponent?: string | null;
	team?: string | null;
	venue?: string | null;
	teacher?: string | null;
	extra_teachers?: string[] | null;
	transportation?: string | null;
	out_of_class?: Date | null;
	start?: Date | null;
	notes?: string | null;
};

export function serializeGames(
	games: SelectedPick<GamesRecord, ('*' | 'team.*' | 'venue.*' | 'teacher.*')[]>[],
	isTeacher: boolean,
): SerializedGame[] {
	return games.map((game) => serializeGame(game, isTeacher));
}

export function serializeGamesWithId(
	games: SelectedPick<GamesRecord, ('*' | 'team.id' | 'venue.id' | 'teacher.id')[]>[],
	isTeacher: boolean,
): SerializedGameWithId[] {
	return games.map((game) => serializeGameWithId(game, isTeacher));
}

export function serializeGame(
	{
		id,
		date,
		opponent,
		venue,
		team,
		teacher,
		extra_teachers,
		transportation,
		out_of_class,
		start,
		notes,
	}: SelectedPick<GamesRecord, ('*' | 'team.*' | 'venue.*' | 'teacher.*')[]>,
	isTeacher: boolean,
): SerializedGame {
	return {
		id,
		date,
		opponent,
		team: {
			id: team?.id,
			name: team?.name,
			isJunior: team?.isJunior,
		},
		venue: {
			id: venue?.id,
			name: venue?.name,
			address: venue?.address,
			court_field_number: venue?.court_field_number,
		},
		teacher: {
			id: teacher?.id,
			name: teacher?.name,
		},
		extra_teachers: extra_teachers,
		transportation,
		out_of_class,
		start,
		notes: isTeacher ? notes : undefined,
	};
}

export function serializeGameWithId(
	{
		id,
		date,
		opponent,
		venue,
		team,
		teacher,
		extra_teachers,
		transportation,
		out_of_class,
		start,
		notes,
	}: SelectedPick<GamesRecord, ('*' | 'team.id' | 'venue.id' | 'teacher.id')[]>,
	isTeacher: boolean,
) {
	return {
		id,
		date,
		opponent,
		team: team?.id,
		venue: venue?.id,
		teacher: teacher?.id,
		extra_teachers,
		transportation,
		out_of_class,
		start,
		notes: isTeacher ? notes : undefined,
	};
}

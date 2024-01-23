import { SelectedPick } from '@xata.io/client';
import { GamesRecord, TeamsRecord, VenuesRecord } from './xata';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type SerializedTeam = {
	id: string;
	name?: string | null;
	isJunior?: boolean | null;
};
type TeamRecord = SelectedPick<TeamsRecord, ['*']>;

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

export type SerializedVenue = {
	id: string;
	name?: string | null;
	address?: string | null;
	court_field_number?: string | null;
};
type VenueRecord = SelectedPick<VenuesRecord, ['*']>;

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
	transportation?: string | null;
	out_of_class?: Date | null;
	start?: Date | null;
	notes?: string | null;
};

export function serializeGames(
	games: SelectedPick<GamesRecord, ('*' | 'team.*' | 'venue.*' | 'teacher.*')[]>[],
): SerializedGame[] {
	return games.map((game) => serializeGame(game));
}

export function serializeGame({
	id,
	date,
	opponent,
	venue,
	team,
	teacher,
	transportation,
	out_of_class,
	start,
	notes,
}: SelectedPick<GamesRecord, ('*' | 'team.*' | 'venue.*' | 'teacher.*')[]>): SerializedGame {
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
		transportation,
		out_of_class,
		start,
		notes,
	};
}

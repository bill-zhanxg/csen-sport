import { SelectedPick } from '@xata.io/client';
import { GamesRecord } from './xata';

export type SerializedGame = {
	id: string;
	date?: Date | null;
	opponent?: string | null;
	venue?: {
		id?: string;
		name?: string | null;
		address?: string | null;
		court_field_number?: string | null;
	} | null;
	team?: {
		id?: string;
		name?: string | null;
		isJunior?: boolean | null;
	} | null;
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
	return games.map(({ id, date, opponent, venue, team, teacher, transportation, out_of_class, start, notes }) => ({
		id,
		date,
		opponent,
		venue: {
			id: venue?.id,
			name: venue?.name,
			address: venue?.address,
			court_field_number: venue?.court_field_number,
		},
		team: {
			id: team?.id,
			name: team?.name,
			isJunior: team?.isJunior,
		},
		teacher: {
			id: teacher?.id,
			name: teacher?.name,
		},
        transportation,
		out_of_class,
		start,
        notes,
	}));
}

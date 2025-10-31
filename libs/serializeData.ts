import type { SelectedPick } from '@xata.io/client';
import type { RawTeam } from './tableData';
import type { GamesRecord, TeamsRecord } from './xata';

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

export type SerializedGame = {
	id: string;
	date?: Date | null;
	team: PartialBy<SerializedTeam, 'id'> | null;
	isHome?: boolean | null;
	opponent?: string | null;
	venue?: string | null;
	teacher: {
		id?: string;
		name?: string | null;
		image?: string | null;
	};
	extra_teachers?: string[] | null;
	transportation?: string | null;
	out_of_class?: Date | null;
	start?: Date | null;
	notes?: string | null;
	confirmed: boolean;
};

export type SerializedGameWithId = {
	id: string;
	date?: Date | null;
	team?: string;
	isHome?: boolean | null;
	opponent?: string | null;
	venue?: string | null;
	teacher?: string;
	extra_teachers?: string[] | null;
	transportation?: string | null;
	out_of_class?: Date | null;
	start?: Date | null;
	notes?: string | null;
	confirmed: boolean;
};

export function serializeGames(
	games: SelectedPick<GamesRecord, ('*' | 'team.*' | 'teacher.*')[]>[],
	isTeacher: boolean,
): SerializedGame[] {
	return games.map((game) => serializeGame(game, isTeacher));
}

export function serializeGamesWithId(
	games: SelectedPick<GamesRecord, ('*' | 'team.id' | 'teacher.id')[]>[],
	isTeacher: boolean,
): SerializedGameWithId[] {
	return games.map((game) => serializeGameWithId(game, isTeacher));
}

export function serializeGame(
	{
		id,
		date,
		team,
		isHome,
		opponent,
		venue,
		teacher,
		extra_teachers,
		transportation,
		out_of_class,
		start,
		notes,
		confirmed,
	}: SelectedPick<GamesRecord, ('*' | 'team.*' | 'teacher.*')[]>,
	isTeacher: boolean,
): SerializedGame {
	return {
		id,
		date,
		team: {
			id: team?.id,
			name: team?.name,
			isJunior: team?.isJunior,
		},
		isHome: isHome,
		opponent,
		venue,
		teacher: {
			id: teacher?.id,
			name: teacher?.name,
			image: teacher?.image,
		},
		extra_teachers: extra_teachers,
		transportation,
		out_of_class,
		start,
		notes: isTeacher ? notes : undefined,
		confirmed: isTeacher ? confirmed : false,
	};
}

export function serializeGameWithId(
	{
		id,
		date,
		team,
		isHome,
		opponent,
		venue,
		teacher,
		extra_teachers,
		transportation,
		out_of_class,
		start,
		notes,
		confirmed,
	}: SelectedPick<GamesRecord, ('*' | 'team.id' | 'teacher.id')[]>,
	isTeacher: boolean,
) {
	return {
		id,
		date,
		team: team?.id,
		isHome,
		opponent,
		venue,
		teacher: teacher?.id,
		extra_teachers,
		transportation,
		out_of_class,
		start,
		notes: isTeacher ? notes : undefined,
		confirmed: isTeacher ? confirmed : false,
	};
}

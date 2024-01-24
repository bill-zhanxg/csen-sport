import { Page, SelectedPick } from '@xata.io/client';
import { SerializedGame } from './serializeData';
import { GamesRecord } from './xata';

export type DateWithGames = {
	date: string;
	games: SelectedPick<GamesRecord, ('*' | 'team.*' | 'venue.*' | 'teacher.*')[]>[];
};

export type SerializedDateWithGames = {
	date: string;
	games: SerializedGame[];
};

export function gamesToDates(
	games: Page<GamesRecord, SelectedPick<GamesRecord, ('*' | 'team.*' | 'teacher.*' | 'venue.*')[]>>,
	isTeacher: boolean,
): DateWithGames[] {
	const dates: {
		date: string;
		games: SelectedPick<GamesRecord, ('*' | 'team.*' | 'venue.*' | 'teacher.*')[]>[];
	}[] = [];
	let datesArrayIndex = 0;
	for (const game of games.records) {
		if (!game.date) continue;
		const date = game.date.toLocaleDateString();
		if (!dates[datesArrayIndex]) dates[datesArrayIndex] = { date, games: [] };
		if (dates[datesArrayIndex].date !== date) datesArrayIndex++;
		if (!dates[datesArrayIndex]) dates[datesArrayIndex] = { date, games: [] };
		dates[datesArrayIndex].games.push({ ...game, notes: isTeacher ? game.notes : undefined });
	}
	return dates;
}

import { Page, SelectedPick } from '@xata.io/client';
import { Session } from 'next-auth';
import { SerializedGame } from './serializeData';
import { GamesRecord, getXataClient } from './xata';

export type DateWithGames = {
	date: string;
	rawDate: Date;
	games: SelectedPick<GamesRecord, ('*' | 'team.*' | 'venue.*' | 'teacher.*')[]>[];
};

export type SerializedDateWithGames = {
	date: string;
	rawDate: Date;
	games: SerializedGame[];
};

export function gamesToDates(
	games:
		| Page<GamesRecord, SelectedPick<GamesRecord, ('*' | 'team.*' | 'teacher.*' | 'venue.*')[]>>
		| SelectedPick<GamesRecord, ('*' | 'team.*' | 'teacher.*' | 'venue.*')[]>[],
	isTeacher: boolean,
): DateWithGames[] {
	const dates: DateWithGames[] = [];
	let datesArrayIndex = 0;
	const gamesArray = 'records' in games ? games.records : games;
	for (const game of gamesArray) {
		const gameDate = game.date;
		if (!gameDate) continue;
		// TODO: use user timezone instead
		const date = gameDate.toLocaleDateString();
		const checkArray = () => {
			if (!dates[datesArrayIndex]) dates[datesArrayIndex] = { date, rawDate: gameDate, games: [] };
		};
		checkArray();
		if (dates[datesArrayIndex].date !== date) datesArrayIndex++;
		checkArray();
		dates[datesArrayIndex].games.push({ ...game, notes: isTeacher ? game.notes : undefined });
	}
	return dates;
}

export function getLastVisitDate(session: Session | null, isWeeklySport = false): Date {
	if (!session) return new Date();
	const lastVisitDate = session?.user?.last_logged_on ? new Date(session.user.last_logged_on) : new Date();
	if (isWeeklySport || !session.user.reset_only_after_visit_weekly_sport)
		getXataClient().db.nextauth_users.update(session.user.id, { last_logged_on: new Date() });
	return lastVisitDate;
}

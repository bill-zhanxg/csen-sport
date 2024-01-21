'use server';

import { Games } from './components/GamesTable';
import { ImportState } from './components/ImportPage';
import { Opponents } from './components/OpponentsTable';
import { Venues } from './components/Step2';
import { Teams } from './components/TeamsTable';

export async function importData(
	team: Teams,
	opponents: Opponents,
	venues: Venues,
	games: Games,
): Promise<ImportState> {
	// Delete database

    // venues[0].csenCode

	return {
		type: 'success',
	};
}

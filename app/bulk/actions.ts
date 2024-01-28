'use server';

import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import { AlertType } from '../components/Alert';

const xata = getXataClient();

export async function resetAll(): Promise<AlertType> {
	const session = await auth();
	if (!isAdmin(session))
		return {
			type: 'error',
			message: 'Unauthorized',
		};

	try {
		const games = (await xata.db.games.select(['id']).getAll()).map((game) => ({ ...game, table: 'games' }));
		const teams = (await xata.db.teams.select(['id']).getAll()).map((game) => ({ ...game, table: 'teams' }));
		const venues = (await xata.db.venues.select(['id']).getAll()).map((game) => ({ ...game, table: 'venues' }));
		const chunks = chunk([...games, ...teams, ...venues]);
		for (const chunk of chunks)
			await xata.transactions.run(
				chunk.map((item) => ({
					delete: {
						table: item.table as any,
						id: item.id,
					},
				})),
			);
		return {
			type: 'success',
			message: 'Successfully reset all data',
		};
	} catch (e) {
		return {
			type: 'error',
			message: 'Error: ' + (e as Error).message,
		};
	}
}
export async function resetGames() {
	return resetItem('games');
}

export async function resetTeams() {
	return resetItem('teams');
}

export async function resetVenues() {
	return resetItem('venues');
}

async function resetItem(table: 'games' | 'teams' | 'venues'): Promise<AlertType> {
	const session = await auth();
	if (!isAdmin(session))
		return {
			type: 'error',
			message: 'Unauthorized',
		};

	try {
		const items = await (xata.db[table] as any).select(['id']).getAll();
		const chunks = chunk(items);
		for (const chunk of chunks) await xata.db[table].delete(chunk as any[]);
		return {
			type: 'success',
			message: 'Successfully reset all ' + table,
		};
	} catch (e) {
		return {
			type: 'error',
			message: 'Error: ' + (e as Error).message,
		};
	}
}

function chunk<T>(array: T[], chunkSize = 1000): T[][] {
	const R = [];
	for (let i = 0, len = array.length; i < len; i += chunkSize) R.push(array.slice(i, i + chunkSize));
	return R;
}

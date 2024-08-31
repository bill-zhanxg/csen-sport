'use server';

import { authC } from '@/app/cache';
import { isAdmin } from '@/libs/checkPermission';
import { chunk } from '@/libs/formatValue';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AlertType } from '../components/Alert';
import { UpdateGameSchema } from '../globalComponents/Schemas';

const xata = getXataClient();

export async function resetAll(): Promise<AlertType> {
	const session = await authC();
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
		revalidatePath('/bulk');
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
	const session = await authC();
	if (!isAdmin(session))
		return {
			type: 'error',
			message: 'Unauthorized',
		};

	try {
		const items = await (xata.db[table] as any).select(['id']).getAll();
		const chunks = chunk(items);
		for (const chunk of chunks) await xata.db[table].delete(chunk as any[]);
		revalidatePath('/bulk');
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

const GameChangesSchema = z.array(
	z
		.object({
			type: z.literal('create'),
			id: z.string(),
			value: UpdateGameSchema,
		})
		.or(
			z.object({
				type: z.literal('update'),
				id: z.string(),
				value: UpdateGameSchema,
			}),
		)
		.or(
			z.object({
				type: z.literal('delete'),
				id: z.string(),
			}),
		),
);

export type GameChanges = z.infer<typeof GameChangesSchema>;

export async function updateGamesBulk(dataRaw: z.infer<typeof GameChangesSchema>): Promise<AlertType> {
	const session = await authC();
	if (!isAdmin(session))
		return {
			type: 'error',
			message: 'Unauthorized',
		};

	try {
		const data = GameChangesSchema.parse(dataRaw);
		const chunks = chunk(data);
		for (const chunk of chunks) {
			const changes = chunk.map((item) => {
				if (item.type === 'create')
					return {
						insert: {
							table: 'games',
							record: item.value,
						},
					};
				if (item.type === 'update')
					return {
						update: {
							table: 'games',
							id: item.id,
							fields: item.value,
						},
					};
				if (item.type === 'delete')
					return {
						delete: {
							table: 'games',
							id: item.id,
						},
					};
			});
			await xata.transactions.run(changes as any);
		}
		revalidatePath('/bulk');
		return {
			type: 'success',
			message: 'Successfully updated all games',
		};
	} catch (e) {
		return {
			type: 'error',
			message: 'Error: ' + (e as Error).message,
		};
	}
}

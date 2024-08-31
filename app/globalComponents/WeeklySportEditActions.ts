'use server';

import { authC } from '@/app/cache';
import { isTeacher } from '@/libs/checkPermission';
import { GamesRecord, getXataClient } from '@/libs/xata';
import { SelectedPick } from '@xata.io/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AlertType } from '../components/Alert';
import { UpdateGameSchema } from './Schemas';

const xata = getXataClient();
const stringSchema = z.string();

export async function updateGame(idRaw: string, dataRaw: z.infer<typeof UpdateGameSchema>): Promise<AlertType> {
	return gameAction(() => {
		const id = stringSchema.parse(idRaw);
		const data = UpdateGameSchema.parse(dataRaw);
		return xata.db.games.update(id, data);
	}, 'updated');
}

export async function newGame(dataRaw: z.infer<typeof UpdateGameSchema>): Promise<AlertType> {
	return gameAction(
		() => {
			const data = UpdateGameSchema.parse(dataRaw);
			// Remove all empty values
			Object.keys(data).forEach((keyRaw) => {
				const key = keyRaw as keyof typeof data;
				const d = data[key];
				if (d === undefined || (typeof d === 'string' && !d.trim())) delete data[key];
			});
			return xata.db.games.create(data);
		},
		'created',
		true,
	);
}

export async function deleteGame(idRaw: string): Promise<AlertType> {
	return gameAction(
		() => {
			const id = stringSchema.parse(idRaw);
			return xata.db.games.delete(id);
		},
		'deleted',
		true,
	);
}

async function gameAction(
	func: () => Promise<Readonly<SelectedPick<GamesRecord, ['*']>> | null>,
	action: string,
	revalidate = false,
): Promise<AlertType> {
	const session = await authC();
	if (!isTeacher(session)) return { type: 'error', message: 'Unauthorized' };

	try {
		const res = await func();

		// We only want to revalidate the timetable if a game was deleted or created
		if (revalidate) revalidatePath('/weekly-sport/timetable');
		if (!res) return { type: 'error', message: `The game you are trying to ${action.slice(0, -1)} does not exist` };
		return { type: 'success', message: `Successfully ${action} a game that is on "${res.date?.toDateString()}"` };
	} catch (error) {
		return { type: 'error', message: (error as Error).message };
	}
}

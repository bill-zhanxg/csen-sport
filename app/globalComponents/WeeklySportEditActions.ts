'use server';

import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { GamesRecord, getXataClient } from '@/libs/xata';
import { SelectedPick } from '@xata.io/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AlertType } from '../components/Alert';

const xata = getXataClient();
const stringSchema = z.string();

const UpdateGameSchema = z.object({
	date: z.date().optional(),
	team: z.string().optional(),
	opponent: z.string().optional(),
	venue: z.string().optional(),
	teacher: z.string().optional(),
	transportation: z.string().optional(),
	out_of_class: z.date().optional(),
	start: z.date().optional(),
	notes: z.string().optional(),
});

export async function updateGame(idRaw: string, dataRaw: z.infer<typeof UpdateGameSchema>): Promise<AlertType> {
	return gameAction(() => {
		const id = stringSchema.parse(idRaw);
		const data = UpdateGameSchema.parse(dataRaw);
		return xata.db.games.update(id, data);
	}, 'updated');
}

export async function newGame(dataRaw: z.infer<typeof UpdateGameSchema>): Promise<AlertType> {
	return gameAction(() => {
		const data = UpdateGameSchema.parse(dataRaw);
		// Remove all empty values
		Object.keys(data).forEach((keyRaw) => {
			const key = keyRaw as keyof typeof data;
			const d = data[key];
			if (d === undefined || (typeof d === 'string' && !d.trim())) delete data[key];
		});
		return xata.db.games.create(data);
	}, 'created');
}

export async function deleteGame(idRaw: string): Promise<AlertType> {
	return gameAction(() => {
		const id = stringSchema.parse(idRaw);
		return xata.db.games.delete(id);
	}, 'deleted');
}

async function gameAction(
	func: () => Promise<Readonly<SelectedPick<GamesRecord, ['*']>> | null>,
	action: string,
): Promise<AlertType> {
	const session = await auth();
	if (!isTeacher(session)) return { type: 'error', message: 'Unauthorized' };

	try {
		const res = await func();

		revalidatePath('/weekly-sport/timetable');
		if (!res) return { type: 'error', message: `The game you are trying to ${action.slice(0, -1)} does not exist` };
		// TODO
		return { type: 'success', message: `Successfully ${action} a game that is on "${res.date?.toDateString()}"` };
	} catch (error) {
		return { type: 'error', message: (error as Error).message };
	}
}

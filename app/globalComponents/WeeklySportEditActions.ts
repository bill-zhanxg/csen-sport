'use server';

import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import { z } from 'zod';
import { AlertType } from '../components/Alert';

const xata = getXataClient();
const stringSchema = z.string();

const UpdateGameSchema = z.object({
	// TODO: add more actions
	// date: z.string().optional(),
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
	const session = await auth();
	if (!isTeacher(session)) return { type: 'error', message: 'Unauthorized' };

	try {
		const id = stringSchema.parse(idRaw);
		const data = UpdateGameSchema.parse(dataRaw);

		const res = await xata.db.games.update(id, data);

		if (!res) return { type: 'error', message: 'The game you are trying to update does not exist' };
		return { type: 'success', message: `Successfully updated game for column "${Object.keys(data)[0] ?? 'none'}"` };
	} catch (error) {
		return { type: 'error', message: (error as Error).message };
	}
}

'use server';

import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AlertType } from '../components/Alert';

const xata = getXataClient();
const stringSchema = z.string();

const UpdateTeamSchema = z.object({
	name: z.optional(z.string()),
	isJunior: z.optional(z.boolean().or(z.literal('junior').or(z.literal('intermediate')))),
});

export async function updateTeam(idRaw: string, dataRaw: z.infer<typeof UpdateTeamSchema>): Promise<AlertType> {
	return teamAction(() => {
		const id = stringSchema.parse(idRaw);
		const data = UpdateTeamSchema.parse(dataRaw);
		if (data.isJunior && typeof data.isJunior !== 'boolean') data.isJunior = data.isJunior === 'junior';
		return xata.db.teams.update(id, data);
	});
}

export async function newTeam(dataRaw: z.infer<typeof UpdateTeamSchema>): Promise<AlertType> {
	return teamAction(() => {
		const data = UpdateTeamSchema.parse(dataRaw);
		if (data.isJunior && typeof data.isJunior !== 'boolean') data.isJunior = data.isJunior === 'junior';
		return xata.db.teams.create(data);
	});
}

export async function deleteTeam(idRaw: string): Promise<AlertType> {
	return teamAction(() => {
		const id = stringSchema.parse(idRaw);
		return xata.db.teams.delete(id);
	});
}

async function teamAction(func: () => Promise<any> | any): Promise<AlertType> {
	const session = await auth();
	if (!isAdmin(session)) return { type: 'error', message: 'Unauthorized' };

	try {
		const res = await func();

		revalidatePath('/teams');
		if (!res) return { type: 'error', message: 'The game you are trying to update does not exist' };
		return { type: 'success', message: `Successfully created a new team named "${res.name}"` };
	} catch (error) {
		return { type: 'error', message: (error as Error).message };
	}
}

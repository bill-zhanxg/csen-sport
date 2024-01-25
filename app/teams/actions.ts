'use server';

import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { TeamsRecord, getXataClient } from '@/libs/xata';
import { SelectedPick } from '@xata.io/client';
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
	}, 'updated');
}

export async function newTeam(dataRaw: z.infer<typeof UpdateTeamSchema>): Promise<AlertType> {
	return teamAction(() => {
		const data = UpdateTeamSchema.parse(dataRaw);
		if (data.isJunior && typeof data.isJunior !== 'boolean') data.isJunior = data.isJunior === 'junior';
		return xata.db.teams.create(data);
	}, 'created');
}

export async function deleteTeam(idRaw: string): Promise<AlertType> {
	return teamAction(() => {
		const id = stringSchema.parse(idRaw);
		return xata.db.teams.delete(id);
	}, 'deleted');
}

async function teamAction(
	func: () => Promise<Readonly<SelectedPick<TeamsRecord, ['*']>> | null>,
	action: string,
): Promise<AlertType> {
	const session = await auth();
	if (!isAdmin(session)) return { type: 'error', message: 'Unauthorized' };

	try {
		const res = await func();

		revalidatePath('/teams');
		if (!res) return { type: 'error', message: `The team you are trying to ${action.slice(0, -1)} does not exist` };
		return { type: 'success', message: `Successfully ${action} a team named "${res.name}"` };
	} catch (error) {
		return { type: 'error', message: (error as Error).message };
	}
}

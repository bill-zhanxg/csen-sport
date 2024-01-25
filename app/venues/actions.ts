'use server';

import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { VenuesRecord, getXataClient } from '@/libs/xata';
import { SelectedPick } from '@xata.io/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AlertType } from '../components/Alert';

const xata = getXataClient();
const stringSchema = z.string();

const UpdateVenueSchema = z.object({
	name: z.optional(z.string()),
	address: z.optional(z.string()),
	court_field_number: z.optional(z.string()),
});

export async function updateVenue(idRaw: string, dataRaw: z.infer<typeof UpdateVenueSchema>): Promise<AlertType> {
	return venueAction(() => {
		const id = stringSchema.parse(idRaw);
		const data = UpdateVenueSchema.parse(dataRaw);
		return xata.db.venues.update(id, data);
	}, 'updated');
}

export async function newVenue(dataRaw: z.infer<typeof UpdateVenueSchema>): Promise<AlertType> {
	return venueAction(() => {
		const data = UpdateVenueSchema.parse(dataRaw);
		return xata.db.venues.create(data);
	}, 'created');
}

export async function deleteVenue(idRaw: string): Promise<AlertType> {
	return venueAction(() => {
		const id = stringSchema.parse(idRaw);
		return xata.db.venues.delete(id);
	}, 'deleted');
}

async function venueAction(
	func: () => Promise<Readonly<SelectedPick<VenuesRecord, ['*']>> | null>,
	action: string,
): Promise<AlertType> {
	const session = await auth();
	if (!isAdmin(session)) return { type: 'error', message: 'Unauthorized' };

	try {
		const res = await func();

		revalidatePath('/venues');
		if (!res) return { type: 'error', message: `The venue you are trying to ${action.slice(0, -1)} does not exist` };
		return { type: 'success', message: `Successfully ${action} a venue named "${res.name}"` };
	} catch (error) {
		return { type: 'error', message: (error as Error).message };
	}
}

'use server';

import { auth } from '@/libs/auth';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';

const xata = getXataClient();

export async function createTicket(data: FormData) {
	const session = await auth();
	const title = data.get('title');
	if (!title || typeof title !== 'string' || !session) return;

	await xata.db.tickets.create({
		title: title,
		createdBy: session.user.id,
	});

	revalidatePath('/tickets', 'layout');
}

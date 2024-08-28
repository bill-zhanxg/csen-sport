'use server';

import { auth } from '@/libs/auth';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';

export async function setUserTimezone(timezone: string) {
	if (!timezone || typeof timezone !== 'string') return;

	const session = await auth();
	if (!session || session.user.timezone === timezone) return;

	await getXataClient().db.nextauth_users.update(session.user.id, { timezone });

	// Revalidate all data
	revalidatePath('/', 'layout');
}

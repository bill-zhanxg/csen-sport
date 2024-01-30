'use server';

import { auth } from '@/libs/auth';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function resetGuide() {
	const session = await auth();
	if (session) await getXataClient().db.nextauth_users.update(session.user.id, { guided: false });
	revalidatePath('/');
	redirect('/');
}

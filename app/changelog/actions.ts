'use server';

import { authC } from '@/app/cache';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function resetGuide() {
	const session = await authC();
	if (session) await getXataClient().db.nextauth_users.update(session.user.id, { guided: false });
	revalidatePath('/', 'layout');
	redirect('/');
}

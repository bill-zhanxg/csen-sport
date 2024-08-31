'use server';

import { authC } from '@/app/cache';
import { getXataClient } from '@/libs/xata';

export async function finishGuide() {
	const session = await authC();
	if (session) getXataClient().db.nextauth_users.update(session.user.id, { guided: true });
}

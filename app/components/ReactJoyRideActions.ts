'use server';

import { auth } from '@/libs/auth';
import { getXataClient } from '@/libs/xata';

export async function finishGuide() {
	const session = await auth();
	if (session) getXataClient().db.nextauth_users.update(session.user.id, { guided: true });
}

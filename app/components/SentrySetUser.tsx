'use client';

import { useEffect } from 'react';

import { setUser } from '@sentry/nextjs';

export function SentrySetUser({
	user,
}: {
	user: { id: string; name?: string | null; email?: string | null; ip_address?: string | null };
}) {
	useEffect(() => {
		setUser({
			id: user.id,
			username: user.name ?? undefined,
			email: user.email ?? undefined,
			ip_address: user.ip_address ?? undefined,
		});
	}, [user]);

	return null;
}

'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
	return (
		<a
			onClick={() =>
				signOut({
					callbackUrl: '/login',
				})
			}
		>
			Logout
		</a>
	);
}

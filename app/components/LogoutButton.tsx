'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
	return (
		<button
			className="bg-red-600 hover:bg-red-800 text-white"
			onClick={() =>
				signOut({
					callbackUrl: '/login',
				})
			}
		>
			Logout
		</button>
	);
}

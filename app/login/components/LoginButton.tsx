'use client';

import { signIn } from 'next-auth/react';

export function LoginButton({ callbackUrl }: { callbackUrl?: string }) {
	return (
		<button
			className="btn btn-primary w-4/5 max-w-[20rem]"
			onClick={() =>
				signIn('azure-ad', {
					callbackUrl,
				})
			}
		>
			Login with Microsoft
		</button>
	);
}

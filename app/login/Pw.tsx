'use client';

import { getCsrfToken } from 'next-auth/react';
import { startTransition, useEffect, useState } from 'react';

export function Pw() {
	const [csrfToken, setCsrfToken] = useState('');

	useEffect(() => {
		startTransition(async () => {
			setCsrfToken(await getCsrfToken());
		});
	}, [setCsrfToken]);

	return (
		<>
			<input type="hidden" name="csrfToken" value={csrfToken} />
			<input type="password" name="password" id="password" placeholder="Password" />
			<button type="submit">
				<span>Sign in with Password</span>
			</button>
		</>
	);
}

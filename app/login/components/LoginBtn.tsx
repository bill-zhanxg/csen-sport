'use client';

import { dotWave } from 'ldrs';
import { useState } from 'react';

dotWave.register();

export function LoginBtn({ login }: { login: () => Promise<void> }) {
	const [loading, setLoading] = useState(false);

	return (
		<form className="w-4/5 max-w-[20rem]" action={login} onSubmit={() => setLoading(true)}>
			<button type="submit" className="btn btn-primary w-full" disabled={loading}>
				{loading ? <l-dot-wave size="30" speed="1" color="black"></l-dot-wave> : 'Login with Microsoft'}
			</button>
		</form>
	);
}

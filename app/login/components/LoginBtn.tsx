'use client';

import { useEffect, useState } from 'react';
import { FaMicrosoft } from 'react-icons/fa';

declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'l-dot-wave': {
				size: string;
				speed: string;
				color: string;
			};
		}
	}
}

export function LoginBtn({ loginAction }: { loginAction: () => Promise<void> }) {
	const [loading, setLoading] = useState(false);
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		(async () => {
			await import('ldrs/dotWave');
			setHasMounted(true);
		})();
	}, []);

	return hasMounted ? (
		<form className="w-4/5 max-w-[15rem]" action={loginAction} onSubmit={() => setLoading(true)}>
			<button type="submit" className="btn btn-primary w-full" disabled={loading}>
				{loading ? (
					hasMounted ? (
						<l-dot-wave size="30" speed="1" color="black"></l-dot-wave>
					) : (
						<span className="flex w-full items-center justify-between gap-4">Loading...</span>
					)
				) : (
					<span className="flex w-full items-center justify-between gap-4">
						<FaMicrosoft className="text-xl" />
						<p>Login with Microsoft</p>
					</span>
				)}
			</button>
		</form>
	) : (
		<button type="submit" className="btn btn-primary w-4/5 max-w-[15rem]" disabled={true}>
			<span className="flex w-full items-center justify-between gap-4">Loading...</span>
		</button>
	);
}

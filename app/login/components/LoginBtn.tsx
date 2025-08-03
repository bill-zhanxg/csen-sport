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
		<form className="w-full" action={loginAction} onSubmit={() => setLoading(true)}>
			<button
				type="submit"
				className="btn btn-primary w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
				disabled={loading}
			>
				{loading ? (
					hasMounted ? (
						<l-dot-wave size="30" speed="1" color="white"></l-dot-wave>
					) : (
						<span className="flex w-full items-center justify-center gap-3">
							<div className="loading loading-spinner loading-sm"></div>
							Signing in...
						</span>
					)
				) : (
					<span className="flex w-full items-center justify-center gap-3">
						<FaMicrosoft className="text-lg" />
						<span>Continue with Microsoft</span>
					</span>
				)}
			</button>
		</form>
	) : (
		<div className="w-full">
			<button type="submit" className="btn btn-primary w-full h-12 text-base font-medium" disabled={true}>
				<span className="flex w-full items-center justify-center gap-3">
					<div className="loading loading-spinner loading-sm"></div>
					Loading...
				</span>
			</button>
		</div>
	);
}

'use client';

import { useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html>
			<body>
				<div className="flex flex-col items-center justify-center h-screen p-4 sm:p-6 text-center">
					<div className="max-w-xl w-full px-4 sm:px-6 lg:px-8">
						<h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6">500</h1>
						<p className="text-lg sm:text-xl md:text-2xl text-base-content mb-6 sm:mb-8">
							Something seriously went wrong. The developer have been notified and will work to resolve the issue as
							soon as possible.
						</p>
						<p className="text-base sm:text-lg md:text-xl text-error mb-6 sm:mb-8 wrap-break-word">{error.message}</p>
						<div className="flex flex-col gap-2 sm:gap-3 w-full">
							<button className="btn btn-primary w-full" onClick={() => reset()}>
								Try Again
							</button>
							<button className="btn btn-secondary w-full" onClick={() => window.location.reload()}>
								Full Reload
							</button>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}

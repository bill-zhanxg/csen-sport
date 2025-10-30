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
				<div className="flex flex-col items-center justify-center h-full text-center">
					<div className="max-w-xl px-4 sm:px-6 lg:px-8">
						<h1 className="text-6xl font-bold mb-4">500</h1>
						<p className="text-2xl text-base-content/100 mb-8">
							Something seriously went wrong. The developer have been notified and will work to resolve the issue as
							soon as possible.
						</p>
						<p className="text-lg text-error mb-8">{error.message}</p>
						<button
							className="inline-flex items-center justify-center px-4 py-2 btn btn-primary"
							onClick={() => reset()}
						>
							Try Again
						</button>
					</div>
				</div>
			</body>
		</html>
	);
}

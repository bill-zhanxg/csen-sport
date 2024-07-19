'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className="flex justify-center items-center h-full">
			<div className="flex flex-col justify-center items-center w-full max-w-xl">
				<div className="flex flex-col justify-center items-center w-full py-4 text-center gap-2">
					<h1 className="text-2xl font-bold">An error occurred while trying to load the page</h1>
					<h1 className="text-xl font-semibold text-error">{error.message}</h1>
					<h1 className="text-sm text-primary">
						The developer have been notified and will work to resolve the issue as soon as possible.
					</h1>
				</div>
				<button className="btn btn-primary w-full" onClick={() => reset()}>
					Try Again
				</button>
			</div>
		</div>
	);
}

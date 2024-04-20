'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className="flex justify-center items-center h-full">
			<div className="flex flex-col justify-center items-center w-full max-w-sm">
				<div className="flex flex-col justify-center items-center w-full py-4 text-center gap-2">
					<h1 className="text-2xl font-bold">An error occurred while trying to load the page: {error.name}</h1>
					<h1 className="text-xl font-semibold text-error">{error.message}</h1>
				</div>
				<button className="btn btn-primary w-full" onClick={() => reset()}>
					Try Again
				</button>
			</div>
		</div>
	);
}

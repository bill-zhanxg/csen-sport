'use client';

import { useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className="flex justify-center items-center h-full p-4 sm:p-6">
			<div className="flex flex-col justify-center items-center w-full max-w-xl">
				<div className="flex flex-col justify-center items-center w-full py-4 sm:py-6 text-center gap-3 sm:gap-4">
					<h1 className="text-xl sm:text-2xl md:text-3xl font-bold px-2">
						An error occurred while trying to load the page
					</h1>
					<h1 className="text-base sm:text-lg md:text-xl font-semibold text-error wrap-break-word px-2 max-w-full">
						{error.message}
					</h1>
					<h1 className="text-sm sm:text-base text-primary px-2">
						The developer have been notified and will work to resolve the issue as soon as possible.
					</h1>
				</div>
				<div className="flex flex-col gap-2 sm:gap-3 w-full px-2">
					<button
						className="btn btn-primary w-full"
						onClick={(e) => {
							e.preventDefault();
							reset();
						}}
					>
						Try Again
					</button>
					<button
						className="btn btn-secondary w-full"
						onClick={(e) => {
							e.preventDefault();
							window.location.reload();
						}}
					>
						Full Reload
					</button>
				</div>
			</div>
		</div>
	);
}

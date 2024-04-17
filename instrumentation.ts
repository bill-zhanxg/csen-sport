import { captureConsoleIntegration } from '@sentry/browser';
import * as Sentry from '@sentry/nextjs';

export function register() {
	// Sentry migration: https://github.com/getsentry/sentry-javascript/blob/8.0.0-beta.1/MIGRATION.md#upgrading-from-7x-to-8x
	// Initialize Sentry Server and Edge
	Sentry.init({
		dsn: 'https://9d31f1bae75a32099d8f34cf7d4fb5b9@o4505283637477376.ingest.sentry.io/4505888403554304',
		enabled: process.env.NODE_ENV === 'production',
		// Adjust this value in production, or use tracesSampler for greater control
		tracesSampleRate: 0.2,
		// Setting this option to true will print useful information to the console while you're setting up Sentry.
		debug: false,
		integrations: [captureConsoleIntegration({ levels: ['error'] })],
	});
}

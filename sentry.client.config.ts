// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/nextjs';

Sentry.init({
	dsn: 'https://9d31f1bae75a32099d8f34cf7d4fb5b9@o4505283637477376.ingest.sentry.io/4505888403554304',

	enabled: process.env.NODE_ENV === 'production',

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 0.2,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,

	replaysOnErrorSampleRate: 0.8,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.2,

	integrations: [
		new Sentry.Replay({
			maskAllText: false,
			maskAllInputs: false,
		}),
		new CaptureConsole({ levels: ['error'] }),
	],
});

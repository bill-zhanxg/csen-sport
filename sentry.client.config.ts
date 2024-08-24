// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
	dsn: 'https://9d31f1bae75a32099d8f34cf7d4fb5b9@o4505283637477376.ingest.sentry.io/4505888403554304',

	enabled: process.env.NODE_ENV === 'production',

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 0.4,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,

	replaysOnErrorSampleRate: 1,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,

	integrations: [
		Sentry.replayIntegration({
			maskAllText: false,
			maskAllInputs: false,
			blockAllMedia: false,
		}),
		Sentry.captureConsoleIntegration({ levels: ['error'] }),
		Sentry.thirdPartyErrorFilterIntegration({
			filterKeys: ['A}EP@q>NJkuRGUfNzkVMGs&b^:H?Sz'],
			behaviour: 'apply-tag-if-contains-third-party-frames',
		}),

		Sentry.extraErrorDataIntegration(),
		Sentry.sessionTimingIntegration(),

		Sentry.browserProfilingIntegration(),
		Sentry.httpClientIntegration(),
		Sentry.moduleMetadataIntegration(),
		Sentry.reportingObserverIntegration(),
	],

	ignoreErrors: [
		'network error',
		'Failed to fetch',
		'Load failed',
		"Failed to construct 'URL': Invalid base URL",
	],
});

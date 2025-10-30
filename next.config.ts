import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'icotar.com',
			},
			{
				protocol: 'https',
				hostname: '*.xata.sh',
			},
		],
	},
	webpack: (config, { isServer }) => {
		config.resolve.alias.canvas = false;
		if (isServer) {
			config.ignoreWarnings = [{ module: /opentelemetry/ }];
		}
		return config;
	},
	experimental: {
		// authInterrupts: true,
		typedEnv: true,
		clientSegmentCache: true,
		turbopackFileSystemCacheForDev: true,

		serverActions: {
			bodySizeLimit: '30mb',
		},
	},
	cacheComponents: true,
	reactCompiler: true,
	typedRoutes: true,
};

export default withSentryConfig(nextConfig, {
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options

	org: 'billzhanxg',
	project: 'csen-sport',

	// Only print logs for uploading source maps in CI
	silent: !process.env.CI,

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	// Automatically annotate React components to show their full name in breadcrumbs and session replay
	reactComponentAnnotation: {
		enabled: true,
	},

	// Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
	tunnelRoute: '/monitoring',

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,
});

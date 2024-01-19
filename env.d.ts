namespace NodeJS {
	interface ProcessEnv {
		BASE_URL: string;

		XATA_BRANCH: string;
		XATA_API_KEY: string;

		AUTH_SECRET: string;
		AZURE_AD_CLIENT_ID: string;
		AZURE_AD_CLIENT_SECRET: string;
		AZURE_AD_TENANT_ID: string;

		// TODO: Remove if not used
		NEXT_PUBLIC_SCHOOL_EMAIL_DOMAIN: string;

		SENTRY_AUTH_TOKEN: string;
	}
}

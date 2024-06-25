namespace NodeJS {
	interface ProcessEnv {
		BASE_URL: string;

		XATA_BRANCH: string;
		XATA_API_KEY: string;

		AUTH_SECRET: string;
		AZURE_AD_CLIENT_ID: string;
		AZURE_AD_CLIENT_SECRET: string;
		AZURE_AD_TENANT_ID: string;

		SENTRY_AUTH_TOKEN: string;
	}
}

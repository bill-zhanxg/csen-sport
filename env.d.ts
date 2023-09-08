namespace NodeJS {
	interface ProcessEnv {
		NEXT_PUBLIC_APPWRITE_ENDPOINT: string;
		NEXT_PUBLIC_APPWRITE_PROJECT_ID: string;

		LOG_DEBUG: boolean;
		LOG_INFO: boolean;
		LOG_WARN: boolean;
		LOG_ERROR: boolean;
	}
}

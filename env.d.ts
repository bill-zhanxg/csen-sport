namespace NodeJS {
	interface ProcessEnv {
		BASE_URL: string;

		XATA_BRANCH: string;
		XATA_API_KEY: string;

		AUTH_SECRET: string;
		AUTH_MICROSOFT_ENTRA_ID_ID: string;
		AUTH_MICROSOFT_ENTRA_ID_SECRET: string;
		AUTH_MICROSOFT_ENTRA_ID_TENANT_ID: string;

		SENTRY_AUTH_TOKEN: string;

		TEST_LOGIN_ADMIN_PASSWORD: string;
		TEST_LOGIN_DEVELOPER_PASSWORD: string;
		TEST_LOGIN_TEACHER_PASSWORD: string;
		TEST_LOGIN_STUDENT_PASSWORD: string;
		TEST_LOGIN_BLOCKED_PASSWORD: string;

		NEXT_PUBLIC_TAWK_PROPERTY_ID: string;
		NEXT_PUBLIC_TAWK_WIDGET_ID: string;
		TAWK_API_KEY: string;
	}
}

// Tawk.io global type declaration
interface Window {
	Tawk_API?: any;
	Tawk_LoadStart?: Date;
}

import { DefaultSession } from 'next-auth';

type role = 'admin' | 'teacher' | 'blocked' | 'student' | null;
declare module 'next-auth' {
	interface Session {
		user: {
			/** The role of the user. */
			role: role;
		} & DefaultSession['user'];
	}

	interface User extends DefaultUser {
		/** The role of the user. */
		role: role;
	}
}

declare module '@auth/core/adapters' {
	interface AdapterUser extends BaseAdapterUser {
		role: role;
	}
}

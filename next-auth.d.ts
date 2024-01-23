import { DefaultSession } from 'next-auth';

type role = 'admin' | 'teacher' | 'blocked' | 'student' | null;
type team = { id: string };
declare module 'next-auth' {
	interface Session {
		user: {
			/** The role of the user. */
			role: role;
			team: team;
		} & DefaultSession['user'];
	}

	interface User extends DefaultUser {
		/** The role of the user. */
		role: role;
		team: team;
	}
}

declare module '@auth/core/adapters' {
	interface AdapterUser extends BaseAdapterUser {
		role: role;
		team: team;
	}
}

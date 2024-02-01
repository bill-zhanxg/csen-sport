import { DefaultSession } from 'next-auth';

type role = 'admin' | 'teacher' | 'blocked' | 'student' | null;
type team = { id: string };

interface CustomUser {
	/** The role of the user. */
	role?: role | null;
	team?: team | null;
	guided?: boolean | null;
	last_logged_on?: string | null;
}
declare module 'next-auth' {
	interface Session {
		user: CustomUser & DefaultSession['user'];
	}

	interface User extends DefaultUser, CustomUser {}
}

declare module '@auth/core/adapters' {
	interface AdapterUser extends BaseAdapterUser, CustomUser {}
}

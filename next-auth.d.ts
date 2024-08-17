import { DefaultSession } from 'next-auth';

export type Role = 'admin' | 'teacher' | 'blocked' | 'student' | 'developer' | null;
type Team = { id: string };

interface CustomUser {
	/** The role of the user. */
	id: string;
	role?: Role | null;
	team?: Team | null;
	guided?: boolean | null;
	last_logged_on?: string | null;
	reset_only_after_visit_weekly_sport?: boolean | null;
	timezone?: string | null;
	auto_timezone?: boolean | null;
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

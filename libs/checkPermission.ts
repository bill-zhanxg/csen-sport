import { Session } from 'next-auth';

type Input =
	| Session
	| {
			role?: string | null;
	  }
	| null;

export function isDeveloper(session: Input): boolean {
	return getRole(session) === 'developer';
}

export function isAdmin(session: Input): boolean {
	const role = getRole(session);
	return role === 'admin' || role === 'developer';
}

export function isTeacher(session: Input): boolean {
	const role = getRole(session);
	return role === 'teacher' || role === 'admin';
}

export function isBlocked(session: Input): boolean {
	return getRole(session) === 'blocked';
}

function getRole(session: Input): string {
	if (!session) return 'student';
	if ('role' in session) return session.role ?? 'student';
	if ('user' in session) return session.user.role ?? 'student';
	return 'student';
}

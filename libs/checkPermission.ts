import { Session } from 'next-auth';

export function isDeveloper(session: Session | null): boolean {
	return session?.user.role === 'developer';
}

export function isAdmin(session: Session | null): boolean {
	return session?.user.role === 'admin' || session?.user.role === 'developer';
}

export function isTeacher(session: Session | null): boolean {
	return session?.user.role === 'teacher' || session?.user.role === 'admin';
}

export function isBlocked(session: Session | null): boolean {
	return session?.user.role === 'blocked';
}

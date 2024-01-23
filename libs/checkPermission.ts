import { Session } from 'next-auth/types';

export function isAdmin(session: Session | null): boolean {
	return session?.user.role === 'admin';
}

export function isTeacher(session: Session | null): boolean {
	return session?.user.role === 'teacher' || session?.user.role === 'admin';
}

export function isBlocked(session: Session | null): boolean {
	return session?.user.role === 'blocked';
}

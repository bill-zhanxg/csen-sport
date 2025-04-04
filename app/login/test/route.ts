import { getXataClient } from '@/libs/xata';
import { Role } from '@/next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { v4 } from 'uuid';

const xata = getXataClient();
const blocked: string[] = [];

export async function POST(request: NextRequest) {
	// Manually log the user in with password (skipping auth.js)
	const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'localhost';
	if (!ip) return rejectLogin();
	if (blocked.includes(ip)) return rejectLogin();

	const body = await request.json();
	const password = body.password;
	if (typeof password !== 'string') return rejectLogin(ip);
	const https = request.headers.get('x-forwarded-proto') === 'https' || request.nextUrl.protocol === 'https:';

	const login = async (role: Role) => {
		// Replace the document if the first request was more than 1 hour ago
		let replaceDocument = false;
		const document = await xata.db.nextauth_users.read(`test_user_${role}`);
		if (document) {
			const firstRequestDate = document.xata.createdAt;
			replaceDocument = new Date(Date.now() - 1000 * 60 * 60) > firstRequestDate;
		}

		const sessionToken = v4();
		// Testing duration should be less than 24 hours
		const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

		const userData = {
			id: `test_user_${role}`,
			name: `Test User ${role}`,
			email: `test_user_${role}@test.com`,
			role,
		};

		if (replaceDocument && document) {
			// We need to delete the document first to reset the createdAt date
			await document.delete();
		}

		const user = await xata.db.nextauth_users.createOrUpdate(userData);
		const session = await xata.db.nextauth_sessions.create({
			sessionToken,
			expires,
			user,
		});
		await xata.db.nextauth_users_sessions.create({
			user,
			session,
		});

		const res = NextResponse.redirect(new URL(process.env.BASE_URL).href);
		res.cookies.set(https ? '__Secure-authjs.session-token' : 'authjs.session-token', sessionToken, {
			expires,
			secure: https,
		});
		return res;
	};

	switch (password) {
		case process.env.TEST_LOGIN_ADMIN_PASSWORD:
			return login('admin');
		case process.env.TEST_LOGIN_DEVELOPER_PASSWORD:
			return login('developer');
		case process.env.TEST_LOGIN_TEACHER_PASSWORD:
			return login('teacher');
		case process.env.TEST_LOGIN_STUDENT_PASSWORD:
			return login('student');
		case process.env.TEST_LOGIN_BLOCKED_PASSWORD:
			return login('blocked');
	}

	return rejectLogin(ip);
}

function rejectLogin(ip?: string) {
	// Block the IP address until restart
	if (ip) blocked.push(ip);
	return NextResponse.json({ error: 'Invalid login' }, { status: 400 });
}

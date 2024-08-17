import { signIn } from '@/libs/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const headers = request.headers;
	console.log(headers.get('hello'));
	await signIn('credentials', { password: process.env.TEST_LOGIN_ADMIN_PASSWORD });
}

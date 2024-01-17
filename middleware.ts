import { auth } from '@/libs/auth';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const session = await auth();
	if (!session)
		return NextResponse.redirect(
			new URL(process.env.BASE_URL).href + `login?redirect=${encodeURIComponent(request.nextUrl.pathname)}`,
		);
}

export const config = {
	matcher: {
		source: '/((?!api|login|_next/static|_next/image|favicon.ico).*)',
		missing: [
			{ type: 'header', key: 'next-router-prefetch' },
			{ type: 'header', key: 'purpose', value: 'prefetch' },
		],
	},
};

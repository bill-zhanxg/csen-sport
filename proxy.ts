import { auth } from '@/libs/auth';
import { NextResponse } from 'next/server';

export default auth((request) => {
	const session = request.auth;
	const { pathname, searchParams } = request.nextUrl;

	if (pathname === '/login') {
		// Handle redirection after successful login
		if (session) {
			const redirectUrl = searchParams.get('redirect');
			const targetUrl = redirectUrl ? decodeURIComponent(redirectUrl) : '/';
			return NextResponse.redirect(new URL(targetUrl, request.url));
		}
	} else {
		// Redirect to login if not authenticated
		if (!session) {
			return NextResponse.redirect(
				new URL(process.env.BASE_URL).href +
					`login` +
					(request.nextUrl.pathname === '/' ? '' : `?redirect=${encodeURIComponent(request.nextUrl.pathname)}`),
			);
		}
	}

	// Modify the request headers with client's IP address
	const requestHeaders = new Headers(request.headers);
	const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'localhost';
	requestHeaders.set('x-forwarded-for', ip);
	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
});

export const config = {
	matcher: [
		{
			source: '/((?!api|manifest|_next/static|_next/image|favicon.ico).*)',
			missing: [
				{ type: 'header', key: 'next-router-prefetch' },
				{ type: 'header', key: 'purpose', value: 'prefetch' },
			],
		},
	],
};

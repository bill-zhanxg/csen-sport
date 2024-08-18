import { auth } from '@/libs/auth';
import { NextResponse } from 'next/server';

export default auth((request) => {
	const session = request.auth;
	// TODO: remove console log
	console.log(session);
	if (!session)
		return NextResponse.redirect(
			new URL(process.env.BASE_URL).href +
				`login` +
				(request.nextUrl.pathname === '/' ? '' : `?redirect=${encodeURIComponent(request.nextUrl.pathname)}`),
		);

	// Modify the request headers with client's IP address
	const requestHeaders = new Headers(request.headers);
	const ip = request.ip || '';
	requestHeaders.set('x-forwarded-for', ip);
	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
});

export const config = {
	matcher: {
		source: '/((?!api|login|manifest|_next/static|_next/image|favicon.ico).*)',
		missing: [
			{ type: 'header', key: 'next-router-prefetch' },
			{ type: 'header', key: 'purpose', value: 'prefetch' },
		],
	},
};

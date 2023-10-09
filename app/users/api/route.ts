import { AppwriteException } from 'appwrite';
import { NextRequest, NextResponse } from 'next/server';

import { clientAccount, user } from '../../../libs/server/appwrite';

export async function GET(request: NextRequest) {
	const unauthorized = NextResponse.json(
		{
			message: 'Unauthorized',
		},
		{
			status: 401,
			statusText: 'Unauthorized',
		},
	);

	const serverError = NextResponse.json(
		{
			message: 'Server Error',
		},
		{
			status: 500,
			statusText: 'Server Error',
		},
	);

	// Check client scope
	const clientJWT = request.headers.get('X-Appwrite-JWT');
	if (clientJWT) {
		return await new Promise<NextResponse<any>>((resolve) => {
			clientAccount
				.checkAdministrator(clientJWT)
				.then((isAdmin) => {
					if (!isAdmin) return resolve(unauthorized);

					// Get all users
					user
						.getAll()
						.then((res) => resolve(NextResponse.json(res)))
						.catch((error) => {
							// Report error to Sentry
							console.error(error);
							resolve(serverError);
						});
				})
				.catch((error: AppwriteException) => {
					// Report error to Sentry
					console.error(error);
					resolve(serverError);
				});
		});
	} else {
		return unauthorized;
	}
}

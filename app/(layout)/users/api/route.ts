import { AppwriteException } from 'appwrite';
import { NextRequest, NextResponse } from 'next/server';
import { Array, Boolean, Record, String, Union, ValidationError } from 'runtypes';

import { clientAccount, user } from '../../../../libs/server/appwrite';

export async function GET(request: NextRequest) {
	const unauthorized = NextResponse.json({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
	const serverError = NextResponse.json({ message: 'Server Error' }, { status: 500, statusText: 'Server Error' });

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

/**
 * Handles POST requests for updating user.
 */
export async function POST(request: NextRequest) {}

/**
 * PATCH function to block or unblock user.
 */
export async function PATCH(request: NextRequest) {
	const BlockUserData = Record({
		block: Boolean,
		$id: Union(String, Array(String)),
	});

	const unauthorized = NextResponse.json({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
	const serverError = NextResponse.json({ message: 'Server Error' }, { status: 500, statusText: 'Server Error' });

	const data = await request.json();
	try {
		const blockUserData = BlockUserData.check(data);

		// Check client scope
		const clientJWT = request.headers.get('X-Appwrite-JWT');
		if (clientJWT) {
			return await new Promise<NextResponse<any>>((resolve) => {
				clientAccount
					.checkAdministrator(clientJWT)
					.then(async (isAdmin) => {
						if (!isAdmin) return resolve(unauthorized);

						if (typeof blockUserData.$id === 'object') {
							const promises = blockUserData.$id.map((id) => user.updateStatus(id, !blockUserData.block));
							const results = await Promise.allSettled(promises);
							resolve(
								NextResponse.json({
									succeed: results.filter(({ status }) => status === 'fulfilled').length,
									failed: results.length - results.filter(({ status }) => status === 'fulfilled').length,
								}),
							);
						} else {
							user
								.updateStatus(blockUserData.$id, true)
								.then((res) => resolve(NextResponse.json(res)))
								.catch((error: AppwriteException) => {
									if (error.code === 404)
										return resolve(
											NextResponse.json({ message: 'User not found' }, { status: 404, statusText: 'Not Found' }),
										);
									// Report error to Sentry
									console.error(error);
									resolve(serverError);
								});
						}
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
	} catch (e) {
		const { code, message } = e as ValidationError;
		return NextResponse.json({ code, message }, { status: 400, statusText: 'Bad Request' });
	}
}

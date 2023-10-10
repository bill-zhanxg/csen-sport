import { AppwriteException } from 'appwrite';
import { NextRequest, NextResponse } from 'next/server';
import { Array, Record, String, Union, ValidationError } from 'runtypes';

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

export async function DELETE(request: NextRequest) {
	const UserId = Record({
		$id: String,
	});
	const User = Record({
		user: UserId,
	});
	const Users = Record({
		users: Array(UserId),
	});
	const DeleteUserData = Union(User, Users);

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

	const data = await request.json();
	try {
		const deleteUserData = DeleteUserData.check(data);
		// TODO: move everything in
	} catch (e) {
		const error = e as ValidationError;
		// TODO
		return;
	}

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

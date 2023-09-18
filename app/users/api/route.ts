import { NextRequest, NextResponse } from 'next/server';

import { clientAccount, user } from '../../../libs/server/appwrite';

export async function GET(request: NextRequest) {
	// Check client scope
	const clientJWT = request.headers.get('X-Appwrite-JWT');
	if (clientJWT) {
		clientAccount.checkAdministrator(clientJWT);
	} else {
		return NextResponse.json(
			{
				message: 'Unauthorized',
			},
			{
				status: 401,
				statusText: 'Unauthorized',
			},
		);
	}

	// Get all users
	user
		.getAll()
		.then((res) => {
			console.log(res);
		})
		.catch((error) => {
			console.log(error);
		});

	return NextResponse.json({ hello: 'hello' });
}

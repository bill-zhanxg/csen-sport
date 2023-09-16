import { NextResponse } from 'next/server';

import { user } from '../../../libs/server/appwrite';

export async function GET() {
	// Check client scope

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

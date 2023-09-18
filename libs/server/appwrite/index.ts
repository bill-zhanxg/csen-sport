import { Client as ClientClient, Teams } from 'appwrite';
import { AppwriteException, Client, Users } from 'node-appwrite';

import { UserAPIResponse } from './Interface/User';

export const client = new Client()
	.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
	.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
	.setKey(process.env.APPWRITE_API_KEY);

export const user = {
	appwrite: new Users(client),

	getAll: () => {
		return new Promise<UserAPIResponse[]>((resolve, reject) => {
			user.appwrite
				.list()
				.then((users) => resolve(users.users.map(({ name, email }) => ({ name, email }))))
				.catch((error: AppwriteException) => {
					// TODO
				});
		});
	},
};

export const clientAccount = {
	_getClient: (jwt: string) => {
		return new ClientClient()
			.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
			.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
			.setJWT(jwt);
	},

	checkAdministrator: (jwt: string) => {
		const client = clientAccount._getClient(jwt);
		const team = new Teams(client);
		team.createMembership('administrator', [], 'bill.zhanxg@outlook.com', undefined, undefined, 'https://localhost:3000').then((teams) => {
			console.log('🚀 ~ file: index.ts:38 ~ team.list ~ teams:', teams);
			// team.create('administrator', 'Administrator').then((team) => {
			// });
		});
	},
};

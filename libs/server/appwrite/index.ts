import { Client as ClientClient, Models, Teams } from 'appwrite';
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

	/**
	 * Check if the user is an administrator
	 * @throws {AppwriteException}
	 */
	checkAdministrator: (jwt: string) => {
		return new Promise<Models.Team<Models.Preferences>>((resolve, reject) => {
			const client = clientAccount._getClient(jwt);
			const team = new Teams(client);
			team
				.get('administrator')
				.then((team) => {
					console.log('🚀 ~ file: index.ts:41 ~ .then ~ team:', team);
					resolve(team);
				})
				.catch(reject);
		});
	},
};

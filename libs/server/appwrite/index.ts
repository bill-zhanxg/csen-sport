import { Client as ClientClient, Teams } from 'appwrite';
import { AppwriteException, Client, Models, Users } from 'node-appwrite';

import { UserAPIResponse } from './Interface/User';

export const client = new Client()
	.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
	.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
	.setKey(process.env.APPWRITE_API_KEY);

export const user = {
	appwrite: new Users(client),

	/**
	 * Get all users
	 * @throws {AppwriteException}
	 */
	getAll: () => {
		return new Promise<UserAPIResponse[]>((resolve, reject) => {
			user.appwrite
				.list()
				.then((users) => resolve(users.users.map(({ $id, name, email, status }) => ({ $id, name, email, status }))))
				.catch(reject);
		});
	},

	/**
	 * Block or unblock a user
	 * @throws {AppwriteException}
	 */
	updateStatus: (userId: string, block: boolean) => {
		return new Promise<Models.User<Models.Preferences>>((resolve, reject) => {
			user.appwrite.updateStatus(userId, block).then(resolve).catch(reject);
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
		return new Promise<boolean>((resolve, reject) => {
			const JWTClient = clientAccount._getClient(jwt);
			const team = new Teams(JWTClient);
			team
				.get('administrator')
				// User is an administrator
				.then(() => resolve(true))
				.catch((error: AppwriteException) => {
					// User is not an administrator
					if (error.code === 404) resolve(false);
					// Something went wrong
					else reject(error);
				});
		});
	},
};

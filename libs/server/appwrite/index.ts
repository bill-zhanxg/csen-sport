import { Client, Users } from 'node-appwrite';
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
				.catch(reject);
		});
	},
};

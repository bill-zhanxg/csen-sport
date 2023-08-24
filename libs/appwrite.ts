import { Account, Client, Models } from 'appwrite';

export const client = new Client()
	.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
	.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);

export function login() {
	account.createEmailSession(
		'',
		'',
	);
}

export function logout() {
	account
		.deleteSession('current')
		.catch(() => {})
		.finally(() => (window.location.href = '/'));
}

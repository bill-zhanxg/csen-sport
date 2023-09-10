'use client';

import { Account, AppwriteException, Client, Models } from 'appwrite';
import { usePathname } from 'next/navigation';

import { logError } from './logger';

export const client = new Client()
	.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
	.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);

export function login() {
	const pathname = window.location.href || process.env.ROOT_URL;
	account.createOAuth2Session('microsoft', pathname, pathname);
}

export function logout() {
	account
		.deleteSession('current')
		.catch(() => {})
		.finally(() => location.reload());
}

export function getSession() {
	return new Promise<Models.Session>((resolve, reject) => {
		account
			.getSession('current')
			.then(resolve)
			.catch((error: AppwriteException) => {
				if (error.code === 401) login();
				logError(error);
				reject(error);
			});
	});
}
